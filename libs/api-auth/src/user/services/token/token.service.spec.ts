import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { DatabaseModule } from '@symbiota2/api-database';
import { UserService } from '../user/user.service';

describe('RefreshTokenService', () => {
    let service: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [TokenService],
        }).compile();

        service = module.get<TokenService>(TokenService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
