import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonomicStatusService } from './taxonomicStatus.service';
import { ApiProperty, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
    TaxonomicStatusDto
} from './dto/TaxonomicStatusDto';
import { TaxonomicStatusFindAllParams } from './dto/taxonomicStatus-find-all.input.dto';
import { TaxonomicStatus } from '@symbiota2/api-database';

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
            return taxonomicStatus
        })
        return Promise.all(dtos)
    }

    /*
    @Get(':authorityId')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto, isArray: true })
    @ApiOperation({
        summary: "Find all for a specific taxonomic authority id."
    })
    async findAllByAuthorityId(@Param('authorityId') authorityId: number, @Query() findAllParams: TaxonomicStatusFindAllParams): Promise<TaxonomicStatusDto[]> {
        const taxonomicStatii = await this.taxanomicStatusService.findAllByAuthorityId(authorityId,findAllParams);
        const dtos = taxonomicStatii.map(async (c) => {
            const taxonomicStatus = new TaxonomicStatusDto(c)
            return taxonomicStatus
        });
        return Promise.all(dtos)
    }
     */

    @Get(':taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto })
    @ApiOperation({
        summary: "Find a taxonomic status record for a given taxon id."
    })
    async findByID(@Param('taxonid') taxonid: number): Promise<TaxonomicStatusDto> {
        const taxonomicStatus = await this.taxanomicStatusService.findByID(taxonid);
        const dto = new TaxonomicStatusDto(taxonomicStatus);
        return dto;
        //return taxonomicStatus;
    }

    @Get('children/:taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto, isArray: true })
    @ApiOperation({
        summary: "Get the children for the given taxon id, optionally limit it to a specific taxonomic authority"
    })
    async findChildren(@Param('taxonid') taxonid: number, @Query() findAllParams: TaxonomicStatusFindAllParams): Promise<TaxonomicStatusDto[]> {
        const taxonomicStatii = await this.taxanomicStatusService.findChildren(taxonid, findAllParams)
        const taxonDtos = taxonomicStatii.map(async (c) => {
            const taxonomicStatus = new TaxonomicStatusDto(c);
            return taxonomicStatus;
        });
        return Promise.all(taxonDtos);
    }

}
