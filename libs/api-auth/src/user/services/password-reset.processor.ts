import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_ID_PASSWORD_RESET } from './password-reset.queue';
import { ResetPasswordInputDto } from '../dto/reset-password.input.dto';
import { EmailService } from '@symbiota2/api-email';
import { UserService } from './user.service';
import { randomBytes } from 'crypto';

@Processor(QUEUE_ID_PASSWORD_RESET)
export class PasswordResetProcessor {
    private static readonly PASSWORD_LENGTH = 6;

    constructor(
        private readonly users: UserService,
        private readonly email: EmailService) { }

    @Process()
    async resetPassword(job: Job<ResetPasswordInputDto>) {
        const { username } = job.data;
        const newPassword = await PasswordResetProcessor.generatePassword();
        const email = await this.users.resetPassword(username, newPassword);

        if (email) {
            await this.email.send(
                'Password Reset',
                `Your password has been reset to ${newPassword}. Please log in and change it.`,
                email,
            );
        }

        // TODO: Email them if it failed?
    }

    private static async generatePassword(): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(PasswordResetProcessor.PASSWORD_LENGTH, (err, bytes) => {
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