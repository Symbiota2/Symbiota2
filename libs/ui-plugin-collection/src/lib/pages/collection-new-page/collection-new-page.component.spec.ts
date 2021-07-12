import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNewPageComponent } from './collection-new-page.component';

describe('CollectionNewPageComponent', () => {
  let component: CollectionNewPageComponent;
  let fixture: ComponentFixture<CollectionNewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionNewPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
