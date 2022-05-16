import * as path from 'path';
import * as process from "process";

// ===== Environment variable names =====
export const ENV_APP_PORT = 'SYMBIOTA2_APP_PORT';
export const ENV_APP_DATA_DIR = 'SYMBIOTA2_APP_DATA_DIR';
export const ENV_NODE_ENV = 'SYMBIOTA2_NODE_ENV';

export const ENV_DB_TYPE = 'SYMBIOTA2_DATABASE_TYPE';
export const ENV_DB_USER = 'SYMBIOTA2_DATABASE_USER';
export const ENV_DB_PASSWORD = 'SYMBIOTA2_DATABASE_PASSWORD';
export const ENV_DB_HOST = 'SYMBIOTA2_DATABASE_HOST';
export const ENV_DB_PORT = 'SYMBIOTA2_DATABASE_PORT';
export const ENV_DB_NAME = 'SYMBIOTA2_DATABASE_NAME';
export const ENV_DB_PATH = 'SYMBIOTA2_DATABASE_PATH';

export const ENV_IMAGE_LIBRARY = 'SYMBIOTA2_IMAGE_LIBRARY'

export const ENV_REDIS_HOST = 'SYMBIOTA2_REDIS_HOST';
export const ENV_REDIS_PORT = 'SYMBIOTA2_REDIS_PORT';

export const ENV_SMTP_HOST = 'SYMBIOTA2_SMTP_HOST';
export const ENV_SMTP_PORT = 'SYMBIOTA2_SMTP_PORT';
export const ENV_SMTP_USER = 'SYMBIOTA2_SMTP_USER';
export const ENV_SMTP_PASSWORD = 'SYMBIOTA2_SMTP_PASSWORD';
export const ENV_SMTP_SENDER = 'SYMBIOTA2_SMTP_SENDER';

export const ENV_ENABLE_AUTH = 'SYMBIOTA2_ENABLE_AUTH';

export const ENV_STORAGE_SERVER = 'SYMBIOTA2_STORAGE_SERVER';
export const ENV_STORAGE_USER = 'SYMBIOTA2_STORAGE_USER';
export const ENV_STORAGE_PASSWORD = 'SYMBIOTA2_STORAGE_PASSWORD';
export const ENV_STORAGE_BUCKET = 'SYMBIOTA2_STORAGE_BUCKET';

export const ENV_ENABLE_ELASTICSEARCH = 'SYMBIOTA2_ENABLE_ELASTICSEARCH';
export const ENV_ELASTICSEARCH_PORT = 'SYMBIOTA2_ELASTICSEARCH_PORT';
export const ENV_ELASTICSEARCH_USER = 'SYMBIOTA2_ELASTICSEARCH_USER';
export const ENV_ELASTICSEARCH_PASSWORD = 'SYMBIOTA2_ELASTICSEARCH_PASSWORD';
export const ENV_KIBANA_PORT = 'SYMBIOTA2_KIBANA_PORT';

// ======================================

// ===== Configuration defaults =====
export const DEFAULT_PORT = '8080';
export const DEFAULT_ENV = 'production';
export const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data');

export const DEFAULT_DB_TYPE = 'mariadb';
export const DEFAULT_DB_USER = 'root';
export const DEFAULT_DB_PASSWORD = 'password';
export const DEFAULT_DB_HOST = '127.0.0.1';
export const DEFAULT_DB_PORT = '3306';
export const DEFAULT_DB_NAME = 's2clean';
export const DEFAULT_DB_PATH = ':memory:';

export const DEFAULT_ENABLE_ELASTICSEARCH = '0';
export const DEFAULT_ELASTICSEARCH_PORT = '9200';
export const DEFAULT_ELASTICSEARCH_USER = 'elastic';
export const DEFAULT_ELASTICSEARCH_PASSWORD = 'hello';
export const DEFAULT_KIBANA_PORT = '5601';

//export const DEFAULT_IMAGE_LIBRARY = 'C:\\Users\\Curt\\Dropbox\\imglib'
export const DEFAULT_IMAGE_LIBRARY = 'D:\\Dropbox\\imglib'
//export const DEFAULT_IMAGE_LIBRARY = '/var/lib/openherb'

export const DEFAULT_REDIS_HOST = '127.0.0.1';
export const DEFAULT_REDIS_PORT = '6379';

export const DEFAULT_SMTP_HOST = '127.0.0.1';
export const DEFAULT_SMTP_PORT = '25';
export const DEFAULT_SMTP_USER = '';
export const DEFAULT_SMTP_PASSWORD = '';
export const DEFAULT_SMTP_SENDER = 'noreply@symbiota2.org';

