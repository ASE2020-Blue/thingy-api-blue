import { Middleware } from 'telegraf';
import { BlueBot } from '../../src/BlueBot';
import { BotSceneSessionContext, BotSessionContext } from '../../src/context';
import { SimpleThingyPersistenceClient } from '../helpers/services/client/SimpleThingyPersistenceClient';

export declare interface IAvaContext<TContext extends BotSceneSessionContext> {
    sessionMiddleware: Middleware<BotSessionContext>;
    simplePersistLocalizationClient: SimpleThingyPersistenceClient;
    bot: BlueBot<TContext>;
}
