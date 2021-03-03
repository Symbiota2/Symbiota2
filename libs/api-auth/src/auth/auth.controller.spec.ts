import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AppConfigModule } from '@symbiota2/api-config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService, RefreshCookieStrategy, UserModule } from '..';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AppConfigModule,
                JwtModule.register({ secret: '1234' }),
                UserModule,
                PassportModule
            ],
            providers: [
                AuthService,
                LocalStrategy,
                JwtStrategy,
                RefreshCookieStrategy
            ],
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
