import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@symbiota2/api-database';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private users: UserService) {
        super();
    }

    async validate(username: string, passwordStr: string): Promise<User> {
        const user = await this.users.findByLoginWithPassword(
            username,
            passwordStr
        );

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
