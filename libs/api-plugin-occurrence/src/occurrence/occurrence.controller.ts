import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger, NotFoundException,
    Param, ParseArrayPipe, Patch,
    Post,
    Query, Req, Res,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBody,
    ApiExtraModels, ApiOperation, ApiProperty,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { OccurrenceList, OccurrenceListItem } from './dto/occurrence-list';
import { OccurrenceService } from './occurrence.service';
import { FindAllParams } from './dto/find-all-input.dto';
import { OccurrenceInputDto } from './dto/occurrence-input.dto';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import fs, { createReadStream } from 'fs';
import {
    ApiFileInput,
    getCSVFields, withTempDir
} from '@symbiota2/api-common';
import { OccurrenceOutputDto } from './dto/occurrence.output.dto';
import { ProtectCollection } from '@symbiota2/api-plugin-collection';
import { CollectionListItem } from '@symbiota2/ui-plugin-collection';
import { CollectionIDQueryParam } from './dto/collection-id-query-param';
import { AuthenticatedRequest, JwtAuthGuard } from '@symbiota2/api-auth';
import { OccurrenceHeaderMapBody } from './dto/occurrence-header-map.input.dto';
import { Occurrence, OccurrenceUpload } from '@symbiota2/api-database';
import * as path from 'path';
import { tmpdir } from 'os';
import { DwcArchiveBuilder } from '@symbiota2/dwc';
import { AppConfigService } from '@symbiota2/api-config';
import { IsNull, Not } from 'typeorm';

type File = Express.Multer.File;
const fsPromises = fs.promises;

