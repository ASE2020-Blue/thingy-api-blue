import ava, { TestInterface } from 'ava';
import * as Sentry from '@sentry/node';

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
import { emptyStageManager } from './helpers/stage/stageManagers';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

test('Caught error and ask if error should be reported', async ({ plan, pass }) => {
    process.env.DEBUG_SENTRY = 'true';
    initSentry();

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
    process.env.DEBUG_SENTRY = 'true';
    initSentry();

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

/**
 * Run this only to produce an issue in Sentry
 */
test.skip('Throw TypeScript error', async ({ pass, plan }) => {
    process.env.DEBUG_SENTRY = 'true';
    process.env.ENABLE_SENTRY = 'true';
    initSentry();

    plan(2);

    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(successResult([]), successResult(undefined));
    const middlewares = [requestHandler(), tracingHandler(), sessionMiddleware, emptyStageManager];
    const bot = new BlueBot<BotSceneSessionContext & SentryTransaction>(undefined, simplePersistLocalizationClient, middlewares);

    bot.catch(errorHandler({
        shouldHandleError: (error, ctx) => {
            pass("Captured an error");
            return true;
        }
    }));

    // The token is not set, therefore, it will trigger a error in telegraf/telegram
    await bot.handleUpdate(createCommandMessage('/start').toUpdate());

    await Sentry.flush(2000);

    pass("Seamless");
});
