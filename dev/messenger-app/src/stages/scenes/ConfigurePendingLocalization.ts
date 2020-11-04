import { BaseScene, Markup } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { SceneContextMessageUpdate } from 'telegraf/typings/stage';

export const SCENE_ID = 'configure-pending-localization';
export const USER_ACCEPT_PENDING_CONFIGURATION = 'configure_pending_location_yes';
export const USER_REFUSE_PENDING_CONFIGURATION = 'configure_pending_location_no';

export const cplScene = new BaseScene(SCENE_ID);

export function askIfUserWantsToConfigure (ctx: TelegrafContext) {
    ctx.reply(
        'We started collecting data for one or more thingy, do you want to configure where you placed them?',
        Markup
            .inlineKeyboard(
                [
                    Markup.callbackButton('Yes', USER_ACCEPT_PENDING_CONFIGURATION),
                    Markup.callbackButton('No', USER_REFUSE_PENDING_CONFIGURATION)
                ],
                {}
            )
            .extra()
    );
}

cplScene.enter((ctx: SceneContextMessageUpdate) => {
    ctx.reply('Entered configuration');
});

cplScene.on('message', ctx => ctx.reply('Trying to say something?'));

cplScene.leave(ctx => {
    console.log(`Leaving ${SCENE_ID}`);
    ctx.reply('Bye from the scene');
});
