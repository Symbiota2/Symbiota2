import {MigrationInterface, QueryRunner} from "typeorm";

export class RefreshToken1611870856572 implements MigrationInterface {
    name = 'RefreshToken1611870856572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `clientID_unique` ON `userRefreshTokens`");
        await queryRunner.query("CREATE INDEX `IDX_d1302d7b3ff994ff84234860ed` ON `userRefreshTokens` (`clientID`, `token`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_d1302d7b3ff994ff84234860ed` ON `userRefreshTokens`");
        await queryRunner.query("CREATE UNIQUE INDEX `clientID_unique` ON `userRefreshTokens` (`clientID`)");
    }

}
