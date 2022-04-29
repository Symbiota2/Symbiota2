import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { AlertService, AppConfigService } from '@symbiota2/ui-common';
import {
    DrawEvents,
    FeatureGroup,
    latLng,
    MapOptions, TileLayer,
    Map,
    tileLayer,
    Control, geoJSON, Layer, circleMarker, GeoJSON, latLngBounds
} from 'leaflet';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { Occurrence } from '../../dto/occurrence';
import { OccurrenceService } from '../../services/occurrence.service';
import { ROUTE_COLLECTION_PROFILE } from '@symbiota2/ui-plugin-collection';
import { ApiOccurrenceListItem } from '@symbiota2/data-access';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'symbiota2-spatial-module-dashboard',
    templateUrl: './spatial-module-dashboard-page.html',
    styleUrls: ['./spatial-module-dashboard-page.scss']
})
export class SpatialModuleDashboardPage  {

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly occurrences: OccurrenceService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute) { }

}
