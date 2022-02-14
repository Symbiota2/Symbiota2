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
import { CollectionGraph } from './dto/collection-graph';
import { CollectionIDParam } from './dto/collection-id-param';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateGraphQuery } from './dto/update-graph-query';
import { basename } from 'path';
import { Response } from 'express';
import {
    AuthenticatedRequest,
    JwtAuthGuard,
    TokenService
} from '@symbiota2/api-auth';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { KnowledgeGraphService } from './knowledge-graph.service';
import { QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH } from './queues/knowledge-graph-generate.queue';
import { KnowledgeGraphGenerateJob } from './queues/knowledge-graph-generate.processor';

@ApiTags('Knowledge Graph')
@Controller('knowledge-graph')
export class KnowledgeGraphController {
    constructor(
        @InjectQueue(QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH) private readonly kgQueue: Queue<KnowledgeGraphGenerateJob>,
        private readonly kgService: KnowledgeGraphService) { }

    @Get('collections')
    @ApiOperation({ summary: 'Retrieve the list of publicly-available Knowledge Graphs for this portal' })
    async getPublishedCollections(): Promise<CollectionGraph[]> {
        const graphs = await this.kgService.listGraphs();

        return graphs.map((a) => {
            const { objectKey, ...graph } = a;
            return new CollectionGraph({
                graph: basename(objectKey),
                ...graph,
            });
        });
    }

    @Get('collections/:collectionID')
    @ApiOperation({ summary: 'Retrieve the publicly-available knowledge graph for a given collection' })
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
    async getGraphByID(@Param() params: CollectionIDParam, @Res() res: Response): Promise<void> {
        const graphStream: NodeJS.ReadableStream = await this.kgService.getCollectionGraph(params.collectionID);
        if (!graphStream) {
            throw new NotFoundException();
        }

        graphStream.pipe(res);

        return new Promise((resolve, reject) => {
            let error = null;
            graphStream.on('error', (e) => {
                error = e;
                reject(e)
            });
            graphStream.on('end', () => {
                if (!error) {
                    resolve();
                }
            });
        });
    }

    // TODO: Return graph generation date

    @Put('collections/:collectionID')
    @ApiOperation({ summary: 'Create or publish a knowledge graph for the given collection' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createCollectionGraph(
        @Req() req: AuthenticatedRequest,
        @Param() params: CollectionIDParam,
        @Query() query: UpdateGraphQuery): Promise<void> {

        const [isSuperAdmin, isCollectionAdmin] = await Promise.all([
            TokenService.isSuperAdmin(req.user),
            TokenService.isCollectionAdmin(req.user, params.collectionID)
        ]);

        if (!(isSuperAdmin || isCollectionAdmin)) {
            throw new ForbiddenException();
        }

        const collectionExists = await this.kgService.collectionGraphExists(
            params.collectionID
        );

        if (!collectionExists || query.refresh) {
            if (await this.jobIsRunning(params.collectionID)) {
                throw new BadRequestException(
                    `A knowledge graph job for collectionID ${params.collectionID} is already running`
                );
            }

            await this.kgQueue.add({
                collectionID: params.collectionID,
                publish: query.publish,
                userID: req.user.uid
            });
        }
        else if (collectionExists) {
            if (query.publish) {
                await this.kgService.publishCollectionGraph(params.collectionID);
            }
            else {
                await this.kgService.unpublishCollectionGraph(params.collectionID);
            }
        }
        else {
            throw new NotFoundException("Graph not found")
        }
    }

    private async jobIsRunning(collectionID: number): Promise<boolean> {
        const jobs = await this.kgQueue.getJobs(['active', 'waiting']);
        const matchingJobs = jobs.filter((j) => j.data.collectionID === collectionID);
        return matchingJobs.length > 0;
    }
}
