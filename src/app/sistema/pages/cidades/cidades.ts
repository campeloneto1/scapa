import { Estado } from "../estados/estados";

export interface Cidade{
    id?: number,
    estado_id: number,
    estado: Estado,
    nome: string,

}

export type Cidades = Array<Cidade>;