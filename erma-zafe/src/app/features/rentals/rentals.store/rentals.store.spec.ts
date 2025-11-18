import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalsStore } from './rentals.store';

describe('RentalsStore', () => {
  let component: RentalsStore;
  let fixture: ComponentFixture<RentalsStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalsStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalsStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
