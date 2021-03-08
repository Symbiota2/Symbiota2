# Symbiota2

This project was uses [Nx](https://nx.dev), [Angular](https://angular.io), and [Nest](https://nestjs.com).

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[Angular Documentation](https://angular.io/docs)

[Nest Documentation](https://docs.nestjs.com/)

## Environment

Any variable without a default is required for the Symbiota2 API to run. 
For development, a [.env file](https://www.npmjs.com/package/dotenv) can be used.

| Environment variable | Description | Default |
| -------------------- | ----------- | ------- |
| NODE_ENV | 'development' or 'production', determines log level, etc. | 'production'
| APP_PORT | The port the the API server will run on | 8080 |
| APP_DATA_DIR | The data directory for the API server | './data' |
| DATABASE_TYPE | The scheme for the database uri | 'mariadb' |
| DATABASE_HOST | The database host | '127.0.0.1' |
| DATABASE_PORT | The database port | 3306 |
| DATABASE_NAME | The name of the database on DATABASE_HOST | 'symbiota' |
| DATABASE_USER | The user used to connection to DATABASE_NAME | 'root' |
| DATABASE_PASSPORT | The password for DATABASE_USER | 'password' |
| ENABLE_AUTH | FOR DEBUGGING ONLY: Set to 0 to disable API authentication | 1 |

## Database

The Symbiota2 API uses [TypeORM](https://typeorm.io) to manage databases migrations and entities, so in theory any
database that's compatible with TypeORM is compatible with Symbiota2. However, currently SQLite experiences issues due to
a lack of support for spatial indexes. MariaDB is the only database that has been tested.

For development purposes, `docker-compose up -d` will start a mariadb server on port 3306 compatible with the
DATABASE_* defaults. This database loads the initialization scripts in [docker-entrypoint-initdb.d](./docker-entrypoint-initdb.d/)
to initialize a [Symbiota v1 database](https://github.com/Symbiota/Symbiota/blob/f158b1651632ecfe018d7c5d578e7fa8d904fb04/docs/INSTALL.txt#L26).
This repo also provides a convenience script for running a sql file or directory of sql files. This script utilizes the environment
variables above to connect to the database:

`npm run sql my-script.sql`

or

`npm run sql my/dir/with/sql/scripts`

Symbiota2 has been written under the assumption that most users will be upgrading from a Symbiota v1 database. Any new databases
should first run the initialization scripts in docker-entrypoint-initdb.d. When ready to upgrade to the Symbiota2 schema, run
`npm run typeorm migration:run`. This will load the schema updates from the [migrations directory](./libs/api-database/src/migrations).

During development, if any [entities](./libs/api-database/src/entities) are changed, a migration should be generated using 
`npm run typeorm migration:generate -n MyMigration`.

A key requirement of Symbiota2 is backward-compatibility with Symbiota v1 databases. For this reason, care should be taken
that any migrations do not result in data loss. However, **all users need to back up their data prior to upgrading to Symbiota2** as 
it's always possible that data loss could occur.

More information on the database schema can be found here:
- [Institutions/Collections/Occurrences/Taxa](./docs/occurrences.md)
- [Occurrences/Taxa/Images](./docs/images.md)


## Generate a plugin

Run `nx g @nrwl/angular:lib --buildable --publishable --importPath @<my-org>/<my-plugin> <my-plugin> ` to generate a UI plugin.

Run `nx workspace-generator api-plugin @<my-org>/<my-plugin>` to generate an API plugin.

Plugins are shareable across plugins and applications. They can be imported from `@<my-org>/<my-plugin>`.

## Development server

Run `nx serve ui` for a UI dev server in 'watch' mode. 

Run `nx serve api` for an API dev server in 'watch' mode.

Run `npm run start:dev` to start both servers in 'watch' mode.

## Code scaffolding

Run `nx g @nrwl/angular:<resource type> --project=<ui or my-plugin> <my-resource>` to generate a new UI resource.

Run `nx g @nrwl/nest:<resource type> --project=<api or my-plugin> <my-resource>` to generate a new API resource.

## Internationalization

The UI uses [ngx-translate's http loader](http://www.ngx-translate.com/) to load internationization files as JSON.

1. Run `npm run i18n:init libs/<my-plugin>/src/i18n` to initialize an internationalization directory.

2. Edit the internationalization files based on language

3. Use ngx-translate's 
   [translate pipe or translation service](https://github.com/ngx-translate/core#5-use-the-service-the-pipe-or-the-directive)
   to create language-independent text in the UI.
   
4. Run `npm run i18n` to merge all core & plugin internationalization files into [apps/ui/src/assets/i18n](./apps/ui/src/assets/i18n) 
where angular can serve them.

Run `npm run i18n:clean` to delete all merged translation files.

## Build

Run `ng build ui` to build the UI. 

Run `nx build api` to build the API. 

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test ui` to execute the UI unit tests via [Jest](https://jestjs.io).

Run `nx test api` to execute the API unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
