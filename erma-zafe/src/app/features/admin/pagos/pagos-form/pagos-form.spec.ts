import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosForm } from './pagos-form';

describe('PagosForm', () => {
  let component: PagosForm;
  let fixture: ComponentFixture<PagosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
