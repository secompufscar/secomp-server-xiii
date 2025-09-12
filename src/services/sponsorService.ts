import sponsorsRepository from "../repositories/sponsorRepository";
import sponsorsOnTagsRepository from "../repositories/sponsorOnTagsRepository";
import { SponsorDTO, CreateSponsorDTO, UpdateSponsorDTO } from "../dtos/sponsorDtos";
import { Sponsor } from "@prisma/client";
import { ApiError, ErrorsCode } from "../utils/api-errors";

function toSponsorDTO(sponsor: any, tagProperty: "id" | "name"): SponsorDTO {
  return {
    id: sponsor.id,
    name: sponsor.name,
    logoUrl: sponsor.logoUrl,
    description: sponsor.description,
    starColor: sponsor.starColor,
    link: sponsor.link,
    tags: sponsor.tags.map((sponsorTag: any) => sponsorTag.tag[tagProperty]),
  };
}

export default {
  async listAll(): Promise<SponsorDTO[]> {
    const sponsorsFromDb = await sponsorsRepository.listAll();

    return sponsorsFromDb.map((sponsor) => toSponsorDTO(sponsor, "name"));
  },

  async getOne(id: string): Promise<SponsorDTO> {
    const sponsor = await sponsorsRepository.findById(id);
    if (!sponsor) {
      throw new ApiError("Patrocinador não encontrado", ErrorsCode.NOT_FOUND);
    }

    return toSponsorDTO(sponsor, "id");
  },

  async create(data: CreateSponsorDTO): Promise<Sponsor> {
    const { tagIds, ...sponsorData } = data;

    const newSponsor = await sponsorsRepository.create(sponsorData);

    if (tagIds && tagIds.length > 0) {
      const linkPromises = tagIds.map((tagId) => sponsorsOnTagsRepository.link(newSponsor.id, tagId));
      await Promise.all(linkPromises);
    }

    return newSponsor;
  },

  async update(id: string, data: UpdateSponsorDTO): Promise<Sponsor> {
    const sponsorExists = await sponsorsRepository.findById(id);
    if (!sponsorExists) {
      throw new ApiError("Patrocinador não encontrado", ErrorsCode.NOT_FOUND);
    }
    return sponsorsRepository.update(id, data);
  },

  async delete(id: string): Promise<Sponsor> {
    const sponsorExists = await sponsorsRepository.findById(id);
    if (!sponsorExists) {
      throw new ApiError("Patrocinador não encontrado", ErrorsCode.NOT_FOUND);
    }
    return sponsorsRepository.delete(id);
  },
};
