import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceController } from './occurrence.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { MulterModule } from '@nestjs/platform-express';
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { join as pathJoin } from 'path';
import { promises as fsPromises } from 'fs';

@Module({
    imports: [
        DatabaseModule,
        MulterModule.registerAsync({
            imports: [AppConfigModule],
            useFactory: async (appConfig: AppConfigService) => {
                const dataDir = await appConfig.dataDir();
                const uploadDir = pathJoin(dataDir, 'uploads', 'occurrences');

                try {
                    await fsPromises.stat(uploadDir);
                }
                catch (e) {
                    await fsPromises.mkdir(
                        uploadDir,
                        { mode: 0o700, recursive: true }
                    );
                }

                return { dest: uploadDir }
            },
            inject: [AppConfigService]
        })
    ],
    providers: [OccurrenceService],
    controllers: [OccurrenceController]
})
export class OccurrenceModule { }
