import { Pessoa } from "../pessoas/pessoas";
import { Setor } from "../setores/setores";

export interface EventoPessoa{
    id?: number,
    evento_id: number,
    evento: Setor,
    pessoa: Pessoa,
    pessoa_id: number,
    presente: boolean,
}

export type EventosPessoas = Array<EventoPessoa>;