import { Funcionario } from "../funcionarios/funcionarios";
import { Setor } from "../setores/setores";

export interface Chave{
    id?: number,
    setor_id: number,
    setor: Setor,
    funcionario_entrega_id: number,
    funcionario_entrega: Funcionario,
    data_hora_entrega: Date;
    funcionario_devolucao?: Funcionario,
    funcionario_devolucao_id?: number,
    data_hora_devolucao?: Date,
    obs?: string
}

export type Chaves = Array<Chave>;