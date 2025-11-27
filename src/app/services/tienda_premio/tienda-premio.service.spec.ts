import { TestBed } from '@angular/core/testing';

import { TiendaPremioService } from './tienda-premio.service';

describe('TiendaPremioService', () => {
  let service: TiendaPremioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiendaPremioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
