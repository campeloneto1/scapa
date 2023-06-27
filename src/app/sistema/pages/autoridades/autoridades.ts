import { Cargo } from "../cargos/cargos";

export interface Autoridade{
    id?: number,
    nome: string,
    cargo_id: number,
    cargo: Cargo
}

export type Autoridades = Array<Autoridade>;