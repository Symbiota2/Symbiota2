import { Component, OnInit } from "@angular/core";
import { AppConfigService } from "@symbiota2/ui-common";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
    static readonly ROUTE = "";
    title = "";

    constructor(private readonly appConfig: AppConfigService) { }

    ngOnInit() {
        this.title = this.appConfig.appTitle();
    }
}
