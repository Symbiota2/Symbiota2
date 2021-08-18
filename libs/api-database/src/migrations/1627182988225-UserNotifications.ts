import {MigrationInterface, QueryRunner} from "typeorm";

export class UserNotifications1627182988225 implements MigrationInterface {
    name = 'UserNotifications1627182988225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_notification` (`id` int NOT NULL AUTO_INCREMENT, `uid` int UNSIGNED NOT NULL, `message` text NOT NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), INDEX `IDX_d66c97c60908a4c106506c404e` (`uid`), INDEX `IDX_9eaa8c44a1741b5d69af5b3f2c` (`createdAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user_notification`");
    }
}
