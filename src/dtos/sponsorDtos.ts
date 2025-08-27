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
  tagIds?: string[]; 
}

export interface UpdateSponsorDTO {
  name?: string;
  logoUrl?: string;
  description?: string;
  starColor?: string;
  link?: string;
}
