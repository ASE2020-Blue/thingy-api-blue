import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export declare interface ReplyApiData extends ExtraReplyMessage {
    text: string
}

export type PartialReplyApiData = Partial<ReplyApiData>;
