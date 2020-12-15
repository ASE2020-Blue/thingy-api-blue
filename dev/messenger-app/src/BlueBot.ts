import { Middleware, Telegraf } from 'telegraf';
import { TelegrafOptions } from 'telegraf/typings/telegraf';
import { Message } from 'telegraf/typings/telegram-types';
import * as Debug from 'debug';

import { BotSceneSessionContext } from './context';

import { ThingyLocalization } from './proto/thingy_pb';
import { IPersistLocalizationClient } from './services/client/IPersistLocalizationClient';

import { ConfigureLocalizationScene } from './stage/scenes/ConfigureLocalizationScene';
import { ConfigurePendingLocalizationScene } from './stage/scenes/ConfigurePendingLocalizationScene';

import { fgRed, reset } from './helpers/consoleColors';

const debug = Debug('messenger:BlueBot');

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

    constructor(token: string, persistLocalizationClient: IPersistLocalizationClient,
                middlewares?: Array<Middleware<TContext>>, options? : TelegrafOptions) {
        super(token, options);

        this.context.persistLocalizationClient = persistLocalizationClient;

        if (middlewares)
            this.use(...middlewares);

        this.start(this.onStart);
        this.help(this.onHelp);

        const { USER_REFUSE_SETTING_NEW_LOCATION } = ConfigureLocalizationScene;
        const { USER_REFUSE_PENDING_CONFIGURATION } = ConfigurePendingLocalizationScene;
        this.action([USER_REFUSE_PENDING_CONFIGURATION, USER_REFUSE_SETTING_NEW_LOCATION], this.onRefuseActions);
        this.on('callback_query', this.onCallbackQuery);

        this.command('setlocation', this.setLocationHandler);
        this.command('setposition', this.setLocationHandler);
    }

    private async onStart (ctx: TContext): Promise<Message | any> {
        const { reply, from, persistLocalizationClient } = ctx;

        await reply('Welcome on the Telegram bot of group 🔷🥳');

        const chatId = from.id;
        debug(`Started talking with: ${from.first_name} ${from.last_name} (@${from.username} - ${chatId})`);
        if (! process.env.DEV_ID) {
            process.env.DEV_ID = chatId.toString();
            debug(`${fgRed}Set DEV_ID in .env file: ${chatId}${reset}`);
        }

        try {
            const thingies: Array<ThingyLocalization> = await persistLocalizationClient.getPendingLocation();

            return await ConfigurePendingLocalizationScene.ASK_IF_USER_WANTS_TO_CONFIGURE(ctx, thingies);
        } catch (error) {
            debug(`${fgRed}Error while requesting pending locations:${reset} %O`, error);

            return Promise.reject(error);
        }
    }

    /**
     * Handle callback actions defined in the triggers array passed as argument.
     *
     * Will only get into this method for the trigger attached with the action method
     *
     * @param callbackQuery
     * @param reply
     * @param replyWithMarkdown
     * @private
     *
     * TODO improve to combine in an object the key to bind the action and the action to be done
     */
    private onRefuseActions ({ callbackQuery: { data }, reply, replyWithMarkdown, session }: TContext): Promise<Message> {
        switch (data) {
            case ConfigurePendingLocalizationScene.USER_REFUSE_PENDING_CONFIGURATION:
                session.thingiesUuid = undefined;
                return reply('No pressure 👍\nYou can configure them any time');

            case ConfigureLocalizationScene.USER_REFUSE_SETTING_NEW_LOCATION:
                return replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [thingy-name]`');

            default:
                return Promise.reject(new Error(`Not supposed to get here! Missing a 'case' clause for ${data}`));
        }
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
        if (data.startsWith(ConfigurePendingLocalizationScene.USER_ACCEPT_PENDING_CONFIGURATION)) {
            session.thingiesUuid = data.replace(new RegExp(ConfigurePendingLocalizationScene.USER_ACCEPT_PENDING_CONFIGURATION), '')
                .split('/');

            return scene.enter(ConfigurePendingLocalizationScene.ID);

        } else if (data.startsWith(ConfigureLocalizationScene.USER_ACCEPT_SETTING_NEW_LOCATION)) {
            session.thingyUuid = data.replace(new RegExp(ConfigureLocalizationScene.USER_ACCEPT_SETTING_NEW_LOCATION), '');

            return scene.enter(ConfigureLocalizationScene.ID);
        }
    }

    private async setLocationHandler ({ message: { text }, session, reply, scene, persistLocalizationClient }: TContext): Promise<any> {
        const [ thingyUuid, ...splitLocation ] = text.replace(/\/\w+\s*/, '')
            .split(' ');
        const location = splitLocation.join(' ');

        if (thingyUuid && location) {
            // TODO refactor - move to "shared" method
            const thingyLocalization = new ThingyLocalization();
            thingyLocalization.setLocation(location);
            thingyLocalization.setThingyUuid(thingyUuid);

            try {
                await persistLocalizationClient.setNewLocation(thingyLocalization);
                await reply('All good hear! It has been saved 💾');

                return;
            } catch (error) {
                debug(`${fgRed}Error while setting new location...${reset} %O`, error);
                // FIXME, maybe, validate the existence of the thingy uuid on the server and see how to anser
                await reply('Oups... got and error, let\'s try again! 🙃');

                return scene.reenter();
            }
        }

        // Even if it is empty, set it in the session, to make sure we will ask the name or not reuse a previous name
        session.thingyUuid = thingyUuid;

        return scene.enter(ConfigureLocalizationScene.ID);
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
