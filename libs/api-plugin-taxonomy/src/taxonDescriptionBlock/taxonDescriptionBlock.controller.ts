import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonDescriptionBlockDto } from './dto/TaxonDescriptionBlockDto'
import { TaxonDescriptionBlockFindAllParams } from './dto/taxonDescriptionBlock-find-all.input.dto'
import { TaxonDescriptionStatementDto } from '../taxonDescriptionStatement/dto/TaxonDescriptionStatementDto';
import { TaxonDto } from '../taxon/dto/TaxonDto';
import { ImageDto } from '../../../api-plugin-image/src/image/dto/ImageDto';

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

    @Get('block/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlockDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon description statements using a taxon ID."
    })
    async findDescriptions(@Param('taxonID') taxonID: number): Promise<TaxonDescriptionBlockDto> {
        const block = await this.myService.findBlockForTaxon(taxonID)
        const dto = new TaxonDescriptionBlockDto(block)
        const statements = await block.descriptionStatements
        dto.descriptionStatements = statements.map(c => new TaxonDescriptionStatementDto(c))
        return dto
    }

    @Get('blockAndImages/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlockDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon description statements using a taxon ID."
    })
    async findBlockAndImages(@Param('taxonID') taxonID: number): Promise<TaxonDescriptionBlockDto> {
        const block = await this.myService.findBlockAndImagesForTaxon(taxonID)
        const dto = new TaxonDescriptionBlockDto(block)
        const statements = await block.descriptionStatements
        const taxon = await block.taxon
        dto.taxon = new TaxonDto(taxon)
        const images = await taxon.images
        dto.images = images.map(c => new ImageDto(c))
        dto.descriptionStatements = statements.map(c => new TaxonDescriptionStatementDto(c))
        return dto
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

}
