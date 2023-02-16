import { Pais } from "../paises/paises";

export interface Estado{
    id?: number,
    pais_id: number,
    pais: Pais,
    nome: string,
    uf: string
}

export type Estados = Array<Estado>;