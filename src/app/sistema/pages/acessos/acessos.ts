import { Funcionario } from "../funcionarios/funcionarios";
import { Pessoa } from "../pessoas/pessoas";
import { Posto } from "../postos/postos";
import { Setor } from "../setores/setores";

export interface Acesso{
    id?: number,
    setor: Setor,
    setor_id: number,
    funcionario?: Funcionario,
    funcionario_id?: number,
    posto: Posto,
    posto_id: number,
    pessoa: Pessoa,
    pessoa_id: number,
    data_hora: Date,
    obs: string,
    created_by: number,
    createdby: Pessoa,
}

export type Acessos = Array<Acesso>;