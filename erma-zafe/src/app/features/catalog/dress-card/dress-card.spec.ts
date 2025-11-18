import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DressCard } from './dress-card';

describe('DressCard', () => {
  let component: DressCard;
  let fixture: ComponentFixture<DressCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DressCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DressCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
