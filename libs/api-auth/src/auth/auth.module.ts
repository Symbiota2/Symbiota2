import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AppConfigModule } from '@symbiota2/api-config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshCookieStrategy } from './strategies/refresh-cookie.strategy';
import { AppJwtModule } from '../app-jwt.module';

@Module({
    imports: [
        AppConfigModule,
        AppJwtModule,
        UserModule,
        PassportModule
    ],
    providers: [
        LocalStrategy,
        JwtStrategy,
        RefreshCookieStrategy
    ],
    controllers: [AuthController]
})
export class AuthModule { }
