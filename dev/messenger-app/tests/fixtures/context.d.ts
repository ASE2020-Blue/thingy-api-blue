import { Middleware } from 'telegraf';
import { BlueBot } from '../../src/BlueBot';
import { BotSceneSessionContext, BotSessionContext } from '../../src/context';
import { SimplePersistLocalizationClient } from '../helpers/services/client/SimplePersistLocalizationClient';

export declare interface IAvaContext<TContext extends BotSceneSessionContext> {
    sessionMiddleware: Middleware<BotSessionContext>;
    simplePersistLocalizationClient: SimplePersistLocalizationClient;
    bot: BlueBot<TContext>;
}
