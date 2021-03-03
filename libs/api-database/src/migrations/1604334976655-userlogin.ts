import {MigrationInterface, QueryRunner} from "typeorm";

export class userlogin1604334976655 implements MigrationInterface {
    name = 'userlogin1604334976655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `unknowns` DROP FOREIGN KEY `FK_9d189948b17a7d60014b1a59568`");
        await queryRunner.query("ALTER TABLE `users` ADD `username` varchar(45) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` (`username`)");
        await queryRunner.query("ALTER TABLE `users` ADD `password` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD `lastLogin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()");
        await queryRunner.query("CREATE INDEX `Index_username_password` ON `users` (`username`, `password`)");
        await queryRunner.query("ALTER TABLE `unknowns` ADD CONSTRAINT `FK_9d189948b17a7d60014b1a59568` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE RESTRICT");

        await queryRunner.query(`
            UPDATE users u
            INNER JOIN userlogin ul on u.uid = ul.uid
            SET
                u.username = ul.username,
                u.password = ul.password,
                u.lastLogin = ul.lastlogindate
        `);

        await queryRunner.query('DROP TABLE userlogin');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `unknowns` DROP FOREIGN KEY `FK_9d189948b17a7d60014b1a59568`");
        await queryRunner.query("DROP INDEX `Index_username_password` ON `users`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `lastLogin`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `password`");
        await queryRunner.query("ALTER TABLE `users` DROP INDEX `IDX_fe0bb3f6520ee0469504521e71`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `username`");
        await queryRunner.query("ALTER TABLE `unknowns` ADD CONSTRAINT `FK_9d189948b17a7d60014b1a59568` FOREIGN KEY (`username`) REFERENCES `userlogin`(`username`) ON DELETE RESTRICT ON UPDATE RESTRICT");

        await queryRunner.query(`
            CREATE TABLE userlogin(
                uid int(10) REFERENCES users.uid,
                username varchar(45) NOT NULL PRIMARY KEY,
                password varchar(255) NOT NULL,
                alias varchar(45) UNIQUE,
                lastlogindate DATETIME,
                InitialTimeStamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
            );
        `);

        await queryRunner.query(`
            INSERT INTO userlogin VALUES
                (SELECT uid, username, password, lastLogin as lastlogindate FROM users);
        `);

        await queryRunner.query(`
            ALTER TABLE users
                DROP COLUMN username,
                DROP COLUMN password,
                DROP COLUMN lastLogin;
        `);
    }
}
