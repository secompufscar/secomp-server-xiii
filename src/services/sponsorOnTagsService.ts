import sponsorsRepository from "../repositories/sponsorRepository";
import tagsRepository from "../repositories/tagsRepository";
import sponsorsOnTagsRepository from "../repositories/sponsorOnTagsRepository";
import { ApiError, ErrorsCode } from "../utils/api-errors";
import { SponsorsOnTags } from "@prisma/client"; // Importando o tipo para clareza

export default {
  async linkTagToSponsor(sponsorId: string, tagId: string): Promise<SponsorsOnTags> {
    const [sponsorExists, tagExists] = await Promise.all([sponsorsRepository.findById(sponsorId), tagsRepository.findById(tagId)]);

    if (!sponsorExists) {
      throw new ApiError("Patrocinador não encontrado.", ErrorsCode.NOT_FOUND);
    }

    if (!tagExists) {
      throw new ApiError("Tag não encontrada.", ErrorsCode.NOT_FOUND);
    }

    return sponsorsOnTagsRepository.link(sponsorId, tagId);
  },

  async unlinkTagFromSponsor(sponsorId: string, tagId: string): Promise<SponsorsOnTags> {
    const [sponsorExists, tagExists] = await Promise.all([sponsorsRepository.findById(sponsorId), tagsRepository.findById(tagId)]);

    if (!sponsorExists) {
      throw new ApiError("Patrocinador não encontrado.", ErrorsCode.NOT_FOUND);
    }

    if (!tagExists) {
      throw new ApiError("Tag não encontrada.", ErrorsCode.NOT_FOUND);
    }

    return sponsorsOnTagsRepository.unlink(sponsorId, tagId);
  },
};
