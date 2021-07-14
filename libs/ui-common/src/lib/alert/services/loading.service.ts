import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable, of, timer } from 'rxjs';
import {
    delay,
    distinctUntilChanged,
    map,
    shareReplay, startWith, switchMap,
    take,
    tap
} from 'rxjs/operators';
import { AlertModule } from "../alert.module";

@Injectable({
    providedIn: AlertModule
})
export class LoadingService {
    constructor() {
        // TODO: Remove this
        this.isLoading.subscribe((isLoading) => {
            console.log(isLoading ? 'Loading...' : 'Load finished');
        });
    }

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
