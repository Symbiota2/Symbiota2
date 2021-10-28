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
    UseGuards, SerializeOptions, ParseArrayPipe
} from '@nestjs/common';
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TaxonDescriptionBlockDto } from './dto/TaxonDescriptionBlockDto'
import { TaxonDescriptionBlockFindAllParams } from './dto/taxonDescriptionBlock-find-all.input.dto'
import { TaxonDescriptionStatementDto } from '../taxonDescriptionStatement/dto/TaxonDescriptionStatementDto';
import { TaxonDto } from '../taxon/dto/TaxonDto';
import { ImageDto } from '../../../api-plugin-image/src/image/dto/ImageDto';
import { JwtAuthGuard } from '@symbiota2/api-auth';
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

    //@Post(':taxonID:creatorID')
    @Post()
    @ApiOperation({
        summary: "Create a new description block"
    })
    @HttpCode(HttpStatus.OK)
    //@UseGuards(JwtAuthGuard)
    //@ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlockDto })
    //@SerializeOptions({ groups: ['single'] })
    @ApiBody({ type: TaxonDescriptionBlockInputDto, isArray: true })
    /**
    @see - @link TaxonDescriptionBlockDto
     **/
    //async create(@Param('taxonID') taxonID: number, @Param('creatorID') creatorID: number, @Body() data: TaxonDescriptionBlockInputDto): Promise<TaxonDescriptionBlockDto> {
    async create(@Body(new ParseArrayPipe({ items: TaxonDescriptionBlockInputDto })) data: TaxonDescriptionBlockInputDto[]): Promise<TaxonDescriptionBlockDto> {
        console.log('taxon id and uid ' + (typeof data) + data[0].taxonID + data[0].creatorUID)
        //if (taxonID != null) data.taxonID = taxonID
        //if (creatorID != null) data.creatorUID = creatorID
        if (data[0].taxonID == null) data[0].taxonID = 2
        if (data[0].creatorUID == null) data[0].creatorUID = 1
        const block = await this.myService.create(data[0])
        const dto = new TaxonDescriptionBlockDto(block)
        return dto
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a taxon description block by ID"
    })
    @ProtectCollection('id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Param('id') id: number): Promise<void> {
        const block = await this.myService.deleteByID(id);
        if (!block) {
            throw new NotFoundException();
        }
    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a specimen collection by ID"
    })
    //@ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlock })
    @SerializeOptions({ groups: ['single'] })
    async updateByID(@Param('id') id: number, @Body() data: TaxonDescriptionBlock): Promise<TaxonDescriptionBlock> {
        console.log("data is " + data.caption)
        const block = await this.myService.updateByID(id, data)
        if (!block) {
            throw new NotFoundException()
        }

        return block
    }
}
