import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
  ApiClientModule,
  NavBarLink, SymbiotaComponentModule,
  SymbiotaUiPlugin
} from '@symbiota2/ui-common';

import { TaxaViewerPageComponent } from "./pages/taxa-viewer/taxa-viewer-page.component";
import { Route, RouterModule } from "@angular/router";
import { TaxaSearchPage } from "./pages/search-taxa/taxa-search-page.component";
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
    TaxonomicAuthorityService, TaxonDescriptionBlockService, TaxonDescriptionStatementService
} from './services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { TaxonProfilePageComponent } from './pages';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { TaxonEditorDialogComponent } from './components';
import { TaxonEditorPageComponent } from './pages/taxon-editor/taxon-editor-page.component';


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
    MatTableModule
  ],
    declarations: [
        TaxaSearchPage,
        TaxaViewerPageComponent,
        TaxonProfilePageComponent,
        TaxonEditorPageComponent,
        TaxonEditorDialogComponent,
    ],
    providers: [
        TaxonService,
        TaxonomicEnumTreeService,
        TaxonomicStatusService,
        TaxonVernacularService,
        TaxonDescriptionBlockService,
        TaxonDescriptionStatementService,
        TaxonomicAuthorityService
    ],
    entryComponents: [
        TaxaSearchPage,
        TaxonProfilePageComponent,
        TaxaViewerPageComponent,
        TaxonEditorPageComponent,
        TaxonEditorDialogComponent,
    ]
})
export class TaxonomyPlugin extends SymbiotaUiPlugin {
    private static SEARCH_TAXA_ROUTE = "taxonomy/search"
    private static TAXA_VIEWER_ROUTE = "taxonomy/viewer"
    private static TAXON_EDITOR_ROUTE = "taxon/editor/:taxonID"
    private static TAXON_PROFILE_ROUTE = "taxon/profile/:taxonID"

    constructor() {
        super();
    }

    static routes(): Route[] {
        return [
            {
                path: TaxonomyPlugin.SEARCH_TAXA_ROUTE,
                component: TaxaSearchPage
            },
            {
                path: TaxonomyPlugin.TAXON_PROFILE_ROUTE,
                component: TaxonProfilePageComponent
            },
            {
                path: TaxonomyPlugin.TAXA_VIEWER_ROUTE,
                component: TaxaViewerPageComponent
            },
            {
                path: TaxonomyPlugin.TAXON_EDITOR_ROUTE,
                component: TaxonEditorPageComponent
            }
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${TaxonomyPlugin.TAXA_VIEWER_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.viewer.link"
            }
        ]
    }

}
