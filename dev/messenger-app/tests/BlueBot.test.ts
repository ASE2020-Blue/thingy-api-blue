import ava, { TestInterface } from 'ava';

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
import { SimpleThingyPersistenceClient } from './helpers/services/client/SimpleThingyPersistenceClient';
import { emptyStageManager } from './helpers/stage/stageManagers';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

test.beforeEach('Setup mocked bot', ({ context }) => {
    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimpleThingyPersistenceClient(successResult([]), successResult(undefined));
    const bot = new BlueBot(undefined, simplePersistLocalizationClient, [sessionMiddleware, emptyStageManager]);

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
