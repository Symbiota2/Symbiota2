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
    UseInterceptors,
    UseGuards,
    UploadedFile,
    BadRequestException,
    Req,
    ForbiddenException, ParseArrayPipe
} from '@nestjs/common';
import { TaxonService } from './taxon.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TaxonDto } from './dto/TaxonDto';
import { TaxonIDandNameDto } from './dto/TaxonIDandNameDto';
import {
    AuthenticatedRequest,
    JwtAuthGuard,
    SuperAdminGuard,
    TokenService
} from '@symbiota2/api-auth';
import { Taxon } from '@symbiota2/api-database';
import { TaxonInputDto } from './dto/TaxonInputDto';
import { TaxonomicStatusDto } from '../taxonomicStatus/dto/TaxonomicStatusDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFileInput } from '@symbiota2/api-common';
import { Express } from 'express';
import { TaxonFindAllParams, TaxonFindNamesParams } from './dto/taxon-find-parms';

type File = Express.Multer.File;

@ApiTags('Taxon')
@Controller('taxon')
export class TaxonController {
    constructor(private readonly taxa: TaxonService) { }
    public static taxaAuthorityID = 1  // default taxa authority ID

    // The default controller fetches all of the records
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxons.  The list can be narrowed by taxon IDs and/or a taxa authority."
    })
    async findAll(@Query() findAllParams: TaxonFindAllParams): Promise<TaxonDto[]> {
        const taxons = await this.taxa.findAll(findAllParams)
        if (!taxons) {
            throw new NotFoundException()
        }
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonDto(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    // Get a list of all the scientific names
    @Get('scientificNames')
    @ApiResponse({ status: HttpStatus.OK, type: String })
    @ApiOperation({
        summary: "Retrieve a list of scientific names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findAllScientificNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<string[]> {
        const taxons = await this.taxa.findAllScientificNames(findNamesParams)
        if (!taxons) {
            throw new NotFoundException()
        }
        const names = taxons.map(async (c) => {
            return c.scientificName
        });
        return Promise.all(names)
    }

    // Get a list of all the family names
    @Get('familyNames')
    @ApiResponse({ status: HttpStatus.OK, type: String })
    @ApiOperation({
        summary: "Retrieve a list of family names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findFamilyNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDandNameDto[]> {
        const items = await this.taxa.findFamilyNames(findNamesParams)
        if (!items) {
            throw new NotFoundException()
        }
        const names = items.map(async (c) => {
            return new TaxonIDandNameDto(c.scientificName, c.id)
        });
        return Promise.all(names)
    }

    // Get a list of all the genus names
    @Get('genusNames')
    @ApiResponse({ status: HttpStatus.OK, type: String })
    @ApiOperation({
        summary: "Retrieve a list of genus names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findGenusNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDandNameDto[]> {
        const items = await this.taxa.findGenusNames(findNamesParams)
        if (!items) {
            throw new NotFoundException()
        }
        const names = items.map(async (c) => {
            return new TaxonIDandNameDto(c.scientificName, c.id)
        });
        return Promise.all(names)
    }

    // Get a list of all the species names
    @Get('speciesNames')
    @ApiResponse({ status: HttpStatus.OK, type: String })
    @ApiOperation({
        summary: "Retrieve a list of genus names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findSpeciesNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDandNameDto[]> {
        const items = await this.taxa.findSpeciesNames(findNamesParams)
        if (!items) {
            throw new NotFoundException()
        }
        const names = items.map(async (c) => {
            return new TaxonIDandNameDto(c.scientificName, c.id)
        });
        return Promise.all(names)
    }

    // Get a list of all the scientific names
    @Get('scientificNamesPlusAuthors')
    @ApiResponse({ status: HttpStatus.OK, type: String })
    @ApiOperation({
        summary: "Retrieve a list of scientific names and authors.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findAllScientificNamesPlusAuthors(@Query() findNamesParams: TaxonFindNamesParams): Promise<string[]> {
        const taxons = await this.taxa.findAllScientificNamesPlusAuthors(findNamesParams)
        if (!taxons) {
            throw new NotFoundException()
        }
        const names = taxons.map(async (c) => {
            return c.scientificName + (c.author? " - " + c.author : "")
        });
        return Promise.all(names)
    }

    // The scientificName controller finds using a scientific name
    @Get('byScientificName/:scientificName')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    @ApiOperation({
        summary: "Retrieve the taxons that match a scientific name."
    })
    async findByScientificName(
        @Param('scientificName') sciname: string,
        @Query() findNamesParams: TaxonFindNamesParams
    ): Promise<TaxonDto[]> {
        const taxons = await this.taxa.findByScientificName(sciname, findNamesParams)
        if (!taxons) {
            throw new NotFoundException()
        } else if (taxons.length == 0) {
            throw new NotFoundException()
        }
        const dto = taxons.map((taxon) => new TaxonDto(taxon))
        return dto
    }

    // The scientificName controller finds using a scientific name
    @Get('scientificName/:scientificName')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    @ApiOperation({
        summary: "Retrieve a taxon that matches a scientific name, just get the first of the list of names."
    })
    async findScientificName(@Param('scientificName') sciname: string, @Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonDto> {
        const taxons = await this.taxa.findByScientificName(sciname, findNamesParams)
        if (!taxons) {
            throw new NotFoundException()
        } else if (taxons.length == 0) {
            throw new NotFoundException()
        }
        const dto = new TaxonDto(taxons[0])
        return dto
    }

    @Get('withSynonyms/:taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    @ApiOperation({
        summary: "Find a taxon by the taxonID"
    })
    async findByTIDWithSynonyms(@Param('taxonid') id: number): Promise<TaxonDto> {
        const taxon = await this.taxa.findByTID(id)
        if (!taxon) {
            throw new NotFoundException()
        }
        // Wait for the accepted statuses
        const statuses = await taxon.acceptedTaxonStatuses
        const a = []
        statuses.forEach((status) => {
            const dto = new TaxonomicStatusDto(status)
            a.push(dto)
        })
        const dto = new TaxonDto(taxon)
        dto.acceptedTaxonStatuses = a
        return dto
    }

    @Get(':taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    @ApiOperation({
        summary: "Find a taxon by the taxonID"
    })
    async findByTID(@Param('taxonid') id: number): Promise<TaxonDto> {
        const taxon = await this.taxa.findByTID(id)
        if (!taxon) {
            throw new NotFoundException()
        }
        const dto = new TaxonDto(taxon)
        return dto
    }

    @Get('meta/fields')
    @ApiOperation({
        summary: 'Retrieve the list of fields for the taxon entity'
    })
    async getFields(): Promise<string[]> {
        return this.taxa.getFields()
    }

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isEditor = TokenService.isTaxonEditor(request.user)
        return isSuperAdmin || isEditor
    }

    @Post()
    @ApiOperation({
        summary: "Create a new taxon"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto })
    //@SerializeOptions({ groups: ['single'] })
    @ApiBody({ type: TaxonInputDto, isArray: true })
    /**
     @see - @link TaxonInputDto
     **/
    async create(
        @Req() request: AuthenticatedRequest,
        @Body(new ParseArrayPipe({ items: TaxonInputDto })) data: TaxonInputDto[]
    ): Promise<TaxonDto> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.taxa.create(data[0])
        const dto = new TaxonDto(block)
        return dto
    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a taxon by ID"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: Taxon })
    @ApiBody({ type: TaxonInputDto, isArray: true })
    //@SerializeOptions({ groups: ['single'] })
    async updateByID(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Body(new ParseArrayPipe({ items: TaxonInputDto })) data: Taxon[]
    ): Promise<Taxon> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const statement = await this.taxa.updateByID(id, data[0])
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

        const block = await this.taxa.deleteByID(id);
        if (!block) {
            throw new NotFoundException();
        }
    }

    @Post('dwc')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    // @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Upload a CSV or DwCA file containing taxa" })
    @ApiFileInput('file')
    @UseGuards(SuperAdminGuard)
    async uploadTaxaDwcA(@UploadedFile() file: File) {
        if (!file.mimetype.startsWith('application/zip')) {
            throw new BadRequestException('Invalid DwCA');
        }

        await this.taxa.fromDwcA(file.path);
    }
}
