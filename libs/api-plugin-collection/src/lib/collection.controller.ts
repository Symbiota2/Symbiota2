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
    UseGuards, SerializeOptions
} from '@nestjs/common';
import {
    ApiTags,
    ApiResponse,
    ApiBearerAuth,
    ApiOperation
} from '@nestjs/swagger';
import { CollectionService } from './collection.service';
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
import { Collection } from '@symbiota2/api-database';

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
        type: Collection,
        isArray: true
    })
    async findAll(@Query() findAllParams: CollectionFindAllParams): Promise<Collection[]> {
        const collections = await this.collections.findAll(findAllParams);

        if (collections.length === 0) {
            throw new NotFoundException();
        }

        return collections;
    }

    @Get(':id')
    @ApiOperation({
        summary: "Retrieve a specimen collection by ID"
    })
    @ApiResponse({ status: HttpStatus.OK, type: Collection })
    @SerializeOptions({ groups: ['single'] })
    async findByID(@Param('id') id: number): Promise<Collection> {
        const collection = await this.collections.findByID(id);

        if (collection === null) {
            throw new NotFoundException();
        }

        return collection;
    }

    @Post()
    @ApiOperation({
        summary: "Create a new specimen collection"
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: Collection })
    @SerializeOptions({ groups: ['single'] })
    async create(@Body() data: CollectionInputDto): Promise<Collection> {
        const collection = await this.collections.create(data);
        collection.collectionStats = await collection.collectionStats;
        collection.institution = await collection.institution;
        return collection;
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
    @ApiResponse({ status: HttpStatus.OK, type: Collection })
    @SerializeOptions({ groups: ['single'] })
    async updateByID(@Param('id') id: number, @Body() data: UpdateCollectionInputDto): Promise<Collection> {
        const collection = await this.collections.updateByID(id, data);
        if (!collection) {
            throw new NotFoundException();
        }

        collection.collectionStats = await collection.collectionStats;
        collection.institution = await collection.institution;

        return collection;
    }
}
