import {
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country/country.service';
import {
    Continent,
    ContinentListItem,
} from './dto/Continent.output.dto';
import { ContinentService } from './continent/continent.service';
import { CountryListItem, Country } from './dto/Country.output.dto';

@ApiTags('Geography')
@Controller('geography')
export class GeographyController {
    constructor(
        private readonly continents: ContinentService,
        private readonly countries: CountryService) { }

    @Get('continents')
    async continentList(): Promise<ContinentListItem[]> {
        const continents = await this.continents.findAll();
        return continents.map((continent) => {
            return new ContinentListItem(continent);
        });
    }

    @Get('continents/:id')
    async continent(@Param('id') id: number): Promise<Continent> {
        const continent = await this.continents.findOne(id);
        if (!continent) {
            throw new NotFoundException();
        }
        return new Continent(continent);
    }

    @Get('countries')
    @ApiResponse({ status: HttpStatus.OK, type: CountryListItem, isArray: true })
    async countryList(): Promise<CountryListItem[]> {
        const countries = await this.countries.findAll();
        return countries.map((country) => {
            return new CountryListItem(country);
        });
    }

    @Get('countries/:id')
    @ApiResponse({ status: HttpStatus.OK, type: Country })
    async country(@Param('id') id: number): Promise<Country> {
        const country = await this.countries.findOne(id);
        if (!country) {
            throw new NotFoundException();
        }
        return new Country(country);
    }
}
