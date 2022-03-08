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
    UseGuards, Req
} from '@nestjs/common';
import { TaxonResourceLinkService } from './taxonResourceLink.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
    TaxonResourceLink
} from './dto/TaxonResourceLink';
import {
    TaxonResourceLinkFindAllParams
} from './dto/taxonResourceLink-find-all.input.dto';
import { AuthenticatedRequest, JwtAuthGuard } from '@symbiota2/api-auth';

@ApiTags('TaxonResourceLink')
@Controller('taxonResourceLink')
export class TaxonResourceLinkController {
    constructor(private readonly myService: TaxonResourceLinkService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonResourceLink, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxon resource links."
    })
    async findAll(@Query() findAllParams: TaxonResourceLinkFindAllParams): Promise<TaxonResourceLink[]> {
        const taxons = await this.myService.findAll(findAllParams)
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
        const taxon = await this.myService.findByID(id)
        const dto = new TaxonResourceLink(taxon)
        return dto
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a taxon resource link by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        // Delete the taxon resource link
        const link = await this.myService.deleteByID(id);
        if (!link) {
            throw new NotFoundException();
        }
    }

}
