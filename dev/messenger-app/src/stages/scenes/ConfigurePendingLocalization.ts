import { BaseScene, Markup } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

export const SCENE_ID = 'configure-pending-localization';
export const USER_ACCEPT_PENDING_CONFIGURATION = 'configure_pending_location_yes';
export const USER_REFUSE_PENDING_CONFIGURATION = 'configure_pending_location_no';
export const ASK_CALLBACK = [USER_ACCEPT_PENDING_CONFIGURATION, USER_REFUSE_PENDING_CONFIGURATION];

export const cplScene = new BaseScene(SCENE_ID);

export function askIfUserWantToConfigure (ctx: TelegrafContext) {

    ctx.reply(
        'We started collecting data for one or more thingy, do you want to configure where you placed them?',
        Markup.forceReply()
            .inlineKeyboard(
                [
                    Markup.callbackButton('Yes', USER_ACCEPT_PENDING_CONFIGURATION),
                    Markup.callbackButton('No', USER_REFUSE_PENDING_CONFIGURATION)
                ],
                {}
            )
            .resize()
            .extra()
    );
}

cplScene.enter(ctx => {
    ctx.reply('Entered configuration');
});

cplScene.on('message', ctx => ctx.reply('Trying to say something?'));

cplScene.leave(ctx => {
    console.log(`Leaving ${SCENE_ID}`);
    ctx.reply('Bye from the scene');
});
