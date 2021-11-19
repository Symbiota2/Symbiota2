import {MigrationInterface, QueryRunner} from "typeorm";

export class TaxonNotesExpand1637307200567 implements MigrationInterface {
    name = 'TaxonNotesExpand1637307200567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`taxa\` DROP COLUMN \`Notes\``);
        await queryRunner.query(`ALTER TABLE \`taxa\` ADD \`Notes\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`taxa\` DROP COLUMN \`Notes\``);
        await queryRunner.query(`ALTER TABLE \`taxa\` ADD \`Notes\` varchar(250) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL`);
    }

}
