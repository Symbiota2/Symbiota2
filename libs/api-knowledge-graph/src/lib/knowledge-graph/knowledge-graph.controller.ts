import {
    BadRequestException,
    Controller, Delete, ForbiddenException,
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
import { TaxonDto } from '../../../../api-plugin-taxonomy/src/taxon/dto/TaxonDto';

@ApiTags('Knowledge Graph')
@Controller('knowledge-graph')
export class KnowledgeGraphController {

    constructor(
        @InjectQueue(QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH)
        private readonly kgQueue: Queue<KnowledgeGraphGenerateJob>,
        private readonly kgService: KnowledgeGraphService) { }

    @Get('')
    @ApiOperation({ summary: 'Retrieve the list of Knowledge Graphs for this portal' })
    @ApiResponse({ status: HttpStatus.OK, type: KnowledgeGraph, isArray: true })
    async getGraphs(): Promise<KnowledgeGraph[]> {
        const graphs = await this.kgService.listGraphs();

        return graphs.map((a) => {
            //const { name, ...graph } = a;
            return new KnowledgeGraph({
                name: a.name,
                updatedAt: a.updatedAt,
                size: a.size
            })
        })
    }

    @Get(':graphName')
    @ApiOperation({ summary: 'Download the knowledge graph for a given name' })
    @ApiResponse({
        status: HttpStatus.OK,
        content: {
            'application/json': {
                schema: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    async getGraphByName(@Param('graphName') name: string, @Res() res: Response): Promise<void> {
        const graphStream: NodeJS.ReadableStream = await this.kgService.getKnowledgeGraph(name);
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

    @Put(':graphName')
    @ApiOperation({ summary: 'Build or rebuild a knowledge graph' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createKnowledgeGraph(
        @Req() req: AuthenticatedRequest,
        @Param('graphName') name: string): Promise<void> {

        const [isSuperAdmin] = await Promise.all([
            TokenService.isSuperAdmin(req.user)
        ]);

        if (!(isSuperAdmin)) {
            throw new ForbiddenException()
        }

        if (await this.jobIsRunning()) {
            throw new BadRequestException(
                `A knowledge graph job is already running`
            )
        }

        await this.kgQueue.add({
            publish: true,
            graphName: name,
            userID: req.user?.uid
        })

    }

    private async jobIsRunning(): Promise<boolean> {
        const jobs = await this.kgQueue.getJobs(['active', 'waiting']);
        //const matchingJobs = jobs.filter((j) => j.data.collectionID === collectionID);
        return jobs.length > 0;
    }

    @Delete(':graphName')
    @ApiOperation({ summary: 'Delete a knowledge graph' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteKnowledgeGraph(
        @Req() req: AuthenticatedRequest,
        @Param('graphName') name: string): Promise<void> {

        const [isSuperAdmin] = await Promise.all([
            TokenService.isSuperAdmin(req.user)
        ]);

        if (!(isSuperAdmin)) {
            throw new ForbiddenException()
        }

        await this.kgService.deleteKnowledgeGraph(name);

    }
}
