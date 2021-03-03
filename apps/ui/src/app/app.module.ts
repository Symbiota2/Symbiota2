import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';
import {
    AlertModule,
    AppConfigModule,
    AppTranslationModule,
    PluginModule, SymbiotaPlugin,
    UserModule
} from "@symbiota2/ui-common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "./material.module";
import { HomeComponent } from "./pages/home/home.component";
import { SitemapComponent } from "./pages/sitemap/sitemap.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LoginDialog } from "./components/login-dialog/login-dialog.component";
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { CollectionPlugin } from "@symbiota2/ui-plugin-collection";
import { OccurrencePlugin } from '@symbiota2/ui-plugin-occurrence';

const PLUGINS = [
    CollectionPlugin,
    OccurrencePlugin
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SitemapComponent,
        UserProfileComponent,
        NavbarComponent,
        LoginDialog,
        FooterComponent,
        BannerComponent
    ],
    imports: [
        AlertModule,
        AppConfigModule.configure(environment),
        AppRoutingModule,
        AppTranslationModule,
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MaterialModule,
        PluginModule.configure(PLUGINS.map((p) => p as (typeof SymbiotaPlugin))),
        ReactiveFormsModule,
        UserModule,
        ...PLUGINS
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
