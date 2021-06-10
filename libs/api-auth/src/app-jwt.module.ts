import { Module } from '@nestjs/common';
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

async function jwtModuleFactory(appConfigService: AppConfigService): Promise<JwtModuleOptions> {
    return {
        secret: await appConfigService.jwtKey(),
        signOptions: { expiresIn: '5m' }
    }
}

/**
 * Module that sets up JWT authentication based on a secret key provided in the
 * app config. See https://github.com/nestjs/jwt. Imported by './user/user.module.ts'
 */
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [AppConfigModule],
            useFactory: jwtModuleFactory,
            inject: [AppConfigService]
        }),
    ],
    exports: [JwtModule]
})
export class AppJwtModule {}
