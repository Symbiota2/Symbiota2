import {
    Body,
    Controller, Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param, Post,
    SerializeOptions, UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import {
    CategoryOutputDto
} from './dto/category.output.dto';
import { CategoryService } from './category.service';
import { CollectionService } from '../collection.service';
import { CollectionIDBody } from './dto/collection-id-body.dto';
import { JwtAuthGuard, SuperAdminGuard } from '@symbiota2/api-auth';

@ApiTags('Collection Categories')
@Controller('collection-categories')
export class CategoryController {
    constructor(
        private readonly collections: CollectionService,
        private readonly categories: CategoryService) { }

    @Get()
    @ApiOperation({ summary: "Retrieve a list of collection categories" })
    @ApiResponse({ status: HttpStatus.OK, type: CategoryOutputDto, isArray: true })
    @SerializeOptions({ groups: ['list'] })
    async getCategoryList(): Promise<CategoryOutputDto[]> {
        const categories = await this.categories.findAll();

        return Promise.all([
            ...categories.map(async (category) => {
                const dto = new CategoryOutputDto(category);
                const collections = await this.collections.findByCategory(category.id);
                dto.collections = collections;
                return dto;
            }),
            this.collections.findUncategorized().then((collections) => {
                return {
                    id: -1,
                    category: 'Uncategorized',
                    icon: null,
                    collections: collections
                }
            }),
        ]);
    }

    @Get(':id')
    @ApiOperation({ summary: "Retrieve a collection category by ID" })
    @ApiResponse({ status: HttpStatus.OK, type: CategoryOutputDto })
    @SerializeOptions({ groups: ['single'] })
    async getCategory(@Param('id') id: number): Promise<CategoryOutputDto> {
        const [category, collections] = await Promise.all([
            this.categories.findByID(id),
            this.collections.findByCategory(id)
        ]);

        if (!category) {
            throw new NotFoundException();
        }

        const dto = new CategoryOutputDto(category);
        dto.collections = collections;
        return dto;
    }

    @Post(':id/collections')
    @ApiOperation({ summary: 'Add a collection to a category' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SuperAdminGuard)
    async addCollectionToCategory(@Param('id') id: number, @Body() body: CollectionIDBody): Promise<CategoryOutputDto> {
        const category = await this.categories.addCollectionToCategory(id, body.collectionID);
        const collections = await this.collections.findByCategory(id);
        const dto = new CategoryOutputDto(category);
        dto.collections = collections;
        return dto;
    }

    @Delete(':id/collections')
    @ApiOperation({ summary: 'Remove a collection from a category' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, SuperAdminGuard)
    async removeCollectionFromCategory(@Param('id') id: number, @Body() body: CollectionIDBody): Promise<CategoryOutputDto> {
        const category = await this.categories.removeCollectionFromCategory(id, body.collectionID);
        if (!category) {
            throw new NotFoundException();
        }

        const collections = await this.collections.findByCategory(id);
        const dto = new CategoryOutputDto(category);
        dto.collections = collections;
        return dto;
    }
}
