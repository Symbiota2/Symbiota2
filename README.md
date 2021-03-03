# Symbiota2

This project was uses [Nx](https://nx.dev), [Angular](https://angular.io), and [Nest](https://nestjs.com).

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[Angular Documentation](https://angular.io/docs)

[Nest Documentation](https://docs.nestjs.com/)

## Generate a plugin

Run `ng g @nrwl/angular:lib <my-plugin> --buildable` to generate a UI plugin.

Run `nx generate @nrwl/nest:library <my-plugin> --buildable` to generate an API plugin.

Plugins are shareable across plugins and applications. They can be imported from `@symbiota2/<my-plugin>`.

## Development server

Run `ng serve ui` for a UI dev server. 

Run `nx serve api` for an API dev server.

## Code scaffolding

Run `ng g <resource type> my-component --project=<ui or my-plugin>` to generate a new UI resource.

Run `nx generate @nrwl/nest:<resource type> --sourceRoot=<api or my-plugin> ` to generate a new API resource.


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
