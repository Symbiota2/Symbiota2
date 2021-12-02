import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwcPublishingComponent } from './dwc-publishing.component';

describe('DarwinCoreArchivePublishingComponent', () => {
  let component: DwcPublishingComponent;
  let fixture: ComponentFixture<DwcPublishingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwcPublishingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DwcPublishingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
