import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeGraphService } from './knowledge-graph.service';

describe('ApiKnowledgeGraphService', () => {
  let service: KnowledgeGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeGraphService],
    }).compile();

    service = module.get<KnowledgeGraphService>(KnowledgeGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
