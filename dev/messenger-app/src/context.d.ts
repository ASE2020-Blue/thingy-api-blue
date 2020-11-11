import { TelegrafContext } from 'telegraf/typings/context';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';

export declare class MessengerSession {
    public thingyUuid: string | undefined;
    public location: string | undefined;
    public thingiesUuid: Array<string> | undefined;
}

export declare class SessionContext {
    public session: MessengerSession;
}

export type BotSessionContext = SessionContext & TelegrafContext;
export type SceneSessionContext = SessionContext & SceneContextMessageUpdate;
export type BotSceneSessionContext = BotSessionContext & SceneSessionContext;
