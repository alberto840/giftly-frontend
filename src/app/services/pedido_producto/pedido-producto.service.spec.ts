import { TestBed } from '@angular/core/testing';

import { PedidoProductoService } from './pedido-producto.service';

describe('PedidoProductoService', () => {
  let service: PedidoProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
