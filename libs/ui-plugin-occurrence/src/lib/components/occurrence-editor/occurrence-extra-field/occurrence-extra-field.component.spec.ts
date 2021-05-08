import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceExtraFieldComponent } from './occurrence-extra-field.component';

describe('OccurrenceExtraFieldComponent', () => {
  let component: OccurrenceExtraFieldComponent;
  let fixture: ComponentFixture<OccurrenceExtraFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurrenceExtraFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceExtraFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
