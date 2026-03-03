export interface ResponseDto<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Nivel {
    id?: number;
    exp: number;
    nombre: string;
}
