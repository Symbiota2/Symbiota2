import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateGraphQuery {
    @ApiProperty({ required: true })
    @IsOptional()
    name: string;
}
