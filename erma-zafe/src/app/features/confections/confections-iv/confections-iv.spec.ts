import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfectionsIV } from './confections-iv';

describe('ConfectionsIV', () => {
  let component: ConfectionsIV;
  let fixture: ComponentFixture<ConfectionsIV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfectionsIV]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfectionsIV);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
