import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonProfilePublicationImageLinkService } from './taxonProfilePublicationImageLink.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonProfilePublicationImageLink } from './dto/TaxonProfilePublicationImageLink'
import { TaxonProfilePublicationImageLinkFindAllParams } from './dto/taxonProfilePublicationImageLink-find-all.input.dto'

@ApiTags('TaxonProfilePublicationImageLink')
@Controller('taxonProfilePublicationImageLink')
export class TaxonProfilePublicationImageLinkController {
    constructor(private readonly taxons: TaxonProfilePublicationImageLinkService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonProfilePublicationImageLink, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon publication links."
    })
    async findAll(@Query() findAllParams: TaxonProfilePublicationImageLinkFindAllParams): Promise<TaxonProfilePublicationImageLink[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonProfilePublicationImageLink(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonProfilePublicationImageLink })
    @ApiOperation({
        summary: "Retrieve a taxon  link by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonProfilePublicationImageLink> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonProfilePublicationImageLink(taxon)
        return dto
    }

}
