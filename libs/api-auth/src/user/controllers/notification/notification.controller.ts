import {
    Controller, Delete,
    ForbiddenException,
    Get, NotFoundException,
    Param,
    Req,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserNotification } from '@symbiota2/api-database';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationGuard } from './notification.guard';
import { NotificationsResults } from './notifications-results.dto';

@ApiTags('Users')
@Controller('users/:uid/notifications')
@UseGuards(NotificationGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    @ApiOperation({
        summary: 'Retrieves the 5 most recent notifications for the given user'
    })
    @ApiBearerAuth()
    async getAllNotifications(@Param('uid') uid: number): Promise<NotificationsResults> {
        const [notifications, count] = await this.notificationService.findAllAndCount(uid);
        return new NotificationsResults(count, notifications);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete all notifications for a user' })
    @ApiBearerAuth()
    async deleteAll(@Param('uid') uid: number): Promise<{ deleted: number }> {
        const deleted = await this.notificationService.deleteAllForUser(uid);
        return { deleted };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a notification by ID' })
    @ApiBearerAuth()
    async deleteNotificationByID(@Param('id') id: number): Promise<void> {
        const success = await this.notificationService.deleteByID(id);
        if (!success) {
            throw new NotFoundException();
        }
        // TODO: We should probably return the new list of notifications in order to save the UI an extra request
    }
}
