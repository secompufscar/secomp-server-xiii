import { prisma } from "../lib/prisma";
import { Tag } from "@prisma/client";

export default {
  async listAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return tags;
  },

  async findById(id: string): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });
    return tag;
  },

  async upsert(tagName: string): Promise<Tag> {
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {}, 
      create: { name: tagName },
    });
    return tag;
  },
  
  async update(id: string, data: { name: string }): Promise<Tag> {
    const tag = await prisma.tag.update({ where: { id }, data });
    return tag;
  },

  async delete(id: string): Promise<Tag> {
    await prisma.sponsorsOnTags.deleteMany({ where: { tagId: id } });
    const deletedTag = await prisma.tag.delete({ where: { id } });
    return deletedTag;
  },
};