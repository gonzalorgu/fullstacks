import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleModal } from './sale-modal';

describe('SaleModal', () => {
  let component: SaleModal;
  let fixture: ComponentFixture<SaleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
