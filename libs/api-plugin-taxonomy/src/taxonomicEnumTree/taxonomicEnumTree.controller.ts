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
    SerializeOptions, UseGuards
} from '@nestjs/common';
import { TaxonomicEnumTreeService } from './taxonomicEnumTree.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
    TaxonomicEnumTreeDto
} from './dto/TaxonomicEnumTreeDto';
import { TaxonomicEnumTreeFindAllParams } from './dto/taxonomicEnumTree-find-all.input.dto';
import { TaxonDto } from '../taxon/dto/TaxonDto';
import { TaxonomicStatusDto } from '../taxonomicStatus/dto/TaxonomicStatusDto';
import { TaxonDescriptionBlock } from '@symbiota2/api-database';
import { TaxonomicEnumTreeMoveTaxonParams } from './dto/taxonomicEnumTreeQueryParams';
import { TaxonAndAcceptedStatusesDto } from '../taxon/dto/TaxonAndAcceptedStatusesDto';
import { JwtAuthGuard } from '@symbiota2/api-auth';

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
            const acceptedStatuses = await parentTaxon.acceptedTaxonStatuses
            const synonyms = []
            for (const s of acceptedStatuses) {
                const synstatus = new TaxonomicStatusDto(s)
                const t = await s.taxon
                synstatus.taxon = new TaxonDto(t)
                synonyms.push(synstatus)
            }
            const taxon = new TaxonAndAcceptedStatusesDto(parentTaxon)
            taxon.acceptedTaxonStatuses = synonyms
            return taxon
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
            const acceptedStatuses = await parentTaxon.acceptedTaxonStatuses
            const synonyms = []
            for (const s of acceptedStatuses) {
                const synstatus = new TaxonomicStatusDto(s)
                const t = await s.taxon
                synstatus.taxon = new TaxonDto(t)
                synonyms.push(synstatus)
                }
            const taxon = new TaxonomicEnumTreeDto(c)
            taxon.parent = new TaxonAndAcceptedStatusesDto(parentTaxon)
            taxon.parent.acceptedTaxonStatuses = synonyms

            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get('descendants/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto })
    @ApiOperation({
        summary: "Get the descendent enum tree records for a given taxon ID (and optional taxonomic authority id)."
    })
    async findDescendants(@Param('taxonID') taxonid: number, @Query() findAllParams: TaxonomicEnumTreeFindAllParams): Promise<TaxonomicEnumTreeDto[]> {
        const taxons = await this.myService.findDescendants(taxonid, findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonomicEnumTreeDto(c)
            const t = await c.taxon
            taxon.taxon = new TaxonDto(t)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    @Get('descendantsByRank/:taxonID/:rankID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto })
    @ApiOperation({
        summary: "Get the descendent enum tree records for a given taxon ID and rank ID (and optional taxonomic authority id)."
    })
    async findDescendantsByRank(@Param('taxonID') taxonID: number, @Param('rankID') rankID: number, @Query() findAllParams: TaxonomicEnumTreeFindAllParams): Promise<TaxonomicEnumTreeDto[]> {

        const enumTreeRecords = await this.myService.findDescendantsByRank(taxonID, rankID, findAllParams)
        const enumTreeDtos = enumTreeRecords.map(async (c) => {
            const enumTreeDto = new TaxonomicEnumTreeDto(c)
            const t = await c.taxon
            enumTreeDto.taxon = new TaxonDto(t)
            return enumTreeDto
        })
        return Promise.all(enumTreeDtos)
    }



    /* No single id for a taxa enum tree
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
     */

    @Patch('move')
    @ApiOperation({
        summary: "Move taxon to a new parent in the enum tree."
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto })
    async moveTaxon(@Query() myParams: TaxonomicEnumTreeMoveTaxonParams): Promise<TaxonomicEnumTreeDto> {
        const enumTree = await this.myService.moveTaxon(myParams.taxonID, myParams.taxonAuthorityID, myParams.parentTaxonID);
        if (!enumTree) {
            throw new NotFoundException()
        }
        return new TaxonomicEnumTreeDto(enumTree)
    }

    @Patch('rebuildTree/:taxonomicAuthorityID')
    @ApiOperation({
        summary: "Rebuild the taxonomic enum tree for a given authority."
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicEnumTreeDto })
    async rebuildTaxonEnumTree(@Param('taxonomicAuthorityID') taxonomicAuthorityID: number): Promise<TaxonomicEnumTreeDto> {
        const enumTree = await this.myService.rebuildTaxonEnumTree(taxonomicAuthorityID);
        if (!enumTree) {
            throw new NotFoundException()
        }
        return new TaxonomicEnumTreeDto(enumTree)
    }

}
