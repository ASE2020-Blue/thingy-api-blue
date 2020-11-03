const dotenv = require('dotenv');
/**
 * Get the key-values of the `.env` file, and place then in the `process.env` variable
 *
 * Special notices to:
 *  - TELEGRAM_TOKEN
 *  - DEV_ID
 */
dotenv.config();

import { createServer } from './services/server';
import { fgRed, reset } from './utils/consoleColors';

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.startPolling();
bot.use(Telegraf.log());

bot.start((ctx) => {
    ctx.reply('Welcome!');

    const chatId = ctx.from.id;

    console.log(
        `Started talking with: ${ctx.from.first_name} ${ctx.from.last_name}` +
        `(@${ctx.from.username} - ${chatId})`
    );
    if (! process.env.DEV_ID) {
        process.env.DEV_ID = chatId;
        console.log(`${fgRed}Set DEV_ID in .env file: ${chatId}${reset}`);
    }
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there mister'));
bot.launch()
    .then(() => createServer(bot.telegram));
