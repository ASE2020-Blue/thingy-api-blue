import { Stage } from 'telegraf';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';
import { SceneSessionContext } from '../context';
import { clScene } from './scenes/ConfigureLocalization';
import { cplScene } from './scenes/ConfigurePendingLocalization';

const { leave } = Stage;

// FIXME: avoid listening for help or setlocation command
export const stageManager = new Stage([cplScene, clScene]);

function clearSessionAndLeave (ctx: SceneSessionContext) : void {
    ctx.session = undefined;
    leave();
}

const stageInterruptionCommands = [ 'cancel', 'exit', 'stop' ];

stageInterruptionCommands.forEach((commands: string) => {
    stageManager
        .command(commands, clearSessionAndLeave)
        .hears(commands, clearSessionAndLeave);
});

function onStatus ({ scene }: SceneContextMessageUpdate): void {
    console.log('Current scene: ', scene.current && scene.current.id);
}

stageManager
    .command('status', onStatus)
    .hears('status', onStatus);
