export interface Producto {
    id: number;
    nombre: string;
    stock: number;
    precio: number;     // BigDecimal
    categoriaId: number;
}