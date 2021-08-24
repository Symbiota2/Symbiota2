import {MigrationInterface, QueryRunner} from "typeorm";

export class LongerInfoWitheld1627373339635 implements MigrationInterface {
    name = 'LongerInfoWitheld1627373339635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `informationWithheld`");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `informationWithheld` varchar(500) NULL");
        await queryRunner.query("ALTER TABLE `occurrence_upload` CHANGE `fieldMap` `fieldMap` text NOT NULL DEFAULT '{}'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `occurrence_upload` CHANGE `fieldMap` `fieldMap` text NOT NULL DEFAULT ''");
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `informationWithheld`");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `informationWithheld` varchar(250) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
    }
}
