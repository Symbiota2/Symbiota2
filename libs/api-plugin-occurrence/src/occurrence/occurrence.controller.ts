import {
    BadRequestException,
    Body,
    Controller, Delete, ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Logger, NotFoundException,
    Param, ParseArrayPipe, Patch,
    Post,
    Provider,
    Query, Req, Res,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBearerAuth,
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
    getCSVFields, getCSVFieldsCustomSeperator, getCsvSeperator, withTempDir
} from '@symbiota2/api-common';
import { OccurrenceOutputDto } from './dto/occurrence.output.dto';
import {
    CollectionService,
    ProtectCollection
} from '@symbiota2/api-plugin-collection';
import { CollectionListItem } from '@symbiota2/ui-plugin-collection';
import { CollectionIDQueryParam } from './dto/collection-id-query-param';
import { AuthenticatedRequest, JwtAuthGuard } from '@symbiota2/api-auth';
import { OccurrenceHeaderMapBody } from './dto/occurrence-header-map.input.dto';
import { Occurrence, OccurrenceUpload } from '@symbiota2/api-database';
import * as path from 'path';
import { AppConfigService } from '@symbiota2/api-config';
import { IsNull, Not } from 'typeorm';
import { StorageService } from '@symbiota2/api-storage';
import { DwCService } from '@symbiota2/api-dwc';
import extract from 'extract-zip';
import { IPTInputDto } from './dto/occurrence-ipt-input.dto';
import { DWCUploadInfo } from './dto/occurrence-dwc-upload-info';


type File = Express.Multer.File;
const fsPromises = fs.promises;

@ApiTags('Occurrences')
@Controller('occurrences')
export class OccurrenceController {
    constructor(
        private readonly config: AppConfigService,
        private readonly occurrenceService: OccurrenceService,
        private readonly collectionService: CollectionService,
        private readonly storageService: StorageService,
        private readonly dwcService: DwCService) { }

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
        const currDate = new Date();
        const timestamp = currDate.getTime();
        const re = /\s/gi;
        const fileTimeStamp = currDate.toString().replace(re, "")
        let occurrencesSeperator: string;
        console.log("Timestamp: " + timestamp);

        let uniqueDir: string = path.resolve(__dirname, "..", "..", "..", "data", "uploads", "occurrences", fileTimeStamp);
        let extractDir: string = path.resolve(__dirname, "..", "..", "..", "data", "uploads", "occurrences");

        if (!file) {
            throw new BadRequestException('File not specified');
        }

        if (file.mimetype.startsWith('application/zip') || file.mimetype.startsWith('application/x-zip-compressed')) {
            // Accepts file
            // Writes file to uploads directory /home/dovahcraft/symbiota2/data/uploads/occurrences
            // Generates timestamped dir
            // Moves items with a new unique id/timestamp to top level
            // Deletes uniqueDir and uneeded items.

            if (file.mimetype.startsWith('application/zip') || file.mimetype.startsWith('application/x-zip-compressed')) {
                try {
                    await extract(file.path, { dir: uniqueDir })
                    const files = await fs.promises.readdir(uniqueDir);
                    console.log("Files in directory: " + uniqueDir);
                    for (var currFile of files) {
                        console.log(currFile);
                        //Rebuild string with timestamp added to it.
                        const fileNameParts = currFile.split('.');
                        //Splits fileName before file extension, adding the timestamp between them. 
                        let fullFileName: string = fileNameParts[0] + "-" + fileTimeStamp + "." + fileNameParts[1];

                        //Rename to csv. 
                        if (fileNameParts[1] != "csv") {
                            let fullFileNameCsv: string = fileNameParts[0] + "-" + fileTimeStamp + ".csv";
                            fs.renameSync(path.resolve(uniqueDir, currFile), path.resolve(extractDir, fullFileNameCsv));
                        }
                        else {
                            fs.renameSync(path.resolve(uniqueDir, currFile), path.resolve(extractDir, fullFileName));
                        }
                    }

                    //Remove the now empty unique directory
                    fs.rmSync(uniqueDir, { recursive: true, force: true });
                    let occurrencesFName: string
                    let occurrenceCsvPath: string

                    //Get the timestamped occurrences file.
                    occurrencesFName = "occurrence" + "-" + fileTimeStamp + "." + "csv";
                    occurrenceCsvPath = path.resolve(extractDir, occurrencesFName);
                    if (!fs.existsSync(occurrenceCsvPath)) {
                        //Try occurrences
                        console.log('Trying occurrences')
                        occurrencesFName = "occurrences" + "-" + fileTimeStamp + "." + "csv";
                        occurrenceCsvPath = path.resolve(extractDir, occurrencesFName);
                        if (!fs.existsSync(occurrenceCsvPath)) {
                            throw new BadRequestException("Couldn't find csv file!");
                        }
                    }


                    // Get csv seperator if we found a valid occurrences file.
                    occurrencesSeperator = await getCsvSeperator(occurrenceCsvPath);


                    try {
                        console.log('Trying occurrence');

                        // Get csv seperator
                        occurrencesSeperator = await getCsvSeperator(occurrenceCsvPath);
                    }
                    catch (err) {
                        console.log("Does NOT start with occurrence. Trying occurrences.");
                        //Starts with occurrences
                        try {

                            // Get csv seperator
                            occurrencesSeperator = await getCsvSeperator(occurrenceCsvPath);
                        }
                        catch (err) {
                            console.log("Does NOT start with occurrences either. Invalid filename.");
                            throw new BadRequestException("Invalid filename for occurrences. Must be either occurrence or occurrences.")
                        }
                    }



                    console.log("Got seperator.")
                    //Convert to csv.
                    //TODO: Check if we need a seperator. Should be a try catch or something.
                    const headers = await getCSVFieldsCustomSeperator(occurrenceCsvPath, occurrencesSeperator);
                    const headerMap = {};
                    headers.forEach((h) => headerMap[h] = '');

                    upload = await this.occurrenceService.createUpload(
                        path.resolve(occurrenceCsvPath),
                        ".csv",
                        headerMap
                    );
                } catch (err) {
                    // handle any errors
                    throw new BadRequestException('DwCA upload not extracted! ' + err);
                }
            }
        }

