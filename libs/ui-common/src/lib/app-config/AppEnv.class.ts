import { Injectable } from '@angular/core';

export class AppEnv {
    defaultLanguage = "";
    appTitle = "";
    apiUrl = "";

    constructor(environ: Record<string, unknown>) {
        Object.assign(this, environ);
    }
}
