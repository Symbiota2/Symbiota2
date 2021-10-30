import {MigrationInterface, QueryRunner} from "typeorm";

export class OccurrenceCleanupAndCache1633626219613 implements MigrationInterface {
    name = 'OccurrenceCleanupAndCache1633626219613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN IF EXISTS `institutionID`");
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN IF EXISTS `collectionID`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `collectionID` varchar(255) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `institutionID` varchar(255) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
    }
}
