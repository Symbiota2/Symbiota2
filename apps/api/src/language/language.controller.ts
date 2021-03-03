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
    findAll() {
        return this.languageService.findAll();
    }

    @Get('/:id')
    @ApiResponse({ status: HttpStatus.OK, type: LanguageOutputDto })
    findByID(@Param('id') id: number) {
        return this.languageService.findByID(id);
    }
}
