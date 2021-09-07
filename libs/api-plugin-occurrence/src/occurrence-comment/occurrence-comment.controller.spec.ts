import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceCommentController } from './occurrence-comment.controller';

describe('OccurrenceCommentController', () => {
  let controller: OccurrenceCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccurrenceCommentController],
    }).compile();

    controller = module.get<OccurrenceCommentController>(OccurrenceCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
