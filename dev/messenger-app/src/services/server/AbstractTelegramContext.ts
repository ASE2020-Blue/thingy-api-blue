import { Telegram } from 'telegraf';

export class AbstractTelegramContext {

    protected telegram: Telegram;

    constructor(telegram: Telegram) {
        this.telegram = telegram;
    }
}
