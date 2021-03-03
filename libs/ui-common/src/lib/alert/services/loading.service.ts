import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable, timer } from 'rxjs';
import { distinctUntilChanged, map, share } from 'rxjs/operators';
import { AlertModule } from "../alert.module";

@Injectable({
    providedIn: AlertModule
})
export class LoadingService {
    constructor() {
        // TODO: Remove this
        this.isLoading.subscribe((isLoading) => {
            console.debug(isLoading ? 'Loading...' : 'Load finished');
        });
    }

    private loadingCounter = new BehaviorSubject<number>(0);

    // Take at least 500ms
    isLoading = forkJoin({
        isLoading: this.isLoadingObs,
        timer: timer(500)
    }).pipe(
        map((results) => results.isLoading),
        share()
    );

    start() {
        const current = this.loadingCounter.getValue();
        this.loadingCounter.next(current + 1);
    }

    end() {
        const current = this.loadingCounter.getValue();
        if (current > 0) {
            this.loadingCounter.next(current - 1);
        }
    }

    private get isLoadingObs(): Observable<boolean> {
        return this.loadingCounter.asObservable().pipe(
            map((loadingCounter) => loadingCounter > 0),
            distinctUntilChanged()
        );
    }
}
