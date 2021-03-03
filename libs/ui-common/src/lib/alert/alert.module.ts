import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingOverlayComponent } from "./loading-overlay/loading-overlay.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";


@NgModule({
    declarations: [LoadingOverlayComponent],
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    exports: [LoadingOverlayComponent]
})
export class AlertModule { }
