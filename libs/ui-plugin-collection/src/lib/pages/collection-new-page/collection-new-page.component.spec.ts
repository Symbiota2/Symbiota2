import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNewPage } from './collection-new-page.component';

describe('CollectionNewPageComponent', () => {
  let component: CollectionNewPage;
  let fixture: ComponentFixture<CollectionNewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionNewPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
