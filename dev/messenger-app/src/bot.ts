import { Telegraf } from 'telegraf';

import { BotSceneSessionContext } from './context';
import { ThingyLocalization } from './proto/thingy_pb';
import { getPendingLocation, setNewLocation } from './services/client/persistLocalizationClient';
import { createServer } from './services/server';

import {
    SCENE_ID as CONFIGURE_LOCATION_SCENE_ID,
    USER_ACCEPT_SETTING_NEW_LOCATION,
    USER_REFUSE_SETTING_NEW_LOCATION
} from './stages/scenes/ConfigureLocalization';
import {
    askIfUserWantsToConfigure as askUserPendingLocation,
    SCENE_ID as CONFIGURE_PENDING_LOCATION_SCENE_ID,
    USER_ACCEPT_PENDING_CONFIGURATION,
    USER_REFUSE_PENDING_CONFIGURATION
} from './stages/scenes/ConfigurePendingLocalization';
import { stageManager } from './stages/stageManager';

import { fgRed, reset } from './utils/consoleColors';

const bot = new Telegraf<BotSceneSessionContext>(process.env.TELEGRAM_TOKEN);

const session = new (require('telegraf-session-redis'))({
    store: {
        host: 'redis',
        port: 6379
    }
});

bot.startPolling();
bot.use(Telegraf.log());
bot.use(session);
bot.use(stageManager.middleware());

bot.start(async ctx => {
    const { reply, from } = ctx;

    await reply('Welcome on the Telegram bot of group 🔷🥳');

    const chatId = from.id;
    console.log(
        `Started talking with: ${from.first_name} ${from.last_name}` +
        `(@${from.username} - ${chatId})`
    );
    if (! process.env.DEV_ID) {
        process.env.DEV_ID = chatId.toString();
        console.log(`${fgRed}Set DEV_ID in .env file: ${chatId}${reset}`);
    }

    try {
        const thingies: Array<ThingyLocalization> = await getPendingLocation();

        return await askUserPendingLocation(ctx, thingies);
    } catch (error) {
        console.error('Error while requesting pending locations', error);
    }
});

// Handle callback actions defined in the triggers array passed as argument
bot.action([
    USER_REFUSE_PENDING_CONFIGURATION,
    USER_REFUSE_SETTING_NEW_LOCATION
], ({ callbackQuery, reply, replyWithMarkdown }) => {
    const { data } = callbackQuery;
    switch (data) {
        case USER_REFUSE_PENDING_CONFIGURATION:
            return reply('No pressure 👍\nYou can configure them any them');

        case USER_REFUSE_SETTING_NEW_LOCATION:
            return replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [thingy-name]`');
    }
});

// Handle no matching actions
bot.on('callback_query', ({ callbackQuery, scene, session }) => {
    const { data } = callbackQuery;

    if (data.startsWith(USER_ACCEPT_PENDING_CONFIGURATION)) {
        session.thingiesUuid = data.replace(new RegExp(USER_ACCEPT_PENDING_CONFIGURATION), '')
            .split('/');

        return scene.enter(CONFIGURE_PENDING_LOCATION_SCENE_ID);

    } else if (data.startsWith(USER_ACCEPT_SETTING_NEW_LOCATION)) {
        session.thingyUuid = data.replace(new RegExp(USER_ACCEPT_SETTING_NEW_LOCATION), '');

        return scene.enter(CONFIGURE_LOCATION_SCENE_ID);
    }
});

async function setLocationHandler ({ message, session, reply, scene }: BotSceneSessionContext): Promise<any> {
    const { text } = message;
    const [ thingyUuid, ...splitLocation ] = text.replace(/\/\w+\s*/, '')
        .split(' ');
    const location = splitLocation.join(' ');

    if (thingyUuid && location) {
        // TODO refactor - move to "shared" method
        const thingyLocalization = new ThingyLocalization();
        thingyLocalization.setLocation(location);
        thingyLocalization.setThingyUuid(thingyUuid);

        try {
            await setNewLocation(thingyLocalization)
            await reply('All good hear! It has been saved 💾');
        } catch (error) {
            console.error('Error while setting new location...');
            console.error(error);
            // FIXME, maybe, validate the existence of the thingy uuid on the server and see how to anser
            await reply('Oups... got and error, let\'s try again! 🙃');

            return scene.reenter();
        }
    }

    // Even if it is empty, set it in the session, to make sure we will ask the name or not reuse a previous name
    session.thingyUuid = thingyUuid;

    return scene.enter(CONFIGURE_LOCATION_SCENE_ID);
}

bot.command('setlocation', setlocationHandler);
// position ~ location
bot.command('setposition', setlocationHandler);

/*
 * In addition to the help commands, we can register the `help` and `setlocation` commands to the bot father with:
 *
 *      setcommands
 *
 * then
 *
 *      help - show help menu with commands
 *      setlocation - change the location of a Thingy
 *
 * following the format:
 *
 *      command1 - Description
 *      command2 - Another description
 */
bot.help(({ replyWithMarkdown }) =>
    replyWithMarkdown(
        `Looking for help? No problem, we got you covered with this few tricks 😉

1\\.  We are hear to assist you with the configuration of your different Thingy ⚙️
2\\.  You can request a new location by **double clicking** on the Thingy you want to move 📍

🔹 *Expert mode* 🧞
If you are an expert and know what you are doing, you can also use the following commands:
\\-   \`/setlocation [[<thingy-name>] <new-location>]\`: to set the new location of a Thingy, like if you double clicked on one\\.

🔹 *_Work in progress_* \\- 👩🏻‍💻👨🏼‍🔧🥵
1\\.  We will send you alerts we a Thingy records a value trespassing the configured thresholds 📈📉
2\\.  For good news, we will send you periodic detailed reports to follow those curves to keep an eye on your places 🧐
3\\.  Finally, to shut all those noisy notifications, you can *un*\\-mute us 🤐`,
        {
            parse_mode: 'MarkdownV2'
        }
    )
);

bot.launch()
    .then(() => createServer(bot.telegram));
