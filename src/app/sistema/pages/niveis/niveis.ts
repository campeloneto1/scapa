import { Orgao } from "../orgaos/orgaos";

export interface Nivel{
    id?: number,
    orgao_id: number,
    orgao: Orgao,
    nome: string,
    
}

export type Niveis = Array<Nivel>;