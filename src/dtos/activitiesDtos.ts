export interface CreateActivityDTOS {
    nome: string
    data: Date | null
    palestranteNome: string
    categoriaId: string
    vagas: number | null
    detalhes: string | null
    local: string 
    points: number;

}

export interface UpdateActivityDTOS {
    nome: string
    data: Date | null
    palestranteNome: string
    categoriaId: string
    detalhes: string | null
    local: string 
    points?: number;

}

export interface ActivityDTOS {
    id: string
    nome: string
    data: Date | null
    vagas: number | null
    detalhes: string | null
    palestranteNome: string
    categoriaId: string
    points: number
}