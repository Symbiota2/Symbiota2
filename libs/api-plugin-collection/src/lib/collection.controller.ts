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
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiResponse,
    ApiBearerAuth,
    ApiOperation
} from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import { CollectionOutputDto } from './dto/Collection.output.dto';
import { CollectionFindAllParams } from './dto/coll-find-all.input.dto';
import { InstitutionService } from './institution/institution.service';
import {
    CollectionInputDto,
    UpdateCollectionInputDto
} from './dto/Collection.input.dto';
import { JwtAuthGuard } from '@symbiota2/api-auth';
import {
    ProtectCollection
} from './collection-edit-guard/protect-collection.decorator';
import { CollectionListItem } from './dto/CollectionListItem.output.dto';

/**
 * API routes for manipulating specimen collections
 */
@ApiTags('Collections')
@Controller('collections')
export class CollectionController {
    constructor(
        private readonly institutionService: InstitutionService,
        private readonly collections: CollectionService) {
    }

    @Get()
    @ApiOperation({
        summary: "Retrieve a list of specimen collections"
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CollectionListItem,
        isArray: true
    })
    async findAll(@Query() findAllParams: CollectionFindAllParams): Promise<CollectionListItem[]> {
        const collections = await this.collections.findAll(findAllParams);

        if (collections.length === 0) {
            throw new NotFoundException();
        }

        return collections.map((c) => new CollectionListItem(c));
    }

    @Get(':id')
    @ApiOperation({
        summary: "Retrieve a specimen collection by ID"
    })
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async findByID(@Param('id') id: number): Promise<CollectionOutputDto> {
        const collection = await this.collections.findByID(id);

        if (collection === null) {
            throw new NotFoundException();
        }

        const collectionDto = new CollectionOutputDto(collection);
        collectionDto.institution = await collection.institution;
        collectionDto.stats = await collection.collectionStats;
        return collectionDto;
    }

    @Post()
    @ApiOperation({
        summary: "Create a new specimen collection"
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async create(@Body() data: CollectionInputDto): Promise<CollectionOutputDto> {
        const collection = await this.collections.create(data);
        return new CollectionOutputDto(collection);
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete a specimen collection by ID"
    })
    @ProtectCollection('id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Param('id') id: number): Promise<void> {
        const collection = await this.collections.deleteByID(id);
        if (!collection) {
            throw new NotFoundException();
        }
    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a specimen collection by ID"
    })
    @ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async updateByID(@Param('id') id: number, @Body() data: UpdateCollectionInputDto): Promise<CollectionOutputDto> {
        const collection = await this.collections.updateByID(id, data);
        if (!collection) {
            throw new NotFoundException();
        }

        const collectionDto = new CollectionOutputDto(collection);
        collectionDto.stats = await collection.collectionStats;
        collectionDto.institution = await collection.institution;

        return collectionDto;
    }
}
