import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { TaxonDescriptionStatement } from './dto/TaxonDescriptionStatement'
import { TaxonDescriptionStatementFindAllParams } from './dto/taxonDescriptionStatement-find-all.input.dto'

@ApiTags('TaxonDescriptionStatement')
@Controller('TaxonDescriptionStatement')
export class TaxonDescriptionStatementController {
    constructor(private readonly taxons: TaxonDescriptionStatementService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatement, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon description Statements."
    })
    async findAll(@Query() findAllParams: TaxonDescriptionStatementFindAllParams): Promise<TaxonDescriptionStatement[]> {
        const taxons = await this.taxons.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonDescriptionStatement(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatement })
    @ApiOperation({
        summary: "Retrieve a taxon description Statement by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonDescriptionStatement> {
        const taxon = await this.taxons.findByID(id)
        const dto = new TaxonDescriptionStatement(taxon)
        return dto
    }

}
