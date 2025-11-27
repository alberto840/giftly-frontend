import { TestBed } from '@angular/core/testing';

import { MisionUsuarioService } from './mision-usuario.service';

describe('MisionUsuarioService', () => {
  let service: MisionUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MisionUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
