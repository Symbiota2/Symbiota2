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
    UseGuards, BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import {
    CollectionInstitutionOutputDto,
    CollectionOutputDto, CollectionStatsOutputDto
} from './dto/Collection.output.dto';
import { CollectionFindAllParams } from './dto/coll-find-all.input.dto';
import { InstitutionService } from './institution/institution.service';
import {
    CollectionInputDto,
    UpdateCollectionInputDto
} from './dto/Collection.input.dto';
import { Collection } from '@symbiota2/api-database';
import { JwtAuthGuard } from '@symbiota2/api-auth';
import {
    ProtectCollection,
} from './collection-edit-guard/decorators';

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
        const collectionDtos = collections.map((c) => {
            return new CollectionOutputDto(c);
        });
        return Promise.all(collectionDtos);
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async findByID(@Param('id') id: number): Promise<CollectionOutputDto> {
        const collection = await this.collections.findByID(id);
        return new CollectionOutputDto(collection);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async create(@Body() data: CollectionInputDto): Promise<CollectionOutputDto> {
        const collection = await this.collections.create(data);
        return new CollectionOutputDto(collection);
    }

    @Delete(':id')
    @ProtectCollection('id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Param('id') id: number): Promise<void> {
        try {
            const collection = await this.collections.deleteByID(id);

            if (!collection) {
                throw new NotFoundException();
            }
        }
        catch (e) {
            throw new BadRequestException(e.toString());
        }
    }

    @Patch(':id')
    @ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionOutputDto })
    async updateByID(@Param('id') id: number, @Body() data: UpdateCollectionInputDto): Promise<CollectionOutputDto> {
        const collection = await this.collections.updateByID(id, data);
        if (!collection) {
            throw new NotFoundException();
        }
        return new CollectionOutputDto(collection);
    }
}
