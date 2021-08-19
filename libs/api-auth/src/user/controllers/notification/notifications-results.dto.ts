import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserNotification } from '@symbiota2/api-database';

export class NotificationsResults {
    constructor(count: number, notifications: UserNotification[]) {
        this.count = count;
        this.notifications = notifications;
    }

    @ApiProperty()
    @Expose()
    count: number;

    @ApiProperty()
    @Expose()
    @Type(() => UserNotification)
    notifications: UserNotification[];
}
