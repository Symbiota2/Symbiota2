import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_ID_NODE_MAILER } from './node-mailer.provider';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { AppConfigService } from '@symbiota2/api-config';

@Injectable()
export class EmailService {
    constructor(
        private readonly appConfig: AppConfigService,
        @Inject(PROVIDER_ID_NODE_MAILER)
        private readonly nodeMailer: Transporter<SMTPTransport.SentMessageInfo>) { }

    async send(subject: string, body: string, to: string) {
        await this.nodeMailer.sendMail({
            to,
            from: this.appConfig.smtpSender(),
            text: body
        });
    }
}
