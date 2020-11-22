import { Telegraf } from 'telegraf';
import { BlueBot } from './BlueBot';

import { BotSceneSessionContext } from './context';
import { createServer } from './services/server';
import { stageManager } from './stages/stageManager';

const session = new (require('telegraf-session-redis'))({
    store: {
        host: 'redis',
        port: 6379
    }
});

const bot = new BlueBot<BotSceneSessionContext>(process.env.TELEGRAM_TOKEN, session, stageManager);
bot.use(Telegraf.log());

bot.launch()
    .then(() => createServer(bot.telegram));
