import {MigrationInterface, QueryRunner} from "typeorm";

export class RedundantOccurrenceFields1632242772596 implements MigrationInterface {
    name = 'RedundantOccurrenceFields1632242772596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `year`");
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `month`");
        await queryRunner.query("ALTER TABLE `omoccurrences` DROP COLUMN `day`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `day` int NULL");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `month` int NULL");
        await queryRunner.query("ALTER TABLE `omoccurrences` ADD `year` int NULL");
    }
}
