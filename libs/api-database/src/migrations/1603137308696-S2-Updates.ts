import {MigrationInterface, QueryRunner} from 'typeorm';

export class S2Updates1603137308696 implements MigrationInterface {
    name = 'S2Updates1603137308696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `fmprojects` MODIFY `projname` varchar(90) NOT NULL');
        await queryRunner.query('ALTER TABLE `userlogin` MODIFY `password` varchar(255) NOT NULL');
        await queryRunner.query('ALTER TABLE `taxonunits` MODIFY `rankname` varchar(255) NOT NULL');
        await queryRunner.query('ALTER TABLE `taxadescrblock` ADD CONSTRAINT `FK_82a30081de13015881f59368e89` FOREIGN KEY (`uid`) REFERENCES `users`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `omoccuredits` ADD `editType` tinyint UNSIGNED NOT NULL COMMENT \'0 = general edit, 1 = batch edit\' DEFAULT 0');

        await queryRunner.query('CREATE TABLE `userRefreshTokens` (`uid` int UNSIGNED NOT NULL, `clientID` varchar(36) NOT NULL, `token` varchar(36) NOT NULL, `expiresAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), UNIQUE INDEX `clientID_unique` (`clientID`), PRIMARY KEY (`uid`, `clientID`, `token`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE `configurations` (`id` int NOT NULL AUTO_INCREMENT, `configurationName` varchar(255) NOT NULL, `configurationValue` varchar(255) NOT NULL, `configurationSide` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `userRefreshTokens` ADD CONSTRAINT `FK_53686dfd96d685e425311bb6fa8` FOREIGN KEY (`uid`) REFERENCES `users`(`uid`) ON DELETE CASCADE ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `omoccuredits` DROP COLUMN `editType`');
        await queryRunner.query('ALTER TABLE `taxadescrblock` DROP FOREIGN KEY `FK_82a30081de13015881f59368e89`');
        await queryRunner.query('ALTER TABLE `taxonunits` MODIFY `rankname` varchar(15) NOT NULL');
        await queryRunner.query('ALTER TABLE `userlogin` MODIFY `password` varchar(45) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NOT NULL');
        await queryRunner.query('ALTER TABLE `fmprojects` MODIFY `projname` varchar(45) CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL');

        await queryRunner.query('DROP INDEX `clientID_unique` ON `userRefreshTokens`');
        await queryRunner.query('DROP TABLE `configurations`');
        await queryRunner.query('DROP TABLE `userRefreshTokens`');
    }
}
