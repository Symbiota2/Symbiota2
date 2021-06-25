import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonomicEnumTreeService } from './taxonomicEnumTree.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
    TaxonomicEnumTreeDto
} from './dto/TaxonomicEnumTreeDto';
import { TaxonomicEnumTreeFindAllParams } from './dto/taxonomicEnumTree-find-all.input.dto';
import { TaxonDto } from '../taxon/dto/TaxonDto';

@ApiTags('TaxonomicEnumTree')
@Controller('taxonomicEnumTree')
export class TaxonomicEnumTreeController {
    constructor(private readonly myService: TaxonomicEnumTreeService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve all of the TaxonomicEnumTreeDto records"
    })
    async findAll(@Query() findAllParams: TaxonomicEnumTreeFindAllParams): Promise<TaxonomicEnumTreeDto[]> {
        const taxons = await this.myService.findAll(findAllParams);
        const taxonDtos = taxons.map(async (c) => {
            //const mytaxon = await c.taxon;
            //const myparent = await c.parentTaxon;
            const taxon = new TaxonomicEnumTreeDto(c);
            return taxon;
        });
        return Promise.all(taxonDtos);
    }


    @Get('ancestorTaxons/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    @ApiOperation({
        summary: "Retrieve all of the ancestor taxons for a given taxon ID."
    })
    async findAncestorTaxons(@Param('taxonID') taxonid: string, @Query() findAllParams: TaxonomicEnumTreeFindAllParams): Promise<TaxonDto[]> {
        const taxons = await this.myService.findAncestors(taxonid, findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const parentTaxon = await c.parentTaxon
            const taxon = new TaxonomicEnumTreeDto(c)
            return new TaxonDto(parentTaxon)
        })
        return Promise.all(taxonDtos)
    }

    @Get('ancestors/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto })
    @ApiOperation({
        summary: "Retrieve the enum tree records for a given taxon ID."
    })
    async findAncestors(@Param('taxonID') taxonid: string, @Query() findAllParams: TaxonomicEnumTreeFindAllParams): Promise<TaxonomicEnumTreeDto[]> {
        const taxons = await this.myService.findAncestors(taxonid, findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const parentTaxon = await c.parentTaxon
            const taxon = new TaxonomicEnumTreeDto(c)
            taxon.parent = new TaxonDto(parentTaxon)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get('descendants/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto })
    @ApiOperation({
        summary: "Get the descendent enum tree records for a given taxon ID (and optional taxonomic authority id)."
    })
    async findDescendants(@Param('taxonID') taxonid: string, @Query() findAllParams: TaxonomicEnumTreeFindAllParams): Promise<TaxonomicEnumTreeDto[]> {
        const taxons = await this.myService.findDescendants(taxonid, findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonomicEnumTreeDto(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto })
    @ApiOperation({
        summary: "Find an enum tree record by taxon ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonomicEnumTreeDto> {
        const taxon = await this.myService.findByID(id)
        const dto = new TaxonomicEnumTreeDto(taxon)
        return dto
    }

}
