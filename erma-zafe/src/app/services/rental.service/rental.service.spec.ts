import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalService } from './rental.service';

describe('RentalService', () => {
  let component: RentalService;
  let fixture: ComponentFixture<RentalService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
