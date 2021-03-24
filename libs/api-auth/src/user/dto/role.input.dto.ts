import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum, IsInt,
    IsNotEmpty,
    IsOptional
} from 'class-validator';
import { UserRoleName } from '@symbiota2/api-database';
import { Type } from 'class-transformer';

export class RoleInputDto {
    @ApiProperty()
    @IsEnum(UserRoleName)
    @IsNotEmpty()
    name: UserRoleName;

    @ApiProperty({ required: false })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    tablePrimaryKey?: number;
}
