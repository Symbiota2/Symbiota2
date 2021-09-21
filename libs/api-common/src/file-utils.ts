import csvParser from 'csv-parser';
import fs, { promises as fsPromises } from 'fs';
import csv from 'csv-parser';
import xml2js from 'xml2js';

const DEFAULT_ITER_ROWS = 1024;
export type InsideTempDirCallback<T> = (string) => Promise<T>;

export async function getCSVFields(csvFile: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(csvFile);
        stream.pipe(csvParser())
            .on('headers', (headers) => {
                stream.pause();
                stream.destroy();
                resolve(headers);
            }).on('error', (err) => {
                reject(err);
            });
    });
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    }
    catch (e) {
        return false;
    }
}

export async function* csvIterator<RowType>(filePath: string, bufSize = DEFAULT_ITER_ROWS) {
    let rowBuffer: RowType[] = [];
    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {
        if (rowBuffer.length >= bufSize) {
            stream.pause();
            yield rowBuffer;
            rowBuffer = [];
            stream.resume();
        }
        else {
            rowBuffer.push(row);
        }
    }
    yield rowBuffer;
}

export function withTempDir<T>(dirPrefix: string, cb: InsideTempDirCallback<T>) {
    fsPromises.mkdtemp(dirPrefix).then((tmpDir) => {
        return cb(tmpDir).finally(async () => {
            await fsPromises.rm(tmpDir, { recursive: true });
        });
    });
}

export async function readXmlFile<T>(filePath: string): Promise<T> {
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
