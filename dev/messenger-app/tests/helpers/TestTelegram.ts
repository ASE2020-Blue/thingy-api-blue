import { Telegram } from 'telegraf';
import { TelegramOptions } from 'telegraf/typings/telegram';

export class TestTelegram extends Telegram {
    constructor(token: string, options?: TelegramOptions) {
        super(token, options);
    }

    callApi(method: string, data: object): Promise<unknown> {
        return Promise.resolve();
    }
}
