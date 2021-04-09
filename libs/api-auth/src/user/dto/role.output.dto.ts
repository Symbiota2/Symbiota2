import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@symbiota2/api-database';
import { ApiUserRoleName, ApiUserRole } from '@symbiota2/data-access';

@Exclude()
export class RoleOutputDto implements ApiUserRole {
    constructor(role: UserRole) {
        Object.assign(this, role);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: ApiUserRoleName;

    @ApiProperty()
    @Expose()
    tablePrimaryKey: number;
}
