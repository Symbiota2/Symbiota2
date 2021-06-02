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
    Control, geoJSON, Layer, circleMarker, GeoJSON
} from 'leaflet';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Occurrence } from '../../dto/occurrence';
import { OccurrenceService } from '../../services/occurrence.service';
import { ROUTE_COLLECTION_PROFILE } from '@symbiota2/ui-plugin-collection';

@Component({
    selector: 'symbiota2-spatial-module',
    templateUrl: './spatial-module-page.component.html',
    styleUrls: ['./spatial-module-page.component.scss']
})
export class SpatialModulePage implements OnInit, AfterViewInit, OnDestroy {
    private static readonly LOCAL_STRG_ZOOM = `${SpatialModulePage.name}_zoom`;
    private static readonly LOCAL_STRG_CENTER = `${SpatialModulePage.name}_center`;

    private static readonly OCCURRENCE_MARKER_OPTS = {
        radius: 6,
        fillColor: 'blue',
        color: 'blue',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.5
    };

    tileLayer: TileLayer;
    drawnItems: FeatureGroup;
    occurrenceFeatures: FeatureGroup;
    mapOptions: MapOptions;
    drawOptions: Control.DrawConstructorOptions;

    searchResults = new BehaviorSubject<Occurrence[]>([]);
    map = new ReplaySubject<Map>();
    mapLoaded = false;

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly occurrences: OccurrenceService,
        private readonly alert: AlertService) { }

    private static occurrenceToGeoJSON(occurrence: Occurrence): Record<string, unknown> {
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
            center: latLng(center[0], center[1])
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

        this.mapLoaded = true;
    }

    onMapReady(map: Map) {
        this.map.next(map);
    }

    ngAfterViewInit() {
        this.map.pipe(take(1)).subscribe((map) => {
            // console.log("Redrawing map...");
            map.invalidateSize();
        });
    }

    ngOnDestroy() {
        this.map.pipe(take(1)).subscribe((map) => map.remove());
    }

    onDrawPoly(e: DrawEvents.Created) {
        this.drawnItems.clearLayers();
        this.occurrenceFeatures.clearLayers();

        this.drawnItems.addLayer(e.layer);

        this.occurrences.findByGeoJSON(e.layer.toGeoJSON() as any).subscribe((occurrences) => {
            if (occurrences.length === 0) {
                this.alert.showError('No results found');
            }
            else {
                occurrences.forEach((occurrence) => {
                    const occurrenceGeoJSON = SpatialModulePage.occurrenceToGeoJSON(occurrence);
                    const geoJSONLayer = SpatialModulePage.occurrenceGeoJSONToLayer(occurrenceGeoJSON);
                    this.occurrenceFeatures.addLayer(geoJSONLayer);
                });
            }
        });
    }

    onMapViewChanged() {
        this.map.pipe(take(1)).subscribe((map) => {
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
