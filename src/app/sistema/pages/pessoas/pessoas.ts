import { Acesso, Acessos } from "../acessos/acessos";
import { Cidade } from "../cidades/cidades";
import { Estado } from "../estados/estados";
import { Nivel } from "../niveis/niveis";
import { Orgao } from "../orgaos/orgaos";
import { Sexo } from "../sexos/sexos";

export interface Pessoa{
    id?: number,
    acessos?: Acessos|any,
    orgao_id: number,
    orgao: Orgao,
    nivel_id: number,
    nivel: Nivel,
    sexo_id?: number,
    sexo?: Sexo,
    nome: string,
    cpf: string,
    rg: string,
    uf_rg_id?: number,
    uf_rg?: Estado,
    data_nascimento?: Date,
    mae: string,
    pai: string,
    telefone1: string,
    telefone2: string,
    email: string,
    obs?: string,
    rua?: string,
    numero?: string,
    bairro?: string,
    complemento?: string,
    cidade_id: number,
    cidade: Cidade,
    cep?: string,
    key: string,
    foto?: string,
    digital?: string,
    pivot?: any,
    nao_autorizado?: boolean,
}

export type Pessoas = Array<Pessoa>;