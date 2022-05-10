import { RoleOutputDto, UserOutputDto } from "@symbiota2/api-auth";

export class UserPanel {
    user: UserOutputDto;
    permissions: RoleOutputDto[];
    isSuperAdmin: boolean;

    constructor(user: UserOutputDto, permissions: RoleOutputDto[]) {
        this.user = user;
        this.permissions = permissions;
        //       this.isSuperAdmin = this.hasPermission("SuperAdmin");
    }

    hasPermission(targetPermission: String): boolean {
        var hasPermission = false;
        this.permissions.forEach(role => {
            //console.log("Checking targetPermission: ", targetPermission, " against permission: ", role.name);
            if (role.name === targetPermission) {
                hasPermission = true;
            }
        })
        return hasPermission;
    }


    setPermission(targetPermission: String) {

    }
}