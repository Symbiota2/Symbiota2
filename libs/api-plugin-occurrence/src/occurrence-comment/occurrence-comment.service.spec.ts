import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceCommentService } from './occurrence-comment.service';

describe('OccurrenceCommentService', () => {
  let service: OccurrenceCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OccurrenceCommentService],
    }).compile();

    service = module.get<OccurrenceCommentService>(OccurrenceCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
