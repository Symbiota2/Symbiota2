import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum, IsInt,
    IsNotEmpty,
    IsOptional
} from 'class-validator';
import { UserRoleName } from '@symbiota2/api-database';
import { Type } from 'class-transformer';
import { ApiInputUserRole } from '@symbiota2/data-access';

export class RoleInputDto implements ApiInputUserRole {
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
