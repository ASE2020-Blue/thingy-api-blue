import { Telegraf } from 'telegraf';
import { BlueBot } from './BlueBot';

import { BotSceneSessionContext } from './context';
import { createServer } from './services/server';
import { BlueStageManager } from './stage/BlueStageManager';
import { ConfigureLocalizationScene } from './stage/scenes/ConfigureLocalizationScene';
import { ConfigurePendingLocalizationScene } from './stage/scenes/ConfigurePendingLocalizationScene';

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
const bot = new BlueBot<BotSceneSessionContext>(process.env.TELEGRAM_TOKEN, session, blueStageManager);
bot.use(Telegraf.log());

bot.launch()
    .then(() => createServer(bot.telegram));
