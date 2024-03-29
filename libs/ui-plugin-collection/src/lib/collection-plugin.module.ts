import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionCheckboxSelectorComponent } from './components/collection-checkbox-selector/collection-checkbox-selector.component';
import { MatTreeModule } from '@angular/material/tree';
import {
    AppTranslationModule,
    UiPluginModule,
    SymbiotaComponentModule,
    SymbiotaUiPlugin,
    UserProfileTab,
    NavBarLink,
} from '@symbiota2/ui-common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
import { InstitutionService } from './services/institution.service';
import { CollectionProfileService } from './services/collection-profile.service';
import { CommentService } from './services/comments.service';
import { CollectionLogoComponent } from './components/collection-logo/collection-logo.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {
    ROUTE_COLLECTION_LIST,
    ROUTE_COLLECTION_PROFILE,
    ROUTE_COLLECTION_NEW,
    ROUTE_COLLECTION_COMMENTS,
    ROUTE_COLLECTION_TOOLS,
    ROUTE_COLLECTION_DWCARCHIVES, ROUTE_COLLECTION_STATISTICS_DASHBOARD
} from './routes';
import { CollectionFieldComponent } from './components/collection-field/collection-field.component';
import { CollectionListPage } from './pages/collection-list-page/collection-list-page.component';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { CollectionEditorComponent } from './components/collection-editor/collection-editor.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CollectionNewCollectionComponent } from './components/create-collection-form/create-collection-form.component';
import { CollectionCreatePage } from './pages/create-collection-page/create-collection-page.component';
import { InstitutionNewComponent } from './components/institution-new/institution-new.component';
import { InstitutionNewDialogComponent } from './components/institution-new-dialog/institution-new-dialog.component';
import { CollectionCommentPage } from './pages/collection-comment-page/collection-comment-page.component';
import { CollectionCommentComponent } from './components/collection-comment/collection-comment.component';
import { ImgFallbackDirective } from './components/collection-logo/img-fallback.directive';
import { CollectionToolsPage } from './pages/collection-tools-page/collection-tools-page.component';
import { CollectionPermissionsComponent } from './components/collection-permissions/collection-permissions.component';
import { UserSearchableSelectComponent } from './components/user-searchable-select/user-searchable-select.component';
import { CollectionPermissionsConfirmDialogComponent } from './components/collection-permissions-confirm-dialog/collection-permissions-confirm-dialog.component';
import { DwcPublishingComponent } from './components/dwc-publishing/dwc-publishing.component';
import { DwcService } from './services/dwc.service';
import { CollectionDwcPage } from './pages/collection-dwc-page/collection-dwc-page.component';
import { DwcTableComponent } from './components/dwc-table/dwc-table.component';
import { DwcDownloadLinkComponent } from './components/dwc-download-link/dwc-download-link.component';
import {
    CollectionStatisticsDashboardPage
} from './pages/collection-statistics-dashboard/collection-statistics-dashboard-page';


@NgModule({
    declarations: [
        CollectionCheckboxSelectorComponent,
        CollectionFieldComponent,
        UserProfileCollectionTab,
        CollectionPage,
        CollectionStatisticsDashboardPage,
        CollectionLogoComponent,
        CollectionListPage,
        CollectionCardComponent,
        CollectionEditorComponent,
        CollectionCreatePage,
        CollectionNewCollectionComponent,
        InstitutionNewComponent,
        InstitutionNewDialogComponent,
        CollectionCommentPage,
        CollectionCommentComponent,
        ImgFallbackDirective,
        CollectionToolsPage,
        CollectionPermissionsComponent,
        UserSearchableSelectComponent,
        CollectionPermissionsConfirmDialogComponent,
        DwcPublishingComponent,
        CollectionDwcPage,
        DwcTableComponent,
        DwcDownloadLinkComponent,
    ],
    imports: [
        FormsModule,
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
        MatDialogModule,
        MatSelectModule,
        MatDividerModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatListModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatTableModule,
        MatSortModule
    ],
    entryComponents: [CollectionEditorComponent],
    providers: [
        CollectionService,
        CollectionProfileService,
        InstitutionService,
        CommentService,
        DwcService,
    ],
    exports: [CollectionCheckboxSelectorComponent, CollectionLogoComponent],
})
export class CollectionPlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.collection.name';

    static routes(): Route[] {
        return [
            { path: ROUTE_COLLECTION_LIST, component: CollectionListPage },
            { path: ROUTE_COLLECTION_PROFILE, component: CollectionPage },
            { path: ROUTE_COLLECTION_NEW, component: CollectionCreatePage },
            {
                path: ROUTE_COLLECTION_COMMENTS,
                component: CollectionCommentPage,
            },
            { path: ROUTE_COLLECTION_TOOLS, component: CollectionToolsPage },
            {
                path: ROUTE_COLLECTION_DWCARCHIVES,
                component: CollectionDwcPage,
            },
            {
                path: ROUTE_COLLECTION_STATISTICS_DASHBOARD,
                component: CollectionStatisticsDashboardPage,
            },
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            { name: 'core.layout.header.topnav.collection.browse_collections_link', url: ROUTE_COLLECTION_LIST },
            { name: 'core.layout.header.topnav.collection.dca_link', url: ROUTE_COLLECTION_DWCARCHIVES },
            { name: "core.layout.header.topnav.collection.statistics.dashboard_link", url: ROUTE_COLLECTION_STATISTICS_DASHBOARD}
        ];
    }

    static userProfileTabs(): UserProfileTab[] {
        return [
            {
                name: 'core.layout.header.topnav.search_collections_link',
                component: UserProfileCollectionTab,
            },
        ];
    }
}
