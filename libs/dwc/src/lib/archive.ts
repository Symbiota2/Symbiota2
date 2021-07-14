import xml2js from 'xml2js';
import { promises as fsPromises } from 'fs';
import zipExtract from 'extract-zip';
import { tmpdir } from 'os';
import path from 'path';
import { InsideTempDirCallback } from './interfaces';

export class DwCArchive {
    private readonly eml: Record<string, unknown> = null;
    private readonly meta: Record<string, unknown> = null;
    private readonly dataFiles = new Map<string, Record<string, unknown>>();

    static async parse(filePath: string): Promise<DwCArchive> {
        const fileName = path.basename(filePath);
        const extractDirPrefix = path.join(tmpdir(), fileName.replace(/.zip$/, "-"));

        await DwCArchive.withTempDir(extractDirPrefix, async (extractDir) => {
            await zipExtract(filePath, { dir: extractDir });
            const archiveMeta = await DwCArchive.readXmlFile(path.join(extractDir, 'meta.xml'));

            console.log(JSON.stringify(archiveMeta, null, 4));
        });

        return null;
    }

    private static async readXmlFile(filePath: string): Promise<Record<string, unknown>> {
        const fileContents = await fsPromises.readFile(filePath);
        return new Promise((resolve, reject) => {
            xml2js.parseString(fileContents, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    private static async withTempDir(dirPrefix: string, cb: InsideTempDirCallback) {
        const tmpDir = await fsPromises.mkdtemp(dirPrefix);
        await cb(tmpDir);
        await fsPromises.rm(tmpDir, { recursive: true });
    }
}

DwCArchive.parse("/home/edunn/Downloads/UMN-EXT_backup_1626274168_DwC-A.zip").then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
});
