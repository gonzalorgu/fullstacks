import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthInterfaceTs } from './auth.interface.ts';

describe('AuthInterfaceTs', () => {
  let component: AuthInterfaceTs;
  let fixture: ComponentFixture<AuthInterfaceTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthInterfaceTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthInterfaceTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
