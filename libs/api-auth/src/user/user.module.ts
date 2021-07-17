import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { UserRoleController } from './controllers/user-role.controller';
import { TokenService } from './services/token.service';
import { AppConfigModule } from '@symbiota2/api-config';
import { AppJwtModule } from '../app-jwt.module';
import { ForgotPasswordProcessor } from './services/forgot-password.processor';
import { ForgotPasswordQueue } from './services/forgot-password.queue';
import { EmailModule } from '@symbiota2/api-email';
import { ForgotUsernameQueue } from './services/forgot-username.queue';
import { ForgotUsernameProcessor } from './services/forgot-username.processor';

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
        ForgotPasswordProcessor
    ],
    controllers: [
        UserController,
        UserRoleController
    ],
    exports: [
        UserService,
        TokenService
    ]
})
export class UserModule {}