export const DEFAULT_ENABLE_AUTH = '1';

export const DEFAULT_STORAGE_SERVER = 'http://127.0.0.1:9000';
export const DEFAULT_STORAGE_USER = 'symbiota2';
export const DEFAULT_STORAGE_PASSWORD = 'password';
export const DEFAULT_STORAGE_BUCKET = 'symbiota2';
// ==================================

/**
 * Returns the app config. If an environment variable is set, it's returned.
 * Otherwise it's default is used.
 */
export default function configBuilder(): Record<string, string> {
    return {
        // App config
        [ENV_APP_PORT]: process.env[ENV_APP_PORT] || DEFAULT_PORT,
        [ENV_APP_DATA_DIR]: process.env[ENV_APP_DATA_DIR] || DEFAULT_DATA_DIR,
        [ENV_NODE_ENV]: process.env[ENV_NODE_ENV] || DEFAULT_ENV,

        // All DBs
        [ENV_DB_TYPE]: process.env[ENV_DB_TYPE] || DEFAULT_DB_TYPE,

        // MySQL / MariaDB / Postgres
        [ENV_DB_USER]: process.env[ENV_DB_USER] || DEFAULT_DB_USER,
        [ENV_DB_PASSWORD]: process.env[ENV_DB_PASSWORD] || DEFAULT_DB_PASSWORD,
        [ENV_DB_HOST]: process.env[ENV_DB_HOST] || DEFAULT_DB_HOST,
        [ENV_DB_PORT]: process.env[ENV_DB_PORT] || DEFAULT_DB_PORT,
        [ENV_DB_NAME]: process.env[ENV_DB_NAME] || DEFAULT_DB_NAME,

        // SQLite only
        [ENV_DB_PATH]: process.env[ENV_DB_PATH] || DEFAULT_DB_PATH,

        // Protect routes
        [ENV_ENABLE_AUTH]: process.env[ENV_ENABLE_AUTH] || DEFAULT_ENABLE_AUTH,

        // Images
        [ENV_IMAGE_LIBRARY]: process.env[ENV_IMAGE_LIBRARY] || DEFAULT_IMAGE_LIBRARY,

        // Redis
        [ENV_REDIS_HOST]: process.env[ENV_REDIS_HOST] || DEFAULT_REDIS_HOST,
        [ENV_REDIS_PORT]: process.env[ENV_REDIS_PORT] || DEFAULT_REDIS_PORT,

        // Emails
        [ENV_SMTP_HOST]: process.env[ENV_SMTP_HOST] || DEFAULT_SMTP_HOST,
        [ENV_SMTP_PORT]: process.env[ENV_SMTP_PORT] || DEFAULT_SMTP_PORT,
        [ENV_SMTP_USER]: process.env[ENV_SMTP_USER] || DEFAULT_SMTP_USER,
        [ENV_SMTP_PASSWORD]: process.env[ENV_SMTP_PASSWORD] || DEFAULT_SMTP_PASSWORD,
        [ENV_SMTP_SENDER]: process.env[ENV_SMTP_SENDER] || DEFAULT_SMTP_SENDER,

        // S3 Storage
        [ENV_STORAGE_SERVER]: process.env[ENV_STORAGE_SERVER] || DEFAULT_STORAGE_SERVER,
        [ENV_STORAGE_USER]: process.env[ENV_STORAGE_USER] || DEFAULT_STORAGE_USER,
        [ENV_STORAGE_PASSWORD]: process.env[ENV_STORAGE_PASSWORD] || DEFAULT_STORAGE_PASSWORD,
        [ENV_STORAGE_BUCKET]: process.env[ENV_STORAGE_BUCKET] || DEFAULT_STORAGE_BUCKET,

        // Elasticsearch
        [ENV_ENABLE_ELASTICSEARCH]: process.env[ENV_ENABLE_ELASTICSEARCH] || DEFAULT_ENABLE_ELASTICSEARCH,
        [ENV_ELASTICSEARCH_PORT]: process.env[ENV_ELASTICSEARCH_PORT] || DEFAULT_ELASTICSEARCH_PORT,
        [ENV_ELASTICSEARCH_USER]: process.env[ENV_ELASTICSEARCH_USER] || DEFAULT_ELASTICSEARCH_USER,
        [ENV_ELASTICSEARCH_PASSWORD]: process.env[ENV_ELASTICSEARCH_PASSWORD] || DEFAULT_ELASTICSEARCH_PASSWORD,
        [ENV_KIBANA_PORT]: process.env[ENV_KIBANA_PORT] || DEFAULT_KIBANA_PORT,
    };
}
