import { Setor } from "../setores/setores";

export interface Funcionario{
    id?: number,
    nome: string,
    ramal1?: string,
    ramal2?: string,
    setor: Setor,
    setor_id: number
}

export type Funcionarios = Array<Funcionario>;