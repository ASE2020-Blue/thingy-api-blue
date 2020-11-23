import ava, { TestInterface } from 'ava';

import { session } from 'telegraf';

import { BlueBot } from '../src/BlueBot';
import { BotSceneSessionContext } from '../src/context';
import { IAvaContext } from './fixtures/context';
import { successResult } from './helpers/PromiseMockResult';
import { SimplePersistLocalizationClient } from './helpers/services/client/SimplePersistLocalizationClient';
import { emptyStageManager } from './helpers/stage/emptyStageManager';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

test.before('Setup mocked bot', ({ context }) => {
    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(successResult([]), successResult(undefined));
    const bot = new BlueBot(undefined, sessionMiddleware, emptyStageManager, simplePersistLocalizationClient);

    context.sessionMiddleware = sessionMiddleware;
    context.simplePersistLocalizationClient = simplePersistLocalizationClient;
    context.bot = bot;
});

test('Showing help', t => {
    t.fail();
});
