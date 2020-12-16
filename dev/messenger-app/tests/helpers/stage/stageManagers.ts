import { BlueStageManager } from '../../../src/stage/BlueStageManager';
import { ConfigureLocationScene } from '../../../src/stage/scenes/ConfigureLocationScene';
import { ConfigurePendingLocationScene } from '../../../src/stage/scenes/ConfigurePendingLocationScene';

export const emptyStageManager = new BlueStageManager([]);

const configureLocalizationScene = new ConfigureLocationScene();
export const srcStageManager = new BlueStageManager([
    configureLocalizationScene,
    new ConfigurePendingLocationScene(configureLocalizationScene)
]);
