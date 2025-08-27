export interface CreateTagDTO {
  name: string;
}

export interface TagDTO {
  id: string;
  name: string;
}

export interface UpdateTagDTO {
  name?: string;
}
