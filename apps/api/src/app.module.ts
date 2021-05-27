import { Module } from '@nestjs/common';
import { AppConfigModule } from '@symbiota2/api-config';
import { UserModule, AuthModule } from '@symbiota2/api-auth';
import { ApiPluginModule } from '@symbiota2/api-common';
import { OccurrenceModule } from '@symbiota2/api-plugin-occurrence';
import { CollectionModule } from '@symbiota2/api-plugin-collection';
import { ApiJobsModule } from '@symbiota2/api-jobs';
import { GeographyModule } from '@symbiota2/api-plugin-geography';

@Module({
    imports: [
        AppConfigModule,
        UserModule,
        AuthModule,
        ApiPluginModule.configure([
            ApiJobsModule,
            CollectionModule,
            OccurrenceModule,
            GeographyModule,
        ])
    ]
})
export class AppModule {}
