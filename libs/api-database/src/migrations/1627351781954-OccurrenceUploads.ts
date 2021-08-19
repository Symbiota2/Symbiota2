import {MigrationInterface, QueryRunner} from "typeorm";

export class OccurrenceUploads1627351781954 implements MigrationInterface {
    name = 'OccurrenceUploads1627351781954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `occurrence_upload` (`id` int NOT NULL AUTO_INCREMENT, `filePath` varchar(255) NOT NULL, `mimeType` varchar(255) NOT NULL, `uniqueIDField` varchar (255) NOT NULL DEFAULT '', `fieldMap` text NOT NULL DEFAULT '{}', PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user_notification` ADD CONSTRAINT `FK_d66c97c60908a4c106506c404e0` FOREIGN KEY (`uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_notification` DROP FOREIGN KEY `FK_d66c97c60908a4c106506c404e0`");
        await queryRunner.query("DROP TABLE `occurrence_upload`");
    }
}
