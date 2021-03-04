# Symbiota2

This project was uses [Nx](https://nx.dev), [Angular](https://angular.io), and [Nest](https://nestjs.com).

## Environment
Any variable without a default is required for the Symbiota2 API to run. 
For development, a [.env file](https://www.npmjs.com/package/dotenv) can be used.

| Environment variable | Description | Default |
| -------------------- | ----------- | ------- |
| NODE_ENV | 'development' or 'production', determines log level, etc. | 'production'
| APP_PORT | The port the the API server will run on | 8080 |
| APP_DATA_DIR | The data directory for the API server | './data' |
| DATABASE_TYPE | The [type of database](https://typeorm.io) to that will be used any will work in theory, but currently only mariadb has been tested | 'mariadb' |
| DATABASE_HOST | The database host | '127.0.0.1' |
| DATABASE_PORT | The database port | 3306 |
| DATABASE_NAME | The name of the database on DATABASE_HOST | 'symbiota' |
| DATABASE_USER | The user used to connection to DATABASE_NAME | 'root' |
| DATABASE_PASSPORT | The password for DATABASE_USER | 'password' |
| ENABLE_AUTH | FOR DEBUGGING ONLY: Set to 0 to disable API authentication | 1 |

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[Angular Documentation](https://angular.io/docs)

[Nest Documentation](https://docs.nestjs.com/)

## Generate a plugin

Run `nx g @nrwl/angular:lib --buildable --publishable --importPath @<my-org>/<my-plugin> <my-plugin> ` to generate a UI plugin.

Run `nx g @nrwl/nest:library --buildable --publishable --importPath @<my-org>/<my-plugin> <my-plugin>` to generate an API plugin.

Plugins are shareable across plugins and applications. They can be imported from `@<my-org>/<my-plugin>`.

## Development server

Run `nx serve ui` for a UI dev server in 'watch' mode. 

Run `nx serve api` for an API dev server in 'watch' mode.

Run `npm run start:dev` to start both servers in 'watch' mode.

## Code scaffolding

Run `nx g @nrwl/angular:<resource type> --project=<ui or my-plugin> <my-resource>` to generate a new UI resource.

Run `nx g @nrwl/nest:<resource type> --sourceRoot=<api or my-plugin> <my-resource>` to generate a new API resource.

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
