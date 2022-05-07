import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { AlertService, AppConfigService } from '@symbiota2/ui-common';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'symbiota2-collection-statistics-dashboard',
    templateUrl: './collection-statistics-dashboard-page.html',
    styleUrls: ['./collection-statistics-dashboard-page.scss']
})
export class CollectionStatisticsDashboardPage {

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute) { }

}
