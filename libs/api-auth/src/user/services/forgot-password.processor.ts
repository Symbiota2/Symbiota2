import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_ID_FORGOT_PASSWORD } from './forgot-password.queue';
import { ForgotPasswordInputDto } from '../dto/forgot-password.input.dto';
import { EmailService } from '@symbiota2/api-email';
import { UserService } from './user.service';
import { randomBytes } from 'crypto';
import { Logger } from '@nestjs/common';

@Processor(QUEUE_ID_FORGOT_PASSWORD)
export class ForgotPasswordProcessor {
    private static readonly PASSWORD_LENGTH = 6;
    private logger = new Logger(ForgotPasswordProcessor.name);

    constructor(
        private readonly users: UserService,
        private readonly email: EmailService) { }

    @Process()
    async resetPassword(job: Job<ForgotPasswordInputDto>) {
        const { username } = job.data;

        try {
            const newPassword = await ForgotPasswordProcessor.generatePassword();
            const email = await this.users.resetPassword(username, newPassword);

            if (email) {
                await this.email.send(
                    'Your Symbiota2 password',
                    `Your password has been reset to ${ newPassword }. Please log in and change it.`,
                    email,
                );
            }

            // TODO: Email them if it failed?
        }
        catch (e) {
            this.logger.error(`Password reset failed for user ${username}: ${e.message}`);
        }
    }

    private static async generatePassword(): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(ForgotPasswordProcessor.PASSWORD_LENGTH, (err, bytes) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(bytes.toString('hex'));
                }
            });
        });
    }
}
