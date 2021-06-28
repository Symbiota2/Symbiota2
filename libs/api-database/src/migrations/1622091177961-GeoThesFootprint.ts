import {MigrationInterface, QueryRunner} from "typeorm";

export class GeoThesFootprint1622091177961 implements MigrationInterface {
    name = 'GeoThesFootprint1622091177961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `geothesstateprovince` DROP COLUMN `footprintWKT`");
        await queryRunner.query("ALTER TABLE `geothesstateprovince` ADD `footprintWKT` longtext NULL");
        await queryRunner.query("ALTER TABLE `geothescountry` DROP COLUMN `footprintWKT`");
        await queryRunner.query("ALTER TABLE `geothescountry` ADD `footprintWKT` longtext NULL");
        await queryRunner.query("ALTER TABLE `geothescontinent` DROP COLUMN `footprintWKT`");
        await queryRunner.query("ALTER TABLE `geothescontinent` ADD `footprintWKT` longtext NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `geothescontinent` DROP COLUMN `footprintWKT`");
        await queryRunner.query("ALTER TABLE `geothescontinent` ADD `footprintWKT` text CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `geothescountry` DROP COLUMN `footprintWKT`");
        await queryRunner.query("ALTER TABLE `geothescountry` ADD `footprintWKT` text CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
        await queryRunner.query("ALTER TABLE `geothesstateprovince` DROP COLUMN `footprintWKT`");
        await queryRunner.query("ALTER TABLE `geothesstateprovince` ADD `footprintWKT` text CHARACTER SET \"utf8\" COLLATE \"utf8_general_ci\" NULL");
    }
}
