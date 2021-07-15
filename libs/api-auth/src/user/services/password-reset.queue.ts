import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_PASSWORD_RESET = 'passwordReset';
export const PasswordResetQueue = BullModule.registerQueue({ name: QUEUE_ID_PASSWORD_RESET });
