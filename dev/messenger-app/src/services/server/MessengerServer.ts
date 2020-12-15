import { sendUnaryData, ServerUnaryCall, ServiceDefinition, UntypedServiceImplementation } from '@grpc/grpc-js';
import * as Debug from 'debug';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Telegram } from 'telegraf';

import { IMessengerServer, MessengerService } from '../../proto/messenger_grpc_pb';
import { TestMessageRequest, ThingyId } from '../../proto/messenger_pb';
import { ConfigureLocationScene } from '../../stage/scenes/ConfigureLocationScene';
import { extractAndBind } from '../../helpers/MethodExtractor';
import { IServiceProvider } from './IServiceProvider';

const debug = Debug('messenger:grpc:server:MessengerServer');

/**
 * TODO document
 */
export class MessengerServer implements IMessengerServer, IServiceProvider {

    private readonly telegram: Telegram;

    constructor(telegram: Telegram) {
        this.telegram = telegram;
    }

    public async askNewLocation (call: ServerUnaryCall<ThingyId, Empty>, callback: sendUnaryData<Empty>): Promise<void> {
        debug(`askNewLocation`);
        const thingyUuid = call.request.getThingyUuid();
        debug(`\t"${thingyUuid}"`);

        try {
            await ConfigureLocationScene.ASK_IF_USER_WANTS_TO_CONFIGURE(this.telegram, thingyUuid);
            callback(undefined, new Empty());
        } catch (error) {
            callback(error, undefined);
        }
    }

    public async sendTestMessage (call: ServerUnaryCall<TestMessageRequest, Empty>, callback: sendUnaryData<Empty>): Promise<void> {
        debug(`sendTestMessage`);
        debug(`\t"${call.request.getText()}"`);

        try {
            await this.telegram.sendMessage(process.env.DEV_ID, call.request.getText());
            callback(undefined, new Empty());
        } catch (error) {
            callback(error, undefined);
        }
    }

    public getServiceDefinition(): ServiceDefinition {
        return MessengerService;
    }

    public getUntypedServiceImplementation(): UntypedServiceImplementation {
        // simplest solution found to the previously described problematic
        const [ askNewLocation, sendTestMessage ] = extractAndBind(this, ['askNewLocation', 'sendTestMessage']);

        return { askNewLocation, sendTestMessage };
    }
}
