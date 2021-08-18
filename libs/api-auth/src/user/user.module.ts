import { Module } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { UserRoleController } from './controllers/role/user-role.controller';
import { TokenService } from './services/token/token.service';
import { AppConfigModule } from '@symbiota2/api-config';
import { AppJwtModule } from '../app-jwt.module';
import { ForgotPasswordProcessor } from './services/queues/forgot-password.processor';
import { ForgotPasswordQueue } from './services/queues/forgot-password.queue';
import { EmailModule } from '@symbiota2/api-email';
import { ForgotUsernameQueue } from './services/queues/forgot-username.queue';
import { ForgotUsernameProcessor } from './services/queues/forgot-username.processor';
import { NotificationService } from './services/notification/notification.service';
import { NotificationController } from './controllers/notification/notification.controller';

/**
 * Module for user authorization and profile management.
 * Heavy use of https://docs.nestjs.com/security/authentication
 */
@Module({
    imports: [
        AppJwtModule,
        AppConfigModule,
        DatabaseModule,
        EmailModule,
        ForgotUsernameQueue,
        ForgotPasswordQueue
    ],
    providers: [
        UserService,
        TokenService,
        ForgotUsernameProcessor,
        ForgotPasswordProcessor,
        NotificationService
    ],
    controllers: [
        UserController,
        UserRoleController,
        NotificationController
    ],
    exports: [
        UserService,
        TokenService
    ]
})
export class UserModule {}
