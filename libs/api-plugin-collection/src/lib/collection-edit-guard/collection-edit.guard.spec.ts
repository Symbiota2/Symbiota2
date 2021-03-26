import { CollectionEditGuard } from './collection-edit.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { AuthModule } from '@symbiota2/api-auth';
import { InstitutionModule } from '../institution';
import { DatabaseModule } from '@symbiota2/api-database';
import { Reflector } from '@nestjs/core';

describe('CollectionEditGuard', () => {
    let config: AppConfigService;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AppConfigModule,
                AuthModule,
                InstitutionModule,
                DatabaseModule
            ]
        }).compile();

        config = module.get<AppConfigService>(AppConfigService);
        reflector = module.get<Reflector>(Reflector);
    });

    it('should be defined', () => {
        expect(new CollectionEditGuard(config, reflector)).toBeDefined();
    });

});
