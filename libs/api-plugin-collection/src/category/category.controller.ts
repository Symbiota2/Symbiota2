import { Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CategoryOutputDto
} from './dto/category.output.dto';
import { CategoryService } from './category.service';
import { CollectionService } from '../collection/collection.service';
import { CollectionListItem } from '../collection/dto/CollectionListItem.output.dto';

@ApiTags('Collections')
@Controller('collections/categories')
export class CategoryController {
    constructor(
        private readonly collections: CollectionService,
        private readonly categories: CategoryService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: CategoryOutputDto, isArray: true })
    async getCategoryList(): Promise<CategoryOutputDto[]> {
        const categories = await this.categories.findAll();
        return Promise.all(
            categories.map(async (category) => {
                const dto = new CategoryOutputDto(category);
                const collections = await this.collections.findByCategory(category.id);
                dto.collections = await Promise.all(
                    collections.map((coll) => new CollectionListItem(coll))
                );
                return dto;
            })
        );
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: CategoryOutputDto })
    async getCategory(@Param('id') id: number): Promise<CategoryOutputDto> {
        const [category, collections] = await Promise.all([
            this.categories.findByID(id),
            this.collections.findByCategory(id)
        ]);

        if (!category) {
            throw new NotFoundException();
        }

        const dto = new CategoryOutputDto(category);
        dto.collections = collections.map(c => new CollectionListItem(c));

        return dto;
    }
}
