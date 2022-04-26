import {MigrationInterface, QueryRunner} from "typeorm";

export class lifeStageOccurrences1650853385499 implements MigrationInterface {
    name = 'lifeStageOccurrences1650853385499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`degreeOfEstablishment\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`degreeOfEstablishment\``);
    }

}
