import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService, AppConfigService } from '@symbiota2/ui-common';
import {
    DrawEvents,
    FeatureGroup,
    latLng,
    MapOptions, TileLayer,
    Map,
    tileLayer,
    Control, Polygon, Circle, geoJSON
} from 'leaflet';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Occurrence } from '../../dto/occurrence';
import { OccurrenceService } from '../../services/occurrence.service';

@Component({
    selector: 'symbiota2-spatial-module',
    templateUrl: './spatial-module-page.component.html',
    styleUrls: ['./spatial-module-page.component.scss']
})
export class SpatialModulePage implements OnInit, AfterViewInit, OnDestroy {
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

    ngOnInit() {
        this.tileLayer = tileLayer(
            this.appConfig.tilesUrl(),
            { attribution: this.appConfig.tilesAttribution() }
        );
        this.drawnItems = new FeatureGroup();
        this.occurrenceFeatures = new FeatureGroup();

        this.mapOptions = {
            layers: [this.tileLayer, this.drawnItems, this.occurrenceFeatures],
            zoom: 3,
            center: latLng(0, 0)
        };

        this.drawOptions = {
            edit: {
                featureGroup: this.drawnItems
            },
            draw: {
                marker: false,
                polyline: false,
                circlemarker: false,
                rectangle: false,
                circle: false
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
        this.drawnItems.addLayer(e.layer);
        this.occurrenceFeatures.clearLayers();
        this.occurrences.findByGeoJSON(e.layer.toGeoJSON() as any).subscribe((occurrences) => {
            if (occurrences.length === 0) {
                this.alert.showError('No results found');
            }
            else {
                occurrences.forEach((occurrence) => {
                    const { latitude, longitude, ...props } = occurrence;
                    this.occurrenceFeatures.addLayer(geoJSON({
                        type: 'Feature',
                        properties: props,
                        geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        }
                    } as any))
                });
            }
        });
    }

    onDeletePoly(e: DrawEvents.Deleted) {
        this.occurrenceFeatures.clearLayers();
    }
}
