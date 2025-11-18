import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappFloat } from './whatsapp-float';

describe('WhatsappFloat', () => {
  let component: WhatsappFloat;
  let fixture: ComponentFixture<WhatsappFloat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappFloat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappFloat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
