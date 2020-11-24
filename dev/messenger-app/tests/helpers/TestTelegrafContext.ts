import { Context } from 'telegraf';
import { Telegram } from 'telegraf/typings/telegram';
import * as tt from 'telegraf/typings/telegram-types';
import { TestTelegram } from './TestTelegram';
import { spy, when } from 'ts-mockito';


function spyTelegram (tg: Telegram): Telegram {
    tg.callApi = (method: string, data: object): Promise<unknown> => {
        return Promise.resolve();
    }
    return tg;
}

export class TestTelegrafContext extends Context {
    public constructor(update: tt.Update, telegram: Telegram, options?: { username?: string }) {
        super(update, spyTelegram(telegram), options);
    }
}
