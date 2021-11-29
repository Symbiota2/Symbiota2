import zipExtract from 'extract-zip';
import { tmpdir } from 'os'
import { readXmlFile } from '@symbiota2/api-common';
import csv from 'csv-parser'
import { createReadStream, mkdtempSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path'

export class TaxonomyCSVParser {
    static async *read(filepath: string) {
        // TODO: App config data dir?
        const tempdir = mkdtempSync(`${tmpdir()}${path.sep}`);

        const location = path.join(tempdir, filepath)
        const stream = createReadStream(location).pipe(
            csv({
                //headers: fields,
                //skipLines: 1, // Ignore header lines
                separator: ',',
                quote: '"',
            })
        )
        for await (const row of stream) {
            yield row
        }


        await rm(tempdir, { recursive: true });
    }

}

