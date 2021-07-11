import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonDescriptionStatementDto } from './dto/TaxonDescriptionStatementDto'
import { TaxonDescriptionStatementFindAllParams } from './dto/taxonDescriptionStatement-find-all.input.dto'

@ApiTags('TaxonDescriptionStatement')
@Controller('taxonDescriptionStatement')
export class TaxonDescriptionStatementController {
    constructor(private readonly myService: TaxonDescriptionStatementService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatementDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon description Statements."
    })
    async findAll(@Query() findAllParams: TaxonDescriptionStatementFindAllParams): Promise<TaxonDescriptionStatementDto[]> {
        const descriptions = await this.myService.findAll(findAllParams)
        const dtos = descriptions.map(async (c) => {
            const description = new TaxonDescriptionStatementDto(c)
            return description
        });
        return Promise.all(dtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatementDto })
    @ApiOperation({
        summary: "Retrieve a taxon description Statement by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonDescriptionStatementDto> {
        const description = await this.myService.findByID(id)
        const dto = new TaxonDescriptionStatementDto(description)
        return dto
    }

}
