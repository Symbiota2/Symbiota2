import { Inject, Injectable } from '@nestjs/common';
import { UserNotification } from '@symbiota2/api-database';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
    private static readonly NOTIFICATIONS_LIMIT = 3;

    constructor(
        @Inject(UserNotification.PROVIDER_ID)
        private readonly notificationRepo: Repository<UserNotification>) { }

    /**
     * Pushes one or more notifications for the given user
     * @param uid The user's id
     * @param messages The notification messages
     */
    async add(uid: number, ...messages: string[]) {

        const notifications: UserNotification[] = [];
        for (const message of messages) {
            const notification = this.notificationRepo.create({
                uid,
                message,
            });
            notifications.push(notification);
        }

        await this.notificationRepo.save(notifications);
    }

    /**
     * Retrieves one or more notifications for the given user
     * @param uid The user
     */
    async findAllAndCount(uid: number): Promise<[UserNotification[], number]> {
        return await this.notificationRepo.findAndCount({
            where: { uid },
            take: NotificationService.NOTIFICATIONS_LIMIT,
            order: { 'createdAt': 'ASC' }
        });
    }

    /**
     * Deletes the notification with the given ID. Returns whether a notification
     * with the given ID was found & deleted.
     */
    async deleteByID(notificationID: number): Promise<boolean> {
        const notification = await this.notificationRepo.findOne({ id: notificationID });
        if (!notification) {
            return false;
        }
        await this.notificationRepo.remove(notification);
        return true;
    }

    async deleteAllForUser(uid: number): Promise<number> {
        const deleted = await this.notificationRepo.delete({ uid });
        return deleted.affected;
    }
}
