import { Stage } from 'telegraf';
import { cplScene } from './scenes/ConfigurePendingLocalization';

const { leave } = Stage;

export const stageManager = new Stage([cplScene]);
stageManager.command('cancel', leave());
stageManager.command('exit', leave());
stageManager.command('stop', leave());
stageManager.hears('cancel', leave());
stageManager.hears('exit', leave());
stageManager.hears('stop', leave());
