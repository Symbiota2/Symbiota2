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
    ParseArrayPipe, SerializeOptions, UseGuards, ForbiddenException, Req
} from '@nestjs/common';
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { TaxonDescriptionStatementDto } from './dto/TaxonDescriptionStatementDto'
import { TaxonDescriptionStatementFindAllParams } from './dto/taxonDescriptionStatement-find-all.input.dto'
import { TaxonDescriptionBlockDto } from '../taxonDescriptionBlock/dto/TaxonDescriptionBlockDto';
import { TaxonDescriptionBlockInputDto } from '../taxonDescriptionBlock/dto/TaxonDescriptionBlockInputDto';
import { TaxonDescriptionStatementInputDto } from './dto/TaxonDescriptionStatemenInputtDto';
import { TaxonDescriptionBlock, TaxonDescriptionStatement } from '@symbiota2/api-database';
import { AuthenticatedRequest, JwtAuthGuard, TokenService } from '@symbiota2/api-auth';

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

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isProfileEditor = TokenService.isTaxonProfileEditor(request.user)
        return isSuperAdmin || isProfileEditor
    }

    @Post()
    @ApiOperation({
        summary: "Create a new description statement"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatementDto })
    //@SerializeOptions({ groups: ['single'] })
    @ApiBody({ type: TaxonDescriptionStatementInputDto, isArray: true })
    /**
     @see - @link TaxonDescriptionStatementInputDto
     **/
    async create(
        @Req() request: AuthenticatedRequest,
        @Body(new ParseArrayPipe({ items: TaxonDescriptionStatementInputDto })) data: TaxonDescriptionStatementInputDto[]
    ): Promise<TaxonDescriptionStatementDto> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.myService.create(data[0])
        const dto = new TaxonDescriptionStatementDto(block)
        return dto
    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a taxon description statement by ID"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatement })
    @ApiBody({ type: TaxonDescriptionStatementInputDto, isArray: true })
    //@SerializeOptions({ groups: ['single'] })
    async updateByID(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Body(new ParseArrayPipe({ items: TaxonDescriptionStatementInputDto })) data: TaxonDescriptionStatement[]
    ): Promise<TaxonDescriptionStatement> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const statement = await this.myService.updateByID(id, data[0])
        if (!statement) {
            throw new NotFoundException()
        }
        return statement
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a taxon description statement by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.myService.deleteByID(id);
        if (!block) {
            throw new NotFoundException();
        }
    }

}
