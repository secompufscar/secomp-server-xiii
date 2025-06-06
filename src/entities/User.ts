export interface User {
    id: string
    nome: string
    email: string
    senha: string
    tipo: string
    qrCode: string | null
    pushToken: string[] | null
    createdAt: Date
    updatedAt: Date | null
    confirmed: boolean
}