import { TelegrafContext } from 'telegraf/typings/context';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';

export declare interface IMessengerSession {
    thingyUuid: string | undefined;
    location: string | undefined;
    thingiesUuid: Array<string> | undefined;
}

export declare interface ISessionContext {
    session: IMessengerSession;
}

export type BotSessionContext = ISessionContext & TelegrafContext;
export type SceneSessionContext = ISessionContext & SceneContextMessageUpdate;
export type BotSceneSessionContext = BotSessionContext & SceneSessionContext;
