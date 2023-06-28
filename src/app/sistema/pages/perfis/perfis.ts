export interface Perfil{
    id?: number,
    nome?: string,
    administrador?: boolean,
    gestor?: boolean,

    acessos?: boolean,
    acessos_cad?: boolean,
    acessos_edt?: boolean,
    acessos_del?: boolean,

    autoridades_acessos?: boolean,
    autoridades_acessos_cad?: boolean,
    autoridades_acessos_edt?: boolean,
    autoridades_acessos_del?: boolean,

    chaves?: boolean,
    chaves_cad?: boolean,
    chaves_edt?: boolean,
    chaves_del?: boolean,

    eventos?: boolean,
    eventos_cad?: boolean,
    eventos_edt?: boolean,
    eventos_del?: boolean,

    funcionarios?: boolean,
    funcionarios_cad?: boolean,
    funcionarios_edt?: boolean,
    funcionarios_del?: boolean,

    pessoas?: boolean,
    pessoas_cad?: boolean,
    pessoas_edt?: boolean,
    pessoas_del?: boolean,

    orgaos?: boolean,
    orgaos_cad?: boolean,
    orgaos_edt?: boolean,
    orgaos_del?: boolean,

    setores?: boolean,
    setores_cad?: boolean,
    setores_edt?: boolean,
    setores_del?: boolean,

    postos?: boolean,
    postos_cad?: boolean,
    postos_edt?: boolean,
    postos_del?: boolean,

    niveis?: boolean,
    niveis_cad?: boolean,
    niveis_edt?: boolean,
    niveis_del?: boolean,

    created_by?: number,
    created_at?: Date,
    updated_by?: number,
    updated_at?: Date
}

export type Perfis =  Array<Perfil>;