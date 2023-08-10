import { Autoridade } from "../autoridades/autoridades";
import { Orgao } from "../orgaos/orgaos";

export interface AutoridadeAcesso{
    id?: number,
    orgao: Orgao,
    orgao_id: number,
    autoridade: Autoridade,
    autoridade_id: number,
    data_hora_entrada: Date,
    data_hora_saida?: Date,
    obs?: string,
    
}

export type AutoridadesAcessos = Array<AutoridadeAcesso>;

