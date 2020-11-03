import {sendUnaryData, ServerUnaryCall} from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Telegram } from 'telegraf';

import { IMessengerServer } from '../../@types/proto/messenger_grpc_pb';
import { TestMessageRequest } from '../../@types/proto/messenger_pb';

/**
 * TODO document
 */
export class MessengerServer implements IMessengerServer {

    private telegram: Telegram;

    constructor(telegram: Telegram) {
        this.telegram = telegram;
    }

    public sendTestMessage(call: ServerUnaryCall<TestMessageRequest, Empty>, callback: sendUnaryData<Empty>): void {
        console.log(`${new Date().toISOString()}    sendTestMessage`);
        console.log(`\t"${call.request.getText()}"`);

        this.telegram.sendMessage(process.env.DEV_ID, call.request.getText());
    }
}
