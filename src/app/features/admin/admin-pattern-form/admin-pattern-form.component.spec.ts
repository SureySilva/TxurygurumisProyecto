import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPatternFormComponent } from './admin-pattern-form.component';

describe('AdminPatternFormComponent', () => {
  let component: AdminPatternFormComponent;
  let fixture: ComponentFixture<AdminPatternFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPatternFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPatternFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
