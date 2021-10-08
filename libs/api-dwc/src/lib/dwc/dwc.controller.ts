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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateArchiveQuery } from './dto/update-archive-query';
import { basename } from 'path';
import { Response } from 'express';
import { strict } from 'assert';

@ApiTags('Darwin Core')
@Controller('dwc')
export class DwCController {
    constructor(private readonly dwc: DwCService) { }

    @Get('collections')
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
