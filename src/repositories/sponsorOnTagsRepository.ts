import { SponsorsOnTags } from "@prisma/client";
import { prisma } from "../lib/prisma";

export default {
  async link(sponsorId: string, tagId: string): Promise<SponsorsOnTags> {
    const response = await prisma.sponsorsOnTags.create({
      data: {
        sponsorId,
        tagId,
      },
    });
    return response;
  },

  async unlink(sponsorId: string, tagId: string): Promise<SponsorsOnTags> {
    const response = await prisma.sponsorsOnTags.delete({
      where: {
        sponsorId_tagId: {
          sponsorId,
          tagId,
        },
      },
    });
    return response;
  },
};