import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { Express, Request } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import { parse as pathParse, join as pathJoin } from 'path';
import JSONStream from 'JSONStream';

// This is a hack to make Multer available in the Express namespace
import { Multer } from 'multer';

const fsPromises = fs.promises;
type File = Express.Multer.File;

/**
 * Interceptor that turns any CSV files attached to a multipart request into
 * a JSON object
 */
@Injectable()
export class CsvInterceptor implements NestInterceptor {
    /**
     *
     * @param context Interface describing details about the current request
     * pipeline. If the HTTP context contains a property called 'file', and
     * that file has a mimetype starting with 'text/csv', the file is read and
     * transformed into a JSON object. The resulting JSON is then written to a
     * new file, and the request is updated with the new path and mimetype.
     * @param next The next handler in the route
     */
    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const http = context.switchToHttp();
        const req: Request = http.getRequest();
        const file: File = req.file;

        if (file && file.mimetype.startsWith('text/csv')) {
            const origFile = pathParse(file.path);
            const newFile = pathJoin(origFile.dir, `${origFile.name}.json`);

            await CsvInterceptor.csvToJson(file.path, newFile);
            await fsPromises.unlink(file.path);

            req.file.path = newFile;
            req.file.mimetype = 'text/json';
        }

        return next.handle();
    }

    /**
     * Converts a CSV file to JSON file via streams
     * @param filePath Path the the CSV
     * @param outputPath Path to the JSON file
     */
    private static async csvToJson(filePath: string, outputPath: string): Promise<string> {
        const inFileStream = fs.createReadStream(filePath);
        const outFileStream = fs.createWriteStream(outputPath);
        const jsonStream = JSONStream.stringify('[', ',', ']');

        return new Promise((resolve, reject) => {
            inFileStream.pipe(csv())
                .pipe(jsonStream)
                .pipe(outFileStream)
                .on('error', reject)
                .on('finish', () => {
                    resolve(outputPath);
                });
        });
    }
}
