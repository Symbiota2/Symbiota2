import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import configBuilder, { DEFAULT_PORT } from './configuration';

describe('AppConfigService', () => {
    let service: AppConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configBuilder] })],
            providers: [AppConfigService],
        }).compile();

        service = module.get<AppConfigService>(AppConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return the default port', () => {
        expect(service.port()).toBe(DEFAULT_PORT);
    });

    it('should return the test environment', () => {
        expect(service.environment()).toBe(AppConfigService.ENV_TEST);
    });

    it('should say we\'re in development', () => {
        expect(service.isDevelopment()).toBe(true);
    });
});