        else if (file.mimetype == "text/csv") {
            let occurrencesSeperator: string = await getCsvSeperator(file.path);
            const headers = await getCSVFieldsCustomSeperator(file.path, occurrencesSeperator);
            const headerMap = {};
            headers.forEach((h) => headerMap[h] = '');

            upload = await this.occurrenceService.createUpload(
                path.resolve(file.path),
                file.mimetype,
                headerMap
            );
        }
        else if (file.mimetype == "text/plain") {
            //Rebuild string with timestamp added to it.
            const fileNameParts = file.filename.split('.');
            //Convert to csv first.
            let fullFileNameCsv: string = fileNameParts[0] + "-" + fileTimeStamp + ".csv";
            fs.renameSync(path.resolve(uniqueDir, currFile), path.resolve(extractDir, fullFileNameCsv));
            let occurrencesSeperator: string = await getCsvSeperator(file.path);
            const headers = await getCSVFieldsCustomSeperator(file.path, occurrencesSeperator);
            const headerMap = {};
            headers.forEach((h) => headerMap[h] = '');

            upload = await this.occurrenceService.createUpload(
                path.resolve(file.path),
                file.mimetype,
                headerMap
            );
        }

        else {
            await fsPromises.unlink(file.path);
            throw new BadRequestException('Unsupported file type: CSV and DwCA zip files are supported. Uploaded type: ' + file.mimetype);
        }

