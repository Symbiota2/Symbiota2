import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from 'class-validator';
import { UserRoleName } from '@symbiota2/api-database';

export class RoleInputDto {
    @ApiProperty()
    @IsEnum(UserRoleName)
    @IsNotEmpty()
    name: UserRoleName;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    tablePrimaryKey?: number;
}
