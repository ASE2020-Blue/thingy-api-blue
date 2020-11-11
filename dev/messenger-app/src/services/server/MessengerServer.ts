import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Telegram } from 'telegraf';

import { IMessengerServer } from '../../proto/messenger_grpc_pb';
import { TestMessageRequest, ThingyId } from '../../proto/messenger_pb';
import { askIfUserWantsToConfigure } from '../../stages/scenes/ConfigureLocalization';
import { AbstractTelegramContext } from './AbstractTelegramContext';

/**
 * TODO document
 */
export class MessengerServer extends AbstractTelegramContext implements IMessengerServer {

    constructor(telegram: Telegram) {
        super(telegram);
    }

    public async askNewLocation (call: ServerUnaryCall<ThingyId, Empty>, callback: sendUnaryData<Empty>): Promise<void> {
        console.log(`${new Date().toISOString()}    askNewLocation`);
        const thingyUuid = call.request.getThingyUuid();
        console.log(`\t"${thingyUuid}"`);

        try {
            await askIfUserWantsToConfigure(this.telegram, thingyUuid);
            callback(undefined, new Empty());
        } catch (error) {
            callback(error, undefined);
        }
    }

    public async sendTestMessage (call: ServerUnaryCall<TestMessageRequest, Empty>, callback: sendUnaryData<Empty>): Promise<void> {
        console.log(`${new Date().toISOString()}    sendTestMessage`);
        console.log(`\t"${call.request.getText()}"`);

        try {
            await this.telegram.sendMessage(process.env.DEV_ID, call.request.getText());
            callback(undefined, new Empty());
        } catch (error) {
            callback(error, undefined);
        }
    }
}
