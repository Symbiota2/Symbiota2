import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPage } from './collection-page.component';

describe('CollectionPageComponent', () => {
  let component: CollectionPage;
  let fixture: ComponentFixture<CollectionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
