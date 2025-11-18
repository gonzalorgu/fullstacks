import { TestBed } from '@angular/core/testing';

import { Dress } from './dress';

describe('Dress', () => {
  let service: Dress;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dress);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
