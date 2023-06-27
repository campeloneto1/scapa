import { Autoridade } from "../autoridades/autoridades";

export interface AutoridadeAcesso{
    id?: number,
    autoridade: Autoridade,
    autoridade_id: number,
    data_hora: Date,
    tipo: number,
    obs: string
}

export type AutoridadesAcessos = Array<AutoridadeAcesso>;

