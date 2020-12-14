import ava, { TestInterface } from 'ava';

import { ThingyLocalization } from '../src/proto/thingy_pb';
import { PartialReplyApiData } from './fixtures/ApiData';

import { session } from './helpers/MyLocalSession';

import { BlueBot } from '../src/BlueBot';
import { BotSceneSessionContext } from '../src/context';
import { IAvaContext } from './fixtures/context';
import {
    CallApi,
    setContextTypeOption,
    setSimpleReturnContextTypeOption
} from './helpers/context';
import { createCommandMessage } from './helpers/messageFactories';
import { successResult } from './helpers/PromiseMockResult';
import { SimplePersistLocalizationClient } from './helpers/services/client/SimplePersistLocalizationClient';
import { emptyStageManager } from './helpers/stage/emptyStageManager';
import { InlineKeyboardMarkup } from 'telegraf/typings/telegram-types';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

test.beforeEach('Setup mocked bot', ({ context }) => {
    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(successResult([]), successResult(undefined));
    const bot = new BlueBot(undefined, simplePersistLocalizationClient, [sessionMiddleware, emptyStageManager]);

    context.sessionMiddleware = sessionMiddleware;
    context.simplePersistLocalizationClient = simplePersistLocalizationClient;
    context.bot = bot;
});

test('Starting with no pending location', async ({ is, truthy, plan, context: { bot } }) => {
    plan(2);

    setContextTypeOption<{text: string}>(bot.options, (method, { text }) => {
        is(method, 'sendMessage');
        truthy(text.split('\n').length > 0);
    });

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());
});

test('Starting with pending location', async ({ is, truthy, like, plan, context: { simplePersistLocalizationClient, bot } }) => {
    const pendingThingy = new ThingyLocalization();
    pendingThingy.setThingyUuid('rainbow-3');

    simplePersistLocalizationClient.setPendingLocationResult(successResult([ pendingThingy ]));

    plan(7);

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        is(method, 'sendMessage');
        truthy(text.split('\n').length > 0);

        if (reply_markup) {
            reply_markup = <InlineKeyboardMarkup> reply_markup;
            // 1 row, 2 items on the first row
            truthy(reply_markup.inline_keyboard.length === 1 && reply_markup.inline_keyboard[0].length === 2);
            // TODO develop own array like?
            //  As AVA's like method, will "stop" looking down at the first none object instance. Here, this the array...
            like(reply_markup.inline_keyboard[0][0], { text: 'Yes' });
            like(reply_markup.inline_keyboard[0][1], { text: 'No' });
        }
    });

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());
});

test('Showing help', async ({ is, truthy, context: { bot } }) => {

    setSimpleReturnContextTypeOption(bot.options);

    const { method, data: { text } } = <CallApi<PartialReplyApiData>> await bot.handleUpdate(createCommandMessage('/help').toUpdate());
    is(method, 'sendMessage');
    truthy(text.split('\n').length > 0);
});
