import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Symbiota2ExpansionPanelComponent } from './expansion-panel.component';

describe('ExpansionPanelComponent', () => {
  let component: Symbiota2ExpansionPanelComponent;
  let fixture: ComponentFixture<Symbiota2ExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Symbiota2ExpansionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Symbiota2ExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
