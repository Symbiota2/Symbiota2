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

    @Get(':taxonID/:authorityID/:acceptedID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonomicStatusDto })
    @ApiOperation({
        summary: "Find a taxonomic status record for a given taxon id, authority id, and accepted id (the key of the table)"
    })
    async findByID(
        @Param('taxonID') taxonID: number,
        @Param('authorityID') authorityID: number,
        @Param('acceptedID') acceptedID: number
    ): Promise<TaxonomicStatusDto> {
        const taxonomicStatus = await this.taxanomicStatusService.findOne(taxonID, authorityID, acceptedID)
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

    @Patch('updateToAccepted/:id/:authorityID')
    @ApiOperation({
        summary: "Update a taxonomic status record to accepted status using taxonID, taxon authority ID"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: Taxon })
    @ApiBody({ type: TaxonomicStatusInputDto, isArray: true })
    //@SerializeOptions({ groups: ['single'] })
    async updateToAccepted(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Param('authorityID') authorityId: number
    ): Promise<TaxonomicStatus> {

        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const status = await this.taxanomicStatusService.updateToAccepted(id, authorityId)
        if (!status) {
            throw new NotFoundException()
        }
        return status
    }

    @Patch('updateAcceptedRing/:newTaxonId/:authorityId/:oldTaxonId')
    @ApiOperation({
        summary: "Update a ring of taxonomic status record to a new accepted taxonID using a taxon authority ID and the old accepted taxonID"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: Taxon })
    @ApiBody({ type: TaxonomicStatusInputDto, isArray: true })
    //@SerializeOptions({ groups: ['single'] })
    async updateAcceptedRing(
        @Req() request: AuthenticatedRequest,
        @Param('newTaxonId') newTaxonId: number,
        @Param('authorityId') authorityId: number,
        @Param('oldTaxonId') oldTaxonId: number
    ): Promise<TaxonomicStatus> {

        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const status = await this.taxanomicStatusService.updateAcceptedRing(newTaxonId, authorityId, oldTaxonId)
        if (!status) {
            throw new NotFoundException()
        }
        return status
    }

    @Patch(':id/:authorityID/:tidAcceptedID')
    @ApiOperation({
        summary: "Update a taxonomic status recoord by taxonID, taxon authority ID, and tidAcceptedID"
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
        @Param('authorityID') authorityId: number,
        @Param('tidAcceptedID') acceptedId: number,
        @Body(new ParseArrayPipe({ items: TaxonomicStatusInputDto })) data: TaxonomicStatus[]
    ): Promise<TaxonomicStatus> {

        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const statement = await this.taxanomicStatusService.updateByKey(id, authorityId, acceptedId, data[0])
        if (!statement) {
            throw new NotFoundException()
        }
        return statement
    }

    @Delete(':id/:authorityID:tidAcceptedID')
    @ApiOperation({
        summary: "Delete a taxon by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Param('authorityID') authorityId: number,
        @Param('tidAcceptedID') acceptedId: number,
    ): Promise<void> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const status = await this.taxanomicStatusService.deleteByKey(id, authorityId,acceptedId)
        if (!status) {
            throw new NotFoundException();
        }
    }

}
