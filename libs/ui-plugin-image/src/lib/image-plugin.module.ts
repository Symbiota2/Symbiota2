import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
    ApiClientModule, AppConfigService,
    NavBarLink, SymbiotaComponentModule,
    SymbiotaUiPlugin
} from '@symbiota2/ui-common';

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
    ImageFolderUploadService,
    ImageService,
    ImageTagKeyService,
    ImageTagService
} from './services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import {
    ImageDisplayPage,
    ImageSearchDashboardPage,
    ImageLibraryPageComponent,
    ImageDetailsPageComponent,
    ImageSearchPageComponent,
    ImageFolderUploadPage,
    ImageFolderUploadProblemImagesPage,
    ImageFolderUploadCompletePage
} from './pages';
// import { FilterPipe } from './pages/image-search/filter.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ImageDetailsEditorDialogComponent } from './components';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { CollectionPlugin } from '@symbiota2/ui-plugin-collection';
import {
    IMAGE_DETAILS_ROUTE,
    IMAGE_DISPLAY_ROUTE, IMAGE_FOLDER_UPLOAD_COMPLETE_ROUTE,
    IMAGE_FOLDER_UPLOAD_ROUTE,
    IMAGE_LIBRARY_ROUTE, IMAGE_SEARCH_DASHBOARD_ROUTE,
    IMAGE_SEARCH_ROUTE
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
        MatPaginatorModule,
        MatGridListModule,
        MatTabsModule,
        MatChipsModule,
        CollectionPlugin
    ],
    declarations: [
        ImageSearchPageComponent,
        ImageSearchDashboardPage,
        ImageLibraryPageComponent,
        ImageDetailsPageComponent,
        ImageDetailsEditorDialogComponent,
        ImageDisplayPage,
        ImageFolderUploadPage,
        ImageFolderUploadProblemImagesPage,
        ImageFolderUploadCompletePage
//        FilterPipe
    ],
    providers: [
        ImageService,
        ImageTagKeyService,
        ImageTagService,
        ImageFolderUploadService,
    ],
    entryComponents: [
        ImageSearchPageComponent,
        ImageSearchDashboardPage,
        ImageLibraryPageComponent,
        ImageDisplayPage,
        ImageDetailsPageComponent,
        ImageDetailsEditorDialogComponent,
        ImageFolderUploadPage,
        ImageFolderUploadProblemImagesPage,
        ImageFolderUploadCompletePage
    ]
})
export class ImagePlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.image.name';

    private static MY_IMAGE_LIBRARY_ROUTE = IMAGE_LIBRARY_ROUTE
    private static MY_IMAGE_DETAILS_ROUTE = IMAGE_DETAILS_ROUTE
    private static MY_IMAGE_SEARCH_ROUTE = IMAGE_SEARCH_ROUTE
    private static MY_IMAGE_SEARCH_DASHBOARD_ROUTE = IMAGE_SEARCH_DASHBOARD_ROUTE
    private static MY_IMAGE_DISPLAY_ROUTE = IMAGE_DISPLAY_ROUTE
    private static MY_IMAGE_FOLDER_UPLOAD_ROUTE = IMAGE_FOLDER_UPLOAD_ROUTE
    private static MY_IMAGE_FOLDER_UPLOAD_COMPLETE_ROUTE = IMAGE_FOLDER_UPLOAD_COMPLETE_ROUTE

    constructor(private readonly appConfig: AppConfigService) {
        super();
    }

    static routes(): Route[] {
        return [
            {
                path: ImagePlugin.MY_IMAGE_LIBRARY_ROUTE,
                component: ImageLibraryPageComponent
            },
            {
                path: ImagePlugin.MY_IMAGE_DETAILS_ROUTE,
                component: ImageDetailsPageComponent
            },
            {
                path: ImagePlugin.MY_IMAGE_SEARCH_ROUTE,
                component: ImageSearchPageComponent
            },
            {
                path: ImagePlugin.MY_IMAGE_SEARCH_DASHBOARD_ROUTE,
                component: ImageSearchDashboardPage
            },
            {
                path: ImagePlugin.MY_IMAGE_FOLDER_UPLOAD_ROUTE,
                component: ImageFolderUploadPage
            },
            {
                path: ImagePlugin.MY_IMAGE_DISPLAY_ROUTE,
                component: ImageDisplayPage
            },
            {
                path: ImagePlugin.MY_IMAGE_FOLDER_UPLOAD_COMPLETE_ROUTE,
                component: ImageFolderUploadCompletePage
            },
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${ImagePlugin.MY_IMAGE_LIBRARY_ROUTE}`,
                name: "core.layout.header.topnav.image_library_link"
            },
            {
                url: `/${ImagePlugin.MY_IMAGE_SEARCH_ROUTE}`,
                name: "core.layout.header.topnav.image_search_link"
            },
            {
                url: `/${ImagePlugin.MY_IMAGE_FOLDER_UPLOAD_ROUTE}`,
                name: "core.layout.header.topnav.image_folder_upload_link"
            },
            {
                url: `/${ImagePlugin.MY_IMAGE_SEARCH_DASHBOARD_ROUTE}`,
                name: "core.layout.header.topnav.image_search_dashboard_link"
            }
        ]
        }

    }
