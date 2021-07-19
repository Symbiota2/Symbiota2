import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_FORGOT_USERNAME = 'forgotUsername';
export const ForgotUsernameQueue = BullModule.registerQueue({ name: QUEUE_ID_FORGOT_USERNAME });
