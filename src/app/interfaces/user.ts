export interface User {
    id?: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    image: string;
    password?: string; // Solo para el POST de nuevo usuario
}