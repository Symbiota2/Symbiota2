import { Module } from '@nestjs/common';
import { NodeMailerProvider } from './node-mailer.provider';
import { EmailService } from './email.service';
import { AppConfigModule } from '@symbiota2/api-config';

@Module({
    imports: [
        AppConfigModule,
    ],
    providers: [
        NodeMailerProvider,
        EmailService
    ],
    exports: [
        EmailService
    ]
})
export class EmailModule { }
