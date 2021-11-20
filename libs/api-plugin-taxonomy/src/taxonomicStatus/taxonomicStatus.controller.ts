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
    UseGuards, Req, ParseArrayPipe, ForbiddenException, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { TaxonomicStatusService } from './taxonomicStatus.service'
import { ApiProperty, ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TaxonomicStatusDto } from './dto/TaxonomicStatusDto'
import { TaxonomicStatusFindAllParams } from './dto/taxonomicStatus-find-all.input.dto'
import { Taxon, TaxonomicStatus } from '@symbiota2/api-database';
import { TaxonDto } from '../taxon/dto/TaxonDto'
import { AuthenticatedRequest, JwtAuthGuard, SuperAdminGuard, TokenService } from '@symbiota2/api-auth';
import { TaxonInputDto } from '../taxon/dto/TaxonInputDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFileInput } from '@symbiota2/api-common';
import { TaxonomicStatusInputDto } from './dto/TaxonomicStatusInputDto';

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

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isEditor = TokenService.isTaxonEditor(request.user)
        return isSuperAdmin || isEditor
    }

    @Post()
    @ApiOperation({
        summary: "Create a new taxonomic status record"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto })
    //@SerializeOptions({ groups: ['single'] })
    @ApiBody({ type: TaxonomicStatusInputDto, isArray: true })
    /**
     @see - @link TaxonomicStatusInputDto
     **/
    async create(
        @Req() request: AuthenticatedRequest,
        @Body(new ParseArrayPipe({ items: TaxonomicStatusInputDto })) data: TaxonomicStatusInputDto[]
    ): Promise<TaxonomicStatusDto> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const status = await this.taxanomicStatusService.create(data[0])
        const dto = new TaxonomicStatusDto(status)
        return dto
    }

    @Patch(':id/:authorityID')
    @ApiOperation({
        summary: "Update a taxonomic status recoord by taxonID and taxon authority ID"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: Taxon })
    @ApiBody({ type: TaxonomicStatusInputDto, isArray: true })
    //@SerializeOptions({ groups: ['single'] })
    async updateByID(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Param('authorityId') authorityId: number,
        @Body(new ParseArrayPipe({ items: TaxonomicStatusInputDto })) data: TaxonomicStatus[]
    ): Promise<TaxonomicStatus> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const statement = await this.taxanomicStatusService.updateByID(id, authorityId, data[0])
        if (!statement) {
            throw new NotFoundException()
        }
        return statement
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a taxon by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.taxanomicStatusService.deleteByID(id);
        if (!block) {
            throw new NotFoundException();
        }
    }

}
