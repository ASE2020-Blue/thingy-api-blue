import * as Debug from 'debug';
import { BaseScene, Composer, Markup } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { BaseSceneOptions } from 'telegraf/typings/stage';
import { Message } from 'telegraf/typings/telegram-types';

import { SceneSessionContext } from '../../context';
import { ThingyId } from '../../proto/messenger_pb';
import { ConfigureLocalizationScene } from './ConfigureLocalizationScene';

const debug = Debug('messenger:scene:ConfigurePendingLocalizationScene');

export class ConfigurePendingLocalizationScene<TContext extends SceneSessionContext> extends BaseScene<TContext> {

    public static readonly ID = 'configure-pending-localization';

    // TODO doc
    public static readonly USER_ACCEPT_PENDING_CONFIGURATION = 'configure_pending_location_yes/';
    // TODO doc
    public static readonly USER_REFUSE_PENDING_CONFIGURATION = 'configure_pending_location_no';

    private readonly configScene: ConfigureLocalizationScene<TContext>;

    constructor(configScene: ConfigureLocalizationScene<TContext>, options?: Partial<BaseSceneOptions<TContext>>) {
        super(ConfigurePendingLocalizationScene.ID, options);

        this.configScene = configScene;

        // Continue to iterate like when entered the scene
        this.on('message', this.enterHandler);

        // Optional middleware, only enter `onConfigSceneLeave` if the ongoing session attribute is true
        this.configScene.leave(Composer.optional(this.listenConfigScenePredicate, this.onConfigSceneLeave));
    }

    public static ASK_IF_USER_WANTS_TO_CONFIGURE ({ reply }: TelegrafContext, thingies: Array<ThingyId>): Promise<Message | any> {
        if (thingies.length === 0) {
            debug('No pending thingies!');

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
        const { thingiesUuid, ongoingPendingLocationConfiguration } = session;
        if (! thingiesUuid)
            return scene.leave();

        const firstThingyUuid = thingiesUuid.shift();
        if (! firstThingyUuid)
            return scene.leave();

        if ( ! ongoingPendingLocationConfiguration)
            await reply(`Lets put some oder in the location of: ${thingiesUuid.join(', ')} 🗄`);

        session.ongoingPendingLocationConfiguration = true;
        session.thingyUuid = firstThingyUuid;

        return scene.enter(ConfigureLocalizationScene.ID);
    }

    private listenConfigScenePredicate ({ session: { ongoingPendingLocationConfiguration } }: TContext) : boolean {
        return ongoingPendingLocationConfiguration;
    }

    private async onConfigSceneLeave({ replyWithMarkdown, session }: TContext) : Promise<any> {
        const { thingiesUuid } = session;
        if ( ! thingiesUuid || thingiesUuid.length === 0) {
            session.ongoingPendingLocationConfiguration = false;
            return replyWithMarkdown('Nice work! You went through all configurations 🥵🤙');
        }

        const [ nextThingyUuid ] = thingiesUuid;
        const additionalThingiesCount = thingiesUuid.length - 1 <= 0
                ? ''
                : ` (and ${thingiesUuid.length} more)`;

        const { USER_ACCEPT_PENDING_CONFIGURATION, USER_REFUSE_PENDING_CONFIGURATION } = ConfigurePendingLocalizationScene;

        return replyWithMarkdown(
            `Continue with setting location of \`${nextThingyUuid}\`${additionalThingiesCount}`,
            Markup
                .inlineKeyboard([
                    Markup.callbackButton('Yes, continue', `${USER_ACCEPT_PENDING_CONFIGURATION}${thingiesUuid.join('/')}`),
                    Markup.callbackButton('It\'s enough for now', USER_REFUSE_PENDING_CONFIGURATION)
                ])
                .extra()
        );
    }
}
