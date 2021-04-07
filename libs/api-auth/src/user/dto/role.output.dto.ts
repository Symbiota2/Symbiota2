import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@symbiota2/api-database';
import { ApiOutputUserRole } from '@symbiota2/data-access';

@Exclude()
export class RoleOutputDto implements ApiOutputUserRole {
    constructor(role: UserRole) {
        Object.assign(this, role);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    tablePrimaryKey: number;
}
