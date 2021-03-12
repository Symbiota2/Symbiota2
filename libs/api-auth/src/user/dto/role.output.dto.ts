import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@symbiota2/api-database';

@Exclude()
export class RoleOutputDto {
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
