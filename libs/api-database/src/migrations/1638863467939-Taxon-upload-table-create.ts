import {MigrationInterface, QueryRunner} from "typeorm";

export class TaxonUploadTableCleanup1638863467939 implements MigrationInterface {
    name = 'TaxonUploadTableCleanup1638863467939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`taxonomy_upload\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filePath\` varchar(255) NOT NULL, \`mimeType\` varchar(255) NOT NULL, \`uniqueIDField\` varchar(255) NOT NULL, \`fieldMap\` text NOT NULL DEFAULT '{}', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`taxonomy_upload\``);
    }
}
