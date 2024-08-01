export interface UserAtActivity {
    id: String
    presente: boolean
    inscricaoPrevia: boolean
    listaEspera: boolean
    userId: String
    activityId: String
    createdAt: Date
    updatedAt: Date | null
}