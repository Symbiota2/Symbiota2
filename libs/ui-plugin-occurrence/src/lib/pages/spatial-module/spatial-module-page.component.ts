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
    selector: 'symbiota2-spatial-module',
    templateUrl: './spatial-module-page.component.html',
    styleUrls: ['./spatial-module-page.component.scss']
})
export class SpatialModulePage implements OnInit, AfterViewInit {
    private static readonly LOCAL_STRG_ZOOM = `${SpatialModulePage.name}_zoom`;
    private static readonly LOCAL_STRG_CENTER = `${SpatialModulePage.name}_center`;

    private static readonly OCCURRENCE_MARKER_OPTS = {
        radius: 6,
        fillColor: 'blue',
        color: 'blue',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.5,
    };

    tileLayer: TileLayer;
    drawnItems: FeatureGroup;
    occurrenceFeatures: FeatureGroup;
    mapOptions: MapOptions;
    drawOptions: Control.DrawConstructorOptions;

    searchResults = new BehaviorSubject<Occurrence[]>([]);
    map = new ReplaySubject<Map>(1);
    mapLoaded = false;

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly occurrences: OccurrenceService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute) { }

    private static occurrenceToGeoJSON(occurrence: ApiOccurrenceListItem): Record<string, unknown> {
        const { latitude, longitude, ...props } = occurrence;
        return {
            type: 'Feature',
            properties: props,
            geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        };
    }

    private static occurrenceGeoJSONToLayer(geojson: Record<string, unknown>): GeoJSON<any> {
        return geoJSON(
            geojson as any,
            {
                pointToLayer(geoJsonPoint, latlng): Layer {
                    return circleMarker(
                        latlng,
                        SpatialModulePage.OCCURRENCE_MARKER_OPTS
                    );
                },
                onEachFeature: SpatialModulePage.occurrenceBindPopup
            }
        )
    }

    private static occurrenceBindPopup(feature, layer: Layer): void {
        const collectionID = feature.properties["collection"]["id"];
        const sciname = feature.properties['sciname'];

        layer.bindPopup(`
            <a href='/${ROUTE_COLLECTION_PROFILE.replace(':collectionID', collectionID)}'>
              ${sciname}
            </a>
        `);
    }

    ngOnInit() {
        this.tileLayer = tileLayer(
            this.appConfig.tilesUrl(),
            { attribution: this.appConfig.tilesAttribution() }
        );
        this.drawnItems = new FeatureGroup();
        this.occurrenceFeatures = new FeatureGroup();

        const zoom = parseInt(localStorage.getItem(SpatialModulePage.LOCAL_STRG_ZOOM) || '3');
        const center = JSON.parse(localStorage.getItem(SpatialModulePage.LOCAL_STRG_CENTER) || '[0, 0]');

        this.mapOptions = {
            layers: [this.tileLayer, this.drawnItems, this.occurrenceFeatures],
            zoom: zoom,
            center: latLng(center[0], center[1]),
            maxBounds: latLngBounds(latLng(-90, -180), latLng(90, 180))
        };

        this.drawOptions = {
            edit: {
                featureGroup: this.drawnItems,
                edit: false,
                remove: false
            },
            draw: {
                marker: false,
                polyline: false,
                circlemarker: false,
                rectangle: false,
                circle: false,
            }
        };

        this.occurrences.searchResults.occurrences.subscribe((occurrences) => {
            occurrences.data.forEach((occurrence) => {
                const occurrenceGeoJSON = SpatialModulePage.occurrenceToGeoJSON(occurrence);
                const geoJSONLayer = SpatialModulePage.occurrenceGeoJSONToLayer(occurrenceGeoJSON);
                this.occurrenceFeatures.addLayer(geoJSONLayer);
            });
        });

        this.currentRoute.queryParamMap.subscribe((params) => {
            const geojson = params.get('geoJSON');
            this.clearMap();

            if (geojson !== null) {
                this.drawnItems.addLayer(geoJSON(JSON.parse(atob(geojson))));
                this.occurrences.searchResults.setQueryParams({
                    collectionID: [],
                    geoJSON: geojson
                });
            }
        });

        this.occurrences.searchResults.clear();
        this.mapLoaded = true;
    }

    onMapReady(map: Map) {
        this.map.next(map);
    }

    clearMap() {
        this.occurrenceFeatures.clearLayers();
        this.drawnItems.clearLayers();
    }

    ngAfterViewInit() {
        this.map.pipe(first()).subscribe((map) => map.invalidateSize());
    }

    async onDrawPoly(e: DrawEvents.Created) {
        const boundingPolyStr = JSON.stringify(e.layer.toGeoJSON().geometry);
        const boundingPoly = btoa(boundingPolyStr);

        await this.router.navigate(
            ['.'],
            {
                relativeTo: this.currentRoute,
                queryParams: { geoJSON: boundingPoly }
            }
        );
    }

    onMapViewChanged() {
        this.map.pipe(first()).subscribe((map) => {
            const zoom = map.getZoom();
            const center = map.getCenter();

            localStorage.setItem(
                SpatialModulePage.LOCAL_STRG_ZOOM,
                zoom.toString()
            );

            localStorage.setItem(
                SpatialModulePage.LOCAL_STRG_CENTER,
                JSON.stringify([center.lat, center.lng])
            );
        });
    }
}
