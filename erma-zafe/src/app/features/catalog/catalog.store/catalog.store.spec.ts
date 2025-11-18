import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogStore } from './catalog.store';

describe('CatalogStore', () => {
  let component: CatalogStore;
  let fixture: ComponentFixture<CatalogStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
