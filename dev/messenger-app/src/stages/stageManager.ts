import { Stage } from 'telegraf';
import { clScene } from './scenes/ConfigureLocalization';
import { cplScene } from './scenes/ConfigurePendingLocalization';

const { leave } = Stage;

// FIXME: avoid listening for help or setlocation command
export const stageManager = new Stage([cplScene, clScene]);

stageManager.command('cancel', ctx => {
    // @ts-ignore
    ctx.session = undefined;
    leave();
});
stageManager.command('exit', ctx => {
    // @ts-ignore
    ctx.session = undefined;
    leave();
});
stageManager.command('stop', ctx => {
    // @ts-ignore
    ctx.session = undefined;
    leave();
});
stageManager.command('status', ({ scene }) => {
    console.log('Current scene: ', scene.current && scene.current.id);
});

stageManager.hears('cancel', ctx => {
    // @ts-ignore
    ctx.session = undefined;
    leave();
});
stageManager.hears('exit', ctx => {
    // @ts-ignore
    ctx.session = undefined;
    leave();
});
stageManager.hears('stop', ctx => {
    // @ts-ignore
    ctx.session = undefined;
    leave();
});
stageManager.hears('status', ({ scene }) => {
    console.log('Current scene: ', scene.current && scene.current.id);
});
