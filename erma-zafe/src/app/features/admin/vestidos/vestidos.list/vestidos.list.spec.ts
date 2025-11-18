import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestidosList } from './vestidos.list';

describe('VestidosList', () => {
  let component: VestidosList;
  let fixture: ComponentFixture<VestidosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VestidosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VestidosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
