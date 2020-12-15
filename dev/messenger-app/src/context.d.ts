import { TelegrafContext } from 'telegraf/typings/context';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { IThingyPersistenceClient } from './services/client/IThingyPersistenceClient';

export declare interface IMessengerSession {
    thingyUuid: string | undefined;
    location: string | undefined;
    thingiesUuid: Array<string> | undefined;
    ongoingPendingLocationConfiguration: boolean | undefined;
}

export declare interface ISessionContext {
    session: IMessengerSession;
    // https://telegraf.js.org/#/?id=extending-context
    persistLocalizationClient: IThingyPersistenceClient;
}

export type BotSessionContext = ISessionContext & TelegrafContext;
export type SceneSessionContext = ISessionContext & SceneContextMessageUpdate;
export type BotSceneSessionContext = BotSessionContext & SceneSessionContext;
