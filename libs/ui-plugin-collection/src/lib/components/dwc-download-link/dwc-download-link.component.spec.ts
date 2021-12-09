import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwcDownloadLinkComponent } from './dwc-download-link.component';

describe('DwcDownloadLinkComponent', () => {
  let component: DwcDownloadLinkComponent;
  let fixture: ComponentFixture<DwcDownloadLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwcDownloadLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DwcDownloadLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
