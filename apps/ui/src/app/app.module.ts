import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import {
    AlertModule,
    AppConfigModule,
    AppTranslationModule,
    UiPluginModule, SymbiotaUiPlugin,
    UserModule
} from '@symbiota2/ui-common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { HomePage } from './pages/home/home.component';
import { Sitemap } from './components/sitemap/sitemap.component';
import { UserProfilePage } from './pages/user-profile/user-profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginDialog } from './components/login-dialog/login-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { CollectionPlugin } from '@symbiota2/ui-plugin-collection';
import { OccurrencePlugin } from '@symbiota2/ui-plugin-occurrence';
import { CreateUserProfilePage } from './pages/create-user-profile/create-user-profile.component';
import { TaxonomyPlugin } from '@symbiota2/ui-plugin-taxonomy';
import { ErrorComponent } from './pages/create-user-profile/error-component/error.component';
import { PasswordFormValidator } from './pages/user-profile/password-validator.directive';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.component';
import { ForgotUsernamePage } from './pages/forgot-username/forgot-username.component';
import { NotificationDialog } from './components/navbar/notification-dialog/notification-dialog.component';
import { ImagePlugin } from '@symbiota2/ui-plugin-image';
import { ChecklistPlugin } from '@symbiota2/ui-plugin-checklist';
import { NavbarMenuComponent } from './components/navbar-menu/navbar-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { SitemapUnorderedListComponent } from './components/sitemap-unordered-list/sitemap-unordered-list.component';
import { UserlistPageComponent } from './pages/userlist-page/userlist-page.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UserlistComponent } from './components/userlist/userlist.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PermissionFormComponent } from './components/permission-form/permission-form.component';
import { I18nPlugin } from '@symbiota2/ui-plugin-i18n';
import { KnowledgeGraphPlugin } from '@symbiota2/ui-plugin-knowledge-graph';

const PLUGINS = [
    CollectionPlugin,
    OccurrencePlugin,
    TaxonomyPlugin,
    ImagePlugin,
    ChecklistPlugin,
    I18nPlugin,
    KnowledgeGraphPlugin,
];

/**
 * The core of the Angular UI. Imports required plugins for things like
 * config, notifications, and user logins. Imports and configures plugins.
 */
@NgModule({
    declarations: [
        AppComponent,
        HomePage,
        Sitemap,
        UserProfilePage,
        NavbarComponent,
        LoginDialog,
        FooterComponent,
        BannerComponent,
        CreateUserProfilePage,
        ErrorComponent,
        PasswordFormValidator,
        ForgotPasswordPage,
        ForgotUsernamePage,
        NotificationDialog,
        NavbarMenuComponent,
        SitemapUnorderedListComponent,
        UserlistPageComponent,
        UserlistComponent,
        PermissionFormComponent,
    ],
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
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
        UiPluginModule.configure(PLUGINS.map((p) => p as (typeof SymbiotaUiPlugin))),
        ReactiveFormsModule,
        UserModule,
        ...PLUGINS,
        DragDropModule,
        MatExpansionModule,
        MatGridListModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
