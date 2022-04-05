import fs, {
    createReadStream,
    createWriteStream,
    promises as fsPromises
} from 'fs';
import csv from 'csv-parser';
import xml2js from 'xml2js';
import archiver from 'archiver';
import { join as pathJoin, basename } from 'path';
import * as readline from 'readline';

const DEFAULT_ITER_ROWS = 1024;
export type InsideTempDirCallback<T> = (string) => Promise<T>;

export async function getCSVFields(csvFile: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(csvFile);
        stream.pipe(csv())
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

/*
When you want to trim the extra whitespace before and after *all* values in a CSV file use this iterator
 */
export async function* csvIteratorWithTrimValues<RowType>(filePath: string, bufSize = DEFAULT_ITER_ROWS) {
    let rowBuffer: RowType[] = [];
    const stream = fs.createReadStream(filePath).pipe(csv({
        mapValues: ({ header, index, value }) => value.trim()
    }));

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

/*
Iterators through a file of JSON objects
 */
export async function* objectIterator<RowType>(filePath: string, bufSize = DEFAULT_ITER_ROWS) {
    let rowBuffer: RowType[] = []
    const stream = fs.createReadStream(filePath)

    const readStream = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const row of readStream) {

        const obj = JSON.parse(row)
        if (rowBuffer.length >= bufSize) {
            stream.pause()
            yield rowBuffer
            rowBuffer = []
            stream.resume()
        }
        else {
            rowBuffer.push(obj)
        }
    }

    yield rowBuffer
}

export function withTempDir<T>(baseDir: string, cb: InsideTempDirCallback<T>) {
    fsPromises.mkdtemp(pathJoin(baseDir, 'tmp-')).then((tmpDir) => {
        return cb(tmpDir).finally(() => {
            return fsPromises.rm(tmpDir, { recursive: true });
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

export async function zipFiles(archiveName: string, files: string[]): Promise<void> {
    const archiveStream = createWriteStream(archiveName);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(archiveStream);

    for (const file of files) {
        const archiveFile = basename(file);
        archive.append(createReadStream(file), { name: archiveFile });
    }

    return new Promise((resolve, reject) => {
        archiveStream.on('close', () => resolve());
        archiveStream.on('error', (e) => reject(e));
        return archive.finalize();
    });
}
