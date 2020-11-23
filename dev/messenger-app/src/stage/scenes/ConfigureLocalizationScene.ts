import { BaseScene, Markup, Telegram } from 'telegraf';
import { BaseSceneOptions } from 'telegraf/typings/stage';
import { Message } from 'telegraf/typings/telegram-types';

import { SceneSessionContext } from '../../context';
import { ThingyLocalization } from '../../proto/thingy_pb';
import { setNewLocation } from '../../services/client/persistLocalizationClient';

// FIXME! Re-entrant infinite loop
// clScene.leave(({ session, scene }, next) => {
//     const { thingyUuid, thingiesUuid } = session;
//     console.log('leaving configure', thingyUuid, thingiesUuid);
//
//     if (thingiesUuid) {
//         const uuidIndex = thingiesUuid.indexOf(thingyUuid);
//         if (uuidIndex >= 0) {
//             thingiesUuid.splice(uuidIndex, 1);
//         }
//
//         session.thingiesUuid = thingiesUuid; // Not sure if it is necessary
//         const [ nextUuid ] = thingiesUuid;
//         session.thingyUuid = nextUuid; // Not sure if it is necessary
//
//         return next()
//             .then(() => scene.enter(CONFIGURE_PENDING_LOCATION_SCENE_ID));
//     }
// });

export class ConfigureLocalizationScene<TContext extends SceneSessionContext> extends BaseScene<TContext> {

    public static readonly ID = 'configure-localization';

    // TODO doc
    public static readonly USER_ACCEPT_SETTING_NEW_LOCATION = 'configure_new_location_yes/';
    // TODO doc
    public static readonly USER_REFUSE_SETTING_NEW_LOCATION = 'configure_new_location_no';

    private static readonly CONFIRM_CALLBACK = 'configure_new_location_confirm';
    private static readonly RESTART_CALLBACK = 'configure_new_location_restart';
    private static readonly STOP_CALLBACK = 'configure_new_location_stop';

    constructor(options?: Partial<BaseSceneOptions<TContext>>) {
        super(ConfigureLocalizationScene.ID, options);

        this.on('message', this.onMessage);

        const { CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK } = ConfigureLocalizationScene;
        this.action([ CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK ], this.onCallbackAction);
    }

    public static ASK_IF_USER_WANTS_TO_CONFIGURE (telegram: Telegram, thingyUuid: string): Promise<Message | any> {
        if (!thingyUuid) {
            console.log('Dropping request after asking location for an empty uuid...');

            return Promise.resolve();
        }

        const { USER_ACCEPT_SETTING_NEW_LOCATION, USER_REFUSE_SETTING_NEW_LOCATION } = ConfigureLocalizationScene;

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
                    parse_mode: 'Markdown' // not v2, car char '-' is reserved, to render lists
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
            const { CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK } = ConfigureLocalizationScene;

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

    private async onCallbackAction ({ callbackQuery: { data }, reply, replyWithMarkdown, session: { location, thingyUuid }, scene }: TContext) : Promise<any> {
        switch (data) {
            case ConfigureLocalizationScene.CONFIRM_CALLBACK:
                const thingyLocalization = new ThingyLocalization();
                thingyLocalization.setLocation(location);
                thingyLocalization.setThingyUuid(thingyUuid);

                try {
                    await setNewLocation(thingyLocalization);
                    await reply('All good hear! It has been saved 💾');

                    return scene.leave();
                } catch (error) {
                    console.error('Error while setting new location...');
                    console.error(error);

                    // FIXME, maybe, validate the existence of the thingy uuid on the server and see how to anser
                    await reply('Oups... got and error, let\'s try again! 🙃');

                    return scene.reenter();
                }

            case ConfigureLocalizationScene.STOP_CALLBACK:
                await replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [[<thingy-name>] <new location>]`');

                return scene.leave();

            case ConfigureLocalizationScene.RESTART_CALLBACK:
            default:
                return scene.reenter();
        }
    }
}
