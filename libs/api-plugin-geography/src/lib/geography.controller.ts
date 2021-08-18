import {
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param, Query
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country/country.service';
import {
    Continent,
    ContinentListItem,
} from './dto/Continent.output.dto';
import { ContinentService } from './continent/continent.service';
import { CountryListItem, Country } from './dto/Country.output.dto';
import { GeoFindOneQuery } from './dto/GeoFindOneQuery.input.dto';
import { Geometry } from 'wkx';
import { Province, ProvinceListItem } from './dto/Province.output.dto';
import { StateProvinceService } from './state-province/state-province.service';
import { ProvinceFindManyQuery } from './dto/ProvinceFindManyQuery.input.dto';
import { CountryFindAllQuery } from './dto/country-find-all-query';

type GeoJSON = Record<string, unknown>;

@ApiTags('Geography')
@Controller('geography')
export class GeographyController {
    private static readonly FMT_GEOJSON = 'geojson';

    constructor(
        private readonly continents: ContinentService,
        private readonly countries: CountryService,
        private readonly provinces: StateProvinceService) { }

    private static entityToGeoJSON(entity: { footprintWKT: string }): GeoJSON {
        const { footprintWKT, ...props } = entity;
        const geojson = Geometry.parse(footprintWKT).toGeoJSON();
        geojson['properties'] = props;
        return geojson;
    }

    @Get('continents')
    @ApiOperation({
        summary: "Retrieve a list of continents from the database"
    })
    @ApiResponse({ status: HttpStatus.OK, type: ContinentListItem, isArray: true })
    async continentList(): Promise<ContinentListItem[]> {
        const continents = await this.continents.findAll();
        return continents.map((continent) => {
            return new ContinentListItem(continent);
        });
    }

    @Get('continents/:id')
    @ApiOperation({
        summary: "Retrieve a specific continent by ID",
        description: "The output format can be specified using the query parameter format=wkt/geojson"
    })
    async continent(@Param('id') id: number, @Query() query: GeoFindOneQuery): Promise<Continent | GeoJSON> {
        const continent = await this.continents.findOne(id);
        if (!continent) {
            throw new NotFoundException();
        }
        if (query.format === GeographyController.FMT_GEOJSON) {
            return GeographyController.entityToGeoJSON(continent);
        }
        return new Continent(continent);
    }

    @Get('countries')
    @ApiOperation({
        summary: "Retrieve a list of countries from the database"
    })
    @ApiResponse({ status: HttpStatus.OK, type: CountryListItem, isArray: true })
    async countryList(@Query() params: CountryFindAllQuery): Promise<CountryListItem[]> {
        console.log(params);
        const countries = await this.countries.findAll(
            params.countryTerm,
            params.limit ? params.limit : null
        );
        return countries.map((country) => {
            return new CountryListItem(country);
        });
    }

    @Get('countries/:id')
    @ApiOperation({
        summary: "Retrieve a specific country by ID",
        description: "The output format can be specified using the query parameter format=wkt/geojson"
    })
    @ApiResponse({ status: HttpStatus.OK, type: Country })
    async country(@Param('id') id: number, @Query() query: GeoFindOneQuery): Promise<Country | GeoJSON> {
        const country = await this.countries.findOne(id);
        if (!country) {
            throw new NotFoundException();
        }
        if (query.format === GeographyController.FMT_GEOJSON) {
            return GeographyController.entityToGeoJSON(country);
        }
        return new Country(country);
    }

    @Get('provinces')
    @ApiOperation({
        summary: "Retrieve a list of states/provinces"
    })
    @ApiResponse({ status: HttpStatus.OK, type: ProvinceListItem, isArray: true })
    async provinceList(@Query() query: ProvinceFindManyQuery): Promise<ProvinceListItem[]> {
        const provinces = await this.provinces.findAll(
            query.limit,
            query.offset,
            query.countryID,
            query.stateTerm
        );
        return provinces.map((province) => {
            return new ProvinceListItem(province);
        });
    }

    @Get('provinces/:id')
    @ApiOperation({
        summary: "Retrieve a specific state/province by ID",
        description: "The output format can be specified using the query parameter format=wkt/geojson"
    })
    async province(@Param('id') id: number, @Query() query: GeoFindOneQuery): Promise<Province | GeoJSON> {
        const province = await this.provinces.findOne(id);
        if (!province) {
            throw new NotFoundException();
        }
        if (query.format === GeographyController.FMT_GEOJSON) {
            return GeographyController.entityToGeoJSON(province);
        }
        return new Province(province);
    }
}
