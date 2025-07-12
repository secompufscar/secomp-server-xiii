export interface SponsorDTO {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  starColor: string;
  link: string;
  tags: string[]; 
}

export interface CreateSponsorDTO {
  name: string;
  logoUrl: string;
  description: string;
  starColor: string;
  link: string;
  tagIds?: string[]; // Opcional: permite linkar tags no momento da criação
}

export interface UpdateSponsorDTO {
  name?: string;
  logoUrl?: string;
  description?: string;
  starColor?: string;
  link?: string;
}