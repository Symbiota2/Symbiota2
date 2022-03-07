import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {
    ApiClientModule,
    NavBarLink,
    SymbiotaComponentModule,
    SymbiotaUiPlugin,
} from '@symbiota2/ui-common';

import { Route, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlexModule } from '@angular/flex-layout';
import { MatTreeModule } from '@angular/material/tree';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import {
    TaxaViewerPageComponent,
    TaxonCreatePageComponent,
    TaxonomyUploadCompletePage,
    TaxonomyUploadProblemAcceptedNamesPage,
    TaxonProfilePageComponent,
    TaxonomyUploadFieldMapPage,
    TaxaProfilerEntryPage,
    TaxonEditorPageComponent,
    TaxonomyUploadPage,
    TaxaEditorEntryPage,
    TaxaUtilsEntryPage,
    TaxonomyUploadProblemRanksPage,
    TaxonomyFieldMapSelectComponent,
    TaxonomyConfirmDialogComponent,
    TaxonomyUploadProblemParentNamesPage,
    TaxaScientificNamesPage
} from './pages';
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
    TaxonStatusEditorComponent,
    TaxonStatusAcceptedEditorDialogComponent,
    TaxonImageAddComponent,
    TaxonImageGridComponent,
    TaxonStatusParentEditorDialogComponent,
    TaxonDeleteEditorComponent
} from './components';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
    TAXA_ROUTE,
    TAXA_SCIENTIFIC_NAMES,
    TAXA_EDITOR_ROUTE,
    TAXA_PROFILER_ROUTE,
    TAXA_UPLOAD_COMPLETE_ROUTE,
    TAXA_UPLOAD_PROBLEM_ACCEPTED_NAMES_ROUTE,
    TAXA_UPLOAD_PROBLEM_PARENT_NAMES_ROUTE,
    TAXA_UPLOAD_PROBLEM_RANKS_ROUTE,
    TAXA_UPLOADER_FIELD_MAP_ROUTE,
    TAXA_UPLOADER_ROUTE,
    TAXA_VIEWER_ROUTE,
    TAXON_CREATE_ROUTE,
    TAXON_EDITOR_ROUTE,
    TAXON_PROFILE_ROUTE,
    TAXA_UTILS_ENTRY_ROUTE,
} from './routes';
import {
    TaxonomyUploadService,
    TaxonomicEnumTreeService,
    TaxonService,
    TaxonomicStatusService,
    TaxonVernacularService,
    TaxonomicAuthorityService,
    TaxonDescriptionBlockService,
    TaxonDescriptionStatementService,
    TaxonomicUnitService,
} from './services';

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
        MatPaginatorModule,
    ],
    declarations: [
        TaxonomyUploadPage,
        TaxonomyUploadCompletePage,
        TaxonomyUploadProblemAcceptedNamesPage,
        TaxonomyUploadProblemParentNamesPage,
        TaxonomyUploadProblemRanksPage,
        TaxaProfilerEntryPage,
        TaxaEditorEntryPage,
        TaxaUtilsEntryPage,
        TaxaScientificNamesPage,
        TaxaViewerPageComponent,
        TaxonCreatePageComponent,
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
        TaxonImageAddComponent,
        TaxonImageGridComponent,
        TaxonStatusAcceptedEditorDialogComponent,
        TaxonStatusEditorComponent,
        TaxonStatusParentEditorDialogComponent,
        TaxonDeleteEditorComponent,
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
        TaxonomyUploadService,
    ],
    entryComponents: [
        TaxaEditorEntryPage,
        TaxaProfilerEntryPage,
        TaxonomyUploadPage,
        TaxonomyUploadCompletePage,
        TaxonomyUploadProblemAcceptedNamesPage,
        TaxonomyUploadProblemParentNamesPage,
        TaxonomyUploadProblemRanksPage,
        TaxonProfilePageComponent,
        TaxaViewerPageComponent,
        TaxonCreatePageComponent,
        TaxonEditorPageComponent,
        TaxaUtilsEntryPage,
        TaxaScientificNamesPage,
        TaxonomyUploadFieldMapPage,
        TaxonomyFieldMapSelectComponent,
        TaxonomyConfirmDialogComponent,
        TaxonEditorDialogComponent,
        TaxonImageAddComponent,
        TaxonImageGridComponent,
        TaxonVernacularEditorComponent,
        TaxonDescriptionDialogComponent,
        TaxonDescriptionEditorComponent,
        TaxonDescriptionStatementDialogComponent,
        TaxonTaxonEditorComponent,
        TaxonTaxonDialogComponent,
        TaxonStatusAcceptedEditorDialogComponent,
        TaxonStatusEditorComponent,
        TaxonStatusParentEditorDialogComponent,
        TaxonDeleteEditorComponent,
    ],
})
export class TaxonomyPlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.taxa.name';

    constructor() {
        super();
    }

    static routes(): Route[] {
        return [
            {
                path: TAXA_SCIENTIFIC_NAMES,
                component: TaxaScientificNamesPage,
            },
            {
                path: TAXON_PROFILE_ROUTE,
                component: TaxonProfilePageComponent,
            },
            {
                path: TAXA_VIEWER_ROUTE,
                component: TaxaViewerPageComponent,
            },
            {
                path: TAXON_EDITOR_ROUTE,
                component: TaxonEditorPageComponent,
            },
            {
                path: TAXA_EDITOR_ROUTE,
                component: TaxaEditorEntryPage,
            },
            {
                path: TAXON_CREATE_ROUTE,
                component: TaxonCreatePageComponent,
            },
            {
                path: TAXA_PROFILER_ROUTE,
                component: TaxaProfilerEntryPage,
            },
            {
                path: TAXA_UTILS_ENTRY_ROUTE,
                component: TaxaUtilsEntryPage
            },
            {
                path: TAXA_UPLOADER_ROUTE,
                component: TaxonomyUploadPage,
            },
            {
                path: TAXA_UPLOAD_PROBLEM_ACCEPTED_NAMES_ROUTE,
                component: TaxonomyUploadProblemAcceptedNamesPage,
            },
            {
                path: TAXA_UPLOAD_PROBLEM_PARENT_NAMES_ROUTE,
                component: TaxonomyUploadProblemParentNamesPage,
            },
            {
                path: TAXA_UPLOAD_PROBLEM_RANKS_ROUTE,
                component: TaxonomyUploadProblemRanksPage,
            },
            {
                path: TAXA_UPLOADER_FIELD_MAP_ROUTE,
                component: TaxonomyUploadFieldMapPage,
            },
            {
                path: TAXA_UPLOAD_COMPLETE_ROUTE,
                component: TaxonomyUploadCompletePage,
            },
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${TAXA_PROFILER_ROUTE}`,
                name: 'core.layout.header.topnav.taxonomy.profiler.link',
            },
            {
                url: `${TAXA_SCIENTIFIC_NAMES}`,
                name: 'core.layout.header.topnav.taxonomy.scientific.names',
            },
            {
                url: `${TAXA_ROUTE}`,
                name: 'core.layout.header.topnav.taxonomy.scientific.images',
            },
            {
                url: `${TAXA_ROUTE}`,
                name:
                    'core.layout.header.topnav.taxonomy.scientific.descriptions',
            },
            {
                url: `${TAXA_ROUTE}`,
                name:
                    'core.layout.header.topnav.taxonomy.scientific.common.names',
            },
            {
                url: `${TAXA_ROUTE}`,
                name:
                    'core.layout.header.topnav.taxonomy.scientific.alternative.taxonomies',
            },
            {
                url: `/${TAXA_VIEWER_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.viewer.link"
            },
            {
                url: `/${TAXA_EDITOR_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.editor.link"
            },
            {
                url: `/${TAXON_CREATE_ROUTE}`,
                name: "core.layout.header.topnav.taxon.create.link"
            },

            {
                url: `/${TAXA_UPLOADER_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.uploader.link"
            },

            {
                url: `/${TAXA_UTILS_ENTRY_ROUTE}`,
                name: "core.layout.header.topnav.taxonomy.utils.link"
            },

            // {
            //     url: `/${TAXA_VIEWER_ROUTE}`,
            //     name: "core.layout.header.topnav.taxonomy.viewer.link"
            // },
            // {
            //     url: `/${TAXA_EDITOR_ROUTE}`,
            //     name: "core.layout.header.topnav.taxonomy.editor.link"
            // },
            // {
            //     url: `/${TAXA_PROFILER_ROUTE}`,
            //     name: "core.layout.header.topnav.taxonomy.profiler.link"
            // },
            // {
            //     url: `/${TAXON_CREATE_ROUTE}`,
            //     name: "core.layout.header.topnav.taxon.create.link"
            // },
            // {
            //     url: `/${TAXA_UPLOADER_ROUTE}`,
            //     name: "core.layout.header.topnav.taxonomy.uploader.link"
            // },
        ];
    }
}
