import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CollectionCheckboxSelectorComponent} from './collection-checkbox-selector.component';

describe('CollectionCheckboxSelectorComponent', () => {
    let component: CollectionCheckboxSelectorComponent;
    let fixture: ComponentFixture<CollectionCheckboxSelectorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CollectionCheckboxSelectorComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CollectionCheckboxSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
