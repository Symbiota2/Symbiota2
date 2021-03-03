import { Inject, Injectable } from '@nestjs/common';
import { RefreshToken, User } from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';
import { AuthRole } from '../../auth/dto/interfaces';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @Inject(User.PROVIDER_ID)
        private readonly userRepo: Repository<User>,
        @Inject(RefreshToken.PROVIDER_ID)
        private readonly refreshTokenRepo: Repository<RefreshToken>) {

        super(userRepo);
    }

    async findByLogin(username: string): Promise<User> {
        return this.userRepo.findOne({ username });
    }

    async findByLoginWithPassword(username: string, password: string): Promise<User> {
        return this.userRepo.createQueryBuilder()
            .select()
            .where('username = :username', { username })
            .andWhere('password = PASSWORD(:password)', { password })
            .getOne();
    }

    async patchProfileData(uid: number, userData: Partial<User>): Promise<User> {
        return this.userRepo.save({ uid, ...userData });
    }

    async findAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    async updateLastLogin(uid: number): Promise<boolean> {
        const updateQuery = await this.userRepo.update(
            { uid },
            { lastLogin: new Date() }
        );
        return updateQuery.affected > 0;
    }

    async changePassword(uid: number, oldPassword: string, newPassword: string): Promise<boolean> {
        const updateResult = await this.userRepo.createQueryBuilder()
            .update()
            .set({ password: () => `PASSWORD('${newPassword}')` })
            .where('uid = :uid', { uid })
            .andWhere('password = PASSWORD(:oldPassword)', { oldPassword })
            .execute();

        return updateResult.affected > 0;
    }

    async hasRole(uidOrUser: number | User, role: AuthRole): Promise<boolean> {

        let user;

        if (uidOrUser instanceof User) {
            user = uidOrUser;
        }
        else {
            user = await this.findByID(uidOrUser);
        }

        if (!user) {
            return false;
        }

        const userRoles = await user.roles;
        const requestedRole = userRoles.find((userRole) => {
            return (
                userRole.name === role.role &&
                userRole.tableName === role.tableName &&
                userRole.tablePrimaryKey === role.tableKey
            );
        });

        return !!requestedRole;
    }
}
