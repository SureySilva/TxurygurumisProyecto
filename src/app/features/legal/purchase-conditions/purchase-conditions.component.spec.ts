import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseConditionsComponent } from './purchase-conditions.component';

describe('PurchaseConditionsComponent', () => {
  let component: PurchaseConditionsComponent;
  let fixture: ComponentFixture<PurchaseConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
