import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum, IsInt,
    IsNotEmpty,
    IsOptional
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiCreateUserRoleData, ApiUserRoleName } from '@symbiota2/data-access';

/**
 * Object representing the body of a POST request for adding a new role to
 * a user
 */
export class UserRoleInputDto implements ApiCreateUserRoleData {
    constructor(name: ApiUserRoleName) {
        this.name = name;
    }

    @ApiProperty()
    @IsNotEmpty()
    name: ApiUserRoleName;

    @ApiProperty({ required: false })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    tablePrimaryKey?: number;
}
