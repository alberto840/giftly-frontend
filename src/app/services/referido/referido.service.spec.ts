import { TestBed } from '@angular/core/testing';

import { ReferidoService } from './referido.service';

describe('ReferidoService', () => {
  let service: ReferidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
