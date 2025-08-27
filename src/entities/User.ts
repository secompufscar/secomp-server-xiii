export type RegistrationStatus = 0 | 1 | 2;
export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: string;
  qrCode: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  confirmed: boolean;
  registrationStatus: RegistrationStatus; 
  currentEdition: string | null; // Edição atual (ex: "2025")
  points: number;
  pushToken: string | null
}

