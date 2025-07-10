import sponsorsRepository from "../repositories/sponsorRepository";
import tagsRepository from "../repositories/tagsRepository";
import sponsorsOnTagsRepository from "../repositories/sponsorOnTagsRepository";
import { ApiError, ErrorsCode } from "../utils/api-errors";

export default {
  async linkTagToSponsor(sponsorId: string, tagId: string) {
    // Validação para garantir que ambos existem antes de tentar conectar
    const sponsorExists = await sponsorsRepository.findById(sponsorId);
    if (!sponsorExists) {
      throw new ApiError("Patrocinador não encontrado.", ErrorsCode.NOT_FOUND);
    }

    const tagExists = await tagsRepository.findById(tagId);
    if (!tagExists) {
      throw new ApiError("Tag não encontrada.", ErrorsCode.NOT_FOUND);
    }

    return sponsorsOnTagsRepository.link(sponsorId, tagId);
  },

  async unlinkTagFromSponsor(sponsorId: string, tagId: string) {
    return sponsorsOnTagsRepository.unlink(sponsorId, tagId);
  },
};