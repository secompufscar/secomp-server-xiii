export interface UserAtActivity {
    id: string
    presente: boolean
    inscricaoPrevia: boolean
    listaEspera: boolean
    userId: string
    activityId: string
    createdAt: Date
    updatedAt: Date | null
}