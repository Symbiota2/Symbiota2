import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsString } from 'class-validator';
import { ApiUserRoleName } from '@symbiota2/data-access';

class CollectionRoleUser {
    @ApiProperty()
    @Expose()
    uid: number;

    @ApiProperty()
    @Expose()
    username: string;

    @ApiProperty()
    @Expose()
    firstName: string;

    @ApiProperty()
    @Expose()
    lastName: string;
}

export class CollectionRole {
    constructor(roleData: any) {
        Object.assign(this, roleData);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    @Type(() => CollectionRoleUser)
    user: CollectionRoleUser;
}

export class CreateCollectionRoleBody {
    @ApiProperty()
    @IsInt()
    uid: number;

    @ApiProperty()
    @IsString()
    @IsEnum(ApiUserRoleName)
    role: ApiUserRoleName;
}
