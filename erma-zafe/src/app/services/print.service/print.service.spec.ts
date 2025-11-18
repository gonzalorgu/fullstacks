import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintService } from './print.service';

describe('PrintService', () => {
  let component: PrintService;
  let fixture: ComponentFixture<PrintService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
