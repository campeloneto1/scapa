import { Usuario } from "../usuarios/usuarios";

export interface Log{
    id?: number,
    user_id: number,
    user: Usuario,
    mensagem: string,
    table: string,
    fk: number,
    action: number,
    object: string,
    object_old: string
}

export type Logs = Array<Log>;