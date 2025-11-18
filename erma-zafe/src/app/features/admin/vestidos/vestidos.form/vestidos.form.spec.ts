import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestidosForm } from './vestidos.form';

describe('VestidosForm', () => {
  let component: VestidosForm;
  let fixture: ComponentFixture<VestidosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VestidosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VestidosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
