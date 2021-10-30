import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
    ApiClientModule, AppConfigModule,
    NavBarLink, SymbiotaComponentModule,
    SymbiotaUiPlugin
} from '@symbiota2/ui-common';

import { SelectComponent } from "./components/select/select.component";
import { OccurrenceSearchResultsPage } from "./pages/occurrence-search-results/occurrence-search-results-page.component";
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
import { OccurrenceUploadPage } from './pages/occurrence-upload/occurrence-upload-page.component';
import { OccurrenceCreateComponent } from './pages/occurrence-create/occurrence-create.component';
import { OccurrenceEditorComponent } from './components/occurrence-editor/occurrence-editor.component';
import { OccurrenceFieldComponent } from './components/occurrence-editor/occurrence-field/occurrence-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    ROUTE_CREATE_OCCURRENCE,
    ROUTE_SEARCH_OCCURRENCES,
    ROUTE_SEARCH_RESULTS,
    ROUTE_SPATIAL_MODULE,
    ROUTE_UPLOAD,
    ROUTE_UPLOAD_FIELD_MAP
} from './routes';
import { MatTableModule } from '@angular/material/table';
import { OccurrenceSearchResults } from './services/occurrence-search-result.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Q_PARAM_COLLID } from '../constants';
import { GeographyPlugin } from '@symbiota2/ui-plugin-geography';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SpatialModulePage } from './pages/spatial-module/spatial-module-page.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { OccurrenceUploadFieldMapPage } from './pages/occurrence-upload/field-map/field-map.component';
import { OccurrenceUploadService } from './services/occurrence-upload.service';
import { FieldMapSelectComponent } from './pages/occurrence-upload/field-map/field-map-select-component/field-map-select.component';
import { ConfirmDialogComponent } from './pages/occurrence-upload/field-map/confirm-dialog-component/confirm-dialog.component';

@NgModule({
    imports: [
        ApiClientModule,
        AppConfigModule,
        BrowserAnimationsModule,
        BrowserModule,
        CollectionPlugin,
        CommonModule,
        FlexModule,
        FormsModule,
        GeographyPlugin,
        LeafletDrawModule,
        LeafletModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatOptionModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTableModule,
        ReactiveFormsModule,
        RouterModule,
        SymbiotaComponentModule,
        TranslateModule,
    ],
    providers: [
        OccurrenceSearchResults,
        OccurrenceService,
        OccurrenceUploadService
    ],
    declarations: [
        DatePickerComponent,
        OccurrenceSearchCollectionsPage,
        OccurrenceSearchResultModalComponent,
        OccurrenceSearchResultsPage,
        SelectComponent,
        OccurrenceUploadPage,
        OccurrenceCreateComponent,
        OccurrenceEditorComponent,
        OccurrenceFieldComponent,
        SpatialModulePage,
        OccurrenceUploadFieldMapPage,
        FieldMapSelectComponent,
        ConfirmDialogComponent,
    ],
    entryComponents: [
        OccurrenceSearchCollectionsPage,
        OccurrenceSearchResultsPage,
    ]
})
export class OccurrencePlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.occurrence.name';

    constructor(private readonly collectionProfile: CollectionProfileService) {
        super();

        collectionProfile.putLink((collectionID) => {
            return {
                text: "Search Occurrences",
                routerLink: `/${ROUTE_SEARCH_OCCURRENCES}`,
                requiresLogin: false,
                queryParams: { [Q_PARAM_COLLID]: [collectionID] }
            };
        });

        collectionProfile.putLink((collectionID) => {
            return {
                text: "Create occurrence",
                routerLink: `/${ROUTE_CREATE_OCCURRENCE}`,
                requiresLogin: true,
                queryParams: { [Q_PARAM_COLLID]: collectionID }
            };
        });

        collectionProfile.putLink((collectionID) => {
            return {
                text: "Upload occurrences",
                routerLink: `/${ROUTE_UPLOAD}`,
                requiresLogin: true,
                queryParams: { 'collectionID': collectionID }
            };
        });
    }

    static routes(): Route[] {
        return [
            {
                path: ROUTE_CREATE_OCCURRENCE,
                component: OccurrenceCreateComponent
            },
            {
                path: ROUTE_SPATIAL_MODULE,
                component: SpatialModulePage
            },
            {
                path: ROUTE_SEARCH_OCCURRENCES,
                component: OccurrenceSearchCollectionsPage
            },
            {
                path: ROUTE_SEARCH_RESULTS,
                component: OccurrenceSearchResultsPage
            },
            {
                path: ROUTE_UPLOAD,
                component: OccurrenceUploadPage
            },
            {
                path: ROUTE_UPLOAD_FIELD_MAP,
                component: OccurrenceUploadFieldMapPage
            },
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${ROUTE_SEARCH_OCCURRENCES}`,
                name: "Occurrence Search"
            },
            {
                url: `/${ROUTE_SPATIAL_MODULE}`,
                name: "Spatial module"
            }
        ];
    }
}
