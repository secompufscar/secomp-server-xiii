import { PrismaClient, SponsorsOnTags } from "@prisma/client";

const client = new PrismaClient();

export default {
  /**
   * Conecta um patrocinador a uma tag.
   * @param sponsorId O ID do patrocinador.
   * @param tagId O ID da tag.
   */
  async link(sponsorId: string, tagId: string): Promise<SponsorsOnTags> {
    return client.sponsorsOnTags.create({
      data: {
        sponsorId,
        tagId,
      },
    });
  },

  /**
   * Desconecta um patrocinador de uma tag.
   * @param sponsorId O ID do patrocinador.
   * @param tagId O ID da tag.
   */
  async unlink(sponsorId: string, tagId: string): Promise<SponsorsOnTags> {
    return client.sponsorsOnTags.delete({
      where: {
        sponsorId_tagId: { // Utiliza a chave primária composta
          sponsorId,
          tagId,
        },
      },
    });
  },
};