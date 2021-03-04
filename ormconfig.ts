import dotenv from 'dotenv';
import path from 'path';
import * as entities from './libs/api-database/src/entities';
import * as migrations from './libs/api-database/src/migrations';
import { ConnectionOptions } from 'typeorm';

const envFile = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envFile });

let uri = `${ process.env.DATABASE_TYPE }://`;
uri += `${ encodeURIComponent(process.env.DATABASE_USER) }:`;
uri += `${ encodeURIComponent(process.env.DATABASE_PASSWORD) }@`;
uri += `${ process.env.DATABASE_HOST }:${ process.env.DATABASE_PORT }/`;
uri += `${ encodeURIComponent(process.env.DATABASE_NAME) }`;

const ormconfig: ConnectionOptions = {
    type: process.env.DATABASE_TYPE as any,
    synchronize: false,
    migrationsRun: false,
    entities: Object.values(entities),
    migrations: Object.values(migrations),
    cli: { 'migrationsDir': './libs/api-database/src/migrations' },
    logging: false,
    url: uri
}

export default ormconfig;
module.exports = ormconfig;
