import { BlueStageManager } from '../../../src/stage/BlueStageManager';
import { ConfigureLocalizationScene } from '../../../src/stage/scenes/ConfigureLocalizationScene';
import { ConfigurePendingLocalizationScene } from '../../../src/stage/scenes/ConfigurePendingLocalizationScene';

export const emptyStageManager = new BlueStageManager([]);

const configureLocalizationScene = new ConfigureLocalizationScene();
export const srcStageManager = new BlueStageManager([
    configureLocalizationScene,
    new ConfigurePendingLocalizationScene(configureLocalizationScene)
]);
