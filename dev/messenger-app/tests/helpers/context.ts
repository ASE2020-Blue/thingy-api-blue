import { Telegraf, Context } from 'telegraf';
import { Telegram, ApiClient } from 'telegraf/telegram';
import { TOptions } from 'telegraf/typings/telegraf';
import { Update } from 'telegraf/typings/telegram-types';

/**
 * @see {@link TelegrafContext} constructor
 */
interface TContextCtor {
    new (update: Update, telegram: Telegram, options: object): Context;
}

/**
 * {@link Telegram} which will extend {@link ApiClient} and get the {@link ApiClient#callApi} method.
 */
export type CallApiImpl<D> = (method: string, data: D) => Promise<unknown>;

export interface CallApi<D> {
    method: string; // TODO specify more clearly
    data: D;
}

export type CallApiPromise<D> = Promise<CallApi<D>>;

export function prepareHookedTelegramContext<D>(callApiImpl: CallApiImpl<D>): TContextCtor {
    const overrideCallApi = (telegram: Telegram): Telegram => {
        telegram.callApi = callApiImpl;
        return telegram;
    }

    class HookableTelegrafContext extends Context {
        constructor(update: Update, telegram: Telegram, options?: { username?: string }) {
            super(update, overrideCallApi(telegram), options);
        }
    }

    return HookableTelegrafContext;
}

export function setSimpleReturnContextTypeOption (options: TOptions): void {
    setContextTypeOption(options, (method, data) => Promise.resolve({ method, data }));
}

/**
 * Used as in the implementation of {@link Telegraf#handleUpdate}, it will construct a new {@link Context}
 * (TelegrafContext) based on this option.
 *
 * @param options
 * @param callApiImpl
 */
export function setContextTypeOption<D> (options: TOptions, callApiImpl: CallApiImpl<D>): void {
    // @ts-ignore
    options.contextType = prepareHookedTelegramContext(callApiImpl);
}
