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
    ParseArrayPipe, SerializeOptions
} from '@nestjs/common';
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TaxonDescriptionStatementDto } from './dto/TaxonDescriptionStatementDto'
import { TaxonDescriptionStatementFindAllParams } from './dto/taxonDescriptionStatement-find-all.input.dto'
import { TaxonDescriptionBlockDto } from '../taxonDescriptionBlock/dto/TaxonDescriptionBlockDto';
import { TaxonDescriptionBlockInputDto } from '../taxonDescriptionBlock/dto/TaxonDescriptionBlockInputDto';
import { TaxonDescriptionStatementInputDto } from './dto/TaxonDescriptionStatemenInputtDto';
import { TaxonDescriptionBlock, TaxonDescriptionStatement } from '@symbiota2/api-database';

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

    @Post()
    @ApiOperation({
        summary: "Create a new description statement"
    })
    @HttpCode(HttpStatus.OK)
    //@UseGuards(JwtAuthGuard)
    //@ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatementDto })
    //@SerializeOptions({ groups: ['single'] })
    @ApiBody({ type: TaxonDescriptionStatementInputDto, isArray: true })
    /**
     @see - @link TaxonDescriptionBlockInputDto
     **/
    async create(@Body(new ParseArrayPipe({ items: TaxonDescriptionStatementInputDto })) data: TaxonDescriptionStatementInputDto[]): Promise<TaxonDescriptionStatementDto> {//console.log('taxon id and uid ' + (typeof data) + data[0].taxonID + data[0].creatorUID)
        const block = await this.myService.create(data[0])
        const dto = new TaxonDescriptionStatementDto(block)
        return dto
    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a taxon description statement by ID"
    })
    //@ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonDescriptionStatement })
    //@SerializeOptions({ groups: ['single'] })
    async updateByID(@Param('id') id: number, @Body(new ParseArrayPipe({ items: TaxonDescriptionStatementInputDto })) data: TaxonDescriptionStatement[]): Promise<TaxonDescriptionStatement> {
        //console.log("data is " + data.caption)
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
    //@ProtectCollection('id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Param('id') id: number): Promise<void> {
        const block = await this.myService.deleteByID(id);
        if (!block) {
            throw new NotFoundException();
        }
    }

}
