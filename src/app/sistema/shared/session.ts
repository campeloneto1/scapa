import { Usuario } from "../pages/usuarios/usuarios";

export interface Session{
    token: string,
    user: Usuario
}