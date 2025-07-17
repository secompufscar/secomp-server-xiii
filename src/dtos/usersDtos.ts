export interface CreateUserDTOS {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
}

export interface UpdateUserDTOS {
  nome?: string;
  email?: string;
  senha?: string;
  confirmed?: boolean;
}

export interface UpdateQrCodeUsersDTOS {
  qrCode: string | null;
}
export interface UpdateProfileDTO {
  nome?: string;
  email?: string;
}
