import { Pessoas } from "../pessoas/pessoas";
import { Setor } from "../setores/setores";

export interface Evento{
    id?: number,
    setor_id: number,
    setor: Setor,
    nome: string,
    data_hora: Date,
    obs: string,
    pessoas?: Pessoas|any
}

export type Eventos = Array<Evento>;