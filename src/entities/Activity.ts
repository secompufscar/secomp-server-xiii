export interface Activity {
    id: String
    nome: String
    data: Date
    palestranteNome: String
    categoriaId: String
    createdAt: Date
    updatedAt: Date | null
    vagas: number | null
}