import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceDwcUploadPage } from './occurrence-dwc-upload.component';

describe('OccurrenceDwcUploadPage', () => {
  let component: OccurrenceDwcUploadPage;
  let fixture: ComponentFixture<OccurrenceDwcUploadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OccurrenceDwcUploadPage]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceDwcUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
