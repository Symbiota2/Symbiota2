import { ApiUserRole, ApiUserRoleName } from '@symbiota2/data-access';
import { Expose, Type } from 'class-transformer';

@Expose()
export class UserRole implements ApiUserRole {
    id: number;

    @Type(() => String)
    name: ApiUserRoleName;

    tablePrimaryKey: number;
}
