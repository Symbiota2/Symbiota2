import {MigrationInterface, QueryRunner} from "typeorm";

// This looks useless but whatever
export class RefreshTokens1636527024696 implements MigrationInterface {
    name = 'RefreshTokens1636527024696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_d1302d7b3ff994ff84234860ed\` ON \`userRefreshTokens\``);
        await queryRunner.query(`ALTER TABLE \`userRefreshTokens\` CHANGE \`clientID\` \`clientID\` varchar(36) NOT NULL DEFAULT UUID()`);
        await queryRunner.query(`ALTER TABLE \`userRefreshTokens\` CHANGE \`token\` \`token\` varchar(36) NOT NULL DEFAULT UUID()`);
        await queryRunner.query(`CREATE INDEX \`IDX_d1302d7b3ff994ff84234860ed\` ON \`userRefreshTokens\` (\`clientID\`, \`token\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_d1302d7b3ff994ff84234860ed\` ON \`userRefreshTokens\``);
        await queryRunner.query(`ALTER TABLE \`userRefreshTokens\` CHANGE \`token\` \`token\` varchar(36) NOT NULL DEFAULT uuid()`);
        await queryRunner.query(`ALTER TABLE \`userRefreshTokens\` CHANGE \`clientID\` \`clientID\` varchar(36) NOT NULL DEFAULT uuid()`);
        await queryRunner.query(`CREATE INDEX \`IDX_d1302d7b3ff994ff84234860ed\` ON \`userRefreshTokens\` (\`clientID\`, \`token\`)`);
    }

}
