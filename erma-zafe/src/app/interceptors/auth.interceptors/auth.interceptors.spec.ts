import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthInterceptors } from './auth.interceptors';

describe('AuthInterceptors', () => {
  let component: AuthInterceptors;
  let fixture: ComponentFixture<AuthInterceptors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthInterceptors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthInterceptors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
