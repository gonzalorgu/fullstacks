import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalCard } from './rental-card';

describe('RentalCard', () => {
  let component: RentalCard;
  let fixture: ComponentFixture<RentalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
