import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalInterfaceTs } from './rental.interface.ts';

describe('RentalInterfaceTs', () => {
  let component: RentalInterfaceTs;
  let fixture: ComponentFixture<RentalInterfaceTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalInterfaceTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalInterfaceTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
