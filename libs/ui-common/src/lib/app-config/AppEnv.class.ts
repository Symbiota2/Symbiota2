export class AppEnv {
    defaultLanguage = "";
    appTitle = "";
    apiUrl = "";
    tilesUrl = "";
    tilesToken = "";

    constructor(environ: Record<string, unknown>) {
        Object.assign(this, environ);
    }
}
