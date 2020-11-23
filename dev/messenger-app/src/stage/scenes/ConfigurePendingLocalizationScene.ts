import { BaseScene, Markup } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { BaseSceneOptions } from 'telegraf/typings/stage';
import { Message } from 'telegraf/typings/telegram-types';

import { SceneSessionContext } from '../../context';
import { ThingyId } from '../../proto/messenger_pb';
import { ConfigureLocalizationScene } from './ConfigureLocalizationScene';

export class ConfigurePendingLocalizationScene<TContext extends SceneSessionContext> extends BaseScene<TContext> {

    public static readonly ID = 'configure-pending-localization';

    // TODO doc
    public static readonly USER_ACCEPT_PENDING_CONFIGURATION = 'configure_pending_location_yes/';
    // TODO doc
    public static readonly USER_REFUSE_PENDING_CONFIGURATION = 'configure_pending_location_no';

    constructor(options?: Partial<BaseSceneOptions<TContext>>) {
        super(ConfigureLocalizationScene.ID, options);

        // Continue to iterate like when entered the scene
        this.on('message', this.enterHandler);
    }

    public static ASK_IF_USER_WANTS_TO_CONFIGURE ({ reply }: TelegrafContext, thingies: Array<ThingyId>): Promise<Message | any> {
        if (thingies.length === 0) {
            console.log('No pending thingies!');

            return Promise.resolve();
        }

        const thingiesUuids = thingies.map(t => t.getThingyUuid());

        const { USER_ACCEPT_PENDING_CONFIGURATION, USER_REFUSE_PENDING_CONFIGURATION } = ConfigurePendingLocalizationScene;

        return reply(
            'We started collecting data for one or more thingy, do you want to configure where you placed them?',
            Markup
                .inlineKeyboard([
                    Markup.callbackButton('Yes', `${USER_ACCEPT_PENDING_CONFIGURATION}${thingiesUuids.join('/')}`),
                    Markup.callbackButton('No', USER_REFUSE_PENDING_CONFIGURATION)
                ])
                .extra()
        );
    }

    public enterHandler = async ({ session, scene, reply }: TContext) : Promise<Message> => {
        console.log(session.thingiesUuid);

        const { thingiesUuid } = session;
        const [ firstThingyUuid ] = thingiesUuid;
        if (! firstThingyUuid)
            return scene.leave();

        await reply(`Lets put some oder in the location of: ${thingiesUuid.join(', ')} 🗄`);

        session.thingyUuid = firstThingyUuid;

        return scene.enter(ConfigureLocalizationScene.ID);
    }
}
