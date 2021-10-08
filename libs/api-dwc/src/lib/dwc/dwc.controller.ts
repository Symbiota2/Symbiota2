import {
    Controller,
    Get, HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Put,
    Query, Res
} from '@nestjs/common';
import { PublishedCollection } from './dto/published-collection';
import { DwCService } from './dwc.service';
import { CollectionIDParam } from './dto/collection-id-param';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateArchiveQuery } from './dto/update-archive-query';
import { basename } from 'path';
import { Response } from 'express';
import { strict } from 'assert';

@ApiTags('Darwin Core Archives')
@Controller('dwc')
export class DwCController {
    constructor(private readonly dwc: DwCService) { }

    @Get('collections')
    @ApiOperation({ summary: 'Retrieve the list of publicly-available Darwin Core Archives for this portal' })
    async getPublishedCollections(): Promise<PublishedCollection[]> {
        const archives = await this.dwc.listPublishedCollectionArchives();
        return archives.map((a) => {
            return new PublishedCollection({
                collectionID: a.collectionID,
                archive: basename(a.objectKey)
            });
        });
    }

    @Get('collections/:collectionID')
    @ApiOperation({ summary: 'Retrieve the publicly-available Darwin Core Archive for a given collection' })
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
    async getArchiveByID(@Param() params: CollectionIDParam, @Res() res: Response): Promise<void> {
        const archiveStream = await this.dwc.getCollectionArchive(params.collectionID);
        if (!archiveStream) {
            throw new NotFoundException();
        }

        archiveStream.pipe(res);

        return new Promise((resolve, reject) => {
            let error = null;
            archiveStream.on('error', (e) => {
                error = e;
                reject(e)
            });
            archiveStream.on('end', () => {
                if (!error) {
                    resolve();
                }
            });
        });
    }

    @Put('collections/:collectionID')
    @ApiOperation({ summary: 'Create or publish a Darwin Core Archive for the given collection' })
    // @ProtectCollection('collectionID')
    async createCollectionArchive(@Param() params: CollectionIDParam, @Query() query: UpdateArchiveQuery): Promise<void> {
        const collectionExists = await this.dwc.collectionArchiveExists(params.collectionID);

        console.log(query);
        if (!collectionExists || query.refresh) {
            await this.dwc.createArchiveForCollection(
                params.collectionID,
                { publish: query.publish }
            );
        }
        else if (query.publish) {
            await this.dwc.publishCollectionArchive(params.collectionID);
        }
        else {
            await this.dwc.unpublishCollectionArchive(params.collectionID);
        }
    }
}
