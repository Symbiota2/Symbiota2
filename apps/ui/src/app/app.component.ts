import { Component, OnInit } from "@angular/core";
import {
    LoadingService,
    UserService
} from "@symbiota2/ui-common";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    isLoading = false;

    constructor(
        private readonly loadingService: LoadingService,
        private readonly userService: UserService) { }

    ngOnInit() {
        // Show loading screen when loading
        this.loadingService.isLoading.subscribe((isLoading) => {
            this.isLoading = isLoading;
        });

        // Try to log in with refresh token
        this.userService.refresh().subscribe();
    }
}
