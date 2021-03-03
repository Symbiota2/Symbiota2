import { Test, TestingModule } from '@nestjs/testing';
import { LanguageController } from './language.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { LanguageService } from './language.service';

describe('LanguageController', () => {
    let controller: LanguageController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [LanguageService],
            controllers: [LanguageController],
        }).compile();

        controller = module.get<LanguageController>(LanguageController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
