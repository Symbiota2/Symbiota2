import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonomicAuthorityService } from './taxonomicAuthority.service';
import { ApiProperty, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
    TaxonomicAuthority
} from './dto/TaxonomicAuthority';
import { TaxonomicAuthorityFindAllParams } from './dto/taxonomicAuthority-find-all.input.dto';

@ApiTags('TaxonomicAuthority')
@Controller('taxonomicAuthority')
export class TaxonomicAuthorityController {
    constructor(private readonly taxons: TaxonomicAuthorityService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicAuthority, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxonomic authorities."
    })
    async findAll(@Query() findAllParams: TaxonomicAuthorityFindAllParams): Promise<TaxonomicAuthority[]> {
        const taxons = await this.taxons.findAll(findAllParams);
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonomicAuthority(c);
            return taxon;
        });
        return Promise.all(taxonDtos);
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicAuthority })
    @ApiOperation({
        summary: "Retrieve a taxonomic authority by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonomicAuthority> {
        const taxon = await this.taxons.findByID(id);
        const dto = new TaxonomicAuthority(taxon);
        return dto;
    }

}
