import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionStatisticsDashboardPage } from './image-search-dashboard-page';

describe('CollectionStatisticsDashboardPage', () => {
  let component: CollectionStatisticsDashboardPage;
  let fixture: ComponentFixture<CollectionStatisticsDashboardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionStatisticsDashboardPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionStatisticsDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
