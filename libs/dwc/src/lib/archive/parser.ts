import zipExtract from 'extract-zip';
import { tmpdir } from 'os';
import path from 'path';
import {
    DWC_SCHEMA_LOCATION,
    DwCAMeta,
    DwCAParseCallback
} from '../interfaces';
import { readXmlFile, withTempDir } from '@symbiota2/api-common';

export class DwCArchiveParser {
    static parse(filePath: string, cb: DwCAParseCallback<DwCAMeta>) {
        const fileName = path.basename(filePath);
        const extractDirPrefix = path.join(tmpdir(), fileName.replace(/.zip$/, "-"));

        withTempDir(extractDirPrefix, async (extractDir) => {
            await zipExtract(filePath, { dir: extractDir });
            const archiveMeta = await readXmlFile<DwCAMeta>(path.join(extractDir, 'meta.xml'));

            if (!archiveMeta.archive.$['xsi:schemaLocation'].includes(DWC_SCHEMA_LOCATION)) {
                throw new Error(`Invalid DwC Archive. The schema supported is ${DWC_SCHEMA_LOCATION}`);
            }

            await cb(extractDir, archiveMeta);
        });
    }
}

