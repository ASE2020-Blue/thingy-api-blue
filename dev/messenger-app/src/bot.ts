const dotenv = require('dotenv');
/**
 * Get the key-values of the `.env` file, and place then in the `process.env` variable
 *
 * Special notices to:
 *  - TELEGRAM_TOKEN
 *  - DEV_ID
 */
dotenv.config();

import { Markup } from 'telegraf';
import { getPendingLocation } from './services/client/persistLocalizationClient';
import { createServer } from './services/server';
import {
    askIfUserWantToConfigure,
    ASK_CALLBACK,
    SCENE_ID as CONFIGURE_PENDING_LOCATION_SCENE_ID,
    USER_ACCEPT_PENDING_CONFIGURATION,
    USER_REFUSE_PENDING_CONFIGURATION,
} from './stages/scenes/ConfigurePendingLocalization';
import { stageManager } from './stages/stageManager';
import { fgRed, reset } from './utils/consoleColors';

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const session = new (require('telegraf-session-redis'))({
    store: {
        host: 'redis',
        port: 6379
    }
});

bot.startPolling();
bot.use(Telegraf.log());
bot.use(session);
bot.use(stageManager.middleware());

bot.start((ctx) => {
    ctx.reply('Welcome from the bot root!');

    const chatId = ctx.from.id;

    console.log(
        `Started talking with: ${ctx.from.first_name} ${ctx.from.last_name}` +
        `(@${ctx.from.username} - ${chatId})`
    );
    if (! process.env.DEV_ID) {
        process.env.DEV_ID = chatId;
        console.log(`${fgRed}Set DEV_ID in .env file: ${chatId}${reset}`);
    }

    askIfUserWantToConfigure(ctx);
    // TODO
    // getPendingLocation().then(thingies => {
    //
    // })
});

bot.action(ASK_CALLBACK, ({ callbackQuery, reply , scene }) => {
    switch (callbackQuery.data) {
        case USER_ACCEPT_PENDING_CONFIGURATION:
            scene.enter(CONFIGURE_PENDING_LOCATION_SCENE_ID);
            break;
        case USER_REFUSE_PENDING_CONFIGURATION:
            reply('No pressure 👍\nYou can configure them any them');
            break;
        default:
            console.error(`Missing callback query handle of ${callbackQuery.data}`);
    }
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.hears('hi', (ctx) => ctx.reply('Hey there mister'));

bot.launch()
    .then(() => createServer(bot.telegram));
