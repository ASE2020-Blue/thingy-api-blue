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


### Project commands

- [ ] `/sleep, /mute`
- [ ] `/awake, /wake, /unmute`
- [ ] `/bind`
- [ ] `/move`
- [ ] Quick web login?


## Telegram API
[API documentation](https://core.telegram.org/bots/api/#replykeyboardmarkup)
