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
    TaxonomicAuthorityService
} from './services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';


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
    SymbiotaComponentModule
  ],
    declarations: [
        TaxaSearchPage,
        TaxaViewerPageComponent,
    ],
    providers: [
        TaxonService,
        TaxonomicEnumTreeService,
        TaxonomicStatusService,
        TaxonVernacularService,
        TaxonomicAuthorityService
    ],
    entryComponents: [
        TaxaSearchPage,
        TaxaViewerPageComponent
    ]
})
export class TaxaPlugin extends SymbiotaUiPlugin {
    private static SEARCH_TAXA_ROUTE = "taxa/search";
    private static TAXA_VIEWER_ROUTE = "taxa/viewer";

    constructor() {
        super();
    }

    static routes(): Route[] {
        return [
            {
                path: TaxaPlugin.SEARCH_TAXA_ROUTE,
                component: TaxaSearchPage
            },
            {
                path: TaxaPlugin.TAXA_VIEWER_ROUTE,
                component: TaxaViewerPageComponent
            }
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${TaxaPlugin.TAXA_VIEWER_ROUTE}`,
                //name: "core.layout.header.topnav.search_taxa_link"
                name: "Taxa Viewer"
            }
        ];
    }

}
