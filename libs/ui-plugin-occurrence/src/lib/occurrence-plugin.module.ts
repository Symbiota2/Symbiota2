import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
    ApiClientModule,
    NavBarLink, SymbiotaComponentModule,
    SymbiotaUiPlugin
} from '@symbiota2/ui-common';

import { SelectComponent } from "./components/select/select.component";
import { OccurrenceSearchResultsPage } from "./pages/search-results/occurrence-search-results-page.component";
import { Route, RouterModule } from "@angular/router";
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
import { OccurrenceUploadComponent } from './pages/occurrence-upload/occurrence-upload.component';
import { OccurrenceCreateComponent } from './pages/occurrence-create/occurrence-create.component';
import { OccurrenceEditorComponent } from './components/occurrence-editor/occurrence-editor.component';
import { OccurrenceFieldComponent } from './components/occurrence-editor/occurrence-field/occurrence-field.component';
import { OccurrenceExtraFieldComponent } from './components/occurrence-editor/occurrence-extra-field/occurrence-extra-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    ROUTE_CREATE_OCCURRENCE,
    ROUTE_SEARCH_OCCURRENCES,
    ROUTE_SEARCH_RESULTS,
} from './routes';
import { MatTableModule } from '@angular/material/table';
import { FindAllResults } from './services/find-all-results';
import { MatPaginatorModule } from '@angular/material/paginator';

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
        MatExpansionModule,
        MatCheckboxModule,
        SymbiotaComponentModule,
        MatTableModule,
        MatPaginatorModule
    ],
    providers: [
        FindAllResults,
        OccurrenceService
    ],
    declarations: [
        DatePickerComponent,
        OccurrenceSearchCollectionsPage,
        OccurrenceSearchResultModalComponent,
        OccurrenceSearchResultsPage,
        SelectComponent,
        OccurrenceUploadComponent,
        OccurrenceCreateComponent,
        OccurrenceEditorComponent,
        OccurrenceFieldComponent,
        OccurrenceExtraFieldComponent,
    ],
    entryComponents: [
        OccurrenceSearchCollectionsPage,
        OccurrenceSearchResultsPage
    ]
})
export class OccurrencePlugin extends SymbiotaUiPlugin {
    constructor(private readonly collectionProfile: CollectionProfileService) {
        super();

        collectionProfile.putLink((collectionID) => {
            return {
                text: "Search Occurrences",
                routerLink: `/${ROUTE_SEARCH_OCCURRENCES}`,
                requiresLogin: false,
                queryParams: { 'collectionID[]': collectionID }
            };
        });

        collectionProfile.putLink((collectionID) => {
            return {
                text: "Create occurrence",
                routerLink: `/${ROUTE_CREATE_OCCURRENCE}`,
                requiresLogin: true,
                queryParams: { 'collectionID': collectionID }
            };
        });
        // collectionProfile.putLink((collectionID) => {
        //     return {
        //         text: "Upload occurrences",
        //         routerLink: `/${ROUTE_UPLOAD}`,
        //         queryParams: { 'collectionID': collectionID }
        //     };
        // });
    }

    static routes(): Route[] {
        return [
            {
                path: ROUTE_CREATE_OCCURRENCE,
                component: OccurrenceCreateComponent
            },
            {
                path: ROUTE_SEARCH_OCCURRENCES,
                component: OccurrenceSearchCollectionsPage
            },
            {
                path: ROUTE_SEARCH_RESULTS,
                component: OccurrenceSearchResultsPage
            },
            // {
            //     path: ROUTE_UPLOAD,
            //     component: OccurrenceUploadComponent
            // },
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${ROUTE_SEARCH_OCCURRENCES}`,
                name: "Occurrence Search"
            }
        ];
    }
}
