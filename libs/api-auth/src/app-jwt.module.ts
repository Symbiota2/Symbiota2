import { Module } from '@nestjs/common';
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

async function jwtModuleFactory(appConfigService: AppConfigService): Promise<JwtModuleOptions> {
    return {
        secret: await appConfigService.jwtKey(),
        signOptions: { expiresIn: '5m' }
    }
}

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
