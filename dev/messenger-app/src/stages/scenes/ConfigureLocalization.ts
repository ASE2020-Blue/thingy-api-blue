import { BaseScene, Markup, Telegram } from 'telegraf';
import { ThingyLocalization } from '../../proto/thingy_pb';
import { setNewLocation } from '../../services/client/persistLocalizationClient';
import { SCENE_ID as CONFIGURE_PENDING_LOCATION_SCENE_ID } from './ConfigurePendingLocalization';

export const SCENE_ID = 'configure-localization';

export const clScene = new BaseScene(SCENE_ID);

export const USER_ACCEPT_SETTING_NEW_LOCATION = 'configure_new_location_yes/';
export const USER_REFUSE_SETTING_NEW_LOCATION = 'configure_new_location_no';

const CONFIRM_CALLBACK = 'configure_new_location_confirm';
const RESTART_CALLBACK = 'configure_new_location_restart';
const STOP_CALLBACK = 'configure_new_location_stop';

export function askIfUserWantsToConfigure (telegram: Telegram, thingyUudi: string) {
    if (!thingyUudi) {
        console.log('Dropping request after asking location for an empty uuid...');
        return;
    }

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
            const { location, thingyUuid } = session;
            thingyLocalization.setLocation(location);
            thingyLocalization.setThingyUuid(thingyUuid);
            // setNewLocation(thingyLocalization)
            //     .then(() => {
                    reply('All good hear! It has been saved 💾');
                    return scene.leave();
                // })
                // .catch(error => {
                //     console.error('Error while setting new location...');
                //     console.error(error);
                //     // FIXME, maybe, validate the existence of the thingy uuid on the server and see how to anser
                //     reply('Oups... got and error, let\'s try again! 🙃');
                //     scene.reenter();
                // });

        case STOP_CALLBACK:
            replyWithMarkdown('NP!\nIf you change your mind, use the command `/setlocation [[<thingy-name>] <thingy\'s place>]`');
            return scene.leave();

        case RESTART_CALLBACK:
        default:
            return scene.reenter();
    }
});

// @ts-ignore
clScene.leave(({ session, scene }, next) => {
    const { thingyUuid, thingiesUudi } = session;
    console.log('leaving configure', thingyUuid, thingiesUudi);

    // FIXME!!
    if (thingiesUudi) {
        const uuidIndex = thingiesUudi.indexOf(thingyUuid);
        if (uuidIndex >= 0) {
            thingiesUudi.splice(uuidIndex, 1);
        }

        session.thingiesUuid = thingiesUudi; // Not sure if it is necessary

        return next()
            .then(() => scene.enter(CONFIGURE_PENDING_LOCATION_SCENE_ID));
    }
});
