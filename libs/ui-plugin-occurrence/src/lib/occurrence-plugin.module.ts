import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
    ApiClientModule,
    NavBarLink,
    SymbiotaPlugin
} from "@symbiota2/ui-common";

import { OccurrenceSearchCriteria } from "./components/search-criteria/occurrence-search-criteria.component";
import { SelectComponent } from "./components/select/select.component";
import { OccurrenceSearchResultsPage } from "./pages/search-results/occurrence-search-results-page.component";
import { Route, RouterModule } from "@angular/router";
import { OccurrenceSearchResultComponent } from "./components/search-result/occurrence-search-result.component";
import { OccurrenceSearchResultModalComponent } from "./components/search-result-modal/occurrence-search-result-modal.component";
import { OccurrenceSearchCollectionsPage } from "./pages/occurrence-search/occurrence-search-page.component";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { CollectionPlugin, CollectionProfileService } from "@symbiota2/ui-plugin-collection";
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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FlexModule } from "@angular/flex-layout";
import { MatExpansionModule } from '@angular/material/expansion';
import { OccurrenceService } from './services/occurrence.service';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { OccurrenceUploadComponent } from './pages/occurrence-upload/occurrence-upload.component';

@NgModule({
    imports: [
        ApiClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        CollectionPlugin,
        CommonModule,
        FormsModule,
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
        MatExpansionModule
    ],
    providers: [
        OccurrenceService
    ],
    declarations: [
        DatePickerComponent,
        OccurrenceSearchCollectionsPage,
        OccurrenceSearchCriteria,
        OccurrenceSearchResultComponent,
        OccurrenceSearchResultModalComponent,
        OccurrenceSearchResultsPage,
        SelectComponent,
        ExpansionPanelComponent,
        OccurrenceUploadComponent
    ],
    entryComponents: [
        OccurrenceSearchCollectionsPage,
        OccurrenceSearchCriteria,
        OccurrenceSearchResultsPage
    ]
})
export class OccurrencePlugin extends SymbiotaPlugin {
    private static SEARCH_OCCURRENCES_ROUTE = "occurrences/search";
    private static SEARCH_RESULTS_ROUTE = "occurrences/search/results";
    private static UPLOAD_ROUTE = "occurrences/upload";

    constructor(private readonly collectionProfile: CollectionProfileService) {
        super();

        collectionProfile.putLink((collectionID) => {
            return {
                text: "Search Occurrences",
                routerLink: `/${OccurrencePlugin.SEARCH_OCCURRENCES_ROUTE}`,
                queryParams: { 'collectionID[]': collectionID }
            };
        });

        collectionProfile.putLink((collectionID) => {
            return {
                text: "Upload occurrences",
                routerLink: `/${OccurrencePlugin.UPLOAD_ROUTE}`,
                queryParams: { 'collectionID': collectionID }
            };
        });
    }

    static getRoutes(): Route[] {
        return [
            {
                path: OccurrencePlugin.SEARCH_OCCURRENCES_ROUTE,
                component: OccurrenceSearchCollectionsPage
            },
            {
                path: OccurrencePlugin.SEARCH_RESULTS_ROUTE,
                component: OccurrenceSearchResultsPage
            },
            {
                path: OccurrencePlugin.UPLOAD_ROUTE,
                component: OccurrenceUploadComponent
            }
        ];
    }

    static getNavBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${OccurrencePlugin.SEARCH_OCCURRENCES_ROUTE}`,
                name: "Occurrence Search"
            }
        ];
    }
}
