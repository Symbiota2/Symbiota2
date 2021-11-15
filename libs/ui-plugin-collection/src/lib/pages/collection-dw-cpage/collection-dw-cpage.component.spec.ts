import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDwCPageComponent } from './collection-dw-cpage.component';

describe('CollectionDwCPageComponent', () => {
  let component: CollectionDwCPageComponent;
  let fixture: ComponentFixture<CollectionDwCPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionDwCPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionDwCPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
