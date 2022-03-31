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
import {
    AuthenticatedRequest,
    JwtAuthGuard,
    SuperAdminGuard,
    TokenService
} from '@symbiota2/api-auth';
import { Taxon, TaxonomyUpload } from '@symbiota2/api-database';
import { TaxonInputDto } from './dto/TaxonInputDto';
import { TaxonomicStatusDto } from '../taxonomicStatus/dto/TaxonomicStatusDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFileInput, getCSVFields } from '@symbiota2/api-common';
import { Express } from 'express';
import { TaxonFindAllParams, TaxonFindNamesParams } from './dto/taxon-find-parms';
import path from 'path'
import fs, { createReadStream } from 'fs';
import { TaxonHeaderMapBody } from './dto/taxon-header-map.input.dto';
import { TaxonIDAuthorNameDto } from './dto/TaxonIDAuthorNameDto';
import { TaxonAndAcceptedStatusesDto } from './dto/TaxonAndAcceptedStatusesDto';

type File = Express.Multer.File;
const fsPromises = fs.promises;

@ApiTags('Taxon')
@Controller('taxon')
export class TaxonController {

    constructor(private readonly taxa: TaxonService) { }

    // The default controller fetches all of the records
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of taxons.  The list can be narrowed by taxon IDs and/or a taxa authority."
    })
    async findAll(@Query() findAllParams: TaxonFindAllParams): Promise<TaxonDto[]> {
        const taxons = await this.taxa.findAll(findAllParams)
        if (!taxons) {
            return []
        }
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonDto(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    // Get a list of all the scientific names
    @Get('scientificNames')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonIDAuthorNameDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of scientific names.  The list can be narrowed by taxa authority, taxon IDs, whether the taxon has images, or to a specific rank/kingdom."
    })
    async findAllScientificNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDAuthorNameDto[]> {
        const taxons = await this.taxa.findAllScientificNames(findNamesParams)
        if (!taxons) {
            return []
        }
        const names = taxons.map(async (c) => {
            return new TaxonIDAuthorNameDto(c.id, c.scientificName, c.author)
        });
        return Promise.all(names)
    }

    /*
    // Get a list of all the scientific names
    @Get('scientificNamesWithImages')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonIDandNameDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of scientific names if the taxon has an image.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findAllScientificNamesWithImages(
        @Query() findNamesParams: TaxonFindNamesParams
    ): Promise<TaxonIDandNameDto[]> {
        const taxons = await this.taxa.findAllScientificNamesWithImages(findNamesParams)
        if (!taxons) {
            return []
        }
        const names = taxons.map(async (c) => {
            return new TaxonIDandNameDto(c.id, c.scientificName)
        });
        return Promise.all(names)
    }

    // Get a list of all the family names
    @Get('familyNames')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of family names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findFamilyNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDandNameDto[]> {
        const items = await this.taxa.findFamilyNames(findNamesParams)
        if (!items) {
            return []
        }
        const names = items.map(async (c) => {
            return new TaxonIDandNameDto(c.id, c.scientificName)
        });
        return Promise.all(names)
    }

    // Get a list of all the genus names
    @Get('genusNames')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of genus names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findGenusNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDandNameDto[]> {
        const items = await this.taxa.findGenusNames(findNamesParams)
        if (!items) {
            return []
        }
        const names = items.map(async (c) => {
            return new TaxonIDandNameDto(c.id, c.scientificName)
        });
        return Promise.all(names)
    }

    // Get a list of all the species names
    @Get('speciesNames')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of genus names.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findSpeciesNames(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDandNameDto[]> {
        const items = await this.taxa.findSpeciesNames(findNamesParams)
        if (!items) {
            return []
        }
        const names = items.map(async (c) => {
            return new TaxonIDandNameDto(c.id, c.scientificName)
        });
        return Promise.all(names)
    }

    // Get a list of all the scientific names
    @Get('scientificNamesPlusAuthors')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonIDAuthorNameDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of scientific names and authors.  The list can be narrowed by taxa authority and/or taxon IDs."
    })
    async findAllScientificNamesPlusAuthors(@Query() findNamesParams: TaxonFindNamesParams): Promise<TaxonIDAuthorNameDto[]> {
        const taxons = await this.taxa.findAllScientificNamesPlusAuthors(findNamesParams)
        if (!taxons) {
            return []  // returns emptylist if not found
        }
        const names = taxons.map(async (c) => {
            return new TaxonIDAuthorNameDto(c.id, c.scientificName, c.author)
        });
        return Promise.all(names)
    }


     */
    // The scientificName controller finds using a scientific name
    /*
    @Get('byScientificName/:scientificName')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve the taxons that match a scientific name."
    })
    async findByScientificName(
        @Param('scientificName') sciname: string,
        @Query() findNamesParams: TaxonFindNamesParams
    ): Promise<TaxonDto[]> {
        const taxons = await this.taxa.findByScientificName(sciname, findNamesParams)
        if (!taxons) {
            return []  // returns emptylist if not found
        }
        const dto = taxons.map((taxon) => new TaxonDto(taxon))
        return dto
    }
     */
    /*
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
     */

    @Get('withSynonyms/:taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonAndAcceptedStatusesDto })
    @ApiOperation({
        summary: "Find a taxon by the taxonID together with its status and accepted statuses (synonyms)."
    })
    async findByTIDWithSynonyms(@Param('taxonid') id: number): Promise<TaxonAndAcceptedStatusesDto> {
        const taxon = await this.taxa.findByTIDWithSynonyms(id)
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
        const dto = new TaxonAndAcceptedStatusesDto(taxon)
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

    @Get('meta/relatedFields')
    @ApiOperation({
        summary: 'Retrieve the list of fields for the taxon entity plus associated entites (status, vernacular, rank)'
    })
    async getRelatedFields(): Promise<string[]> {
        return this.taxa.getAllTaxonomicUploadFields()
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

        // Delete the taxon
        const block = await this.taxa.deleteByID(id);
        if (!block) {
            throw new NotFoundException();
        }
    }

    @Post('upload')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Upload a CSV file containing a taxonomy"
    })
    @ApiFileInput('file')
    async uploadTaxonomyFile(@UploadedFile() file: File): Promise<TaxonomyUpload> {
        let upload: TaxonomyUpload

        if (!file) {
            throw new BadRequestException('File not specified');
        }

        if (true) {
            const headers = await getCSVFields(file.path);
            const headerMap = {};
            headers.forEach((h) => headerMap[h] = '');

            upload = await this.taxa.createUpload(
                path.resolve(file.path),
                file.mimetype,
                headerMap
            );
        }
        else if (file.mimetype.startsWith('application/zip')) {
            // TODO: DwCA uploads
            await fsPromises.unlink(file.path);
            throw new BadRequestException('Taxonomy uploads are not yet implemented');
        }
        else {
            await fsPromises.unlink(file.path);
            throw new BadRequestException('Unsupported file type: CSV and CSV.zip files are supported');
        }

        return upload;
    }

    @Get('upload/results/:kind')
    @ApiOperation({ summary: 'Retrieve the potential problems in the upload. You must choose by kind of problem by setting the "kind" field. Potential choices are 1 (problem rows), 2 (problem accepted names), 3 (problem parent names), and 4 (problem ranks).' })
    async getresults(@Param('kind') kind: number) : Promise<string[]> {
        if (kind == 1) {
            return this.taxa.getProblemUploadRows()
        } else if (kind == 2) {
            return this.taxa.getProblemAcceptedNames()
        } else if (kind == 3) {
            return this.taxa.getProblemParentNames()
        } else if (kind == 4) {
            return this.taxa.getProblemRanks()
        } else {
            throw new BadRequestException(" The kind is out of the range 1 to 4 it is " + kind)
        }
    }

    @Get('upload/:id')
    @ApiOperation({ summary: 'Retrieve an upload by its ID' })
    async getUploadByID(@Param('id') id: number): Promise<TaxonomyUpload> {
        return this.taxa.findUploadByID(id);
    }

    @Patch('upload/:id')
    @HttpCode(HttpStatus.OK)
    //@ProtectCollection('collectionID', { isInQuery: true })
    @ApiOperation({
        summary: 'Map the fields of a CSV to the taxa table\'s fields'
    })
    async mapTaxonUpload(
        //@Query() query: CollectionIDQueryParam,
        @Param('id') id: number,
        @Body() body: TaxonHeaderMapBody
    ): Promise<{
        problemScinames: number,
        problemAcceptedNames: number,
        problemParentNames: number,
        problemRanks: number,
        nullSciNames: number,
        nullParentNames: number,
        nullKingdomNames: number,
        nullAcceptedNames: number,
        nullRankNames: number,
        totalRecords: number
    }> {

        const upload = await this.taxa.patchUploadFieldMap(
            id,
            //body.uniqueIDField,
            body.fieldMap as Record<string, /*keyof Occurrence*/ string>
        )

        if (!upload) {
            throw new NotFoundException()
        }

        const problemsFound = await this.taxa.taxonCheck(
            upload.filePath,
            body.fieldMap["scientificName"],
            body.fieldMap["ParentTaxonName"],
            body.fieldMap["AcceptedTaxonName"],
            body.fieldMap["kingdomName"],
            body.fieldMap["RankName"])

        return problemsFound
    }

    @Post('upload/:id/:authorityID/start')
    @HttpCode(HttpStatus.NO_CONTENT)
    //@ProtectCollection('collectionID', { isInQuery: true })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Starts a pre-configured upload of a taxonomy CSV'
    })
    async startUpload(
        @Param('id') uploadID: number,
        @Param('authorityID') authorityID: number,
        //@Query() query: CollectionIDQueryParam,
        @Req() request: AuthenticatedRequest) {

        await this.taxa.startUpload(
            request.user.uid,
            authorityID,
            //query.collectionID,
            uploadID
        );
    }

    @Post('dwc')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    // @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Upload a CSV or DwCA file containing taxa" })
    @ApiFileInput('file')
    // @UseGuards(SuperAdminGuard)
    async uploadTaxaDwcA(@UploadedFile() file: File) {
        if (!file.mimetype.startsWith('application/zip')) {
            throw new BadRequestException('Invalid DwCA');
        }

        await this.taxa.fromDwcA(file.path);
    }
}
