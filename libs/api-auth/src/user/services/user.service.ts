import { Inject, Injectable } from '@nestjs/common';
import { RefreshToken, User } from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';
import { CreateUserInputDto } from '../dto';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @Inject(User.PROVIDER_ID)
        private readonly userRepo: Repository<User>,
        @Inject(RefreshToken.PROVIDER_ID)
        private readonly refreshTokenRepo: Repository<RefreshToken>) {

        super(userRepo);
    }

    async findByLogin(username: string, fields?: Array<keyof User>): Promise<User> {
        return this.userRepo.findOne({
            select: fields,
            where: { username }
        });
    }

    async findByLoginWithPassword(username: string, password: string, fields?: Array<keyof User>): Promise<User> {
        return this.userRepo.createQueryBuilder()
            .select(fields)
            .where('username = :username', { username })
            .andWhere('password = PASSWORD(:password)', { password })
            .getOne();
    }

    async patchProfileData(uid: number, userData: Partial<User>): Promise<User> {
        return this.userRepo.save({ uid, ...userData });
    }

    async findAll(fields?: [keyof User]): Promise<User[]> {
        return this.userRepo.find({ select: fields });
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

    async createProfile(userData: CreateUserInputDto): Promise<User> {
        const { password, ...profileData } = userData;
        await this.userRepo.createQueryBuilder()
            .insert()
            .values({ ...profileData, password: () => `PASSWORD('${password}')` })
            .execute();

        return this.userRepo.findOne({ username: profileData.username });
    }
}
