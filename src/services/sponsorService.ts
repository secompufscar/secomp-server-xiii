import sponsorsRepository from "../repositories/sponsorRepository";
import { SponsorDTO } from "../dtos/sponsorDtos";
import { CreateSponsorDTO, UpdateSponsorDTO } from "../dtos/sponsorDtos";
import sponsorsOnTagsRepository from "../repositories/sponsorOnTagsRepository";

export default {
  async listAll(): Promise<SponsorDTO[]> {
    const sponsorsFromDb = await sponsorsRepository.listAll();

    // Transforma o resultado do banco para o formato do DTO
    const sponsorsDTO = sponsorsFromDb.map((sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      logoUrl: sponsor.logoUrl,
      description: sponsor.description,
      starColor: sponsor.starColor,
      link: sponsor.link,
      tags: sponsor.tags.map((sponsorTag) => sponsorTag.tag.name),
    }));

    return sponsorsDTO;
  },
  async create(data: CreateSponsorDTO) {
    const { tagIds, ...sponsorData } = data;

    // 1. Cria o patrocinador
    const newSponsor = await sponsorsRepository.create(sponsorData);

    // 2. Se foram enviadas tags, conecta cada uma delas
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await sponsorsOnTagsRepository.link(newSponsor.id, tagId);
      }
    }

    return newSponsor;
  },

  async update(id: string, data: UpdateSponsorDTO) {
    const sponsorExists = await sponsorsRepository.findById(id);
    if (!sponsorExists) {
      throw new Error("Patrocinador não encontrado.");
    }
    return sponsorsRepository.update(id, data);
  },

  async delete(id: string) {
    const sponsorExists = await sponsorsRepository.findById(id);
    if (!sponsorExists) {
      throw new Error("Patrocinador não encontrado.");
    }
    return sponsorsRepository.delete(id);
  },
};
