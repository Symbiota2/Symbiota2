import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonResourceLinkService } from './taxonResourceLink.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
    TaxonResourceLink
} from './dto/TaxonResourceLink';
import {
    TaxonResourceLinkFindAllParams
} from './dto/taxonResourceLink-find-all.input.dto';

@ApiTags('TaxonResourceLink')
@Controller('taxonResourceLink')
export class TaxonResourceLinkController {
    constructor(private readonly taxons: TaxonResourceLinkService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonResourceLink, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon resource links."
    })
    async findAll(@Query() findAllParams: TaxonResourceLinkFindAllParams): Promise<TaxonResourceLink[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonResourceLink(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonResourceLink })
    @ApiOperation({
        summary: "Retrieve a taxon resource link by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonResourceLink> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonResourceLink(taxon)
        return dto
    }

}
