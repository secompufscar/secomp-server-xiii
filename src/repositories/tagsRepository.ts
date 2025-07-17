import { PrismaClient, Tag } from "@prisma/client";

const client = new PrismaClient();

export default {
  /**
   * Lista todas as tags disponíveis no sistema.
   */
  async listAll(): Promise<Tag[]> {
    return client.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  /**
   * Encontra uma tag pelo seu ID.
   * @param id O ID da tag.
   */
  async findById(id: string): Promise<Tag | null> {
    return client.tag.findUnique({
      where: { id },
    });
  },

  /**
   * Cria uma nova tag se ela não existir, ou retorna a existente.
   * Útil para garantir que não haja tags duplicadas.
   * @param tagName O nome da tag.
   */
  async upsert(tagName: string): Promise<Tag> {
    return client.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  },
  async update(id: string, data: { name: string }) {
    return client.tag.update({ where: { id }, data });
  },

  async delete(id: string) {
    await client.sponsorsOnTags.deleteMany({ where: { tagId: id } });
    return client.tag.delete({ where: { id } });
  },
};
