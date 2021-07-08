import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonDescriptionBlock } from './dto/TaxonDescriptionBlock'
import { TaxonDescriptionBlockFindAllParams } from './dto/taxonDescriptionBlock-find-all.input.dto'

@ApiTags('TaxonDescriptionBlock')
@Controller('TaxonDescriptionBlock')
export class TaxonDescriptionBlockController {
    constructor(private readonly taxons: TaxonDescriptionBlockService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlock, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon description blocks."
    })
    async findAll(@Query() findAllParams: TaxonDescriptionBlockFindAllParams): Promise<TaxonDescriptionBlock[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonDescriptionBlock(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionBlock })
    @ApiOperation({
        summary: "Retrieve a taxon description block by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonDescriptionBlock> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonDescriptionBlock(taxon)
        return dto
    }

}
