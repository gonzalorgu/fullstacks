import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DressDetail } from './dress-detail';

describe('DressDetail', () => {
  let component: DressDetail;
  let fixture: ComponentFixture<DressDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DressDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DressDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
