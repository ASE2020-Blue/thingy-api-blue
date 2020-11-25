import { Stage } from 'telegraf';
import { Scene, StageOptions } from 'telegraf/typings/stage';
import { SceneSessionContext } from '../context';

// FIXME: avoid listening for help or setlocation command
export class BlueStageManager<TContext extends SceneSessionContext> extends Stage<TContext> {

    public static stageInterruptionCommands = [ 'cancel', 'exit', 'stop' ];

    constructor(scenes: Scene<TContext>[], options?: Partial<StageOptions>) {
        super(scenes, options);

        for (const command of BlueStageManager.stageInterruptionCommands) {
            this
                .command(command, this.clearSessionAndLeave)
                .hears(command, this.clearSessionAndLeave);
        }

        this
            .command('status', this.logOnStatus)
            .hears('status', this.logOnStatus);
    }

    private clearSessionAndLeave (ctx: TContext) : void {
        ctx.session = undefined;
        Stage.leave();
    }

    private logOnStatus ({ scene: { current } }: TContext) : void {
        console.log('Current scene: ', current && current.id);
    }
}
