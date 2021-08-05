import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonService } from './taxon.service';
import { ApiProperty, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
    TaxonDto
} from './dto/TaxonDto';
import { TaxonFindAllParams } from './dto/taxon-find-all.input.dto';
import { TaxonFindNamesParams } from './dto/taxon-find-names.input.dto';

@ApiTags('Taxon')
@Controller('taxon')
export class TaxonController {
    constructor(private readonly taxons: TaxonService) { }
    public static taxaAuthorityID = 1  // default taxa authority ID

    // The default controller fetches all of the records
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxons.  The list can be narrowed by taxon IDs and/or a taxa authority."
    })
    async findAll(@Query() findAllParams: TaxonFindAllParams): Promise<TaxonDto[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonDto(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    // Get a list of all the scientific names
    @Get('scientificNames')
    @ApiResponse({ status: HttpStatus.OK, type: String })
    @ApiOperation({
        summary: "Retrieve a list of scientific names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findAllScientificNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<string[]> {
        const taxons = await this.taxons.findAllScientificNames(findNamesParams)
        const names = taxons.map(async (c) => {
            return c.scientificName
        });
        return Promise.all(names)
    }

    // Get a list of all the scientific names
    @Get('scientificNamesPlusAuthors')
    @ApiResponse({ status: HttpStatus.OK, type: String })
    @ApiOperation({
        summary: "Retrieve a list of scientific names and authors.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findAllScientificNamesPlusAuthors(@Query() findNamesParams: TaxonFindNamesParams): Promise<string[]> {
        const taxons = await this.taxons.findAllScientificNamesPlusAuthors(findNamesParams)
        const names = taxons.map(async (c) => {
            return c.scientificName + (c.author? " - " + c.author : "")
        });
        return Promise.all(names)
    }

    // The scientificName controller finds using a scientific name
    @Get('scientificName/:scientificName')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    @ApiOperation({
        summary: "Retrieve a scientific name."
    })
    async findByScientificName(@Param('scientificName') sciname: string, @Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonDto> {
        const taxons = await this.taxons.findByScientificName(sciname, findNamesParams)
        const dto = new TaxonDto(taxons[0])
        return dto
    }

    @Get(':taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    @ApiOperation({
        summary: "Find a taxon by the taxonID"
    })
    async findByTID(@Param('taxonid') id: number): Promise<TaxonDto> {
        const taxon = await this.taxons.findByTID(id)
        const dto = new TaxonDto(taxon)
        return dto
    }

}
