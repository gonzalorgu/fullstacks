import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesService } from './reportes.service';

describe('ReportesService', () => {
  let component: ReportesService;
  let fixture: ComponentFixture<ReportesService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
