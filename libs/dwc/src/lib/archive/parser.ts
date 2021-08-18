import xml2js from 'xml2js';
import { promises as fsPromises } from 'fs';
import zipExtract from 'extract-zip';
import { tmpdir } from 'os';
import path from 'path';
import {
    DwCAMeta,
    DwCAParseCallback,
    InsideTempDirCallback
} from '../interfaces';

export class DwCArchiveParser {
    private static readonly SCHEMA_VERSION = 'http://rs.tdwg.org/dwc/text/tdwg_dwc_text.xsd';

    static parse(filePath: string, cb: DwCAParseCallback<DwCAMeta>) {
        const fileName = path.basename(filePath);
        const extractDirPrefix = path.join(tmpdir(), fileName.replace(/.zip$/, "-"));

        DwCArchiveParser.withTempDir(extractDirPrefix, async (extractDir) => {
            await zipExtract(filePath, { dir: extractDir });
            const archiveMeta = await DwCArchiveParser.readXmlFile<DwCAMeta>(path.join(extractDir, 'meta.xml'));

            if (!archiveMeta.archive.$['xsi:schemaLocation'].includes(DwCArchiveParser.SCHEMA_VERSION)) {
                throw new Error(`Invalid DwC Archive. The schema supported is ${DwCArchiveParser.SCHEMA_VERSION}`);
            }

            await cb(extractDir, archiveMeta);
        });
    }

    private static async readXmlFile<T>(filePath: string): Promise<T> {
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

    private static withTempDir<T>(dirPrefix: string, cb: InsideTempDirCallback<T>) {
        fsPromises.mkdtemp(dirPrefix).then((tmpDir) => {
            return cb(tmpDir).finally(async () => {
                await fsPromises.rm(tmpDir, { recursive: true });
            });
        });
    }
}

