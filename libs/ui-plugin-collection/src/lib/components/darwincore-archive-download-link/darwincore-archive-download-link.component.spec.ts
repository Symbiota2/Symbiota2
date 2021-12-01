import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarwincoreArchiveDownloadLinkComponent } from './darwincore-archive-download-link.component';

describe('DarwincoreArchiveDownloadLinkComponent', () => {
  let component: DarwincoreArchiveDownloadLinkComponent;
  let fixture: ComponentFixture<DarwincoreArchiveDownloadLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarwincoreArchiveDownloadLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DarwincoreArchiveDownloadLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
