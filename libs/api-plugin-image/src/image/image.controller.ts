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
import { ImageService } from './image.service'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { ImageDto } from './dto/ImageDto'
import { ImageFindAllParams } from './dto/image-find-all.input.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFileInput } from '@symbiota2/api-common'
import { Express } from 'express';

type File = Express.Multer.File

@ApiTags('Image')
@Controller('image')
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

    @Get('photographerNames')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of distinct photographer names."
    })
    async findPhotographerNames(): Promise<String[]> {
        const images = await this.myService.findPhotographerNames()
        const s = images.map(async (c) => {
            return c.o_photographer
        });
        return Promise.all(s)
    }

    @Get('taxonIDs')
    @ApiResponse({ status: HttpStatus.OK, type: ImageDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of image records using a list of taxonIDs."
    })
    async findByTaxonIDs(@Query() findAllParams: ImageFindAllParams): Promise<ImageDto[]> {
        const images = await this.myService.findByTaxonIDs(findAllParams)
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

    @Post('upload/storage/single')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    // @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Upload an image file to storage service" })
    @ApiFileInput('file')
    // @UseGuards(SuperAdminGuard)
    async uploadTaxaDwcA(@UploadedFile() file: File) {
        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Invalid Image');
        }

        await this.myService.fromFile(file.path);
    }

}
