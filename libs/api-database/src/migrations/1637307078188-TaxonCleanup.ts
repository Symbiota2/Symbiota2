import {MigrationInterface, QueryRunner} from "typeorm";

export class TaxonCleanup1637307078188 implements MigrationInterface {
    name = 'TaxonCleanup1637307078188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`unitname1_index\` ON \`taxa\``);
        await queryRunner.query(`ALTER TABLE \`taxa\` DROP COLUMN \`UnitName1\``);
        await queryRunner.query(`ALTER TABLE \`taxa\` DROP COLUMN \`UnitName2\``);
        await queryRunner.query(`ALTER TABLE \`taxa\` DROP COLUMN \`UnitName3\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`taxa\` ADD \`UnitName3\` varchar(35) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`taxa\` ADD \`UnitName2\` varchar(50) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`taxa\` ADD \`UnitName1\` varchar(50) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`unitname1_index\` ON \`taxa\` (\`UnitName1\`, \`UnitName2\`)`);
    }

}
