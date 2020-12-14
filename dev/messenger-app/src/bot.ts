import { Telegraf } from 'telegraf';
import { BlueBot } from './BlueBot';

import { BotSceneSessionContext } from './context';
import {
    errorHandler,
    initSentry,
    requestHandler,
    tracingHandler
} from './helpers/TelegrafSentry';
import { GrpcPersistLocalizationClient } from './services/client/GrpcPersistLocalizationClient';
import { createServer } from './services/server';
import { MessengerServer } from './services/server/MessengerServer';
import { BlueStageManager } from './stage/BlueStageManager';
import { ConfigureLocalizationScene } from './stage/scenes/ConfigureLocalizationScene';
import { ConfigurePendingLocalizationScene } from './stage/scenes/ConfigurePendingLocalizationScene';

const { BACKEND_GRPC_HOST, BACKEND_GRPC_BIND_PORT, MESS_GRPC_BIND_HOST, MESS_GRPC_BIND_PORT, NODE_ENV } = process.env;

const isProd = NODE_ENV === 'production';
if (isProd)
    initSentry();

const session = new (require('telegraf-session-redis'))({
    store: {
        host: 'redis',
        port: 6379
    }
});

const blueStageManager = new BlueStageManager([
    new ConfigureLocalizationScene(),
    new ConfigurePendingLocalizationScene()
]);

const grpcPersistLocalizationClient = new GrpcPersistLocalizationClient(BACKEND_GRPC_HOST, parseInt(BACKEND_GRPC_BIND_PORT, 10));

const botMiddleware = [session, blueStageManager];
if (isProd)
    botMiddleware.push(requestHandler(), tracingHandler());

const bot = new BlueBot<BotSceneSessionContext>(process.env.TELEGRAM_TOKEN, grpcPersistLocalizationClient, botMiddleware);
if (isProd)
    bot.catch(errorHandler());

bot.use(Telegraf.log());

bot.launch()
    .then(() => createServer(MESS_GRPC_BIND_HOST, parseInt(MESS_GRPC_BIND_PORT, 10), [new MessengerServer(bot.telegram)]));
