import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export abstract class BaseFindAllParams {
    @ApiProperty({ required: false, minimum: 0 })
    @IsInt()
    @IsOptional()
    @Min(0)
    limit: number;

    @ApiProperty({ required: false, minimum: 0 })
    @IsInt()
    @IsOptional()
    @Min(0)
    offset: number;
}
