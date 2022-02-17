import * as path from 'path';
import * as process from "process";

// ===== Environment variable names =====
export const ENV_APP_PORT = 'APP_PORT';
export const ENV_APP_DATA_DIR = 'APP_DATA_DIR';
export const ENV_NODE_ENV = 'NODE_ENV';

export const ENV_DB_TYPE = 'DATABASE_TYPE';
export const ENV_DB_USER = 'DATABASE_USER';
export const ENV_DB_PASSWORD = 'DATABASE_PASSWORD';
export const ENV_DB_HOST = 'DATABASE_HOST';
export const ENV_DB_PORT = 'DATABASE_PORT';
export const ENV_DB_NAME = 'DATABASE_NAME';
export const ENV_DB_PATH = 'DATABASE_PATH';

export const ENV_IMAGE_LIBRARY = 'IMAGE_LIBRARY'

export const ENV_REDIS_HOST = 'REDIS_HOST';
export const ENV_REDIS_PORT = 'REDIS_PORT';

export const ENV_SMTP_HOST = 'SMTP_HOST';
export const ENV_SMTP_PORT = 'SMTP_PORT';
export const ENV_SMTP_USER = 'SMTP_USER';
export const ENV_SMTP_PASSWORD = 'SMTP_PASSWORD';
export const ENV_SMTP_SENDER = 'SMTP_SENDER';

export const ENV_ENABLE_AUTH = 'ENABLE_AUTH';

export const ENV_STORAGE_SERVER = 'STORAGE_SERVER';
export const ENV_STORAGE_USER = 'STORAGE_USER';
export const ENV_STORAGE_PASSWORD = 'STORAGE_PASSWORD';
export const ENV_STORAGE_BUCKET = 'STORAGE_BUCKET';

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
export const DEFAULT_DB_NAME = 'symbiota';
export const DEFAULT_DB_PATH = ':memory:';

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
    };
}
