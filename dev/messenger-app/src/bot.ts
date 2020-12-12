import { Telegraf } from 'telegraf';
import { BlueBot } from './BlueBot';

import { BotSceneSessionContext } from './context';
import { GrpcPersistLocalizationClient } from './services/client/GrpcPersistLocalizationClient';
import { createServer } from './services/server';
import { MessengerServer } from './services/server/MessengerServer';
import { BlueStageManager } from './stage/BlueStageManager';
import { ConfigureLocalizationScene } from './stage/scenes/ConfigureLocalizationScene';
import { ConfigurePendingLocalizationScene } from './stage/scenes/ConfigurePendingLocalizationScene';

const { BACKEND_GRPC_HOST, BACKEND_GRPC_BIND_PORT, MESS_GRPC_BIND_HOST, MESS_GRPC_BIND_PORT } = process.env;

const session = new (require('telegraf-session-redis'))({
    store: {
        host: 'redis',
        port: 6379
    }
});

const configureLocalizationScene = new ConfigureLocalizationScene();
const blueStageManager = new BlueStageManager([
    configureLocalizationScene,
    new ConfigurePendingLocalizationScene(configureLocalizationScene)
]);

const grpcPersistLocalizationClient = new GrpcPersistLocalizationClient(BACKEND_GRPC_HOST, parseInt(BACKEND_GRPC_BIND_PORT, 10));

const bot = new BlueBot<BotSceneSessionContext>(process.env.TELEGRAM_TOKEN, session, blueStageManager, grpcPersistLocalizationClient);
bot.use(Telegraf.log());

bot.launch()
    .then(() => createServer(MESS_GRPC_BIND_HOST, parseInt(MESS_GRPC_BIND_PORT, 10), [new MessengerServer(bot.telegram)]));
