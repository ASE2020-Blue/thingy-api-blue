import ava, { TestInterface } from 'ava';

import { session } from 'telegraf';
import { Message, Update } from 'telegraf/typings/telegram-types';
import * as TypeMoq from 'typemoq';

import { BlueBot } from '../src/BlueBot';
import { BotSceneSessionContext } from '../src/context';
import { IAvaContext } from './fixtures/context';
import { successResult } from './helpers/PromiseMockResult';
import { SimplePersistLocalizationClient } from './helpers/services/client/SimplePersistLocalizationClient';
import { emptyStageManager } from './helpers/stage/emptyStageManager';
import { TestTelegrafContext } from './helpers/TestTelegrafContext';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

const baseMessage = { chat: { id: 1 }, from: { id: 42, username: 'telegraf' } };

test.before('Setup mocked bot', ({ context }) => {
    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(successResult([]), successResult(undefined));
    // @ts-ignore
    const bot = new BlueBot(undefined, sessionMiddleware, emptyStageManager, simplePersistLocalizationClient, { contextType: TestTelegrafContext });

    context.sessionMiddleware = sessionMiddleware;
    context.simplePersistLocalizationClient = simplePersistLocalizationClient;
    context.bot = bot;
});

test('Showing help', async ({ pass, fail, context: { bot } }) => {
    const update = TypeMoq.Mock.ofType<Update>();
    const message = TypeMoq.Mock.ofType<Message>();
    message.setup(m => m.chat).returns(() => ({ id: 1, type: 'private' }));

    const answer = await bot.handleUpdate({ message: { text: '/help', entities: [{ type: 'bot_command', offset: 0, length: 5 }], ...message.object }, ...update.object });
    pass(message.object.message_id.toString());
});
