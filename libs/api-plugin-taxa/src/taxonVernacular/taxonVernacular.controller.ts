import { Controller, Get, Param, Query, Post, Body, HttpStatus, HttpCode, Delete, NotFoundException, Patch } from '@nestjs/common';
import { TaxonVernacularService } from './taxonVernacular.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import {
    TaxonVernacularOutputDto
} from './dto/TaxonVernacular.output.dto';
import { TaxonVernacularFindAllParams } from './dto/taxonVernacular-find-all.input.dto';

@ApiTags('TaxonVernacular')
@Controller('taxonVernacular')
export class TaxonVernacularController {
    constructor(private readonly myService: TaxonVernacularService) { }
    public static taxaAuthorityID = 1  // default taxa authority ID

    // The default controller fetches all of the records
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto, isArray: true })
    async findAll(@Query() findAllParams: TaxonVernacularFindAllParams): Promise<TaxonVernacularOutputDto[]> {
        const taxons = await this.myService.findAll(findAllParams)
        const taxonDtos = taxons.map(async (c) => {
            const taxon = new TaxonVernacularOutputDto(c)
            return taxon
        });
        return Promise.all(taxonDtos)
    }

    // Get a list of all the languages
    @Get('languages')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    async findAllLanguages(): Promise<string[]> {
        const myRows = await this.myService.findAllLanguages()
        const languages = myRows.map(async (language) => {
            //console.log("lanuage is " + await language.language)
            return language.language
        })
        return Promise.all(languages)
    }

    // Get a list of all the common names
    @Get('commonNames')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    async findAllCommonNames(@Query() findAllParams: TaxonVernacularFindAllParams): Promise<string[]> {
        const myRows = await this.myService.findAllCommonNames(findAllParams)
        const names = myRows.map(async (row) => {
            return row.vernacularName
        })
        return Promise.all(names)
    }

    // Get a list of all the common names
    @Get('commonNamesByLanguage/:language')
    @ApiResponse({ status: HttpStatus.OK, type: String, isArray: true })
    async findAllCommonNamesByLanguage(@Param('language') language: string, @Query() findAllParams: TaxonVernacularFindAllParams): Promise<string[]> {
        const myRows = await this.myService.findAllCommonNamesByLanguage(language,findAllParams)
        const names = myRows.map(async (row) => {
            return row.vernacularName
        })
        return Promise.all(names)
    }

    // The commonName controller finds using a common name
    @Get('commonName/:commonName')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto })
    async findByCommonName(@Param('commonName') commonName: string): Promise<TaxonVernacularOutputDto> {
        const name = await this.myService.findByCommonName(commonName)
        const dto = new TaxonVernacularOutputDto(name[0])
        return dto
    }

    @Get(':taxonid')
    @ApiResponse({ status: HttpStatus.OK, type: TaxonVernacularOutputDto })
    async findByTID(@Param('taxonid') id: number): Promise<TaxonVernacularOutputDto> {
        const taxon = await this.myService.findByTID(id)
        const dto = new TaxonVernacularOutputDto(taxon)
        return dto
    }

}
