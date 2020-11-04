import { BaseScene, Markup } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { ThingyLocalization } from '../../proto/thingy_localization_pb';
import { SCENE_ID as CONFIGURE_LOCATION_SCENE_ID } from './ConfigureLocalization';

export const SCENE_ID = 'configure-pending-localization';
export const USER_ACCEPT_PENDING_CONFIGURATION = 'configure_pending_location_yes/';
export const USER_REFUSE_PENDING_CONFIGURATION = 'configure_pending_location_no';

export const cplScene = new BaseScene(SCENE_ID);

export function askIfUserWantsToConfigure (ctx: TelegrafContext, thingies: Array<ThingyLocalization>) {
    ctx.reply(
        'We started collecting data for one or more thingy, do you want to configure where you placed them?',
        Markup
            .inlineKeyboard(
                [
                    Markup.callbackButton('Yes', `${USER_ACCEPT_PENDING_CONFIGURATION}${thingies.join('/')}`),
                    Markup.callbackButton('No', USER_REFUSE_PENDING_CONFIGURATION)
                ],
                {}
            )
            .extra()
    );
}

function continueSetting (ctx: SceneContextMessageUpdate, next) {
    // @ts-ignore
    const { session, scene, reply } = ctx;

    console.log(session.thingiesUuid);

    const { thingiesUuid } = session;
    const [ firstThingyUudi ] = thingiesUuid;
    if (! firstThingyUudi)
        return scene.leave();

    return reply(`Lets put some oder in the location of: ${thingiesUuid.join(', ')} 🗄`)
        .then(() => {
            session.thingyUuid = firstThingyUudi;
            return scene.enter(CONFIGURE_LOCATION_SCENE_ID);
        });
}

// @ts-ignore
cplScene.enter(continueSetting);

// @ts-ignore
cplScene.on('message', continueSetting);
