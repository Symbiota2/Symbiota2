import { createConnection } from 'typeorm';
// @ts-ignore
import glob from 'glob';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';
import ormconfig from '../ormconfig';
import { ConnectionOptions } from 'typeorm';

const fsPromises = fs.promises;

async function main(): Promise<void> {
    if (process.argv.length < 3) {
        throw new Error('Provide a target file or directory');
    }

    const target = process.argv[2];
    let sqlFiles = [];

    // Find files
    if (fs.statSync(target).isDirectory()) {
        sqlFiles = glob.sync(path.join(target, '**', '*.sql'));
    }
    else {
        sqlFiles.push(target);
    }

    // Read files
    const sqlScripts = {};
    for (let i = 0; i < sqlFiles.length; i++) {
        const file = sqlFiles[i];
        sqlScripts[file] = (await fsPromises.readFile(file))
            .toString();
    }

    // Run files
    const conn = await createConnection({
        ...(await ormconfig),
        multipleStatements: true
    } as ConnectionOptions);

    for (const sqlFile in sqlScripts) {
        const fileData = sqlScripts[sqlFile];
        console.log(`Running ${ sqlFile }...`);
            await conn.transaction(async (entityManager) => {
                try {
                    await entityManager.query(fileData);
                }
                catch (e) {
                    console.error(`ERROR RUNNING ${sqlFile}: ${e.toString()}`);
                    process.exit(1);
                }
            });
            console.log(`Finished processing ${ sqlFile }.`);
    }
}

main().then(() => {
    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
