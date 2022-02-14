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
    UseInterceptors, UploadedFile, BadRequestException, UseGuards, Req, ParseArrayPipe, ForbiddenException, Res
} from '@nestjs/common';
import { ImageService } from './image.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ImageDto } from './dto/ImageDto'
import { ImageFindAllParams } from './dto/image-find-all.input.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFileInput, getCSVFields } from '@symbiota2/api-common';
import fs, { createReadStream } from 'fs';
import { Express } from 'express';
import { PhotographerNameAndIDDto } from './dto/PhotographerNameAndIDDto';
import { ImageSearchParams } from './dto/ImageSearchParams';
import { AuthenticatedRequest, JwtAuthGuard, TokenService } from '@symbiota2/api-auth';
import { TaxonDto } from '../../../api-plugin-taxonomy/src/taxon/dto/TaxonDto';
import { Image, ImageFolderUpload, Taxon, TaxonomyUpload } from '@symbiota2/api-database';
import { ImageInputDto } from './dto/ImageInputDto';
import { ImageAndTaxonDto } from './dto/ImageAndTaxonDto';
import path from 'path';

type File = Express.Multer.File
const fsPromises = fs.promises;

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

    @Get('photographers')
    @ApiResponse({ status: HttpStatus.OK, type: PhotographerNameAndIDDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of distinct photographer names and ids (basic photographer info)."
    })
    async findPhotographers(): Promise<PhotographerNameAndIDDto[]> {
        const images = await this.myService.findPhotographers()
        const s = images.map(async (c) => {
            //return c.o_photographer
            return new PhotographerNameAndIDDto(c)
        });
        return Promise.all(s)
    }

    @Get('photographerNames')
    @ApiResponse({ status: HttpStatus.OK, type: PhotographerNameAndIDDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of distinct photographer names."
    })
    async findPhotographerNames(): Promise<string[]> {
        const images = await this.myService.findPhotographerNames()
        const s = images.map(async (c) => {
            return c.photographerName //.o_photographer
        });
        return Promise.all(s)
    }

    @Get('imageTypes')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of image types"
    })
    async findImageTypes(): Promise<string[]> {
        const images = await this.myService.findImageTypes()
        const s = images.map(async (c) => {
            return c.type //, c.sortSequence.toString()]
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

    @Get('search')
    @ApiResponse({ status: HttpStatus.OK, type: ImageAndTaxonDto, isArray: true })
    @ApiOperation({
        summary: "Retrieve a list of image records and associated taxon info using a slew of potential filters: scientific names, common names, image types, image tags, country, province, taxaids, range of dates for occurrence identification, and photographer names"
    })
    async imageSearch(@Query() searchParams: ImageSearchParams): Promise<ImageAndTaxonDto[]> {
        const images = await this.myService.imageSearch(searchParams)
        const result = []
        let taxonSkip : boolean = false
        let occurrenceSkip : boolean = false
        let previousTaxonID = -1
        let previousOccurrenceID = -1
        for (const image of images) {
            const taxon = await image.taxon
            const taxonDto = new TaxonDto(taxon)
            const imageDto = new ImageAndTaxonDto(image, taxonDto)
            imageDto.taxon = taxonDto
            if (searchParams.limitTaxons) {
                taxonSkip = (imageDto.taxonID) && (imageDto.taxonID == previousTaxonID)
                previousTaxonID = imageDto.taxonID
            }
            if (searchParams.limitOccurrences) {
                occurrenceSkip = (imageDto.occurrenceID) && (imageDto.occurrenceID == previousOccurrenceID)
                previousOccurrenceID = imageDto.occurrenceID
            }
            if (!(taxonSkip || occurrenceSkip)) {
                result.push(imageDto)
            }
        }
        /*
        const dtos = images.map((c) => {
            const taxon = c.taxon
            const taxonDto = new TaxonDto(taxon)
            const image = new ImageDto(c)
            return image
        })
        return Promise.all(dtos)
         */
        return Promise.all(result)
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

    @Get('imglib/:fileName')
    @ApiOperation({
        summary: "Retrieve an image from the image library using the filename it was stored under."
    })
    async getFile(@Param('fileName') fileName : string, @Res() res): Promise<any> {
        res.sendFile(fileName, { root: ImageService.imageLibraryFolder});
    }

    @Get('imglibenv/:fileName')
    @ApiOperation({
        summary: "Retrieve env."
    })
    async getEnv(@Param('fileName') fileName : string): Promise<any> {
        return ImageService.imageLibraryFolder
    }

    @Post('imglib')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    /*
    @UseInterceptors(FileInterceptor(
        'file',
        {
            dest: '.' + ImageService.imageUploadFolder
        }))

     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Upload an image file to the imglib (local disk storage)" })
    @ApiFileInput('file')
    // @UseGuards(SuperAdminGuard)
    async uploadImglib(
        @Req() request: AuthenticatedRequest,
        @UploadedFile() file: File) : Promise<string[]>
    {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Invalid Image');
        }
        return await this.myService.fromFileToLocalStorage(file.originalname, file.filename, file.mimetype)
    }

    @Post('upload/storage/single')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    /*
    @UseInterceptors(FileInterceptor(
        'file',
        {
            dest: ImageService.imageUploadFolder
        }))
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Upload an image file to storage service" })
    @ApiFileInput('file')
    // @UseGuards(SuperAdminGuard)
    async uploadStorageSingle(
        @Req() request: AuthenticatedRequest,
        @UploadedFile() file: File)
    {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Invalid Image');
        }
        await this.myService.fromFileToStorageService(file.originalname, file.filename, file.mimetype)
    }

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isEditor = false // TokenService.isImageEditor(request.user)
        return isSuperAdmin || isEditor
    }

    @Post()
    @ApiOperation({
        summary: "Create a new image record"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ type: ImageDto })
    //@SerializeOptions({ groups: ['single'] })
    @ApiBody({ type: ImageInputDto, isArray: true })
    /**
     @see - @link ImageInputDto
     **/
    async create(
        @Req() request: AuthenticatedRequest,
        @Body(new ParseArrayPipe({ items: ImageInputDto })) data: ImageInputDto[]
    ): Promise<ImageDto> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const image = await this.myService.create(data[0])
        const dto = new ImageDto(image)
        return dto
    }

    @Patch('upload/:id')
    @ApiOperation({
        summary: "Update an image by ID"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: Image })
    @ApiBody({ type: ImageInputDto, isArray: true })
    //@SerializeOptions({ groups: ['single'] })
    async updateByID(
        @Req() request: AuthenticatedRequest,
        @Param('id') id: number,
        @Body(new ParseArrayPipe({ items: ImageInputDto })) data: Image[]
    ): Promise<Image> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const image = await this.myService.updateByID(id, data[0])
        if (!image) {
            throw new NotFoundException()
        }
        return image
    }

    @Delete('upload/:id')
    @ApiOperation({
        summary: "Delete an image by ID"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async deleteByID(@Req() request: AuthenticatedRequest, @Param('id') id: number): Promise<void> {
        if (!this.canEdit(request)) {
            throw new ForbiddenException()
        }

        const block = await this.myService.deleteByID(id)
        if (!block) {
            throw new NotFoundException()
        }
    }

    @Post('zipUpload')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('file'))
    //@UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Upload a zipped folder of images"
    })
    @ApiFileInput('file')
    async uploadZipFile(@UploadedFile() file: File): Promise<ImageFolderUpload> {
        let upload: ImageFolderUpload

        if (!file) {
            throw new BadRequestException('File not specified');
        }

        console.log(" mime is " + file.mimetype)
        if (file.mimetype.startsWith('application/zip') ||
            file.mimetype.startsWith('application/x-zip-compressed')) {
            //const headers = await getCSVFields(file.path);

            upload = await this.myService.createUpload(
                path.resolve(file.path),
                file.mimetype
            );
        }
        else {
            await fsPromises.unlink(file.path);
            throw new BadRequestException('Unsupported file type: .zip file is supported');
        }

        return upload;
    }


}
