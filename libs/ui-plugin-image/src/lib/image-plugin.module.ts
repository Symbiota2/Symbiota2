import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import {
  ApiClientModule,
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
    ImageService,
    ImageTagKeyService,
    ImageTagService
} from './services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import {
    ImageDisplayPage,
    ImageLibraryPageComponent,
    ImageSearchPageComponent,
    ImageDetailsPageComponent
} from './pages';
import { FilterPipe } from './pages/image-search/filter.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ImageDetailsEditorComponent, ImageDetailsEditorDialogComponent } from './components';
import { MatGridListModule } from '@angular/material/grid-list';

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
        MatGridListModule
    ],
    declarations: [
        ImageSearchPageComponent,
        ImageLibraryPageComponent,
        ImageDetailsPageComponent,
        ImageDetailsEditorComponent,
        ImageDetailsEditorDialogComponent,
        ImageDisplayPage,
        FilterPipe
    ],
    providers: [
        ImageService,
        ImageTagKeyService,
        ImageTagService,
    ],
    entryComponents: [
        ImageSearchPageComponent,
        ImageLibraryPageComponent,
        ImageDisplayPage,
        ImageDetailsPageComponent,
        ImageDetailsEditorComponent,
        ImageDetailsEditorDialogComponent
    ]
})
export class ImagePlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.image.name';

    private static IMAGE_LIBRARY_ROUTE = "images/library/:level"
    private static IMAGE_DETAILS_ROUTE = "image/details/:imageID"
    private static IMAGE_SEARCH_ROUTE = "image/search"
    private static IMAGE_DISPLAY_ROUTE = "image/display"

    constructor() {
        super();
    }

    static routes(): Route[] {
        return [
            {
                path: ImagePlugin.IMAGE_LIBRARY_ROUTE,
                component: ImageLibraryPageComponent
            },
            {
                path: ImagePlugin.IMAGE_DETAILS_ROUTE,
                component: ImageDetailsPageComponent
            },
            {
                path: ImagePlugin.IMAGE_SEARCH_ROUTE,
                component: ImageSearchPageComponent
            },
            {
                path: ImagePlugin.IMAGE_DISPLAY_ROUTE,
                component: ImageDisplayPage
            },
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${ImagePlugin.IMAGE_LIBRARY_ROUTE}`,
                name: "core.layout.header.topnav.image_library_link"
            },
            {
                url: `/${ImagePlugin.IMAGE_SEARCH_ROUTE}`,
                name: "core.layout.header.topnav.image_search_link"
                }
            ]
        }

    }
