export interface Mision {
    id: number;
    objetivo: string;
    titulo: string;
    descripcion: string;
    fechaCreacion: string; // java.sql.Date
    fechaFinal: string;    // java.sql.Date
    premioPunt: number;
}