import {
    Controller, ForbiddenException,
    Get, HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Put,
    Query, Req, Res, UseGuards
} from '@nestjs/common';
import { CollectionArchive } from './dto/collection-archive';
import { DwCService } from './dwc.service';
import { CollectionIDParam } from './dto/collection-id-param';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateArchiveQuery } from './dto/update-archive-query';
import { basename } from 'path';
import { Response } from 'express';
import {
    AuthenticatedRequest,
    JwtAuthGuard,
    TokenService
} from '@symbiota2/api-auth';

@ApiTags('Darwin Core Archives')
@Controller('dwc')
export class DwCController {
    constructor(private readonly dwc: DwCService) { }

    @Get('collections')
    @ApiOperation({ summary: 'Retrieve the list of publicly-available Darwin Core Archives for this portal' })
    async getPublishedCollections(): Promise<CollectionArchive[]> {
        const archives = await this.dwc.listArchives();
        return archives.map((a) => {
            return new CollectionArchive({
                collectionID: a.collectionID,
                isPublic: a.isPublic,
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

    // TODO: Return archive generation date

    @Put('collections/:collectionID')
    @ApiOperation({ summary: 'Create or publish a Darwin Core Archive for the given collection' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createCollectionArchive(
        @Req() req: AuthenticatedRequest,
        @Param() params: CollectionIDParam,
        @Query() query: UpdateArchiveQuery): Promise<void> {

        const [isSuperAdmin, isCollectionAdmin] = await Promise.all([
            TokenService.isSuperAdmin(req.user),
            TokenService.isCollectionAdmin(req.user, params.collectionID)
        ]);

        if (!(isSuperAdmin || isCollectionAdmin)) {
            throw new ForbiddenException();
        }

        const collectionExists = await this.dwc.collectionArchiveExists(
            params.collectionID
        );

        if (!collectionExists || query.refresh) {
            await this.dwc.createArchiveForCollection(
                params.collectionID,
                { publish: query.publish }
            );
        }
        else if (collectionExists) {
            if (query.publish) {
                await this.dwc.publishCollectionArchive(params.collectionID);
            }
            else {
                await this.dwc.unpublishCollectionArchive(params.collectionID);
            }
        }
        else {
            throw new NotFoundException("Archive not found")
        }
    }
}
