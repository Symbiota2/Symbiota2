import { Component, Input } from "@angular/core";

@Component({
    selector: "symbiota2-loading-overlay",
    templateUrl: "./loading-overlay.component.html",
    styleUrls: ["./loading-overlay.component.scss"]
})
export class LoadingOverlayComponent {
    @Input() isLoading = false;
}
