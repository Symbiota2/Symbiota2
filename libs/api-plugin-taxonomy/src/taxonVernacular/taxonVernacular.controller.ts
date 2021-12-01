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
    UseGuards, Req, ParseArrayPipe, ForbiddenException
} from '@nestjs/common';
import { TaxonVernacularService } from './taxonVernacular.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
    TaxonVernacularOutputDto
} from './dto/TaxonVernacular.output.dto';
import { TaxonVernacularFindAllParams } from './dto/taxonVernacular-find-all.input.dto';
import { TaxonVernacularFindParams } from './dto/taxonVernacular-find.input.dto';
import { AuthenticatedRequest, JwtAuthGuard, TokenService } from '@symbiota2/api-auth';
import { TaxonVernacularInputDto } from './dto/TaxonVernacular.input.dto';
import { TaxonDescriptionStatementInputDto } from '../taxonDescriptionStatement/dto/TaxonDescriptionStatemenInputtDto';

@ApiTags('TaxonVernacular')
@Controller('taxonVernacular')
export class TaxonVernacularController {
    constructor(private readonly myService: TaxonVernacularService) { }
    public static taxaAuthorityID = 1  // default taxa authority ID

    /*
    The default controller fetches all of the records
     */
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto, isArray: true })
    @ApiOperation({
        summary: "Fetch all of the taxon vernacular records, optionally limited to a specific taxonomic authority and list of taxon vernacular ids (note not taxon IDs)"
    })
    async findAll(@Query() findAllParams: TaxonVernacularFindAllParams): Promise<TaxonVernacularOutputDto[]> {
        const taxons = await this.myService.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonVernacularOutputDto(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    /*
    Get the records for a specific taxon ID
     */
    @Get('taxonID/:taxonID')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto, isArray: true })
    @ApiOperation({
        summary: "Fetch all of the taxon vernacular records for a specific taxon ID"
    })
    async findByTaxonID(@Param('taxonID') taxonID: number): Promise<TaxonVernacularOutputDto[]> {
        const taxons = await this.myService.findByTaxonID(taxonID)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonVernacularOutputDto(c)
            return taxon
        })
        return Promise.all(taxonDtos)
    }

    /*
    Get a list of all the languages
     */
    // TODO: limit to a taxa authority
    @Get('languages')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Get a list of all of the natural languages, optionally limited to a specific taxonomic authority"
    })
    async findAllLanguages(): Promise<string[]> {
        const myRows = await this.myService.findAllLanguages()
        const languages = myRows.map(async (language) => {
            return language.language
        })
        return Promise.all(languages)
    }

    /*
    Get a list of all the common names
     */
    @Get('commonNames')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Get a list of all of the common names, optionally using a list of taxon ids and limited to a specific taxonomic authority"
    })
    async findAllCommonNames(@Query() findAllParams: TaxonVernacularFindParams): Promise<string[]> {
        const myRows = await this.myService.findAllCommonNames(findAllParams)
        const names = myRows.map(async (row) => {
            return row.vernacularName
        })
        return Promise.all(names)
    }

    /*
    Get a list of all the common names for a specific natural language
     */
    @Get('commonNamesByLanguage/:language')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Get a list of all of the common names for a given (natural) language, optionally using a list of taxon ids and limited to a specific taxonomic authority"
    })
    async findAllCommonNamesByLanguage(@Param('language') language: string, @Query() findAllParams: TaxonVernacularFindParams): Promise<string[]> {
        const myRows = await this.myService.findAllCommonNamesByLanguage(language,findAllParams)
        const names = myRows.map(async (row) => {
            return row.vernacularName
        })
        return Promise.all(names)
    }

    /*
The commonName controller finds using a common name
 */
    @Get('commonName/:commonName')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto })
    @ApiOperation({
        summary: "Use a common name to get a list of taxon vernacular records, also using an authority ID"
    })
    async findByCommonName(@Param('byCommonName') commonName: string, @Query() findParams: TaxonVernacularFindParams): Promise<TaxonVernacularOutputDto[]> {
        const names = await this.myService.findByCommonName(commonName, findParams)
        if (!names) {
            throw new NotFoundException()
        } else if (names.length == 0) {
            throw new NotFoundException()
        }
        const dto = names.map((name) => new TaxonVernacularOutputDto(name))
        return dto
    }

    /*
    The commonName controller finds using a common name
     */
    @Get('commonName/:commonName')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto })
    @ApiOperation({
        summary: "Use a common name to get a taxon vernacular record, but since there could be many matches just return the first"
    })
    async findCommonName(@Param('commonName') commonName: string, @Query() findParams: TaxonVernacularFindParams): Promise<TaxonVernacularOutputDto> {
        const name = await this.myService.findByCommonName(commonName, findParams)
        if (!name) {
            throw new NotFoundException()
        } else if (name.length == 0) {
            throw new NotFoundException()
        }
        const dto = new TaxonVernacularOutputDto(name[0])
        return dto
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto })
    @ApiOperation({
        summary: "Use a taxon vernacular id (not a taxonID) to get a taxon vernacular record"
    })
    async findByID(@Param('id') id: number): Promise<TaxonVernacularOutputDto> {
        const taxon = await this.myService.findByID(id)
        const dto = new TaxonVernacularOutputDto(taxon)
        return dto
    }

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isEditor = TokenService.isTaxonEditor(request.user)
        return isSuperAdmin || isEditor
    }

    @Post()
    @ApiOperation({
        summary: "Create a new taxon vernacular record"
    })
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto })
    @ApiBody({ type: TaxonVernacularInputDto, isArray: true })
    async create(
        @Req() request: AuthenticatedRequest,
        @Body(new ParseArrayPipe({ items: TaxonVernacularInputDto })) data: TaxonVernacularInputDto[]
    ): Promise<TaxonVernacularOutputDto>
    {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }


        const vernacular = await this.myService.create(data[0])
        return new TaxonVernacularOutputDto(vernacular)
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a taxon vernacular record by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const vernacular = await this.myService.deleteByID(id)
        if (!vernacular) {
            throw new NotFoundException()
        }
    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a taxon vernacular record by ID"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto })
    @ApiBody({ type: TaxonVernacularInputDto, isArray: true })
    async updateByID(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Body(new ParseArrayPipe({ items: TaxonVernacularInputDto })) data: TaxonVernacularInputDto[]
    )
        : Promise<TaxonVernacularOutputDto>
    {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const vernacular = await this.myService.updateByID(id, data[0])
        if (!vernacular) {
            throw new NotFoundException()
        }

        const vernacularDto = new TaxonVernacularOutputDto(vernacular)

        return vernacularDto
    }

}
