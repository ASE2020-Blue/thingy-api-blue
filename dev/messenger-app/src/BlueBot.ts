import { Middleware, Telegraf } from 'telegraf';
import { TelegrafOptions } from 'telegraf/typings/telegraf';
import { Message } from 'telegraf/typings/telegram-types';

import { BotSceneSessionContext } from './context';

import { ThingyLocalization } from './proto/thingy_pb';
import { getPendingLocation, setNewLocation } from './services/client/persistLocalizationClient';

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

import { fgRed, reset } from './utils/consoleColors';

/**
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
export class BlueBot<TContext extends BotSceneSessionContext> extends Telegraf<TContext> {

    constructor(token: string, sessionMiddleware: Middleware<TContext>, stageManagerMiddleware: Middleware<TContext>,
                options? : TelegrafOptions) {
        super(token, options);

        this.use(sessionMiddleware, stageManagerMiddleware);

        this.start(this.onStart);
        this.help(this.onHelp);

        this.action([USER_REFUSE_PENDING_CONFIGURATION, USER_REFUSE_SETTING_NEW_LOCATION], this.onRefuseActions);
        this.on('callback_query', this.onCallbackQuery);

        this.command('setlocation', this.setLocationHandler);
        this.command('setposition', this.setLocationHandler);
    }

    private async onStart (ctx: TContext): Promise<Message | any> {
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

            return Promise.reject(error);
        }
    }

    /**
     * Handle callback actions defined in the triggers array passed as argument.
     *
     * @param callbackQuery
     * @param reply
     * @param replyWithMarkdown
     * @private
     */
    private onRefuseActions ({ callbackQuery: { data }, reply, replyWithMarkdown }: TContext) {
        switch (data) {
            case USER_REFUSE_PENDING_CONFIGURATION:
                return reply('No pressure 👍\nYou can configure them any them');

            case USER_REFUSE_SETTING_NEW_LOCATION:
                return replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [thingy-name]`');
        }

        debugger;
    }

    /**
     * Handle no matching actions from the {@link #onRefuseActions}.
     *
     * @param data
     * @param scene
     * @param session
     * @private
     */
    private onCallbackQuery ({ callbackQuery: { data }, scene, session }: TContext) {
        if (data.startsWith(USER_ACCEPT_PENDING_CONFIGURATION)) {
            session.thingiesUuid = data.replace(new RegExp(USER_ACCEPT_PENDING_CONFIGURATION), '')
                .split('/');

            return scene.enter(CONFIGURE_PENDING_LOCATION_SCENE_ID);

        } else if (data.startsWith(USER_ACCEPT_SETTING_NEW_LOCATION)) {
            session.thingyUuid = data.replace(new RegExp(USER_ACCEPT_SETTING_NEW_LOCATION), '');

            return scene.enter(CONFIGURE_LOCATION_SCENE_ID);
        }

        debugger;
    }

    private async setLocationHandler ({ message: { text }, session, reply, scene }: TContext): Promise<any> {
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

    private onHelp ({ replyWithMarkdown }: TContext): Promise<Message> {
        return replyWithMarkdown(
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
        );
    }
}
