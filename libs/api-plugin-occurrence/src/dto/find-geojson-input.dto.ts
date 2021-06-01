import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty } from 'class-validator';

export class FindGeoJSONInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsBase64()
    geojson: string;
}
