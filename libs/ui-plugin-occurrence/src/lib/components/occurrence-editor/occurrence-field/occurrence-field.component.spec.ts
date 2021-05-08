import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceFieldComponent } from './occurrence-field.component';

describe('OccurrenceFieldComponent', () => {
  let component: OccurrenceFieldComponent;
  let fixture: ComponentFixture<OccurrenceFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurrenceFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
