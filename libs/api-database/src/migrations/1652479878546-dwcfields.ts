import {MigrationInterface, QueryRunner} from "typeorm";

export class dwcfields1652479878546 implements MigrationInterface {
    name = 'dwcfields1652479878546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`associatedSequences\` varchar(1000) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`earliestAgeOrLowestStage\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`earliestEonOrLowestEonothem\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`earliestEpochOrLowestSeries\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`earliestEraOrLowestErathem\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`earliestPeriodOrLowestSystem\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \` eventRemarks\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`eventTime\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`measurementRemarks\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`parentEventID\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`associatedOrganisms\` varchar(1000) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`associatedReferences\` varchar(1000) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`countryCode\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`datasetName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` ADD \`subgenus\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`subgenus\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`datasetName\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`countryCode\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`associatedReferences\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`associatedOrganisms\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`parentEventID\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`measurementRemarks\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`eventTime\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \` eventRemarks\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`earliestPeriodOrLowestSystem\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`earliestEraOrLowestErathem\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`earliestEpochOrLowestSeries\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`earliestEonOrLowestEonothem\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`earliestAgeOrLowestStage\``);
        await queryRunner.query(`ALTER TABLE \`omoccurrences\` DROP COLUMN \`associatedSequences\``);
    }

}
