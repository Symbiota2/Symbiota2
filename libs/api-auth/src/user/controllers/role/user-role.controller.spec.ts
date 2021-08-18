import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleController } from './user-role.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { TokenService, UserService } from '@symbiota2/api-auth';

describe('UserRoleController', () => {
    let controller: UserRoleController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [
                UserService,
                TokenService
            ],
            controllers: [UserRoleController],
        }).compile();

        controller = module.get<UserRoleController>(UserRoleController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
