import { Graduacao } from "../graduacoes/graduacoes";

export interface C1 {
    id?: number,
    graduacao_id?:number,
    graduacao?: Graduacao, 
    nome: string,
    nome_guerra?: string,
    apelido?: string,
    telefone1: string,
    telefone2?: string,
    telefone3?: string,
    obs: string
}

export type C1s = Array<C1>;