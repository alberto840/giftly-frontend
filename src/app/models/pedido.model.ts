import { DetallePedido } from "./detalle_pedido.model";
import { PedidoProducto } from "./pedido_producto.model";

export interface Pedido {
    id?: number;
    fechaCreacion: string | Date; // Formato 'YYYY-MM-DD'
    fechaEnvio?: string | Date;
    total: number;
    qrId?: number;
    usuarioId: number;
    tiendaPremioId?: number;
    status?: string; // El nuevo campo de estado
}

export interface PedidoRegistroRequest {
  pedido: Pedido;
  detallePedido?: DetallePedido;
  productos: PedidoProducto[];
}