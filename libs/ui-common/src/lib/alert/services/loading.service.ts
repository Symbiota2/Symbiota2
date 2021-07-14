import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import {
    distinctUntilChanged,
    map,
    shareReplay
} from 'rxjs/operators';
import { AlertModule } from "../alert.module";

@Injectable({
    providedIn: AlertModule
})
export class LoadingService {
    private loadingCounter = new BehaviorSubject<number>(0);

    isLoading = this.loadingCounter.pipe(
        map((loadingCounter) => loadingCounter > 0),
        distinctUntilChanged(),
        shareReplay(1)
    );

    start() {
        this.loadingCounter.next(this.counterValue() + 1);
    }

    end() {
        const current = this.counterValue();
        if (current > 0) {
            this.loadingCounter.next(current - 1);
        }
    }

    private counterValue(): number {
        return this.loadingCounter.getValue();
    }
}
