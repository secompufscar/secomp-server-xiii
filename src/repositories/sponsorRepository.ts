import { PrismaClient, Prisma } from "@prisma/client";

const client = new PrismaClient();

export default {
  async listAll() {
    const sponsors = await client.sponsor.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      }
    });
    return sponsors;
  },
  
  async findById(id: string) {
    return client.sponsor.findUnique({ where: { id } });
  },

  async create(data: Prisma.SponsorCreateInput) {
    return client.sponsor.create({ data });
  },

  async update(id: string, data: Prisma.SponsorUpdateInput) {
    return client.sponsor.update({ where: { id }, data });
  },

  async delete(id: string) {
    // É importante deletar as relações na tabela de junção antes
    await client.sponsorsOnTags.deleteMany({ where: { sponsorId: id } });
    return client.sponsor.delete({ where: { id } });
  },
};