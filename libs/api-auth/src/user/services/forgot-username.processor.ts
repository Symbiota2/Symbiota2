import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '@symbiota2/api-email';
import { UserService } from './user.service';
import { Logger } from '@nestjs/common';
import { QUEUE_ID_FORGOT_USERNAME } from './forgot-username.queue';
import { ForgotUsernameInputDto } from '../dto/forgot-username.input.dto';

@Processor(QUEUE_ID_FORGOT_USERNAME)
export class ForgotUsernameProcessor {
    private logger = new Logger(ForgotUsernameProcessor.name);

    constructor(
        private readonly users: UserService,
        private readonly email: EmailService) { }

    @Process()
    async resetPassword(job: Job<ForgotUsernameInputDto>) {
        const { email } = job.data;

        try {
            const user = await this.users.findByEmail(email, ['username']);

            if (user) {
                await this.email.send(
                    'Your Symbiota2 username',
                    `Your Symbiota2 username is ${user.username}`,
                    email
                );
            }
        }
        catch (e) {
            this.logger.error(`Username retrieval failed for ${email}: ${e.message}`);
        }
    }
}
