import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
  ApiClientModule,
  NavBarLink, SymbiotaComponentModule,
  SymbiotaUiPlugin
} from '@symbiota2/ui-common';

import { TaxaViewerPageComponent } from "./pages/taxa-viewer/taxa-viewer-page.component";
import { Route, RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FlexModule } from "@angular/flex-layout";
import { MatTreeModule } from '@angular/material/tree';
import {
    TaxonomicEnumTreeService,
    TaxonService,
    TaxonomicStatusService,
    TaxonVernacularService,
    TaxonomicAuthorityService,
    TaxonDescriptionBlockService,
    TaxonDescriptionStatementService,
    TaxonomicUnitService
} from './services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { TaxonProfilePageComponent } from './pages';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import {
    TaxonDescriptionDialogComponent,
    TaxonEditorDialogComponent,
    TaxonVernacularEditorComponent,
    TaxonDescriptionEditorComponent,
    TaxonDescriptionStatementDialogComponent,
    TaxonTaxonEditorComponent,
    TaxonTaxonDialogComponent,
    TaxonStatusEditorComponent, TaxonStatusAcceptedEditorDialogComponent,
} from './components';
import { TaxonEditorPageComponent, TaxonomyUploadPage, TaxaEditorEntryPage } from './pages'
import { MatGridListModule } from '@angular/material/grid-list';
import { TaxonStatusParentEditorDialogComponent } from './components/taxon-status-parent-editor-dialog/taxon-status-parent-editor-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TaxonomyUploadFieldMapPage } from './pages/taxonomy-upload/field-map/field-map.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TaxonomyFieldMapSelectComponent } from './pages/taxonomy-upload/field-map/taxonomy-field-map-select-component/taxonomy-field-map-select.component';
import { TaxonomyConfirmDialogComponent } from './pages/taxonomy-upload/field-map/taxonomy-confirm-dialog-component/taxonomy-confirm-dialog.component';
import { TaxonomyUploadService } from './services/taxonomyUpload/taxonomy-upload.service';
import { TaxaProfilerEntryPage } from './pages/taxa-profiler-entry/taxa-profiler-entry-page';
import {
    TAXA_EDITOR_ROUTE,
    TAXA_PROFILER_ROUTE, TAXA_UPLOADER_ROUTE,
    TAXA_VIEWER_ROUTE,
    TAXON_EDITOR_ROUTE,
    TAXON_PROFILE_ROUTE
} from './routes';

@NgModule({
  imports: [
    ApiClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    FlexModule,
    MatTreeModule,
    MatCheckboxModule,
    MatListModule,
    MatRadioModule,
    SymbiotaComponentModule,
    ScrollingModule,
    MatTabsModule,
    MatTableModule,
    MatGridListModule,
    MatExpansionModule,
    MatPaginatorModule
  ],
    declarations: [
        TaxonomyUploadPage,
        TaxaProfilerEntryPage,
        TaxaEditorEntryPage,
        TaxaViewerPageComponent,
        TaxonProfilePageComponent,
        TaxonomyFieldMapSelectComponent,
        TaxonomyConfirmDialogComponent,
        TaxonEditorPageComponent,
        TaxonomyUploadFieldMapPage,
        TaxonEditorDialogComponent,
        TaxonVernacularEditorComponent,
        TaxonDescriptionDialogComponent,
        TaxonDescriptionEditorComponent,
        TaxonDescriptionStatementDialogComponent,
        TaxonTaxonEditorComponent,
        TaxonTaxonDialogComponent,
        TaxonStatusAcceptedEditorDialogComponent,
        TaxonStatusEditorComponent,
        TaxonStatusParentEditorDialogComponent
    ],
    providers: [
        TaxonService,
        TaxonomicEnumTreeService,
        TaxonomicStatusService,
        TaxonVernacularService,
        TaxonDescriptionBlockService,
        TaxonDescriptionStatementService,
        TaxonomicAuthorityService,
        TaxonomicUnitService,
        TaxonomyUploadService
    ],
    entryComponents: [
        TaxaEditorEntryPage,
        TaxaProfilerEntryPage,
        TaxonomyUploadPage,
        TaxonProfilePageComponent,
        TaxaViewerPageComponent,
        TaxonEditorPageComponent,
        TaxonomyUploadFieldMapPage,
        TaxonomyFieldMapSelectComponent,
        TaxonomyConfirmDialogComponent,
        TaxonEditorDialogComponent,
        TaxonVernacularEditorComponent,
        TaxonDescriptionDialogComponent,
        TaxonDescriptionEditorComponent,
        TaxonDescriptionStatementDialogComponent,
        TaxonTaxonEditorComponent,
        TaxonTaxonDialogComponent,
        TaxonStatusAcceptedEditorDialogComponent,
        TaxonStatusEditorComponent,
        TaxonStatusParentEditorDialogComponent
    ]
})
export class TaxonomyPlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.taxa.name';

    constructor() {
        super();
    }

    static routes(): Route[] {
        return [
            {
                path: TAXON_PROFILE_ROUTE,
                component: TaxonProfilePageComponent
            },
            {
                path: TAXA_VIEWER_ROUTE,
                component: TaxaViewerPageComponent
            },
            {
                path: TAXON_EDITOR_ROUTE,
                component: TaxonEditorPageComponent
            },
            {
                path: TAXA_EDITOR_ROUTE,
                component: TaxaEditorEntryPage
            },
            {
                path: TAXA_PROFILER_ROUTE,
                component: TaxaProfilerEntryPage
            },
            {
                path: TAXA_UPLOADER_ROUTE,
                component: TaxonomyUploadPage
            }
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${TAXA_VIEWER_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.viewer.link"
            },
            {
                url: `/${TAXA_EDITOR_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.editor.link"
            },
            {
                url: `/${TAXA_PROFILER_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.profiler.link"
            },
            {
                url: `/${TAXA_UPLOADER_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.uploader.link"
            },
        ]
    }

}
