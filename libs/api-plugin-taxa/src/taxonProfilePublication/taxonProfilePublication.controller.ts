import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonProfilePublicationService } from './taxonProfilePublication.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonProfilePublication } from './dto/TaxonProfilePublication'
import { TaxonProfilePublicationFindAllParams } from './dto/taxonProfilePublication-find-all.input.dto'

@ApiTags('TaxonProfilePublication')
@Controller('taxonProfilePublication')
export class TaxonProfilePublicationController {
    constructor(private readonly taxons: TaxonProfilePublicationService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonProfilePublication, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon profile publications."
    })
    async findAll(@Query() findAllParams: TaxonProfilePublicationFindAllParams): Promise<TaxonProfilePublication[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonProfilePublication(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonProfilePublication })
    @ApiOperation({
        summary: "Retrieve a taxon profile publication by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonProfilePublication> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonProfilePublication(taxon)
        return dto
    }

}
