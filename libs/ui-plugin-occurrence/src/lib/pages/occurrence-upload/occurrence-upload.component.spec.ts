import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceUploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: OccurrenceUploadComponent;
  let fixture: ComponentFixture<OccurrenceUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurrenceUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
