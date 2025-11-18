import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestidosStore } from './vestidos.store';

describe('VestidosStore', () => {
  let component: VestidosStore;
  let fixture: ComponentFixture<VestidosStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VestidosStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VestidosStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
