export type Tipo = "USER" | "ADMIN"

export interface UserDTOS {
    id?: string,
    nome: string,
    email: string,
    senha: string
    tipo: string
    createdAt?: Date
}

export interface CreateUserDTOS {
    nome: string
    email: string
    senha: string
    tipo?: Tipo
}

export interface UpdateUserDTOS {
    nome: string 
    email: string
    senha: string
    tipo?: Tipo
}

export interface UpdateQrCodeUsersDTOS {
    nome: string 
    email: string
    senha: string
    tipo?: Tipo
    qrCode?: string

}