import { Test, TestingModule } from '@nestjs/testing'
import { KnowledgeGraphController } from './knowledge-graph.controller';

describe('ApiDwcController', () => {
  let controller: KnowledgeGraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnowledgeGraphController],
    }).compile();

    controller = module.get<KnowledgeGraphController>(KnowledgeGraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
