import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfectionsFS } from './confections-f-s';

describe('ConfectionsFS', () => {
  let component: ConfectionsFS;
  let fixture: ComponentFixture<ConfectionsFS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfectionsFS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfectionsFS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
