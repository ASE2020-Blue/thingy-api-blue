import ava, { LikeAssertion, TestInterface, TruthyAssertion } from 'ava';
import { InlineKeyboardMarkup } from 'telegraf/typings/telegram-types';
import { BlueBot } from '../../../src/BlueBot';
import { BotSceneSessionContext } from '../../../src/context';
import { ConfigureLocalizationScene } from '../../../src/stage/scenes/ConfigureLocalizationScene';
import { ConfigurePendingLocalizationScene } from '../../../src/stage/scenes/ConfigurePendingLocalizationScene';
import { PartialReplyApiData } from '../../fixtures/ApiData';
import { IAvaContext } from '../../fixtures/context';
import { setContextTypeOption } from '../../helpers/context';
import {
    botUser,
    createCallbackQuery,
    createCommandMessage, createMessage,
    SimpleCallbackQuery,
    SimpleMessage
} from '../../helpers/messageFactories';
import { session } from '../../helpers/MyLocalSession';
import { successResult } from '../../helpers/PromiseMockResult';
import { ThingyFactory } from '../../helpers/proto/ThingyFactory';
import { SimplePersistLocalizationClient } from '../../helpers/services/client/SimplePersistLocalizationClient';
import { srcStageManager } from '../../helpers/stage/stageManagers';

const test = <TestInterface<IAvaContext<BotSceneSessionContext>>> ava;

const { createThingyLocalization } = ThingyFactory.instance;

test.beforeEach('Setup mocked bot', ({ context }) => {
    const sessionMiddleware = session<BotSceneSessionContext>();
    const simplePersistLocalizationClient = new SimplePersistLocalizationClient(successResult([]), successResult(undefined));
    const bot = new BlueBot(undefined, sessionMiddleware, srcStageManager, simplePersistLocalizationClient);

    context.sessionMiddleware = sessionMiddleware;
    context.simplePersistLocalizationClient = simplePersistLocalizationClient;
    context.bot = bot;
});

test('No pending thingy', async ({ is, truthy, plan, context: { bot } }) => {
    plan(2);

    setContextTypeOption<{text: string}>(bot.options, (method, { text }) => {
        is(method, 'sendMessage');
        // Welcome message, after start
        truthy(text.trim());

        // No additional message to announce no pending localization
    });

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());
});

test('Starting with pending location', async ({ is, truthy, like, plan, context: { simplePersistLocalizationClient, bot } }) => {
    simplePersistLocalizationClient.setPendingLocationResult(successResult([ createThingyLocalization('rainbow-2') ]));

    plan(7);

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        is(method, 'sendMessage');
        // 1. Welcome message, after start
        // 2. Ask to configure pending localization(s)
        truthy(text.trim());

        if (reply_markup)
            checkMarkupAskingToConfigurePendingLocalization(truthy, like, <InlineKeyboardMarkup>reply_markup);
    });

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());

    // TODO continue the configuration process
});

test.todo('Refuse to set pending thingies');

