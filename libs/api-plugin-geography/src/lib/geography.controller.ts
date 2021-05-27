import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CountryListItem } from '@symbiota2/api-plugin-geography';

@ApiTags('Geography')
@Controller('geography')
export class GeographyController {
    constructor(private readonly countries: CountryService) { }

    @Get('country')
    @ApiResponse({ type: CountryListItem, isArray: true })
    async countryList(): Promise<CountryListItem[]> {
        const countries = await this.countries.findAll();
        return countries.map((country) => {
            return new CountryListItem(country);
        });
    }
}
