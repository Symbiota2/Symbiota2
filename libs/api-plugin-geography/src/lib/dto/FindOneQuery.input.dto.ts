import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

@Exclude()
export class FindOneQueryInput {
    @ApiProperty({ type: String, required: false, default: 'wkt' })
    @Expose()
    @IsEnum(['wkt', 'geojson'])
    format = 'wkt';
}
