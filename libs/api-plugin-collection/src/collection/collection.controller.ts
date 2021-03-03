import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import {
    CollectionInstitutionOutputDto,
    CollectionOutputDto, CollectionStatsOutputDto
} from './dto/Collection.output.dto';
import { CollectionFindAllParams } from './dto/coll-find-all.input.dto';
import { InstitutionService } from '../institution/institution.service';
import {
    CollectionInputDto,
    UpdateCollectionInputDto
} from './dto/Collection.input.dto';
import { Collection } from '@symbiota2/api-database';

@ApiTags('Collections')
@Controller('collections')
export class CollectionController {
    constructor(
        private readonly institutionService: InstitutionService,
        private readonly collections: CollectionService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto, isArray: true })
    async findAll(@Query() findAllParams: CollectionFindAllParams): Promise<CollectionOutputDto[]> {
        const collections = await this.collections.findAll(findAllParams);
        const collectionDtos = collections.map(async (c) => {
            return CollectionController.outputDtoFromEntity(c);
        });
        return Promise.all(collectionDtos);
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async findByID(@Param('id') id: number): Promise<CollectionOutputDto> {
        const collection = await this.collections.findByID(id);
        return CollectionController.outputDtoFromEntity(collection);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async create(@Body() data: CollectionInputDto): Promise<CollectionOutputDto> {
        const collection = await this.collections.create(data);
        return CollectionController.outputDtoFromEntity(collection);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Param('id') id: number): Promise<void> {
        const collection = await this.collections.deleteByID(id);
        if (!collection) {
            throw new NotFoundException();
        }
    }

    @Patch(':id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async updateByID(@Param('id') id: number, @Body() data: UpdateCollectionInputDto): Promise<CollectionOutputDto> {
        const collection = await this.collections.updateByID(id, data);
        if (!collection) {
            throw new NotFoundException();
        }
        return CollectionController.outputDtoFromEntity(collection);
    }

    static async outputDtoFromEntity(collection: Collection): Promise<CollectionOutputDto> {
        const dto = new CollectionOutputDto(collection);
        const stats = await collection.collectionStats;
        const institution = await collection.institution;

        dto.stats = new CollectionStatsOutputDto(stats);
        dto.institution = new CollectionInstitutionOutputDto(institution);

        return dto;
    }
}
