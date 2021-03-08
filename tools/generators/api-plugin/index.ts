import { Tree, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/nest';

const PACKAGE_REGEX = /^@[^/]+\//;

interface ApiPluginSchema {
    name: string;
}

export default async function(host: Tree, schema: ApiPluginSchema) {
    if (!schema.name.match(PACKAGE_REGEX)) {
        throw new Error('The plugin name must be in the format @<my-org>/<my-plugin>');
    }

    const libPromise = await libraryGenerator(
        host,
        {
            name: schema.name.replace(PACKAGE_REGEX, ''),
            importPath: schema.name,
            buildable: true,
            publishable: true,
            target: 'es2017'
        }
    );

    console.log(JSON.stringify(libPromise));

    return libPromise;
}
