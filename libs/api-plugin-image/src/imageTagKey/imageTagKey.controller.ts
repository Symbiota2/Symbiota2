import {
    Controller,
    Get,
    Param,
    Query,
    HttpStatus, NotFoundException
} from '@nestjs/common';
import { ImageTagKeyService } from './imageTagKey.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { ImageTagKeyDto } from './dto/ImageTagKeyDto'
import { ImageTagKeyFindAllParams } from './dto/image-tag-key-find-all.input.dto'


@ApiTags('ImageTagKey')
@Controller('image/tagKey')
export class ImageTagKeyController {

    constructor(private readonly myService: ImageTagKeyService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: ImageTagKeyDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of image tagkey records.  Can use a list of image tagkey ids to filter the records, and a limit and/or offset."
    })
    async findAll(@Query() findAllParams: ImageTagKeyFindAllParams): Promise<ImageTagKeyDto[]> {
        const imageTags = await this.myService.findAll(findAllParams)
        const imageTagDtos = imageTags.map(async (c) => {
            const image = new ImageTagKeyDto(c)
            return image
        });
        return Promise.all(imageTagDtos)
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: ImageTagKeyDto })
    @ApiOperation({
        summary: "Retrieve an image tagkey record by its ID."
    })
    async findByID(@Param('id') id: number): Promise<ImageTagKeyDto> {
        const image = await this.myService.findByID(id)
        if (!image) {
            throw new NotFoundException("Image tag key id " + id + " is not present in the database.")
        }
        const dto = new ImageTagKeyDto(image)
        return dto
    }

}
