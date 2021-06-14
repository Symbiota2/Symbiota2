import { Connection, Repository } from 'typeorm';
import { Provider } from '@nestjs/common';
import { DATABASE_PROVIDER_ID } from './database.provider';
import { classToPlain } from 'class-transformer';

/**
 * Class that all TypeORM database entities should inherit from. The PROVIDER_ID
 * and getProvider() functions allow the entity to be used as a NestJS provider.
 */
export abstract class EntityProvider {
    /**
     * The NestJS provider ID for the entity
     */
    static get PROVIDER_ID(): string {
        return `${this.name}_REPO`;
    }

    /**
     * @return Provider A provider that allows for an injectable TypeORM
     * repository. Should be called in the 'providers' section of
     * database.module.ts. Since we have so many entities, they're first
     * aggregated in providers.ts, then imported into database.module.ts.
     */
    static getProvider<T>(): Provider<Repository<T>> {
        return {
            provide: this.PROVIDER_ID,
            useFactory: (connection: Connection) => {
                return connection.getRepository(this.name);
            },
            inject: [DATABASE_PROVIDER_ID]
        };
    }

    json() {
        return classToPlain(this);
    }
}
