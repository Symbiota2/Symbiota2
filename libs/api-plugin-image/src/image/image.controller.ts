import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { ImageService } from './image.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { ImageDto } from './dto/ImageDto'
import { ImageFindAllParams } from './dto/image-find-all.input.dto'

@ApiTags('Image')
@Controller('Image')
export class ImageController {
    constructor(private readonly myService: ImageService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: ImageDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of image records."
    })
    async findAll(@Query() findAllParams: ImageFindAllParams): Promise<ImageDto[]> {
        const images = await this.myService.findAll(findAllParams)
        const taxonDtos = images.map(async (c) => {
            const image = new ImageDto(c)
            return image
        });
        return Promise.all(taxonDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: ImageDto })
    @ApiOperation({
        summary: "Retrieve an image record by its ID."
    })
    async findByID(@Param('id') id: number): Promise<ImageDto> {
        const image = await this.myService.findByID(id)
        const dto = new ImageDto(image)
        return dto
    }

}
