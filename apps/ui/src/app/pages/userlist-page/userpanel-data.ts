import { RoleOutputDto, UserOutputDto } from "@symbiota2/api-auth";

export class UserPanel {
    user: UserOutputDto;
    permissions: RoleOutputDto[];

    constructor(user: UserOutputDto, permissions: RoleOutputDto[]) {
        this.user = user;
        this.permissions = permissions;
    }
}