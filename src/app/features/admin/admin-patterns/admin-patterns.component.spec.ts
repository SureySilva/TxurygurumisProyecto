import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPatternsComponent } from './admin-patterns.component';

describe('AdminPatternsComponent', () => {
  let component: AdminPatternsComponent;
  let fixture: ComponentFixture<AdminPatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPatternsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
