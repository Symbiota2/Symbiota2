import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

import {
    ENV_APP_DATA_DIR,
    ENV_APP_PORT,
    ENV_DB_HOST,
    ENV_DB_NAME,
    ENV_DB_PASSWORD,
    ENV_DB_PATH,
    ENV_DB_PORT,
    ENV_DB_TYPE,
    ENV_DB_USER,
    ENV_ELASTICSEARCH_PORT,
    ENV_ENABLE_AUTH,
    ENV_ENABLE_ELASTICSEARCH,
    ENV_IMAGE_LIBRARY,
    ENV_KIBANA_PORT,
    ENV_NODE_ENV,
    ENV_REDIS_HOST,
    ENV_REDIS_PORT,
    ENV_SMTP_HOST,
    ENV_SMTP_PASSWORD,
    ENV_SMTP_PORT,
    ENV_SMTP_SENDER,
    ENV_SMTP_USER,
    ENV_STORAGE_BUCKET,
    ENV_STORAGE_PASSWORD,
    ENV_STORAGE_SERVER,
    ENV_STORAGE_USER
} from './configuration';

import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';
//import { StorageService } from '@symbiota2/api-storage';

const fsPromises = fs.promises;


export enum DatabaseProtocol {
    MYSQL = 'mysql',
    MARIA_DB = 'mariadb',
    POSTGRES = 'postgres',
    SQLITE = 'sqlite',
}

/**
 * Service for retrieving configuration values set in environment variables
 */
@Injectable()
export class AppConfigService {
    public static readonly ENV_DEV = 'development';
    public static readonly ENV_TEST = 'test';
    private static readonly PLUGIN_DIR_NAME = 'plugins';

    /**
     * @param path Path to a file
     * @return boolean Whether the file exists
     */
    private static async fsExists(path: string): Promise<boolean> {
        try {
            await fsPromises.access(path, fs.constants.F_OK);
            return true;
        }
        catch(_) {
            return false;
        }
    }

    constructor(private readonly configService: ConfigService) { }

    /**
     * @param key The environment variable name
     * @return T The environment variable value
     */
    get<T>(key: string): T {
        return this.configService.get<T>(key);
    }

    /**
     * The port that the app should run on
     */
    port(): number {
        return this.configService.get<number>(ENV_APP_PORT);
    }

    /**
     * The value for NODE_ENV
     */
    environment(): string {
        return this.configService.get<string>(ENV_NODE_ENV);
    }

    /**
     * The path to the directory where Symbiota2 will store data
     */
    async dataDir(): Promise<string> {
        const dataDir = path.resolve(
            this.configService.get<string>(ENV_APP_DATA_DIR)
        );
        const dirExists = await AppConfigService.fsExists(dataDir);

        if (!dirExists) {
            await fsPromises.mkdir(dataDir, { mode: 0o700, recursive: true });
        }

        return dataDir;
    }

    /**
     * Path to directory that contains Symbiota2 API plugins
     * TODO: Not implemented, plugins are currently loaded from an array in app.module.ts in the API core app
     */
    async pluginDir(): Promise<string> {
        const pluginDir = path.join(
            (await this.dataDir()),
            AppConfigService.PLUGIN_DIR_NAME
        );
        const dirExists = AppConfigService.fsExists(pluginDir);

        if (!dirExists) {
            await fsPromises.mkdir(pluginDir);
        }

        return pluginDir;
    }

    /**
     * Whether we're running within a development environment
     */
    isDevelopment(): boolean {
        return [AppConfigService.ENV_DEV, AppConfigService.ENV_TEST]
            .includes(this.environment());
    }

    /**
     * The value of DATABASE_TYPE that specifies the type of database
     * we're using: 'mysql', 'mariadb', 'postgres', 'sqlite'
     * TODO: Currently only mariadb is tested / implemented
     */
    databaseProtocol(): string {
        const proto = this.configService.get<DatabaseProtocol>(ENV_DB_TYPE);

        if (!Object.values(DatabaseProtocol).includes(proto)) {
            throw new Error(`Invalid database protocol '${proto}'`);
        }

        return proto;
    }

    /**
     * Path to the database when DATABASE_TYPE is 'sqlite'
     */
    databasePath(): string {
        const dbType = this.databaseProtocol();

        if (dbType !== DatabaseProtocol.SQLITE) {
            throw new Error('databasePath() should only be used with sqlite. Use databaseUri() instead');
        }

        return this.configService.get<string>(ENV_DB_PATH);
    }

