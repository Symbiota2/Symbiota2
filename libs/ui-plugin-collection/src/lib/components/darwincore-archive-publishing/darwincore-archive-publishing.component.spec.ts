import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarwinCoreArchivePublishingComponent } from './darwincore-archive-publishing.component';

describe('DarwinCoreArchivePublishingComponent', () => {
  let component: DarwinCoreArchivePublishingComponent;
  let fixture: ComponentFixture<DarwinCoreArchivePublishingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarwinCoreArchivePublishingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DarwinCoreArchivePublishingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
