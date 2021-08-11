import {
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    SerializeOptions
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CategoryOutputDto
} from './dto/category.output.dto';
import { CategoryService } from './category.service';
import { CollectionService } from '../collection.service';

@ApiTags('Collections')
@Controller('collections/categories')
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
}