    /**
     * The database uri when DATABASE_TYPE is something other than 'sqlite'
     */
    databaseUri(): string {
        const dbType = this.databaseProtocol();

        if (dbType === DatabaseProtocol.SQLITE) {
            throw new Error('databaseUri() should not be used with sqlite. Use databasePath() instead');
        }

        const user = this.configService.get<string>(ENV_DB_USER);
        const password = this.configService.get<string>(ENV_DB_PASSWORD);
        const host = this.configService.get<string>(ENV_DB_HOST);
        const port = this.configService.get<number>(ENV_DB_PORT);
        const name = this.configService.get<string>(ENV_DB_NAME);

        let uri = `${dbType}://${encodeURIComponent(user)}:`;
        uri += `${encodeURIComponent(password)}@`;
        uri += `${host}:${port}/${encodeURIComponent(name)}`;

        return uri;
    }

    /**
     * The TypeORM database configuration
     */
    databaseConfiguration(): ConnectionOptions {
        const dbProto = this.databaseProtocol();

        let connectionOpts: ConnectionOptions = {
            type: dbProto as any,
            synchronize: false,
            migrate: false,
            logging: this.isDevelopment(),
            cache: {
                type: 'ioredis',
                options: {
                    host: this.redisHost(),
                    port: this.redisPort()
                }
            }
        };

        if (dbProto === DatabaseProtocol.SQLITE) {
            connectionOpts = <ConnectionOptions> {
                ...connectionOpts,
                database: this.databasePath()
            };
        }
        else {
            connectionOpts = <ConnectionOptions> {
                ...connectionOpts,
                url: this.databaseUri()
            };
        }

        return connectionOpts;
    }

    /**
     * Whether API JWT authentication/authorization is enabled
     */
    isAuthEnabled(): boolean {
        return this.configService.get<string>(ENV_ENABLE_AUTH) === '1';
    }

    /**
     * The path to the image library
     */
    imageLibrary(): string {
        return this.configService.get<string>(ENV_IMAGE_LIBRARY);
    }

    /**
     * The redis host for processing asynchronous jobs
     */
    redisHost(): string {
        return this.configService.get<string>(ENV_REDIS_HOST);
    }

    /**
     * The redis port for processing asynchronous jobs
     */
    redisPort(): number {
        return parseInt(this.configService.get<string>(ENV_REDIS_PORT));
    }

    /**
     * The SMTP host for sending emails
     */
    smtpHost(): string {
        return this.configService.get<string>(ENV_SMTP_HOST);
    }

    /**
     * The SMTP port to connect to on the SMTP host
     */
    smtpPort(): number {
        return parseInt(this.configService.get<string>(ENV_SMTP_PORT));
    }

    /**
     * The SMTP user to authenticate with against the SMTP host
     */
    smtpUser(): string {
        return this.configService.get<string>(ENV_SMTP_USER);
    }

    /**
     * The password for the SMTP user
     */
    smtpPassword(): string {
        return this.configService.get<string>(ENV_SMTP_PASSWORD);
    }

    /**
     * The 'From' field for emails sent by the website
     */
    smtpSender(): string {
        return this.configService.get<string>(ENV_SMTP_SENDER);
    }

    storageServer(): string {
        return this.configService.get<string>(ENV_STORAGE_SERVER);
    }

    storageUser(): string {
        return this.configService.get<string>(ENV_STORAGE_USER);
    }

    storagePassword(): string {
        return this.configService.get<string>(ENV_STORAGE_PASSWORD);
    }

    storageBucket(): string {
        return this.configService.get<string>(ENV_STORAGE_BUCKET);
    }

    /**
     * Whether elasticsearch is enabled
     */
    isElasticsearchEnabled(): boolean {
        return this.configService.get<string>(ENV_ENABLE_ELASTICSEARCH) === '1';
    }

    /**
     * The Elasticsearch port to connect to on the Elasticsearch host
     */
    elasticsearchPort(): number {
        return parseInt(this.configService.get<string>(ENV_ELASTICSEARCH_PORT));
    }

    /**
     * The Kibana port to connect to on the Kibana host
     */
    kibanaPort(): number {
        return parseInt(this.configService.get<string>(ENV_KIBANA_PORT));
    }
}
