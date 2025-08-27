import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export default {
  async listAll() {
    const sponsors = await prisma.sponsor.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return sponsors;
  },

  async findById(id: string) {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id },
      include: {
        tags: {
          include: { tag: true }
        }
      }
    });
    return sponsor;
  },

  async create(data: Prisma.SponsorCreateInput) {
    const sponsor = await prisma.sponsor.create({ data });
    return sponsor;
  },

  async update(id: string, data: Prisma.SponsorUpdateInput) {
    const sponsor = await prisma.sponsor.update({ where: { id }, data });
    return sponsor;
  },

  async delete(id: string) {
    await prisma.sponsorsOnTags.deleteMany({ where: { sponsorId: id } });
    const deletedSponsor = await prisma.sponsor.delete({ where: { id } });
    
    return deletedSponsor;
  },
};