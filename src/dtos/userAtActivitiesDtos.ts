export interface UpdateUserAtActivityDTOS {
  presente: boolean;
  inscricaoPrevia: boolean;
  listaEspera: boolean;
}

export interface CreateUserAtActivityDTOS {
  presente: boolean;
  inscricaoPrevia: boolean;
  listaEspera: boolean;
  userId: string;
  activityId: string;
}
