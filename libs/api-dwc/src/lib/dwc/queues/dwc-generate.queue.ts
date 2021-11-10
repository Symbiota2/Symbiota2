import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_GENERATE_DWC = 'generate-occurrence-dwc';
export const DwcGenerateQueue = BullModule.registerQueue({ name: QUEUE_ID_GENERATE_DWC });
