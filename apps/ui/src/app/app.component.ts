import { Component, HostListener, OnInit } from "@angular/core";
import {
    LoadingService,
    UserService
} from "@symbiota2/ui-common";
import * as e from "express";

/**
 * The main app component. Contains the site header & navbar, along with a
 * router-outlet that displays the current page component.
 */
@Component({
    selector: "symbiota2-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    isLoading = false;

    navbarSticky:boolean = true;

    @HostListener('window:scroll',['$event']) onScroll(){
        if(window.scrollY > 150){
            this.navbarSticky = true;
        } else {
            this.navbarSticky = false;
        }
    }

    constructor(
        private readonly loadingService: LoadingService,
        private readonly userService: UserService ) { }

    ngOnInit() {
        // Show loading screen when loading
        this.loadingService.isLoading.subscribe((isLoading) => {
            this.isLoading = isLoading;
        });

        // Try to log in with refresh token
        this.userService.refresh().subscribe();
    }
}
