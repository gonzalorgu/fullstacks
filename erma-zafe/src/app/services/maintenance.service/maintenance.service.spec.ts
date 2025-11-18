import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceService } from './maintenance.service';

describe('MaintenanceService', () => {
  let component: MaintenanceService;
  let fixture: ComponentFixture<MaintenanceService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
