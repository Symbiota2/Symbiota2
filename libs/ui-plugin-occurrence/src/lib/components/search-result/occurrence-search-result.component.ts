import {
    Component,
    Input,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OccurrenceSearchResultModalComponent } from "../search-result-modal/occurrence-search-result-modal.component";
import { OccurrenceListItem } from '../../dto';

@Component({
    selector: "occurrence-search-search-result",
    templateUrl: "./occurrence-search-result.component.html",
    styleUrls: ["./occurrence-search-result.component.scss"]
})
export class OccurrenceSearchResultComponent {
    @Input() occurrence: OccurrenceListItem;

    constructor(public dialog: MatDialog) { }

    openDialog(): void {
        this.dialog.open(OccurrenceSearchResultModalComponent, {
            data: this.occurrence,
            width: "80rem"
        });
    }
}
