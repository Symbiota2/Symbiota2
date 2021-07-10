import { RefreshToken } from './RefreshToken.entity';
import { User } from './User.entity';
import { UserRole } from './UserRole.entity'

export const providers = [
    RefreshToken.getProvider<RefreshToken>(),
    User.getProvider<User>(),
    UserRole.getProvider<UserRole>()
];
