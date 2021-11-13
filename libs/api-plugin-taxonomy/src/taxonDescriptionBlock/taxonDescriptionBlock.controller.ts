import {
    Controller,
    Get,
    Param,
    Query,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    Delete,
    NotFoundException,
    Patch,
    UseGuards, SerializeOptions, ParseArrayPipe, Req, ForbiddenException, InternalServerErrorException
} from '@nestjs/common';
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TaxonDescriptionBlockDto } from './dto/TaxonDescriptionBlockDto'
import { TaxonDescriptionBlockFindAllParams } from './dto/taxonDescriptionBlock-find-all.input.dto'
import { TaxonDescriptionStatementDto } from '../taxonDescriptionStatement/dto/TaxonDescriptionStatementDto';
import { TaxonDto } from '../taxon/dto/TaxonDto';
import { ImageDto } from '../../../api-plugin-image/src/image/dto/ImageDto';
import {
    AuthenticatedRequest,
    JwtAuthGuard,
    TokenService
} from '@symbiota2/api-auth';
import { TaxonDescriptionBlock } from '@symbiota2/api-database';
import { CollectionInputDto, ProtectCollection, UpdateCollectionInputDto } from '@symbiota2/api-plugin-collection';
import { TaxonDescriptionBlockInputDto } from './dto/TaxonDescriptionBlockInputDto';
import { OccurrenceInputDto } from '../../../api-plugin-occurrence/src/occurrence/dto/occurrence-input.dto';

@ApiTags('TaxonDescriptionBlock')
@Controller('taxonDescriptionBlock')
export class TaxonDescriptionBlockController {
    constructor(private readonly myService: TaxonDescriptionBlockService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlockDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon description blocks."
    })
    async findAll(@Query() findAllParams: TaxonDescriptionBlockFindAllParams): Promise<TaxonDescriptionBlockDto[]> {
        const blocks = await this.myService.findAll(findAllParams)
        const dtos = blocks.map(async (c) => {
            const block = new TaxonDescriptionBlockDto(c)
            return block
        });
        return Promise.all(dtos)
    }

    @Get('blocks/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlockDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon description blocks and statements using a taxon ID."
    })
    async findDescriptions(@Param('taxonID') taxonID: number): Promise<TaxonDescriptionBlockDto[]> {
        const blocks = await this.myService.findBlocksForTaxon(taxonID)
        const dtos = blocks.map(async (block) => {
            const dto = new TaxonDescriptionBlockDto(block)
            const statements = await block.descriptionStatements
            dto.descriptionStatements = statements.map(c => new TaxonDescriptionStatementDto(c))
            return dto
        })
        return Promise.all(dtos)
    }

    @Get('blocksAndImages/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlockDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon blocks, descriptions, and images using a taxon ID."
    })
    async findBlocksAndImages(@Param('taxonID') taxonID: number): Promise<TaxonDescriptionBlockDto[]> {
        const blocks = await this.myService.findBlocksAndImagesForTaxon(taxonID)
        const dtos = blocks.map(async (block) => {
            const dto = new TaxonDescriptionBlockDto(block)
            const statements = await block.descriptionStatements
            const taxon = await block.taxon
            dto.taxon = new TaxonDto(taxon)
            const images = await taxon.images
            dto.images = images.map(c => new ImageDto(c))
            dto.descriptionStatements = statements.map(c => new TaxonDescriptionStatementDto(c))
            return dto
        })
        return Promise.all(dtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlockDto })
    @ApiOperation({
        summary: "Retrieve a taxon description block by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonDescriptionBlockDto> {
        const block = await this.myService.findByID(id)
        const dto = new TaxonDescriptionBlockDto(block)
        return dto
    }

    @Post()
    @ApiOperation({
        summary: "Create a new description block"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ type: TaxonDescriptionBlockDto })
    //@SerializeOptions({ groups: ['single'] })
    @ApiBody({ type: TaxonDescriptionBlockInputDto, isArray: true })
    /**
    @see - @link TaxonDescriptionBlockInputDto
     **/
    async create(@Req() request: AuthenticatedRequest, @Body(new ParseArrayPipe({ items: TaxonDescriptionBlockInputDto })) data: TaxonDescriptionBlockInputDto[]): Promise<TaxonDescriptionBlockDto> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.myService.create(data[0])
        const dto = new TaxonDescriptionBlockDto(block)
        return dto
    }
    // Could not get the non-list version to see the body, it was always undefined no matter what, so put it in a list!
    async create2(@Body() data: TaxonDescriptionBlockInputDto): Promise<TaxonDescriptionBlockDto> {
        const block = await this.myService.create(data)
        const dto = new TaxonDescriptionBlockDto(block)
        return dto
    }

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isProfileEditor = TokenService.isTaxonProfileEditor(request.user)
        return isSuperAdmin || isProfileEditor
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a taxon description block by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.myService.deleteByID(id);
        if (!block) {
            throw new NotFoundException("Block not found");
        }

    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a taxon description block by ID"
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    //@ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlock })
    @ApiBody({ type: TaxonDescriptionBlockInputDto, isArray: true })
    //@SerializeOptions({ groups: ['single'] })
    async updateByID(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Body(new ParseArrayPipe({ items: TaxonDescriptionBlockInputDto })) data: TaxonDescriptionBlockInputDto[]
    ): Promise<TaxonDescriptionBlock> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.myService.updateByID(id, data[0])
        if (!block) {
            throw new NotFoundException()
        }
        return block
    }
}
