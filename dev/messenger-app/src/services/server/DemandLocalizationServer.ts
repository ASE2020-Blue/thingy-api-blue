import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Telegram } from 'telegraf';

import { IDemandLocalizationServer } from '../../proto/thingy_localization_grpc_pb';
import { ThingyLocalization } from '../../proto/thingy_localization_pb';
import { askIfUserWantsToConfigure } from '../../stages/scenes/ConfigureLocalization';
import { AbstractTelegramContext } from './AbstractTelegramContext';

export class DemandLocalizationServer extends AbstractTelegramContext implements IDemandLocalizationServer {

    constructor(telegram: Telegram) {
        super(telegram);
    }

    public askNewLocation(call: ServerUnaryCall<ThingyLocalization, Empty>, callback: sendUnaryData<Empty>): void {
        console.log(`${new Date().toISOString()}    askNewLocation`);
        const thingyUudi = call.request.getThingyUudi();
        console.log(`\t"${thingyUudi}"`);

        askIfUserWantsToConfigure(this.telegram, thingyUudi);
    }

}
