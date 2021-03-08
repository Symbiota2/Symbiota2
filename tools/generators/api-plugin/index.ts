import { Rule, SchematicContext, chain, Tree, externalSchematic } from '@angular-devkit/schematics';
import { getProjectConfig, updateJsonInTree } from '@nrwl/workspace';

const PACKAGE_REGEX = /^@[^/]+\//;

interface ApiPluginSchema {
    name: string;
}

function getProjectName(pluginName: string): string {
    return pluginName.replace(PACKAGE_REGEX, '');
}

function generateNestLibrary(schema: ApiPluginSchema): Rule {
    return externalSchematic(
        '@nrwl/nest',
        'library',
        {
            name: getProjectName(schema.name),
            importPath: schema.name,
            buildable: true,
            publishable: true
        }
    )
}

function updateTsConfig(host: Tree, schema: ApiPluginSchema): Rule {
    return (host: Tree, context: SchematicContext) => {
        const projectConf = getProjectConfig(host, getProjectName(schema.name));

        return updateJsonInTree(
            `${projectConf.root}/tsconfig.lib.json`,
            (json) => {
                json.compilerOptions = Object.assign(
                    {},
                    json.compilerOptions,
                    {
                        module: 'commonjs',
                        target: 'es2017',
                        esModuleInterop: true,
                        allowSyntheticDefaultImports: true
                    }
                );
                return json;
            }
        )
    };
}

function updatePackageJson(host: Tree, schema: ApiPluginSchema): Rule {
    return (host: Tree, context: SchematicContext) => {
        const projectConf = getProjectConfig(host, getProjectName(schema.name));

        return updateJsonInTree(
            `${projectConf.root}/package.json`,
            (json) => {
                return Object.assign(
                    {},
                    json,
                    {
                        "license": "GPL-3.0-or-later",
                        "peerDependencies": {
                            "@nestjs/common": "^7.6.13",
                            "@nestjs/config": "^0.6.3",
                            "reflect-metadata": "^0.1.13",
                            "rxjs": "^6.6.6",
                            "typeorm": "~0.2.31"
                        },
                        "devDependencies": {
                            "typescript": "~4.1.0"
                        }
                    }
                );
            }
        );
    }
}

export default function(schema: ApiPluginSchema): Rule {
    if (!schema.name.match(PACKAGE_REGEX)) {
        throw new Error('The plugin name must be in the format @<my-org>/<my-plugin>');
    }

    return (host: Tree, context: SchematicContext) => {
        const chainedRules = chain([
            generateNestLibrary(schema),
            updateTsConfig(host, schema),
            updatePackageJson(host, schema)
        ]);

        return chainedRules(host, context);
    };
}
