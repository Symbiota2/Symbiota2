import { Component, OnInit } from "@angular/core";
import { AppConfigService } from "@symbiota2/ui-common";

/**
 * The home page for the app. Displays a brief description of the portal
 * that's stored in the AppConfigService
 */
@Component({
    selector: "symbiota2-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomePage implements OnInit {
    static readonly ROUTE = "";
    title = "";

    constructor(private readonly appConfig: AppConfigService) { }

    ngOnInit() {
        this.title = this.appConfig.appTitle();
    }
}
