import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionCheckboxSelectorComponent } from './components/collection-checkbox-selector/collection-checkbox-selector.component';
import { MatTreeModule } from '@angular/material/tree';
import {
    AppTranslationModule,
    UiPluginModule,
    SymbiotaComponentModule,
    SymbiotaUiPlugin,
    UserProfileTab, NavBarLink
} from '@symbiota2/ui-common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileCollectionTab } from './components/user-profile-collection-tab/user-profile-collection-tab.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Route, RouterModule } from '@angular/router';
import { FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { CollectionPage } from './pages/collection-page/collection-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectionService } from './services/collection.service';
import { CollectionProfileService } from './services/collection-profile.service';
import { CollectionLogoComponent } from './components/collection-logo/collection-logo.component';
import { MatInputModule } from '@angular/material/input';
import {
    ROUTE_COLLECTION_LIST,
    ROUTE_COLLECTION_PROFILE
} from './routes';
import { CollectionFieldComponent } from './components/collection-field/collection-field.component';
import { CollectionListPage } from './pages/collection-list-page/collection-list-page.component';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { CollectionEditorComponent } from './components/collection-editor/collection-editor.component';
import { CollectionEditorDialogComponent } from './components/collection-editor-dialog/collection-editor-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        CollectionCheckboxSelectorComponent,
        CollectionFieldComponent,
        UserProfileCollectionTab,
        CollectionPage,
        CollectionLogoComponent,
        CollectionListPage,
        CollectionCardComponent,
        CollectionEditorComponent,
        CollectionEditorDialogComponent
    ],
  imports: [
    AppTranslationModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    UiPluginModule,
    FlexModule,
    MatCardModule,
    RouterModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    SymbiotaComponentModule,
    MatInputModule,
    MatDialogModule
  ],
    providers: [
        CollectionService,
        CollectionProfileService
    ],
    exports: [
        CollectionCheckboxSelectorComponent,
        CollectionLogoComponent
    ]
})
export class CollectionPlugin extends SymbiotaUiPlugin {
    static routes(): Route[] {
        return [
            { path: ROUTE_COLLECTION_LIST, component: CollectionListPage },
            { path: ROUTE_COLLECTION_PROFILE, component: CollectionPage }
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [{ name: 'Collections', url: ROUTE_COLLECTION_LIST }]
    }

    static userProfileTabs(): UserProfileTab[] {
        // TODO: i18n
        return [{
            name: 'Collections',
            component: UserProfileCollectionTab
        }];
    }
}
