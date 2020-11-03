import { BaseScene, Markup, Telegram } from 'telegraf';
import { ThingyLocalization } from '../../proto/thingy_localization_pb';
import { setNewLocation } from '../../services/client/persistLocalizationClient';

export const SCENE_ID = 'configure-localization';

export const clScene = new BaseScene(SCENE_ID);

export const USER_ACCEPT_SETTING_NEW_LOCATION = 'configure_new_location_yes/';
export const USER_REFUSE_SETTING_NEW_LOCATION = 'configure_new_location_no';

const CONFIRM_CALLBACK = 'configure_new_location_confirm';
const RESTART_CALLBACK = 'configure_new_location_restart';
const STOP_CALLBACK = 'configure_new_location_stop';

export function askIfUserWantsToConfigure (telegram: Telegram, thingyUudi: string) {

    telegram.sendMessage(process.env.DEV_ID,
        `You requested a new location for '*${thingyUudi}*'? 🧐\nWant to set a new location? 📍`,
        Markup
            .inlineKeyboard(
                [
                    [ Markup.callbackButton('Yes 📍', `${USER_ACCEPT_SETTING_NEW_LOCATION}${thingyUudi}`) ],
                    [ Markup.callbackButton('No', USER_REFUSE_SETTING_NEW_LOCATION) ]
                ]
            )
            .extra({
                parse_mode: 'Markdown' // not v2, car char '-' is reserved, to render lists
            })
    );
}

// @ts-ignore
clScene.enter(({ reply, replyWithMarkdown, session }) => {
    const { thingyUuid } = session;
    if (thingyUuid)
        replyWithMarkdown(`Name the new place for *${thingyUuid}*`,
            Markup.forceReply()
                .extra()
        );
    else
        reply('What is the name of the thingy you want to set?',
            Markup.forceReply()
                .extra()
        );
});

// @ts-ignore
clScene.on('message', ({ replyWithMarkdown, reply, session, message }) => {
    const { thingyUuid } = session;
    const { text } = message;
    session.location = text;
    if (thingyUuid) {
        replyWithMarkdown(`Please confirm: _${thingyUuid}_ at \`${text}\``,
            Markup
                .inlineKeyboard([
                    [ Markup.callbackButton('Seems correct ✅', CONFIRM_CALLBACK) ],
                    [ Markup.callbackButton('Lets change that ❌', RESTART_CALLBACK) ],
                    [ Markup.callbackButton('Nevermind, I will do it an other time', STOP_CALLBACK) ]
                ])
                .extra()
        );
    } else {
        session.thingyUuid = text;
        reply(`Name the new place`,
            Markup.forceReply()
                .extra()
        );
    }
});

// @ts-ignore
clScene.action([CONFIRM_CALLBACK, RESTART_CALLBACK, STOP_CALLBACK], ({ callbackQuery, reply, replyWithMarkdown, session, scene }) => {
    const { data } = callbackQuery;
    switch (data) {
        case CONFIRM_CALLBACK:
            const thingyLocalization = new ThingyLocalization();
            const { location, thingyUuuid } = session;
            thingyLocalization.setLocation(location);
            thingyLocalization.setThingyUudi(thingyUuuid);
            // setNewLocation(thingyLocalization)
            //     .then(() => {
                    reply('All good hear! It has been saved 💾');
                    scene.leave();
                // })
                // .catch(error => {
                //     console.error('Error while setting new location...');
                //     console.error(error);
                //     reply('Oups... got and error, let\'s try again! 🙃');
                //     scene.reenter();
                // });
            break;
        case STOP_CALLBACK:
            replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [<thingy-name>]`');
            break;

        case RESTART_CALLBACK:
        default:
            scene.reenter(); // TODO check if doesn't had a new layer
    }
});
