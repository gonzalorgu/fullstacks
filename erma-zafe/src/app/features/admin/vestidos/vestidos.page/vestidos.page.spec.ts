import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestidosPage } from './vestidos.page';

describe('VestidosPage', () => {
  let component: VestidosPage;
  let fixture: ComponentFixture<VestidosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VestidosPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VestidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
