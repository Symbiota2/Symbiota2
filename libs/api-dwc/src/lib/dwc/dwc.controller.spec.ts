import { Test, TestingModule } from '@nestjs/testing';
import { DwCController } from './dwc.controller';

describe('ApiDwcController', () => {
  let controller: DwCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DwCController],
    }).compile();

    controller = module.get<DwCController>(DwCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
