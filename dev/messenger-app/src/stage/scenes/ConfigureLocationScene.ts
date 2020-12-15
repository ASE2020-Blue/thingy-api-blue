import * as Debug from 'debug';
import { BaseScene, Markup, Telegram } from 'telegraf';
import { BaseSceneOptions } from 'telegraf/typings/stage';
import { Message } from 'telegraf/typings/telegram-types';

import { SceneSessionContext } from '../../context';
import { fgRed, reset } from '../../helpers/consoleColors';
import { ThingyLocation } from '../../proto/thingy_pb';

const debug = Debug('messenger:scene:ConfigureLocationScene');

export class ConfigureLocationScene<TContext extends SceneSessionContext> extends BaseScene<TContext> {

    public static readonly ID = 'configure-location';

    // TODO doc
    public static readonly USER_ACCEPT_SETTING_NEW_LOCATION = 'configure_new_location_yes/';
    // TODO doc
    public static readonly USER_REFUSE_SETTING_NEW_LOCATION = 'configure_new_location_no';

    public static readonly CONFIRM_CALLBACK = 'configure_new_location_confirm';
    public static readonly RESTART_CALLBACK = 'configure_new_location_restart';
    public static readonly STOP_CALLBACK = 'configure_new_location_stop';

    constructor(options?: Partial<BaseSceneOptions<TContext>>) {
        super(ConfigureLocationScene.ID, options);

        this.on('message', this.onMessage);

        const { CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK } = ConfigureLocationScene;
        this.action([ CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK ], this.onCallbackAction);
    }

    public static ASK_IF_USER_WANTS_TO_CONFIGURE (telegram: Telegram, thingyUuid: string): Promise<Message | any> {
        if (!thingyUuid) {
            debug('Dropping request after asking location for an empty uuid...');

            return Promise.resolve();
        }

        const { USER_ACCEPT_SETTING_NEW_LOCATION, USER_REFUSE_SETTING_NEW_LOCATION } = ConfigureLocationScene;

        return telegram.sendMessage(process.env.DEV_ID,
            `You requested a new location for '*${thingyUuid}*'? 🧐\nWant to set a new location? 📍`,
            Markup
                .inlineKeyboard(
                    [
                        [ Markup.callbackButton('Yes 📍', `${USER_ACCEPT_SETTING_NEW_LOCATION}${thingyUuid}`) ],
                        [ Markup.callbackButton('No', USER_REFUSE_SETTING_NEW_LOCATION) ]
                    ]
                )
                .extra({
                    parse_mode: 'Markdown' // not v2, because char '-' is reserved, to render lists
                })
        );
    }

    public enterHandler = ({ reply, replyWithMarkdown, session: { thingyUuid } }: TContext): Promise<Message> => {
        if (thingyUuid)
            return replyWithMarkdown(`Name the new place for *${thingyUuid}*`,
                Markup.forceReply()
                    .extra()
            );
        else
            return reply('What is the name of the thingy you want to set?',
                Markup.forceReply()
                    .extra()
            );
    }

    private onMessage ({ replyWithMarkdown, reply, session, message: { text } }: TContext): Promise<Message> {
        const { thingyUuid } = session;
        session.location = text;
        if (thingyUuid) {
            const { CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK } = ConfigureLocationScene;

            return replyWithMarkdown(`Please confirm: _${thingyUuid}_ at \`${text}\``,
                Markup
                    .inlineKeyboard([
                        [ Markup.callbackButton('Seems correct ✅', CONFIRM_CALLBACK) ],
                        [ Markup.callbackButton('Lets change that ❌', RESTART_CALLBACK) ],
                        [ Markup.callbackButton('Nevermind, I will do it an other time', STOP_CALLBACK) ]
                    ])
                    .extra()
            );
        }

        session.thingyUuid = text;

        return reply(`Name the new place`,
            Markup.forceReply()
                .extra()
        );
    }

    private async onCallbackAction ({ callbackQuery: { data }, reply, replyWithMarkdown, session, scene, persistLocalizationClient }: TContext) : Promise<any> {
        switch (data) {
            case ConfigureLocationScene.CONFIRM_CALLBACK:
                const thingyLocalization = new ThingyLocation();
                const { location, thingyUuid } = session;
                thingyLocalization.setLocation(location);
                thingyLocalization.setThingyUuid(thingyUuid);

                try {
                    await persistLocalizationClient.setNewLocation(thingyLocalization);
                    session.location = session.thingyUuid = undefined;

                    await reply('All good hear! It has been saved 💾');

                    return scene.leave();
                } catch (error) {
                    debug(`${fgRed}Error while setting new location...${reset} %O`, error);

                    // FIXME, maybe, validate the existence of the thingy uuid on the server and see how to anser
                    await reply('Oups... got and error, let\'s try again! 🙃');

                    return scene.reenter();
                }

            case ConfigureLocationScene.STOP_CALLBACK:
                session.location = session.thingyUuid = undefined;

                await replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [[<thingy-name>] <new location>]`');

                return scene.leave();

            case ConfigureLocationScene.RESTART_CALLBACK:
            default:
                return scene.reenter();
        }
    }
}
