export class AppEnv {
    defaultLanguage = "";
    appTitle = "";
    apiUrl = "";
    tilesUrl = "";
    tilesToken = "";
    tilesAttribution = "";

    constructor(environ: Record<string, unknown>) {
        Object.assign(this, environ);
    }
}
