import { NgModule } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from '@angular/common';
import { NavBarLink, SymbiotaUiPlugin } from '@symbiota2/ui-common';

import { 
  CHECKLIST_LIST_ROUTE,
  CHECKLIST_PROJECT_LIST_ROUTE,
  CHECKLIST_PROJECT_ROUTE,
  CHECKLIST_PROJECT_ID_ROUTE,
  CHECKLIST_REGIONAL_ROUTE,
  CHECKLIST_ID_ROUTE,
  CHECKLIST_ADMIN_ROUTE,
  CHECKLIST_CREATE_ROUTE,
  CHECKLIST_TEACHING_ROUTE,
  CHECKLIST_PROJECT_ID_CHECKLIST_LIST_ROUTE,
 } from './routes';
import { Route, RouterModule } from '@angular/router';
import { ChecklistCreatePageComponent } from './pages/checklist-create/checklist-create-page.component';
import { ChecklistRegionalPageComponent } from './pages/checklist-regional/checklist-regional-page.component';
import { ChecklistTeachingPageComponent } from './pages/checklist-teaching/checklist-teaching-page.component';
import { ChecklistService } from './services/checklist/checklist.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule} from '@angular/material/card';
import { ChecklistSinglePageComponent } from './pages/checklist-single/checklist-single-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [ChecklistService],
  declarations: [
    ChecklistCreatePageComponent,
    ChecklistTeachingPageComponent,
    ChecklistRegionalPageComponent,
    ChecklistSinglePageComponent,
  ],
  entryComponents: [
    ChecklistCreatePageComponent,
    ChecklistTeachingPageComponent,
    ChecklistRegionalPageComponent,
    ChecklistSinglePageComponent,
  ],
})
export class ChecklistPlugin extends SymbiotaUiPlugin {
  static readonly PLUGIN_NAME = 'plugins.checklist.name';

  constructor() {
    super();
  }

  static routes(): Route[] {
    return [
      {
        path: CHECKLIST_PROJECT_LIST_ROUTE,
        component: ChecklistRegionalPageComponent,
      },
      {
        path: CHECKLIST_TEACHING_ROUTE,
        component: ChecklistTeachingPageComponent,
      },
      {
        path: CHECKLIST_CREATE_ROUTE,
        component: ChecklistCreatePageComponent,
      },
      {
        path: CHECKLIST_PROJECT_ID_ROUTE,
        component: ChecklistSinglePageComponent
      },
      {
        path: CHECKLIST_PROJECT_ID_CHECKLIST_LIST_ROUTE,
        component: ChecklistSinglePageComponent
     }
    ];
  }

  static navBarLinks(): NavBarLink[] {
      return [
          {
            url: `/${CHECKLIST_PROJECT_LIST_ROUTE}`,
            name: 'core.layout.header.topnav.checklist.regional.link',
          },
          {
            url: `/${CHECKLIST_TEACHING_ROUTE}`,
            name: 'core.layout.header.topnav.checklist.teaching.link',
          },
          {
            url: `/${CHECKLIST_CREATE_ROUTE}`,
            name: 'core.layout.header.topnav.checklist.create.link',
          },
      ];
  }
}