@ApiTags('Occurrences')
@Controller('occurrences')
export class OccurrenceController {
    constructor(
        private readonly config: AppConfigService,
        private readonly occurrenceService: OccurrenceService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: OccurrenceList })
    @ApiOperation({
        summary: "Retrieve a list of occurrences"
    })
    async findAll(@Query() findAllOpts: FindAllParams): Promise<OccurrenceList> {
        const occurrenceList = await this.occurrenceService.findAll(findAllOpts);
        return new OccurrenceList(occurrenceList.count, occurrenceList.data);
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: OccurrenceOutputDto })
    @ApiOperation({
        summary: "Retrieve an occurrence by ID"
    })
    @ApiExtraModels(CollectionListItem)
    async findByID(@Param('id') id: number): Promise<OccurrenceOutputDto> {
        const occurrence = await this.occurrenceService.findByID(id);
        if (occurrence) {
            return new OccurrenceOutputDto(occurrence);
        }
        throw new NotFoundException();
    }

    @Get('meta/fields')
    @ApiOperation({
        summary: 'Retrieve the list of fields for the occurrence entity'
    })
    async getOccurrenceFields(): Promise<string[]> {
        return this.occurrenceService.getOccurrenceFields();
    }

    @Post()
    @ApiOperation({
        summary: "Create an occurrence within the given collection"
    })
    @ProtectCollection('collectionID', { isInQuery: true })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: OccurrenceInputDto, isArray: true })
    async createOccurrence(
        @Query() query: CollectionIDQueryParam,
        @Body(new ParseArrayPipe({ items: OccurrenceInputDto }))
        occurrenceData: OccurrenceInputDto[]): Promise<OccurrenceListItem> {

        // TODO: This returns nothing if input is array & something if it's a single occurrence
        if (occurrenceData.length > 1) {
            await this.occurrenceService.createMany(query.collectionID, occurrenceData);
        }
        else {
            const occurrence = await this.occurrenceService.create(
                query.collectionID,
                occurrenceData[0]
            );
            return new OccurrenceListItem(occurrence);
        }
    }

    @Post('upload')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Upload a CSV or DwCA file containing occurrences"
    })
    @ApiFileInput('file')
    async uploadOccurrenceFile(@UploadedFile() file: File): Promise<OccurrenceUpload> {
        let upload: OccurrenceUpload;

        if (!file) {
            throw new BadRequestException('File not specified');
        }

        if (file.mimetype.startsWith('text/csv')) {
            const headers = await getCSVFields(file.path);
            const headerMap = {};
            headers.forEach((h) => headerMap[h] = '');

            upload = await this.occurrenceService.createUpload(
                path.resolve(file.path),
                file.mimetype,
                headerMap
            );
        }
        else if (file.mimetype.startsWith('application/zip')) {
            // TODO: DwCA uploads
            await fsPromises.unlink(file.path);
            throw new BadRequestException('DwCA uploads are not yet implemented');
        }
        else {
            await fsPromises.unlink(file.path);
            throw new BadRequestException('Unsupported file type: CSV and DwCA zip files are supported');
        }

        return upload;
    }

    @Get('upload/:id')
    @ApiOperation({ summary: 'Retrieve an upload by its ID' })
    async getUploadByID(@Param('id') id: number): Promise<OccurrenceUpload> {
        return this.occurrenceService.findUploadByID(id);
    }

    @Patch('upload/:id')
    @HttpCode(HttpStatus.OK)
    @ProtectCollection('collectionID', { isInQuery: true })
    @ApiOperation({
        summary: 'Map the fields of a CSV or DwCA to the occurrence table\'s fields'
    })
    async mapOccurrenceUpload(
        @Query() query: CollectionIDQueryParam,
        @Param('id') id: number,
        @Body() body: OccurrenceHeaderMapBody): Promise<{ newRecords: number, updatedRecords: number, nullRecords: number }> {

        const upload = await this.occurrenceService.patchUploadFieldMap(
            id,
            body.uniqueIDField,
            body.fieldMap as Record<string, keyof Occurrence>
        );

        if (!upload) {
            throw new NotFoundException();
        }

        const csvOccurrenceUniqueIDs = await this.occurrenceService.countCSVNonNull(
            upload.filePath,
            body.uniqueIDField
        );

        const dbUniqueIDField = body.fieldMap[body.uniqueIDField];
        const dbOccurrenceUniqueIDs = await this.occurrenceService.countOccurrences(
            query.collectionID,
            dbUniqueIDField,
            csvOccurrenceUniqueIDs.uniqueValues
        );

        const newOccurrenceCount = csvOccurrenceUniqueIDs.uniqueValues.length - dbOccurrenceUniqueIDs;
        return {
            newRecords: newOccurrenceCount,
            updatedRecords: dbOccurrenceUniqueIDs,
            nullRecords: csvOccurrenceUniqueIDs.nulls
        };
    }

    @Post('upload/:id/start')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ProtectCollection('collectionID', { isInQuery: true })
    @ApiOperation({
        summary: 'Starts a pre-configured upload of a CSV or DwCA'
    })
    async startUpload(
        @Param('id') uploadID: number,
        @Query() query: CollectionIDQueryParam,
        @Req() request: AuthenticatedRequest) {

        await this.occurrenceService.startUpload(
            request.user.uid,
            query.collectionID,
            uploadID
        );
    }

    @Get('download/dwca')
    @ApiOperation({
        summary: 'Retrieve this collection as a Darwin Core Archive'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        content: {
            'application/zip': {
                schema: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    async getCollectionAsArchive(@Query() query: CollectionIDQueryParam, @Res() response: Response): Promise<void> {
        const dataDir = await this.config.dataDir();

        // TODO: Do we export records without an associated taxon?

        withTempDir(dataDir, async (tmpDir) => {
            const archive = await this.occurrenceService.createDwCArchive(
                tmpDir,
                { collectionID: query.collectionID, taxonID: Not(IsNull()) }
            );
            const readStream = createReadStream(archive);
            readStream.pipe(response);

            return new Promise<void>((resolve, reject) => {
                readStream.on('error', (e) => reject(e));
                readStream.on('close', () => resolve());
            });
        });
    }
}
