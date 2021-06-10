import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { UserRoleController } from './controllers/user-role.controller';
import { TokenService } from './services/token.service';
import { AppConfigModule } from '@symbiota2/api-config';
import { AppJwtModule } from '../app-jwt.module';

/**
 * Module for user authorization and profile management.
 * Heavy use of https://docs.nestjs.com/security/authentication
 */
@Module({
    imports: [
        AppJwtModule,
        AppConfigModule,
        DatabaseModule
    ],
    providers: [
        UserService,
        TokenService
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
