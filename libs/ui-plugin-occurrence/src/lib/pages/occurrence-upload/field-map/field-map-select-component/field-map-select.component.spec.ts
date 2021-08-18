import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldMapSelectComponent } from './field-map-select.component';

describe('ApiFieldListComponentComponent', () => {
  let component: FieldMapSelectComponent;
  let fixture: ComponentFixture<FieldMapSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldMapSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldMapSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
