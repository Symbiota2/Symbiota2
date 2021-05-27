import { Injectable } from '@angular/core';
import { AppEnv } from './AppEnv.class';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {

    constructor(private readonly environment: AppEnv) { }

    defaultLanguage(): string {
        return this.environment.defaultLanguage;
    }

    appTitle(): string {
        return this.environment.appTitle;
    }

    apiUri(): string {
        return this.environment.apiUrl;
    }

    tilesUrl(): string {
        let url = this.environment.tilesUrl;
        if (this.environment.tilesToken) {
            url += `?accessToken=${this.environment.tilesToken}`;
        }
        return url;
    }
}
