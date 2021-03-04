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

@Injectable()
export class CsvInterceptor implements NestInterceptor {
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
