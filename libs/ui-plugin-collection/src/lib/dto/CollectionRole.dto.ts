import { ApiCollectionRoleInput, ApiCollectionRoleOutput, ApiCollectionRoleUser, ApiUserRoleName} from "@symbiota2/data-access";

export class CollectionRoleOutput implements ApiCollectionRoleOutput {
    id: number;
    name: ApiUserRoleName;
    user: ApiCollectionRoleUser;

    constructor(collectionRole: ApiCollectionRoleOutput) {
        Object.assign(this, collectionRole);
    }


}

export class CollectionRoleInput implements ApiCollectionRoleInput {
    uid: number
    role: ApiUserRoleName

    constructor(uid: number, role: ApiUserRoleName){
        this.uid = uid;
        this.role = role;
    }
}

export class CollectionRoleUser implements ApiCollectionRoleUser {
    uid: number;
    username: string;
    firstName: string;
    lastName: string;

    constructor(collectionRoleUser: ApiCollectionRoleUser) {
        Object.assign(this, collectionRoleUser);
    }

}