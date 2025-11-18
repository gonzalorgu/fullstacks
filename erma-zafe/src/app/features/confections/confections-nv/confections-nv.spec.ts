import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfectionsNv } from './confections-nv';

describe('ConfectionsNv', () => {
  let component: ConfectionsNv;
  let fixture: ComponentFixture<ConfectionsNv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfectionsNv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfectionsNv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
