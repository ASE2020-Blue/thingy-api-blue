import { BaseScene, Markup, Telegram } from 'telegraf';
import { Message } from 'telegraf/typings/telegram-types';
import { SceneSessionContext } from '../../context';
import { ThingyLocalization } from '../../proto/thingy_pb';
import { setNewLocation } from '../../services/client/persistLocalizationClient';

export const SCENE_ID = 'configure-localization';

export const clScene = new BaseScene<SceneSessionContext>(SCENE_ID);

export const USER_ACCEPT_SETTING_NEW_LOCATION = 'configure_new_location_yes/';
export const USER_REFUSE_SETTING_NEW_LOCATION = 'configure_new_location_no';

const CONFIRM_CALLBACK = 'configure_new_location_confirm';
const RESTART_CALLBACK = 'configure_new_location_restart';
const STOP_CALLBACK = 'configure_new_location_stop';

export function askIfUserWantsToConfigure (telegram: Telegram, thingyUuid: string): Promise<Message | any> {
    if (!thingyUuid) {
        console.log('Dropping request after asking location for an empty uuid...');

        return Promise.resolve();
    }

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

clScene.enter(({ reply, replyWithMarkdown, session }) => {
    const { thingyUuid } = session;
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
});

clScene.on('message', ({ replyWithMarkdown, reply, session, message }) => {
    const { thingyUuid } = session;
    const { text } = message;
    session.location = text;
    if (thingyUuid) {
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
});

clScene.action([CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK], async ({ callbackQuery, reply, replyWithMarkdown, session, scene }) => {
    const { data } = callbackQuery;
    switch (data) {
        case CONFIRM_CALLBACK:
            const thingyLocalization = new ThingyLocalization();
            const { location, thingyUuid } = session;
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

        case STOP_CALLBACK:
            await replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [[<thingy-name>] <new location>]`');

            return scene.leave();

        case RESTART_CALLBACK:
        default:
            return scene.reenter();
    }
});

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
