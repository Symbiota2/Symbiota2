import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrenceCreateComponent } from './occurrence-create.component';

describe('OccurrenceCreateComponent', () => {
  let component: OccurrenceCreateComponent;
  let fixture: ComponentFixture<OccurrenceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurrenceCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
