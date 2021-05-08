import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionListPage } from './collection-list-page.component';

describe('CollectionListPageComponent', () => {
  let component: CollectionListPage;
  let fixture: ComponentFixture<CollectionListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionListPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
