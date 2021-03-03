import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionLogoComponent } from './collection-logo.component';

describe('CollectionLogoComponent', () => {
  let component: CollectionLogoComponent;
  let fixture: ComponentFixture<CollectionLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
