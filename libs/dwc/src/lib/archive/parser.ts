import zipExtract from 'extract-zip';
import { tmpdir } from 'os';
import path from 'path';
import {
    DwCAMeta,
    DwCAParseCallback,
} from '../interfaces';
import { readXmlFile, withTempDir } from '@symbiota2/api-common';

export class DwCArchiveParser {
    private static readonly SCHEMA_VERSION = 'http://rs.tdwg.org/dwc/text/tdwg_dwc_text.xsd';

    static parse(filePath: string, cb: DwCAParseCallback<DwCAMeta>) {
        const fileName = path.basename(filePath);
        const extractDirPrefix = path.join(tmpdir(), fileName.replace(/.zip$/, "-"));

        withTempDir(extractDirPrefix, async (extractDir) => {
            await zipExtract(filePath, { dir: extractDir });
            const archiveMeta = await readXmlFile<DwCAMeta>(path.join(extractDir, 'meta.xml'));

            if (!archiveMeta.archive.$['xsi:schemaLocation'].includes(DwCArchiveParser.SCHEMA_VERSION)) {
                throw new Error(`Invalid DwC Archive. The schema supported is ${DwCArchiveParser.SCHEMA_VERSION}`);
            }

            await cb(extractDir, archiveMeta);
        });
    }
}

