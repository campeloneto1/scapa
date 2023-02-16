import { Orgao } from "../orgaos/orgaos";

export interface Setor{
    id?: number,
    orgao: Orgao,
    orgao_id: number,
    nome: string,
    telefone1: string,
    telefone2?: string,
    email?: string
}

export type Setores = Array<Setor>;