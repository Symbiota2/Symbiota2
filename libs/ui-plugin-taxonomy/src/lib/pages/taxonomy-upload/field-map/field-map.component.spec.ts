import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceUploadFieldMapPage } from './field-map.component';

describe('FieldMapComponent', () => {
  let component: OccurrenceUploadFieldMapPage;
  let fixture: ComponentFixture<OccurrenceUploadFieldMapPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurrenceUploadFieldMapPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceUploadFieldMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
