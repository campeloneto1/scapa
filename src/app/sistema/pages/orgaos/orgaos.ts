export interface Orgao{
    id?: number,
    nome: string,
    telefone1: string,
    telefone2?: string,
    email?: string
}

export type Orgaos = Array<Orgao>;