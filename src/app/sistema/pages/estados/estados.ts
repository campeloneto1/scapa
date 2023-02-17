import { Pais } from "../paises/paises";

export interface Estado{
    id?: number,
    pais_id: number,
    pais: Pais,
    nome: string,
    uf: string,
    data:any
}

export type Estados = Array<Estado>;

export type EstadosPaginate = {
    data: Array<Estado>,
    current_page: number,
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: Array<any>,
    next_page_url: string,
    path: string
    per_page: number
    prev_page_url: string
    to: number
    total: number
};