import * as grpc from "grpc";

const dotenv = require('dotenv');
/**
 * Get the key-values of the `.env` file, and place then in the `process.env` variable
 *
 * Special notices to:
 *  - TELEGRAM_TOKEN
 *  - DEV_ID
 */
dotenv.config();

const { GRPC_BIND_HOST, GRPC_BIND_POST } = process.env;
import { server } from './services/Server';

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.startPolling();
bot.use(Telegraf.log());

bot.start((ctx) => {
    ctx.reply('Welcome!');

    console.log(
        `Started talking with: ${ctx.from.first_name} ${ctx.from.last_name}` +
        `(@${ctx.from.username} - ${ctx.from.id})`
    );
});

bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there mister'));
bot.launch()
    .then(() => {
        console.log(`Starting gRPC: ${GRPC_BIND_HOST}:${GRPC_BIND_POST}`);
        server.bind(`${GRPC_BIND_HOST}:${GRPC_BIND_POST}`, grpc.ServerCredentials.createInsecure());
        server.start();
    });
