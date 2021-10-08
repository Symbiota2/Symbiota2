import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateArchiveQuery {
    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    publish: boolean;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    refresh: boolean;
}
