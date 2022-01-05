import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonomicUnitService } from './taxonomicUnit.service';
import { ApiProperty, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
    TaxonomicUnit
} from './dto/TaxonomicUnit';
import { TaxonomicUnitFindAllParams } from './dto/taxonomicUnit-find-all.input.dto';

@ApiTags('TaxonomicUnit')
@Controller('taxonomicUnit')
export class TaxonomicUnitController {
    constructor(private readonly taxons: TaxonomicUnitService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicUnit, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxonomic units."
    })
    async findAll(@Query() findAllParams: TaxonomicUnitFindAllParams): Promise<TaxonomicUnit[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonomicUnit(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get('kingdomNames')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of kingdom names."
    })
    async findKingdomNames(): Promise<string[]> {
        const raw = await this.taxons.findKingdomNames()
        const result = raw.map((name) => {
            return name.kingdomName
        })
        return result
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicUnit })
    @ApiOperation({
        summary: "Retrieve a taxonomic unit by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonomicUnit> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonomicUnit(taxon)
        return dto
    }

}
