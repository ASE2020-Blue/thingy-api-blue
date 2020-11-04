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

    public askNewLocation(call: ServerUnaryCall<ThingyId, Empty>, callback: sendUnaryData<Empty>): void {
        console.log(`${new Date().toISOString()}    askNewLocation`);
        const thingyUuid = call.request.getThingyUuid();
        console.log(`\t"${thingyUuid}"`);

        askIfUserWantsToConfigure(this.telegram, thingyUuid);
    }

    public sendTestMessage(call: ServerUnaryCall<TestMessageRequest, Empty>, callback: sendUnaryData<Empty>): void {
        console.log(`${new Date().toISOString()}    sendTestMessage`);
        console.log(`\t"${call.request.getText()}"`);

        this.telegram.sendMessage(process.env.DEV_ID, call.request.getText());
    }
}
