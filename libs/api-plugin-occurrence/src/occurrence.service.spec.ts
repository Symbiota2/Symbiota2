import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceService } from './occurrence.service';
import { DatabaseModule } from '@symbiota2/api-database';

describe('OccurrenceService', () => {
    let service: OccurrenceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [OccurrenceService]
        }).compile();

        service = module.get<OccurrenceService>(OccurrenceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
