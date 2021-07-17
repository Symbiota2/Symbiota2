import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_FORGOT_PASSWORD = 'forgotPassword';
export const ForgotPasswordQueue = BullModule.registerQueue({ name: QUEUE_ID_FORGOT_PASSWORD });
