import { RefreshToken } from './RefreshToken.entity';
import { User } from './User.entity';
import { UserAccessToken } from './UserAccessToken.entity';
import { UserRole } from './UserRole.entity'
import { UserNotification } from './UserNotification.entity';

export const providers = [
    RefreshToken.getProvider<RefreshToken>(),
    User.getProvider<User>(),
    UserAccessToken.getProvider<UserAccessToken>(),
    UserRole.getProvider<UserRole>(),
    UserNotification.getProvider<UserNotification>(),
];
