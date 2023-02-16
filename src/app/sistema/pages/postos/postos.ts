import { Orgao } from "../orgaos/orgaos";

export interface Posto{
    id?: number,
    orgao: Orgao,
    orgao_id: number,
    nome: string,
    telefone1?: string,
}

export type Postos = Array<Posto>;