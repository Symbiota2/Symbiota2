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
import { KnowledgeGraph } from './dto/knowledge-graph';
import { KnowledgeGraphIdParam } from './dto/knowledge-graph-id-param';
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
    graphID : number = 1  // Dummy placeholder at present

    constructor(
        @InjectQueue(QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH)
        private readonly kgQueue: Queue<KnowledgeGraphGenerateJob>,
        private readonly kgService: KnowledgeGraphService) { }

    @Get('')
    @ApiOperation({ summary: 'Retrieve the list of publicly-available Knowledge Graphs for this portal' })
    async getPublishedGraphs(): Promise<KnowledgeGraph[]> {
        const graphs = await this.kgService.listGraphs();

        return graphs.map((a) => {
            const { objectKey, ...graph } = a;
            return new KnowledgeGraph({
                graph: basename(objectKey),
                ...graph,
            });
        });
    }

    @Get(':graphID')
    @ApiOperation({ summary: 'Retrieve the publicly-available knowledge graph for a given graphID' })
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
    async getGraphByID(@Param() params: KnowledgeGraphIdParam, @Res() res: Response): Promise<void> {
        const graphStream: NodeJS.ReadableStream = await this.kgService.getKnowledgeGraph(params.graphID);
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


    @Put('')
    @ApiOperation({ summary: 'Create or publish a knowledge graph' })
    //@ApiBearerAuth()
    //@UseGuards(JwtAuthGuard)
    async createKnowledgeGraph(
        @Req() req: AuthenticatedRequest,
        @Query() query: UpdateGraphQuery): Promise<void> {

        /*
        const [isSuperAdmin] = await Promise.all([
            TokenService.isSuperAdmin(req.user)
        ]);

        if (!(isSuperAdmin)) {
            throw new ForbiddenException();
        }
         */

        const knowledgeGraphExists = await this.kgService.knowledgeGraphExists(this.graphID);

        if (!knowledgeGraphExists || query.refresh) {
            if (await this.jobIsRunning()) {
                throw new BadRequestException(
                    `A knowledge graph job is already running`
                );
            }

            await this.kgQueue.add({
                publish: query.publish,
                graphID: this.graphID,
                userID: req.user?.uid || 1
            });
        }
        else if (knowledgeGraphExists) {
            if (query.publish) {
                await this.kgService.publishKnowledgeGraph(this.graphID);
            }
            else {
                await this.kgService.unpublishKnowledgeGraph(this.graphID);
            }
        }
        else {
            throw new NotFoundException("Graph not found")
        }
    }

    private async jobIsRunning(): Promise<boolean> {
        const jobs = await this.kgQueue.getJobs(['active', 'waiting']);
        //const matchingJobs = jobs.filter((j) => j.data.collectionID === collectionID);
        return jobs.length > 0;
    }
}
