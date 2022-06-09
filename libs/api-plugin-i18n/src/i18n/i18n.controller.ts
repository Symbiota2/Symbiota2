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
import { I18nService } from './i18n.service'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFileInput, getCSVFields } from '@symbiota2/api-common';
import fs, { createReadStream } from 'fs';
import { Express } from 'express';
import { AuthenticatedRequest, JwtAuthGuard, TokenService } from '@symbiota2/api-auth';
import { Image } from '@symbiota2/api-database';
import path from 'path';
import { DeleteResult } from 'typeorm';
import { I18nInputDto } from './dto/I18nInputDto'
import { TaxonDescriptionStatementFindAllParams } from '../../../api-plugin-taxonomy/src/taxonDescriptionStatement/dto/taxonDescriptionStatement-find-all.input.dto';
import { I18nInputParams } from './dto/I18InputParams';

type File = Express.Multer.File
const fsPromises = fs.promises;

@ApiTags('I18n')
@Controller('i18n')
export class I18nController {

    constructor(private readonly myService: I18nService) { }

    private canEdit(request) {
        // SuperAdmins and TaxonProfileEditors have editing privileges
        const isSuperAdmin = TokenService.isSuperAdmin(request.user)
        const isEditor = false // TokenService.isImageEditor(request.user)
        return isSuperAdmin || isEditor
    }

    @Patch()
    @ApiOperation({
        summary: "Modify a i18n key/value pair, translating the modification into the various languages."
    })
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    @ApiResponse({ type: I18nInputDto })
    //@SerializeOptions({ groups: ['single'] })
    //@ApiBody({ type: I18nInputDto, isArray: true })
    /**
     @see - @link ImageInputDto
     **/
    async modify(
        // @Req() request: AuthenticatedRequest,
        // @Body(new ParseArrayPipe({ items: I18nInputDto })) data: I18nInputDto[]
        @Query() inputParams: I18nInputParams
    ): Promise<I18nInputDto> {
        // if (!this.canEdit(request)) {
        //    throw new ForbiddenException()
        //}

        console.log(" language is " + inputParams.language)
        console.log(" key is " + inputParams.key)
        console.log(" value is " + inputParams.value)
        console.log(" translatable is " + inputParams.translatable)
        const data = new I18nInputDto()
        data.language = inputParams.language
        data.key = inputParams.key
        data.value = inputParams.value
        data.translatable = inputParams.translatable
        const result = await this.myService.modify(data)
        return result
    }

}
