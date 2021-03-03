import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { LanguageOutputDto } from './language.output.dto';

@ApiTags('Languages')
@Controller('languages')
export class LanguageController {
    constructor(private readonly languageService: LanguageService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: LanguageOutputDto, isArray: true })
    async findAll() {
        const languages = await this.languageService.findAll();
        return languages.map((l) => new LanguageOutputDto(l));
    }

    @Get('/:id')
    @ApiResponse({ status: HttpStatus.OK, type: LanguageOutputDto })
    async findByID(@Param('id') id: number) {
        const lang = await this.languageService.findByID(id);
        return new LanguageOutputDto(lang);
    }
}
