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
import { emptyStageManager } from './helpers/stage/stageManagers';
import { InlineKeyboardMarkup } from 'telegraf/typings/telegram-types';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

test.beforeEach('Setup mocked bot', ({ context }) => {
    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(successResult([]), successResult(undefined));
    const bot = new BlueBot(undefined, sessionMiddleware, emptyStageManager, simplePersistLocalizationClient);

    context.sessionMiddleware = sessionMiddleware;
    context.simplePersistLocalizationClient = simplePersistLocalizationClient;
    context.bot = bot;
});

test('Start message', async ({ is, truthy, plan, context: { bot } }) => {
    plan(2);

    setContextTypeOption<{text: string}>(bot.options, (method, { text }) => {
        is(method, 'sendMessage');
        // Welcome message, after start
        truthy(text.trim());
    });

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());
});

test('Showing help', async ({ is, truthy, context: { bot } }) => {

    setSimpleReturnContextTypeOption(bot.options);

    const { method, data: { text } } = <CallApi<PartialReplyApiData>> await bot.handleUpdate(createCommandMessage('/help').toUpdate());
    is(method, 'sendMessage');
    truthy(text.split('\n').length > 0);
});
