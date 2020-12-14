# Messenger App 🔔 📱

## Getting started


### Building `.proto` files
    ../protos/build_protos.sh ./src/proto


## library selection

* Telegram `Node` examples: https://core.telegram.org/bots/samples#node-js

    * [telgraf.js](https://github.com/telegraf/telegraf):
        * ✅ `TypeScript`
    * [TeleBot](https://github.com/mullwar/telebot):
        * 🔀 `JavaScript`
        * 🤔 "_No callbacks, Promises only_"
    * [Telegram Bot API](https://github.com/mast/telegram-bot-api):
        * 🔀 `JavaScript`
        * 🥳 `Tests`: [example](https://github.com/mast/telegram-bot-api#running-tests)


### Choice

![Telegraf](https://github.com/telegraf/telegraf/raw/develop/docs/header.png)


### Inspiration

[Podsearch bot](https://github.com/Fazendaaa/podsearch_bot), as it developed with
`TypeScript` and has running tests on `Travis`.


## Todos
Todo idea:

- [X] Create bot with:
    - [X] Token
    - [X] Username: _[@ASEBlueBot](t.me/ASEBlueBot)_
    - [X] Name: _ASE-Blue_
- [X] env variable to set to who to text
- [X] Global commands: `/start, /help`
- [X] Set help commands with `/setcommands` to the _BotFather_
- [X] Use keyboards and/or inline keyboards ([examples](https://core.telegram.org/bots#keyboards))
- [ ] Add [deep linking](https://core.telegram.org/bots#deep-linking)?
- [ ] Add [inline results](https://core.telegram.org/bots/inline#inline-results)
- [ ] [Type doc](https://typedoc.org/)


### Project commands

- [ ] `/sleep, /mute`
- [ ] `/awake, /wake, /unmute`
- [ ] `/bind`
- [X] `/setlocation`
- [ ] Quick web login?


## Telegram API
[API documentation](https://core.telegram.org/bots/api/#replykeyboardmarkup)


## Sentry
[Sentry](sentry.io) is an open-source error tracking that is free for students.

### Articles
* Node: [Usage | Sentry Documentation](https://docs.sentry.io/clients/node/usage/)
* [Express | Sentry Documentation](https://docs.sentry.io/platforms/node/guides/express/)
* [Koa | Sentry Documentation](https://docs.sentry.io/platforms/node/guides/koa/)
---
More in depth doc:
* [Transaction Summary | Sentry Documentation](https://docs.sentry.io/product/performance/transaction-summary/)
* [Add Context for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/enriching-events/context/)
* [Breadcrumbs for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/enriching-events/breadcrumbs/)
* [Source Maps for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/sourcemaps/)
* [TypeScript for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/typescript/)
* [Integrations for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/configuration/integrations/)
* [Performance Monitoring for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/performance/)


## Testing

### Articles to select lib(s)
* [An Overview of JavaScript Testing in 2020 | by Vitali Zaidman | Welldone Software | Medium](https://medium.com/welldone-software/an-overview-of-javascript-testing-7ce7298b9870)
* [Writing unit tests in TypeScript. In this story, we would be using… | by Chirag Rupani | Medium](https://medium.com/@RupaniChirag/writing-unit-tests-in-typescript-d4719b8a0a40)
* [Top 5 Javascript Testing Frameworks | BrowserStackGroup 4App automate icon](https://www.browserstack.com/guide/top-javascript-testing-frameworks)
* [Best 8 JavaScript Testing Frameworks In 2020](https://www.lambdatest.com/blog/top-javascript-automation-testing-framework/)
* [Top Javascript Testing Frameworks in Demand for 2019 | by Nwose Lotanna | Bits and Pieces](https://blog.bitsrc.io/top-javascript-testing-frameworks-in-demand-for-2019-90c76e7777e9)

#### Articles _how-to_
Might be helpful
* [Testing with Jest and TypeScript, the tricky parts](https://dev.to/s2engineers/testing-with-jest-and-typescript-the-tricky-parts-1gnc)
* [How to Write Integration Tests for a Telegram Bot](https://dev.to/blueset/how-to-write-integration-tests-for-a-telegram-bot-4c0e)


### Telefram tests
For inspiration:
* [telegraf/test at develop · telegraf/telegraf · GitHub](https://github.com/telegraf/telegraf/tree/develop/test)


### Selection: [AVA](https://github.com/avajs/ava)
* [ava/test-setup.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/recipes/test-setup.md)
* [ava/typescript.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/recipes/typescript.md)
    * [GitHub - avajs/typescript: Rudimentary TypeScript support](https://github.com/avajs/typescript)
* [ava/06-configuration.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/06-configuration.md)
* [ava/01-writing-tests.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md)
* [ava/03-assertions.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/03-assertions.md)
* [ava/debugging-with-webstorm.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/recipes/debugging-with-webstorm.md)
* [ava/05-command-line.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/05-command-line.md#tap-reporter)
* [ava/code-coverage.md at master · avajs/ava · GitHub](https://github.com/avajs/ava/blob/master/docs/recipes/code-coverage.md)
