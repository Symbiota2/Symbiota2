import { AppConfigService } from '../../../api-config/src/app-config.service';
import { createTransport, Transporter } from 'nodemailer';
import { Provider } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


export const PROVIDER_ID_NODE_MAILER = 'NODE_MAILER';

async function nodeMailerFactory(appConfig: AppConfigService): Promise<Transporter<SMTPTransport.SentMessageInfo>> {
    const smtpPort = appConfig.smtpPort();

    return createTransport({
        host: appConfig.smtpHost(),
        port: smtpPort,
        auth: {
            user: appConfig.smtpUser(),
            pass: appConfig.smtpPassword()
        },
        tls: {
            // TODO: Configure a custom CA instead
            rejectUnauthorized: false
        }
    })
}

export const NodeMailerProvider: Provider<Promise<Transporter<SMTPTransport.SentMessageInfo>>> = {
    provide: PROVIDER_ID_NODE_MAILER,
    useFactory: nodeMailerFactory,
    inject: [AppConfigService]
};
