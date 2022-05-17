import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceUploadPage } from './occurrence-upload-page.component';

describe('OccurrenceUploadPage', () => {
  let component: OccurrenceUploadPage;
  let fixture: ComponentFixture<OccurrenceUploadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OccurrenceUploadPage]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
