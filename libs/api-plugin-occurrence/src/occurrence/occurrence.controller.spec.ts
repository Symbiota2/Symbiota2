import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceController } from './occurrence.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { OccurrenceService } from './occurrence.service';

describe('OccurrenceController', () => {
    let controller: OccurrenceController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [OccurrenceService],
            controllers: [OccurrenceController],
        }).compile();

        controller = module.get<OccurrenceController>(OccurrenceController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
