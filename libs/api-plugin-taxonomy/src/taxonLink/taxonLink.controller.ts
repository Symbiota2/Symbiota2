import {
    Controller,
    Get,
    Param,
    Query,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    Delete,
    NotFoundException,
    Patch,
    UseGuards, Req, ForbiddenException
} from '@nestjs/common';
import { TaxonLinkService } from './taxonLink.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaxonLink } from './dto/TaxonLink'
import { TaxonLinkFindAllParams } from './dto/taxonLink-find-all.input.dto'
import { AuthenticatedRequest, JwtAuthGuard } from '@symbiota2/api-auth';

@ApiTags('TaxonLink')
@Controller('taxonLink')
export class TaxonLinkController {
    constructor(private readonly myService: TaxonLinkService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonLink, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon links."
    })
    async findAll(@Query() findAllParams: TaxonLinkFindAllParams): Promise<TaxonLink[]> {
        const taxons = await this.myService.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonLink(c)
            return taxon
        })
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonLink })
    @ApiOperation({
        summary: "Retrieve a taxon  link by its ID."
    })
    async findByID(@Param('id') id: number): Promise<TaxonLink> {
        const taxon = await this.myService.findByID(id)
        const dto = new TaxonLink(taxon)
        return dto
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a taxon link by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        // Delete the taxon link
        const link = await this.myService.deleteByID(id);
        if (!link) {
            throw new NotFoundException();
        }
    }

}
