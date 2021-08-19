import {MigrationInterface, QueryRunner} from "typeorm";

export class OccurrenceCleanup1629164462307 implements MigrationInterface {
    name = 'OccurrenceCleanup1629164462307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `Index_sciname` ON `omoccurrences`");
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `institutionCode`");
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `collectionCode`");
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `scientificName`");
        await queryRunner.query("ALTER TABLE `omoccurrences` RENAME COLUMN `sciname` TO `scientificName`");

        // I don't know why these changed but hey, we'll go with it
        await queryRunner.query("ALTER TABLE `configurations` CHANGE `configurationName` `configurationName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `configurations` CHANGE `configurationValue` `configurationValue` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `configurations` CHANGE `configurationSide` `configurationSide` varchar(255) NULL");

        await queryRunner.query("ALTER TABLE `occurrence_upload` CHANGE `uniqueIDField` `uniqueIDField` varchar(255) NOT NULL");
        await queryRunner.query("CREATE INDEX `IDX_4377844adfb9ef709e5f133fa2` ON `omoccurrences` (`scientificName`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_4377844adfb9ef709e5f133fa2` ON `omoccurrences`");
        await queryRunner.query("ALTER TABLE `occurrence_upload` CHANGE `uniqueIDField` `uniqueIDField` varchar(255) NOT NULL DEFAULT ''");
        await queryRunner.query("ALTER TABLE `configurations` CHANGE `configurationSide` `configurationSide` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `configurations` CHANGE `configurationValue` `configurationValue` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `configurations` CHANGE `configurationName` `configurationName` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `omoccurrences` RENAME COLUMN `scientificName` TO `sciname`");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `scientificName` varchar(255) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `collectionCode` varchar(64) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `institutionCode` varchar(64) CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
        await queryRunner.query("CREATE INDEX `Index_sciname` ON `omoccurrences` (`sciname`)");
    }

}
