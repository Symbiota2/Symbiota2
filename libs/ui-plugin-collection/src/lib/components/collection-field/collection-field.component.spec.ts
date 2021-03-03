import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFieldComponent } from './collection-field.component';

describe('CollectionFieldComponent', () => {
  let component: CollectionFieldComponent;
  let fixture: ComponentFixture<CollectionFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
