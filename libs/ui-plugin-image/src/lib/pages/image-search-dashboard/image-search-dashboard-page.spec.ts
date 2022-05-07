import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchDashboardPage } from './image-search-dashboard-page';

describe('ImageSearchDashboardComponent', () => {
  let component: ImageSearchDashboardPage;
  let fixture: ComponentFixture<ImageSearchDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSearchDashboardPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSearchDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
