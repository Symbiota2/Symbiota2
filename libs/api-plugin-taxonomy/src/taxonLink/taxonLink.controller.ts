import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonLinkService } from './taxonLink.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonLink } from './dto/TaxonLink'
import { TaxonLinkFindAllParams } from './dto/taxonLink-find-all.input.dto'

@ApiTags('TaxonLink')
@Controller('taxonLink')
export class TaxonLinkController {
    constructor(private readonly taxons: TaxonLinkService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonLink, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon links."
    })
    async findAll(@Query() findAllParams: TaxonLinkFindAllParams): Promise<TaxonLink[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonLink(c)
            return taxon
        })
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonLink })
    @ApiOperation({
        summary: "Retrieve a taxon  link by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonLink> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonLink(taxon)
        return dto
    }

}
