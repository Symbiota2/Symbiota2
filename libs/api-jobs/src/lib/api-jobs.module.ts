import { Module } from '@nestjs/common';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { EntityTarget } from 'typeorm';
import { AsyncJob } from './async-job.entity';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class ApiJobsModule extends SymbiotaApiPlugin {
    static entities(): EntityTarget<any>[] {
        return [
            AsyncJob
        ];
    }
}