// TODO can heavily be improved
test('Iterate through pending thingies', async ({ is, plan, truthy, like, context: { bot, simplePersistLocalizationClient } }) => {
    let callbackQuery: SimpleCallbackQuery = undefined;

    simplePersistLocalizationClient.setPendingLocationResult(successResult([createThingyLocalization('rainbow-22'), createThingyLocalization('blue-3')]));

    // 7 when starting
    // 3 for callback query data
    // 5 when accepting to setup pending locations
    // 2 when asking to confirm the location
    // 2 Saved location feedback
    // plan(7 + 3 + 5 + 2 + 2); // TODO

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        // Expect 2 messages:
        // 1. Welcome message, after start
        // 2. Ask to configure pending localization(s)
        is(method, 'sendMessage');
        truthy(text.trim());

        // 2nd as a inline keyboard reply markup
        if (reply_markup) {
            const data = checkMarkupAskingToConfigurePendingLocalization(truthy, like, <InlineKeyboardMarkup>reply_markup);
            callbackQuery = createCallbackQuery(createMessage(text, botUser), data);
        }
    });

    await bot.handleUpdate(createCommandMessage('/start').toUpdate());

    const { data } = callbackQuery;
    truthy(data.startsWith(ConfigurePendingLocalizationScene.USER_ACCEPT_PENDING_CONFIGURATION));
    truthy(data.includes('rainbow-22'));
    truthy(data.includes('blue-3'));

    let configurationMessageCount = 0;

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text }) => {
        // Expect 2 messages:
        // 1. Starting iteration through pending localization, introduction message
        //      Will redirect to localization configuration scene
        // 2. Asking place of first thingy
        is(method, 'sendMessage');
        truthy(text.trim());
        if (++configurationMessageCount === 2)
            is(text, 'Name the new place for *rainbow-22*'); // *...*: for bold highlight
    });

    await bot.handleUpdate(callbackQuery.toUpdate());

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        is(method, 'sendMessage');
        is(text, 'Please confirm: _rainbow-22_ at `Location 1 (rainbow)`');
        // TODO check inline keyboard: Yes, No/Correct, Stop
    });

    await bot.handleUpdate(createMessage('Location 1 (rainbow)').toUpdate());

    let afterSaveMessageCount = 0;
    let continuePendingCallback: SimpleCallbackQuery = undefined;

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        is(method, 'sendMessage');
        if (++afterSaveMessageCount === 1)
            is(text, 'All good hear! It has been saved 💾');
        else {
            truthy(text.startsWith('Continue with setting location'));
            // TODO check inline keyboard
            const data = (<InlineKeyboardMarkup>reply_markup).inline_keyboard[0][0].callback_data;
            continuePendingCallback = createCallbackQuery(createMessage(text, botUser), data);
        }
    });

    const botAskingConfirmation1 = createMessage('Please confirm: _rainbow-22_ at `Location 1 (rainbow)`', botUser);
    await bot.handleUpdate(
        createCallbackQuery(botAskingConfirmation1, ConfigureLocalizationScene.CONFIRM_CALLBACK).toUpdate()
    );

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        is(method, 'sendMessage');
        is(text, 'Name the new place for *blue-3*'); // *...*: for bold highlight
    });

    await bot.handleUpdate(continuePendingCallback.toUpdate());

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        is(method, 'sendMessage');
        is(text, 'Please confirm: _blue-3_ at `Location 2 (blue)`');
        // TODO check inline keyboard: Yes, No/Correct, Stop
    });

    await bot.handleUpdate(createMessage('Location 2 (blue)').toUpdate());

    afterSaveMessageCount = 0;

    setContextTypeOption<PartialReplyApiData>(bot.options, (method, { text, reply_markup }) => {
        is(method, 'sendMessage');
        if (++afterSaveMessageCount === 1)
            is(text, 'All good hear! It has been saved 💾');
        else
            is(text, 'Nice work! You went through all configurations 🥵🤙');
    });

    const botAskingConfirmation2 = createMessage('Please confirm: _blue-3_ at `Location 2 (blue)`', botUser);
    await bot.handleUpdate(
        createCallbackQuery(botAskingConfirmation2, ConfigureLocalizationScene.CONFIRM_CALLBACK).toUpdate()
    );
});


function checkMarkupAskingToConfigurePendingLocalization (truthy: TruthyAssertion, like: LikeAssertion, reply_markup: InlineKeyboardMarkup): string {
    reply_markup = <InlineKeyboardMarkup> reply_markup;
    // 1 row, 2 items on the first row
    truthy(reply_markup.inline_keyboard.length === 1 && reply_markup.inline_keyboard[0].length === 2);
    // TODO develop own array like?
    //  As AVA's like method, will "stop" looking down at the first none object instance. Here, this the array...
    like(reply_markup.inline_keyboard[0][0], { text: 'Yes' });
    like(reply_markup.inline_keyboard[0][1], { text: 'No' });

    return reply_markup.inline_keyboard[0][0].callback_data;
}
