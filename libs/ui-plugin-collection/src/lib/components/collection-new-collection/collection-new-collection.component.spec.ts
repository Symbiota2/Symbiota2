import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNewCollectionComponent } from './collection-new-collection.component';

describe('CollectionNewCollectionComponent', () => {
  let component: CollectionNewCollectionComponent;
  let fixture: ComponentFixture<CollectionNewCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionNewCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNewCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
