import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AppConfigModule } from '@symbiota2/api-config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshCookieStrategy } from './strategies/refresh-cookie.strategy';
import { AppJwtModule } from '../app-jwt.module';
import { JwtKeyModule } from '../jwt-key/jwt-key.module';

/**
 * Module responsible for authenticating users via JWTs (https://jwt.io/).
 * Heavy use of Heavy use of https://docs.nestjs.com/security/authentication
 */
@Module({
    imports: [
        AppConfigModule,
        AppJwtModule,
        UserModule,
        PassportModule,
        JwtKeyModule,
    ],
    providers: [
        LocalStrategy,
        JwtStrategy,
        RefreshCookieStrategy
    ],
    controllers: [AuthController],
    exports: [JwtStrategy]
})
export class AuthModule { }
