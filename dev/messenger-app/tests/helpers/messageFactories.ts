import { Audio, Chat, Contact, Document, Invoice, Location, Game, Message, MessageEntity, PhotoSize, Sticker, Update, User, SuccessfulPayment, Video, Venue, VideoNote, Voice, CallbackQuery, ChosenInlineResult, InlineQuery, PreCheckoutQuery, ShippingQuery } from "telegraf/typings/telegram-types";

export const testTargetUser: User = {
    first_name: 'The Tests Savior',
    id: 42,
    is_bot: false,
    language_code: 'en',
    last_name: 'Savior',
    username: 'the_tests_savior'
};

export const botUser: User = {
    id: 141414,
    is_bot: true,
    first_name: "ASE-Blue",
    username: "ASEBlueBot"
};

export class SimpleChat implements Chat {
    id: number = 1;
    type: string = 'private';
}

export class SimpleMessage implements Message {
    chat: Chat = new SimpleChat();
    date: number = + new Date();

    from: User = testTargetUser;

    message_id: 0;

    audio?: Audio;
    author_signature?: string;
    caption?: string;
    caption_entities?: MessageEntity[];
    channel_chat_created?: true;
    connected_website?: string;
    contact?: Contact;
    delete_chat_photo?: true;
    document?: Document;
    edit_date?: number;
    entities?: MessageEntity[];
    forward_date?: number;
    forward_from?: User;
    forward_from_chat?: Chat;
    forward_from_message_id?: number;
    forward_signature?: string;
    game?: Game;
    group_chat_created?: true;
    invoice?: Invoice;
    left_chat_member?: User;
    location?: Location;
    media_group_id?: string;
    migrate_from_chat_id?: number;
    migrate_to_chat_id?: number;
    new_chat_members?: User[];
    new_chat_photo?: PhotoSize[];
    new_chat_title?: string;
    photo?: PhotoSize[];
    pinned_message?: Message;
    reply_to_message?: Message;
    sticker?: Sticker;
    successful_payment?: SuccessfulPayment;
    supergroup_chat_created?: true;
    text?: string;
    venue?: Venue;
    video?: Video;
    video_note?: VideoNote;
    voice?: Voice;

    public toUpdate(): SimpleUpdate {
        const update = new SimpleUpdate();
        update.message = this;

        return update;
    }
}


export class SimpleUpdate implements Update {
    update_id: number = 88;

    callback_query?: CallbackQuery;
    channel_post?: Message;
    chosen_inline_result?: ChosenInlineResult;
    edited_channel_post?: Message;
    edited_message?: Message;
    inline_query?: InlineQuery;
    message?: Message;
    pre_checkout_query?: PreCheckoutQuery;
    shipping_query?: ShippingQuery;
}

/**
 * Example of callbackQuery:
 * <pre>
 *     {
          "id": "2678034395795620365",
          "from": {
            "id": 623528472,
            "is_bot": false,
            "first_name": "Alain",
            "last_name": "Schaller",
            "username": "schallerala",
            "language_code": "en"
          },
          "message": {
            "message_id": 896,
            "from": {
              "id": 1401251288,
              "is_bot": true,
              "first_name": "ASE-Blue",
              "username": "ASEBlueBot"
            },
            "chat": {
              "id": 623528472,
              "first_name": "Alain",
              "last_name": "Schaller",
              "username": "schallerala",
              "type": "private"
            },
            "date": 1607725187,
            "text": "We started collecting data for one or more thingy, do you want to configure where you placed them?",
            "reply_markup": {
              "inline_keyboard": [
                [
                  {
                    "text": "Yes",
                    "callback_data": "configure_pending_location_yes/rainbow-22/blue-3"
                  },
                  {
                    "text": "No",
                    "callback_data": "configure_pending_location_no"
                  }
                ]
              ]
            }
          },
          "chat_instance": "5290634094642987684",
          "data": "configure_pending_location_yes/rainbow-22/blue-3"
        }
 * </pre>
 */
export class SimpleCallbackQuery implements CallbackQuery {
    chat_instance: string = '5290634094642987684';
    from: User = testTargetUser;
    id: string = '2678034395795620365';

    message?: Message;
    inline_message_id?: string;
    data?: string;
    game_short_name?: string;

    public toUpdate(): SimpleUpdate {
        const update = new SimpleUpdate();
        update.callback_query = this;

        return update;
    }
}

export function createMessage (text: string, from: User = testTargetUser): SimpleMessage {
    const msg = new SimpleMessage();
    msg.text = text;
    msg.from = from;

    return msg;
}

/**
 *
 * @param commandName with the prefix '/'
 * @param entireText including the command
 */
export function createCommandMessage (commandName: string, entireText: string = commandName): SimpleMessage {
    const msg = new SimpleMessage();
    msg.text = entireText;
    msg.entities = [{ type: 'bot_command', offset: 0, length: commandName.length }];

    return msg;
}

export function createCallbackQuery (message: Message, data: string): SimpleCallbackQuery {
    const callbackQuery = new SimpleCallbackQuery();
    callbackQuery.message = message;
    callbackQuery.data = data;
    return callbackQuery;
}
