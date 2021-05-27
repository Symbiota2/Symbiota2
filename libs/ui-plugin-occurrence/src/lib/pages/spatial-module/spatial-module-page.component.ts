import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AppConfigService } from '@symbiota2/ui-common';
import {
    DrawEvents,
    FeatureGroup, Icon,
    latLng,
    latLngBounds,
    MapOptions, TileLayer,
    Map,
    tileLayer, LayerGroup, Control
} from 'leaflet';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'symbiota2-spatial-module',
    templateUrl: './spatial-module-page.component.html',
    styleUrls: ['./spatial-module-page.component.scss']
})
export class SpatialModulePage implements OnInit, AfterViewInit, OnDestroy {
    // private static readonly MAP_ATTRIB = `
    //   © <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> |
    //   © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> |
    //   <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>
    // `;

    private static readonly MAP_ATTRIB = `
      &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
    `;

    private get tilesUrl(): string {
        return this.appConfig.tilesUrl();
    }

    tileLayer: TileLayer;
    drawnItems: FeatureGroup;
    mapOptions: MapOptions;
    drawOptions: Control.DrawConstructorOptions;

    map = new ReplaySubject<Map>();
    mapLoaded = false;

    constructor(private readonly appConfig: AppConfigService) { }

    ngOnInit() {
        this.tileLayer = tileLayer(
            this.tilesUrl,
            { attribution: SpatialModulePage.MAP_ATTRIB }
        );
        this.drawnItems = new FeatureGroup();

        this.mapOptions = {
            layers: [this.tileLayer, this.drawnItems],
            zoom: 3,
            center: latLng(0, 0)
        };

        this.drawOptions = {
            edit: {
                featureGroup: this.drawnItems,
                edit: false,
            },
            draw: {
                marker: false,
                polyline: false,
                circlemarker: false
            }
        };

        this.mapLoaded = true;
    }

    onMapReady(map: Map) {
        this.map.next(map);
    }

    ngAfterViewInit() {
        this.map.pipe(take(1)).subscribe((map) => {
            console.log("Redrawing map...");
            map.invalidateSize();
        });
    }

    ngOnDestroy() {
        this.map.pipe(take(1)).subscribe((map) => map.remove());
    }

    onDraw(e: DrawEvents.Created) {
        this.drawnItems.addLayer(e.layer);
    }
}
