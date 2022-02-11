import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageUploadTable1644607638906 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`imagefolder_upload\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filePath\` varchar(255) NOT NULL, \`mimeType\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`imagefolder_upload\``);
    }

}
