import { Connection, Repository } from 'typeorm';
import { Provider } from '@nestjs/common';
import { DATABASE_PROVIDER_ID } from './database.provider';
import { classToPlain } from 'class-transformer';

export abstract class EntityProvider {
    static get PROVIDER_ID(): string {
        return `${this.name}_REPO`;
    }

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
