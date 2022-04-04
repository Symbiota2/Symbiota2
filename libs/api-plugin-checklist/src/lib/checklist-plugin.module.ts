import { Module } from '@nestjs/common';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { AppConfigModule } from '@symbiota2/api-config';
import { DatabaseModule } from '@symbiota2/api-database';
import { ChecklistController } from './checklist/checklist.controller';
import { ChecklistService } from './checklist/project.service';

@Module({
  imports: [
    AppConfigModule, 
    DatabaseModule
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule extends SymbiotaApiPlugin {}
