export interface DetallePedido {
    id?: number;
    mensaje: string;
    instrucciones?: string;
    receptorEncarga: string;
    celular1?: string;
    celular2?: string;
    nombreObjetivo?: string;
    nombre_emisor?: string;
    pedidoId?: number;
    ubicacionId?: number;
}