        return upload;
    }

    @Post('upload/iptLink')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Download a DwCA from an IPT link and upload it."
    })
    async uploadOccurrenceIPTLink(@Body() iptDto: IPTInputDto) {
        let upload: OccurrenceUpload;
        let iptLink = iptDto.iptLink;

        const currDate = new Date();
        const timestamp = currDate.getTime();
        const re = /\s/gi;
        const fileTimeStamp = currDate.toString().replace(re, "")
        let uniqueDir: string = path.resolve(__dirname, "..", "..", "..", "data", "uploads", "occurrences", fileTimeStamp);
        let extractDir: string = path.resolve(__dirname, "..", "..", "..", "data", "uploads", "occurrences");
        // const file = fs.createWriteStream(uniqueDir + "_IPT.zip");
        const headerMap = {};
        let uploadInfo: DWCUploadInfo;
        let occurrencesPath: string;
        let occurrencesSeperator: string;

        //First download the file from a dwca link.
        try {
            occurrencesPath = await this.get_IPT_Zip(iptLink);
        }
        catch (rejectedVal) {
            throw new BadRequestException('Couldn\'t download archive from IPT link' + rejectedVal);
        }

        // Get csv seperator
        occurrencesSeperator = await getCsvSeperator(occurrencesPath);

        //Convert to csv.
        //TODO: Check if we need a seperator. Should be a try catch or something.
        const headers = await getCSVFieldsCustomSeperator(occurrencesPath, occurrencesSeperator);
        var count = 0;
        headers.forEach((h) => {
            headerMap[h] = '';
            console.log("Header " + count + " : " + h);
            count++;
        });

        console.log("HEADERS: " + headers)


        //Now that we have the files, upload them.

        //Upload Occurrences
        return this.occurrenceService.createUpload(
            path.resolve(occurrencesPath),
            ".csv",
            headerMap
        );
        //Upload Images TODO


    }

    //Helper function for IPT upload.
    async get_IPT_Zip(iptLink: string): Promise<any> {
        const currDate = new Date();
        const timestamp = currDate.getTime();
        let uploadInfo: DWCUploadInfo = new DWCUploadInfo();
        const re = /\s/gi;
        const fileTimeStamp = currDate.toString().replace(re, "")
        let uniqueDir: string = path.resolve(__dirname, "..", "..", "..", "data", "uploads", "occurrences", fileTimeStamp);
        let extractDir: string = path.resolve(__dirname, "..", "..", "..", "data", "uploads", "occurrences");
        const https = require('https');
        const http = require('http');
        var httpService = http;
        const fs = require('fs');

        if (iptLink.startsWith("https")) {
            httpService = https;
        }


        const file = fs.createWriteStream(uniqueDir + "_IPT.zip");
        return new Promise((resolve, reject) => {
            httpService.get(iptLink, async function (response) {
                response.pipe(file);
                // after download completed close filestream
                file.on("finish", async () => {
                    file.close();
                    try {
                        await extract(file.path, { dir: uniqueDir })
                        const files = await fs.promises.readdir(uniqueDir);
                        console.log("Files in directory: " + uniqueDir);
                        for (var currFile of files) {
                            console.log(currFile + typeof (currFile));
                            //Rebuild string with timestamp added to it.
                            const fileNameParts = currFile.split('.');
                            //Splits fileName before file extension, adding the timestamp between them. 
                            let fullFileName: string = fileNameParts[0] + "-" + fileTimeStamp + "." + fileNameParts[1];

                            //Rename to csv. 
                            if (fileNameParts[1] != "csv") {
                                let fullFileNameCsv: string = fileNameParts[0] + "-" + fileTimeStamp + ".csv";
                                fs.rename(path.resolve(uniqueDir, currFile), path.resolve(extractDir, fullFileNameCsv), function (err) {
                                    reject(err);
                                });
                            }
                            else {
                                fs.rename(path.resolve(uniqueDir, currFile), path.resolve(extractDir, fullFileName), function (err) {
                                    reject(err);
                                });
                            }

                        }

                        //Remove the now empty unique directory
                        fs.rmSync(uniqueDir, { recursive: true, force: true });
                        fs.rmSync(uniqueDir + "_IPT.zip", { recursive: true, force: true });
                        let occurrencesFName: string = "occurrence" + "-" + fileTimeStamp + "." + "csv";
                        let occurrenceCsvPath: string = path.resolve(extractDir, occurrencesFName);

                        //Get the timestamped occurrences file.
                        occurrencesFName = "occurrence" + "-" + fileTimeStamp + "." + "csv";
                        occurrenceCsvPath = path.resolve(extractDir, occurrencesFName);
                        if (!fs.existsSync(occurrenceCsvPath)) {
                            //Try occurrences
                            console.log('Trying occurrences')
                            occurrencesFName = "occurrences" + "-" + fileTimeStamp + "." + "csv";
                            occurrenceCsvPath = path.resolve(extractDir, occurrencesFName);
                            if (!fs.existsSync(occurrenceCsvPath)) {
                                throw new BadRequestException("Couldn't find csv file!");
                            }
                        }
                        uploadInfo.occurrencePath = occurrenceCsvPath;


                        //Attempt to get the timestamped images file
                        //starts with image.
                        try {
                            let imagesFName: string = "image" + "-" + fileTimeStamp + "." + "csv";
                            let imageCsvPath: string = path.resolve(extractDir, imagesFName);
                            uploadInfo.imagesPath = imageCsvPath;
                        }
                        catch (err) {
                            console.log("Does NOT start with image. Trying images.");
                        }

                        try {
                            let imagesFName: string = "occurrences" + "-" + fileTimeStamp + "." + "csv";
                            let imageCsvPath: string = path.resolve(extractDir, imagesFName);
                            uploadInfo.imagesPath = imageCsvPath;
                        }
                        catch (err) {
                            console.log("Does NOT start with images either. Invalid filename for images.");
                            //reject("Invalid image filename, must be named 'image' or 'images' in DwCA" + err);
                        }
                        console.log("UploadInfo occurrence link: " + uploadInfo.occurrencePath + " Mimetype: " + uploadInfo.occurrenceMimeType);
                        //If we got both, return the information
                        resolve(occurrenceCsvPath);


                    } catch (err) {
                        // handle any errors
                        reject(err);
                        throw new BadRequestException('Couldn\'t download archive from IPT link' + err);
                    }

                }
                );
            })
        })
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

        // const csvOccurrenceUniqueIDs = await this.occurrenceService.countCSVNonNull(
        //     upload.filePath,
        //     body.uniqueIDField,
        //     "tab"
        // );

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

    @Delete(':id')
    @ApiOperation({
        summary: "Delete an occurrence by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        // Delete the taxon
        const occ = await this.occurrenceService.deleteByID(id);
        if (!occ) {
            throw new NotFoundException();
        }
    }
}


