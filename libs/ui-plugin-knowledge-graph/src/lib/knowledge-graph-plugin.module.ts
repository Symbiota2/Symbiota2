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
    KnowledgeGraphService,
} from './services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import {
    KnowledgeGraphListPage,
} from './pages';
// import { FilterPipe } from './pages/image-search/filter.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { CollectionPlugin } from '@symbiota2/ui-plugin-collection';
import {
    KNOWLEDGE_GRAPH_LIST_ROUTE
} from './routes';
import {
    BuildGraphDialogComponent,
    DeleteGraphDialogComponent,
    DownloadGraphDialogComponent,
    RebuildGraphDialogComponent
} from './components';
import { I18nPlugin } from '@symbiota2/ui-plugin-i18n';

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
    CollectionPlugin,
    I18nPlugin
  ],
    declarations: [
        KnowledgeGraphListPage,
        DeleteGraphDialogComponent,
        BuildGraphDialogComponent,
        RebuildGraphDialogComponent,
        DownloadGraphDialogComponent,
//        FilterPipe
    ],
    providers: [
        KnowledgeGraphService,
    ],
    entryComponents: [
        KnowledgeGraphListPage,
    ]
})
export class KnowledgeGraphPlugin extends SymbiotaUiPlugin {
    static readonly PLUGIN_NAME = 'plugins.knowledge.graph.name';

    private static MY_KNOWLEDGE_GRAPH_LIST_ROUTE = KNOWLEDGE_GRAPH_LIST_ROUTE

    constructor(private readonly appConfig: AppConfigService) {
        super();
    }

    static routes(): Route[] {
        return [
            {
                path: KnowledgeGraphPlugin.MY_KNOWLEDGE_GRAPH_LIST_ROUTE,
                component: KnowledgeGraphListPage
            },
        ];
    }

    static navBarLinks(): NavBarLink[] {
        return [
            {
                url: `/${KnowledgeGraphPlugin.MY_KNOWLEDGE_GRAPH_LIST_ROUTE}`,
                name: "core.layout.header.topnav.knowledge.graph.list"
            },
        ]
        }

    }
