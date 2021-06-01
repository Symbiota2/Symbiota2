import {
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param, Query
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country/country.service';
import {
    Continent,
    ContinentListItem,
} from './dto/Continent.output.dto';
import { ContinentService } from './continent/continent.service';
import { CountryListItem, Country } from './dto/Country.output.dto';
import { FindOneQueryInput } from './dto/FindOneQuery.input.dto';
import { Geometry } from 'wkx';
import { EntityTarget } from 'typeorm';

type GeoJSON = Record<string, unknown>;

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
    async continent(@Param('id') id: number, @Query() query: FindOneQueryInput): Promise<Continent | GeoJSON> {
        const continent = await this.continents.findOne(id);
        if (!continent) {
            throw new NotFoundException();
        }
        if (query.format === 'geojson') {
            return GeographyController.entityToGeoJSON(continent);
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
    async country(@Param('id') id: number, @Query() query: FindOneQueryInput): Promise<Country | GeoJSON> {
        const country = await this.countries.findOne(id);
        if (!country) {
            throw new NotFoundException();
        }
        if (query.format === 'geojson') {
            return GeographyController.entityToGeoJSON(country);
        }
        return new Country(country);
    }

    private static entityToGeoJSON(entity: { footprintWKT: string }): GeoJSON {
        const { footprintWKT, ...props } = entity;
        const geojson = Geometry.parse(footprintWKT).toGeoJSON();
        geojson['properties'] = props;
        return geojson;
    }
}
