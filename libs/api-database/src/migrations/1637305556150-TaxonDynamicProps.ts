import {MigrationInterface, QueryRunner} from "typeorm";

export class TaxonDynamicProps1637305556150 implements MigrationInterface {
    name = 'TaxonDynamicProps1637305556150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`taxa\` ADD \`dynamicProperties\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`taxa\` DROP COLUMN \`dynamicProperties\``);
    }

}
