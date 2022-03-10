import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtKeyService } from './jwt-key/jwt-key.service';
import { JwtKeyModule } from './jwt-key/jwt-key.module';

async function jwtModuleFactory(
    jwtKey: JwtKeyService
): Promise<JwtModuleOptions> {
    return {
        secret: await jwtKey.getOrCreateKey(),
        signOptions: { expiresIn: '1d' },
    };
}

/**
 * Module that sets up JWT authentication based on a secret key provided in the
 * app config. See https://github.com/nestjs/jwt. Imported by './user/user.module.ts'
 */
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [JwtKeyModule],
            useFactory: jwtModuleFactory,
            inject: [JwtKeyService],
        }),
        JwtKeyModule,
    ],
    exports: [JwtModule],
})
export class AppJwtModule {}
