import { Middleware } from 'telegraf';
import { BlueBot } from '../../src/BlueBot';
import { BotSceneSessionContext, BotSessionContext } from '../../src/context';
import { IPersistLocalizationClient } from '../../src/services/client/IPersistLocalizationClient';

export declare interface IAvaContext<TContext extends BotSceneSessionContext> {
    sessionMiddleware: Middleware<BotSessionContext>;
    simplePersistLocalizationClient: IPersistLocalizationClient;
    bot: BlueBot<TContext>;
}
