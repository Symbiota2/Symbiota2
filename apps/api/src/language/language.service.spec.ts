import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from './language.service';
import { DatabaseModule } from '@symbiota2/api-database';

describe('LanguageService', () => {
    let service: LanguageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [LanguageService],
        }).compile();

        service = module.get<LanguageService>(LanguageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
