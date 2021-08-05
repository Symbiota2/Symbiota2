import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonomicStatusService } from './taxonomicStatus.service'
import { ApiProperty, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonomicStatusDto } from './dto/TaxonomicStatusDto'
import { TaxonomicStatusFindAllParams } from './dto/taxonomicStatus-find-all.input.dto'
import { TaxonomicStatus } from '@symbiota2/api-database'
import { TaxonDto } from '../taxon/dto/TaxonDto'

@ApiTags('TaxonomicStatus')
@Controller('taxonomicStatus')
export class TaxonomicStatusController {
    constructor(private readonly taxanomicStatusService: TaxonomicStatusService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatus, isArray: true })
    @ApiOperation({
        summary: "Find all of the taxonomic status records."
    })
    async findAll(@Query() findAllParams: TaxonomicStatusFindAllParams): Promise<TaxonomicStatusDto[]> {
        const taxonomicStatii = await this.taxanomicStatusService.findAll(findAllParams)
        const dtos = taxonomicStatii.map(async (c) => {
            const taxonomicStatus = new TaxonomicStatusDto(c)
            const taxon = await c.taxon
            taxonomicStatus.taxon = new TaxonDto(taxon)
            const parentTaxon = await c.parentTaxon
            taxonomicStatus.parent = new TaxonDto(parentTaxon)
            return taxonomicStatus
        })
        return Promise.all(dtos)
    }

    @Get(':taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto })
    @ApiOperation({
        summary: "Find a taxonomic status record for a given taxon id."
    })
    async findByID(@Param('taxonid') taxonid: number): Promise<TaxonomicStatusDto> {
        const taxonomicStatus = await this.taxanomicStatusService.findByID(taxonid)
        const dto = new TaxonomicStatusDto(taxonomicStatus)
        const taxon = await taxonomicStatus.taxon
        dto.taxon = new TaxonDto(taxon)
        const parentTaxon = await taxonomicStatus.parentTaxon
        dto.parent = new TaxonDto(parentTaxon)
        return dto
        //return taxonomicStatus;
    }

    @Get('synonyms/:taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto, isArray: true })
    @ApiOperation({
        summary: "Get the synonyms for the given taxon id, optionally limit it to a specific taxonomic authority"
    })
    async findSynonyms(@Param('taxonid') taxonid: number, @Query() findAllParams: TaxonomicStatusFindAllParams): Promise<TaxonomicStatusDto[]> {
        console.log("taxon id is " + taxonid)
        const taxonomicStatii = await this.taxanomicStatusService.findSynonyms(taxonid, findAllParams)
        const taxonDtos = taxonomicStatii.map(async (c) => {
            const taxonomicStatus = new TaxonomicStatusDto(c)
            const taxon = await c.taxon
            taxonomicStatus.taxon = new TaxonDto(taxon)
            // No need to get the parent
            //const parentTaxon = await c.parentTaxon
            //taxonomicStatus.parent = new TaxonDto(parentTaxon)
            return taxonomicStatus
        });
        return Promise.all(taxonDtos)
    }

    @Get('children/:taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto, isArray: true })
    @ApiOperation({
        summary: "Get the children for the given taxon id, optionally limit it to a specific taxonomic authority"
    })
    async findChildren(@Param('taxonid') taxonid: number, @Query() findAllParams: TaxonomicStatusFindAllParams): Promise<TaxonomicStatusDto[]> {
        const taxonomicStatii = await this.taxanomicStatusService.findChildren(taxonid, findAllParams)
        const taxonDtos = taxonomicStatii.map(async (c) => {
            const taxonomicStatus = new TaxonomicStatusDto(c)
            const taxon = await c.taxon
            taxonomicStatus.taxon = new TaxonDto(taxon)
            // No need to get the parent
            //const parentTaxon = await c.parentTaxon
            //taxonomicStatus.parent = new TaxonDto(parentTaxon)
            return taxonomicStatus
        });
        return Promise.all(taxonDtos)
    }

}
