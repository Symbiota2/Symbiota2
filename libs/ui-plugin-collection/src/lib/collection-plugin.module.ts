import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionCheckboxSelectorComponent } from './components/collection-checkbox-selector/collection-checkbox-selector.component';
import { MatTreeModule } from '@angular/material/tree';
import {
    AppTranslationModule,
    UiPluginModule,
    SymbiotaComponentModule,
    SymbiotaUiPlugin,
    UserProfileTab
} from '@symbiota2/ui-common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { UserProfileCollectionTab } from './components/user-profile-collection-tab/user-profile-collection-tab.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Route, RouterModule } from '@angular/router';
import { FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { CollectionPage } from './components/collection-page/collection-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectionService } from './services/collection.service';
import { CollectionProfileService } from './services/collection-profile.service';
import { CollectionEditorComponent } from './components/collection-editor/collection-editor.component';
import { CollectionLogoComponent } from './components/collection-logo/collection-logo.component';
import { MatInputModule } from '@angular/material/input';
import { CollectionFieldComponent } from './components/collection-field/collection-field.component';

@NgModule({
    declarations: [
        CollectionCheckboxSelectorComponent,
        UserProfileCollectionTab,
        CollectionPage,
        CollectionEditorComponent,
        CollectionLogoComponent,
        CollectionFieldComponent,
        CollectionFieldComponent
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
        MatInputModule
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
        return [CollectionPage.ROUTE];
    }

    static userProfileTabs(): UserProfileTab[] {
        // TODO: i18n
        return [{
            name: 'Collections',
            component: UserProfileCollectionTab
        }];
    }
}
