import ava, { TestInterface } from 'ava';
import { BlueBot } from '../src/BlueBot';
import { BotSceneSessionContext } from '../src/context';
import {
    errorHandler,
    initSentry,
    requestHandler,
    SentryTransaction,
    tracingHandler
} from '../src/helpers/TelegrafSentry';
import { IAvaContext } from './fixtures/context';
import { setSimpleReturnContextTypeOption } from './helpers/context';
import { createCommandMessage } from './helpers/messageFactories';
import { session } from './helpers/MyLocalSession';
import { errorResult, successResult } from './helpers/PromiseMockResult';
import { SimplePersistLocalizationClient } from './helpers/services/client/SimplePersistLocalizationClient';
import { emptyStageManager } from './helpers/stage/emptyStageManager';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

test.before('Init Sentry', () => {
    process.env.DEBUG_SENTRY = 'true';
    initSentry();
});

test('Caught error and ask if error should be reported', async ({ plan, pass }) => {
    plan(2);

    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(errorResult("Trigger Sentry"), successResult(undefined));
    const middlewares = [requestHandler(), tracingHandler(), sessionMiddleware, emptyStageManager];
    const bot = new BlueBot<BotSceneSessionContext & SentryTransaction>(undefined, simplePersistLocalizationClient, middlewares);

    bot.catch(errorHandler({
        shouldHandleError: () => {
            pass("Error caught and ready to report on Sentry");
            return true;
        }
    }));

    setSimpleReturnContextTypeOption(bot.options);

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());

    pass("Sentry test ok");
});

test('Seamless Sentry', async ({ fail, plan, pass }) => {
    plan(1);

    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(successResult([]), successResult(undefined));
    const middlewares = [requestHandler(), tracingHandler(), sessionMiddleware, emptyStageManager];
    const bot = new BlueBot<BotSceneSessionContext & SentryTransaction>(undefined, simplePersistLocalizationClient, middlewares);

    bot.catch(errorHandler({
        shouldHandleError: () => {
            fail("No error should be raised");
            return true;
        }
    }));

    setSimpleReturnContextTypeOption(bot.options);

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());

    pass("Seamless");
});
