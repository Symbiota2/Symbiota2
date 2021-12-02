import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDwcPage } from './collection-dwc-page.component';

describe('CollectionDwCPageComponent', () => {
  let component: CollectionDwcPage;
  let fixture: ComponentFixture<CollectionDwcPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionDwcPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionDwcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
