import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlquileresForm } from './alquileres.form';

describe('AlquileresForm', () => {
  let component: AlquileresForm;
  let fixture: ComponentFixture<AlquileresForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlquileresForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlquileresForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
