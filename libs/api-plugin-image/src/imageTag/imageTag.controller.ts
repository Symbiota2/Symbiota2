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
    UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { ImageTagService } from './imageTag.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { ImageTagDto } from './dto/ImageTagDto'
import { ImageTagFindAllParams } from './dto/image-tag-find-all.input.dto'

@ApiTags('ImageTag')
@Controller('imageTag')
export class ImageTagController {

    constructor(private readonly myService: ImageTagService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: ImageTagDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of image records."
    })
    async findAll(@Query() findAllParams: ImageTagFindAllParams): Promise<ImageTagDto[]> {
        const imageTags = await this.myService.findAll(findAllParams)
        const imageTagDtos = imageTags.map(async (c) => {
            const image = new ImageTagDto(c)
            return image
        });
        return Promise.all(imageTagDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: ImageTagDto })
    @ApiOperation({
        summary: "Retrieve an image tag record by its ID."
    })
    async findByID(@Param('id') id: number): Promise<ImageTagDto> {
        const image = await this.myService.findByID(id)
        const dto = new ImageTagDto(image)
        return dto
    }

}
