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
    UseInterceptors, UploadedFile, BadRequestException, UseGuards, Req, ForbiddenException
} from '@nestjs/common';
import { ImageTagService } from './imageTag.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ImageTagDto } from './dto/ImageTagDto'
import { ImageTagFindAllParams } from './dto/image-tag-find-all.input.dto'
import { AuthenticatedRequest, JwtAuthGuard, TokenService } from '@symbiota2/api-auth';

@ApiTags('ImageTag')
@Controller('imageTag')
export class ImageTagController {

    constructor(private readonly myService: ImageTagService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: ImageTagDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of image tag records.  Can use a list of image tag ids and/or a list of image ids to filter the records.  Limit and/or offset only apply if no ids are used."
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
        if (!image) {
            throw new NotFoundException("Image tag id " + id + " is not present in the database.")
        }
        const dto = new ImageTagDto(image)
        return dto
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete an image tag by ID"
    })
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.OK })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<boolean> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const image = await this.myService.deleteByID(id)
        if (!image) {
            throw new NotFoundException()
        }
        return image
    }

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isEditor = false // TokenService.isImageEditor(request.user)
        return isSuperAdmin || isEditor
    }

}
