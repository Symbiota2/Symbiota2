import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export abstract class BaseFindAllParams {
    @ApiProperty({ required: false, minimum: 0 })
    @IsInt()
    @Min(0)
    limit: number;

    @ApiProperty({ required: false, minimum: 0 })
    @IsInt()
    @Min(0)
    offset: number;
}
