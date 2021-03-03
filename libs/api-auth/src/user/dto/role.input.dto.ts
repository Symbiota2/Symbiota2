import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleInputDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string;

    @ApiProperty({ required: false })
    @Expose()
    tablePrimaryKey?: number;
}
