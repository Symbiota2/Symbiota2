import {
    BadRequestException,
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
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_ID_GENERATE_DWC } from './queues/dwc-generate.queue';
import { Queue } from 'bull';
import { DwcGenerateJob } from './queues/dwc-generate.processor';

@ApiTags('Darwin Core Archives')
@Controller('dwc')
export class DwCController {
    constructor(
        @InjectQueue(QUEUE_ID_GENERATE_DWC) private readonly dwcQueue: Queue<DwcGenerateJob>,
        private readonly dwc: DwCService) { }

    @Get('collections')
    @ApiOperation({ summary: 'Retrieve the list of publicly-available Darwin Core Archives for this portal' })
    async getPublishedCollections(): Promise<CollectionArchive[]> {
        const archives = await this.dwc.listArchives();

        return archives.map((a) => {
            const { objectKey, ...archive } = a;
            return new CollectionArchive({
                archive: basename(objectKey),
                ...archive,
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
            if (await this.jobIsRunning(params.collectionID)) {
                throw new BadRequestException(
                    `A job for collectionID ${params.collectionID} is already running`
                );
            }

            await this.dwcQueue.add({
                collectionID: params.collectionID,
                publish: query.publish,
                userID: req.user.uid
            });
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

    private async jobIsRunning(collectionID: number): Promise<boolean> {
        const jobs = await this.dwcQueue.getJobs(['active', 'waiting']);
        const matchingJobs = jobs.filter((j) => j.data.collectionID === collectionID);
        return matchingJobs.length > 0;
    }
}
