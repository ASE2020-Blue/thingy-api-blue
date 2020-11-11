import { BaseScene, Markup } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { Message } from 'telegraf/typings/telegram-types';
import { SceneSessionContext } from '../../context';
import { ThingyId } from '../../proto/messenger_pb';
import { SCENE_ID as CONFIGURE_LOCATION_SCENE_ID } from './ConfigureLocalization';

export const SCENE_ID = 'configure-pending-localization';
export const USER_ACCEPT_PENDING_CONFIGURATION = 'configure_pending_location_yes/';
export const USER_REFUSE_PENDING_CONFIGURATION = 'configure_pending_location_no';

export const cplScene = new BaseScene<SceneSessionContext>(SCENE_ID);

export function askIfUserWantsToConfigure (ctx: TelegrafContext, thingies: Array<ThingyId>): Promise<Message | any> {
    if (thingies.length === 0) {
        console.log('No pending thingies!');

        return Promise.resolve();
    }

    const thingiesUuids = thingies.map(t => t.getThingyUuid());

    return ctx.reply(
        'We started collecting data for one or more thingy, do you want to configure where you placed them?',
        Markup
            .inlineKeyboard([
                Markup.callbackButton('Yes', `${USER_ACCEPT_PENDING_CONFIGURATION}${thingiesUuids.join('/')}`),
                Markup.callbackButton('No', USER_REFUSE_PENDING_CONFIGURATION)
            ])
            .extra()
    );
}

async function continueSetting ({ session, scene, reply }: SceneSessionContext): Promise<unknown> {
    console.log(session.thingiesUuid);

    const { thingiesUuid } = session;
    const [ firstThingyUuid ] = thingiesUuid;
    if (! firstThingyUuid)
        return scene.leave();

    await reply(`Lets put some oder in the location of: ${thingiesUuid.join(', ')} 🗄`);

    session.thingyUuid = firstThingyUuid;

    return scene.enter(CONFIGURE_LOCATION_SCENE_ID);
}

cplScene
    .enter(continueSetting)
    .on('message', continueSetting);
