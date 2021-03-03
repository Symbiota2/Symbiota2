import {MigrationInterface, QueryRunner} from 'typeorm';

export class KmcharDependence1603223320445 implements MigrationInterface {
    name = 'KmcharDependence1603223320445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('RENAME TABLE `kmchardependance` TO `kmchardependence`');
        await queryRunner.query('ALTER TABLE `kmchardependence` DROP FOREIGN KEY `FK_79d18b7880bd4bcb26e8a1c5c59`');
        await queryRunner.query('DROP INDEX `IDX_79d18b7880bd4bcb26e8a1c5c5` ON `kmchardependence`');
        await queryRunner.query('DROP INDEX `IDX_9387b27d14fc58f0827d2ec420` ON `kmchardependence`');
        await queryRunner.query('DROP INDEX `IDX_7092a09c7f396257a26deb6366` ON `kmchardependence`');
        await queryRunner.query('CREATE INDEX `IDX_98a2d34217f1b52c8f5dbbd0a5` ON `kmchardependence` (`CIDDependance`, `CSDependance`)');
        await queryRunner.query('CREATE INDEX `IDX_ee40d5e32c420c2e145abc92c2` ON `kmchardependence` (`CIDDependance`)');
        await queryRunner.query('CREATE INDEX `IDX_3419625ae605a198c3ca6a9c45` ON `kmchardependence` (`CID`)');
        await queryRunner.query('ALTER TABLE `kmchardependence` ADD CONSTRAINT `FK_98a2d34217f1b52c8f5dbbd0a5d` FOREIGN KEY (`CIDDependance`, `CSDependance`) REFERENCES `kmcs`(`cid`,`cs`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `kmchardependence` DROP FOREIGN KEY `FK_98a2d34217f1b52c8f5dbbd0a5d`');
        await queryRunner.query('DROP INDEX `IDX_3419625ae605a198c3ca6a9c45` ON `kmchardependence`');
        await queryRunner.query('DROP INDEX `IDX_ee40d5e32c420c2e145abc92c2` ON `kmchardependence`');
        await queryRunner.query('DROP INDEX `IDX_98a2d34217f1b52c8f5dbbd0a5` ON `kmchardependence`');
        await queryRunner.query('CREATE INDEX `IDX_7092a09c7f396257a26deb6366` ON `kmchardependence` (`CID`)');
        await queryRunner.query('CREATE INDEX `IDX_9387b27d14fc58f0827d2ec420` ON `kmchardependence` (`CIDDependance`)');
        await queryRunner.query('CREATE INDEX `IDX_79d18b7880bd4bcb26e8a1c5c5` ON `kmchardependence` (`CIDDependance`, `CSDependance`)');
        await queryRunner.query('ALTER TABLE `kmchardependence` ADD CONSTRAINT `FK_79d18b7880bd4bcb26e8a1c5c59` FOREIGN KEY (`CIDDependance`, `CSDependance`) REFERENCES `kmcs`(`cid`,`cs`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('RENAME TABLE `kmchardependence` TO `kmchardependance`');
    }
}
