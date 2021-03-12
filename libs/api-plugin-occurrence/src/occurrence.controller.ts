import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OccurrenceListOutputDto } from './dto/occurrence-list-output.dto';
import { OccurrenceService } from './occurrence.service';
import { FindAllParams } from './dto/find-all-input.dto';
import { OccurrenceInputDto } from './dto/occurrence-input.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import fs from 'fs';
import JSONStream from 'JSONStream';
import {
    ApiBodyOneOrMany,
    ApiFileInput,
    CsvInterceptor
} from '@symbiota2/api-common';
import { DeepPartial } from 'typeorm';
import { Occurrence } from '@symbiota2/api-database';
import { plainToClass } from 'class-transformer';
import { OccurrenceOutputDto } from './dto/occurrence.output.dto';

type File = Express.Multer.File;
const fsPromises = fs.promises;

@ApiTags('Occurrences')
@Controller('occurrences')
export class OccurrenceController {
    private static readonly CREATE_MANY_CHUNK_SZ = 1024;
    private logger = new Logger(OccurrenceController.name);

    constructor(private readonly occurrenceService: OccurrenceService) { }

    @Get()
    async findAll(@Query() findAllOpts: FindAllParams): Promise<OccurrenceListOutputDto[]> {
        const occurrences = await this.occurrenceService.findAll(findAllOpts);
        return occurrences.map((o) => new OccurrenceListOutputDto(o));
    }

    @Get(':id')
    async findByID(@Param('id') id: number): Promise<OccurrenceOutputDto> {
        const occurrence = await this.occurrenceService.findByID(id);
        if (occurrence) {
            return new OccurrenceOutputDto(occurrence);
        }
        return null;
    }

    @Post(':collectionID')
    @HttpCode(HttpStatus.OK)
    @ApiBodyOneOrMany(OccurrenceInputDto)
    async createOccurrence(
        @Param('collectionID') collectionID: number,
        @Body() occurrenceData: OccurrenceInputDto | OccurrenceInputDto[]): Promise<OccurrenceListOutputDto | number[]> {

        // TODO: This returns nothing if input is array & something if it's a single occurrence
        if (Array.isArray(occurrenceData)) {
            await this.occurrenceService.createMany(collectionID, occurrenceData);
        }
        else {
            const occurrence = await this.occurrenceService.create(collectionID, occurrenceData);
            return new OccurrenceListOutputDto(occurrence);
        }
    }

    @Post(':collectionID/upload')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'), CsvInterceptor)
    @ApiFileInput('file')
    async createOccurrencesFromCsv(
        @Param('collectionID') collectionID: number,
        @UploadedFile() file: File): Promise<void> {

        if (!file.mimetype.startsWith('text/json')) {
            await fsPromises.unlink(file.path);
            throw new BadRequestException('Only JSON and CSV files are accepted');
        }

        const inputStream = fs.createReadStream(file.path);

        return new Promise(((resolve, reject) => {
            let currentChunk: DeepPartial<Occurrence>[] = [];
            const occurrencePromises = [];
            const uploadStart = Date.now();

            this.logger.debug('Upload started');

            inputStream.pipe(JSONStream.parse('*'))
                .on('data', async (occurrence) => {
                    if (currentChunk.length < OccurrenceController.CREATE_MANY_CHUNK_SZ) {
                        try {
                            currentChunk.push(
                                plainToClass(
                                    OccurrenceInputDto,
                                    occurrence,
                                    {
                                        enableImplicitConversion: true,
                                        excludeExtraneousValues: true
                                    }
                                )
                            );
                        }
                        catch (e) {
                            throw new BadRequestException(e.message);
                        }
                    }
                    else {
                        occurrencePromises.push(
                            this.occurrenceService.createMany(
                                collectionID,
                                currentChunk
                            )
                        );
                        currentChunk = [];
                    }
                })
                .on('error', async (e) => {
                    await fsPromises.unlink(file.path);
                    reject(e);
                })
                .on('end', async () => {
                    if (currentChunk.length > 0) {
                        occurrencePromises.push(
                            this.occurrenceService.createMany(
                                collectionID,
                                currentChunk
                            )
                        );
                    }

                    try {
                        await Promise.all(occurrencePromises);
                    }
                    catch (e) {
                        reject(e);
                    }
                    finally {
                        const uploadTook = Math.round(
                            (Date.now() - uploadStart) / 1000
                        );
                        this.logger.debug(`Upload took ${uploadTook}s`);
                        await fsPromises.unlink(file.path);
                    }

                    resolve();
                });
        }));
    }
}
