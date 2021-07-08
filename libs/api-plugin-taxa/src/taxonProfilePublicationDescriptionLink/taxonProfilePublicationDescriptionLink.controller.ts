import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonProfilePublicationDescriptionLinkService } from './taxonProfilePublicationDescriptionLink.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonProfilePublicationDescriptionLink } from './dto/TaxonProfilePublicationDescriptionLink'
import { TaxonProfilePublicationDescriptionLinkFindAllParams } from './dto/taxonProfilePublicationDescriptionLink-find-all.input.dto'

@ApiTags('TaxonProfilePublicationDescriptionLink')
@Controller('taxonProfilePublicationDescriptionLink')
export class TaxonProfilePublicationDescriptionLinkController {
    constructor(private readonly taxons: TaxonProfilePublicationDescriptionLinkService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonProfilePublicationDescriptionLink, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon publication links."
    })
    async findAll(@Query() findAllParams: TaxonProfilePublicationDescriptionLinkFindAllParams): Promise<TaxonProfilePublicationDescriptionLink[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonProfilePublicationDescriptionLink(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonProfilePublicationDescriptionLink })
    @ApiOperation({
        summary: "Retrieve a taxon  link by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonProfilePublicationDescriptionLink> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonProfilePublicationDescriptionLink(taxon)
        return dto
    }

}
