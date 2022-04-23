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
    selector: 'symbiota2-image-search-dashboard',
    templateUrl: './image-search-dashboard-page.html',
    styleUrls: ['./image-search-dashboard-page.scss']
})
export class ImageSearchDashboardPage {

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute) { }

}
