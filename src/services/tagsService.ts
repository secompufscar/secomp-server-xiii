import tagsRepository from "../repositories/tagsRepository";
import { CreateTagDTO, TagDTO, UpdateTagDTO } from "../dtos/tagDtos";
import { ApiError, ErrorsCode } from "../utils/api-errors";

export default {
  async listAll(): Promise<TagDTO[]> {
    const tags = await tagsRepository.listAll();
    return tags;
  },

  async create(data: CreateTagDTO): Promise<TagDTO> {
    const { name } = data;

    if (!name || name.trim() === "") {
      throw new ApiError("O nome da tag é obrigatório.", ErrorsCode.BAD_REQUEST);
    }

    const newTag = await tagsRepository.upsert(name);
    return newTag;
  },

  async update(id: string, data: UpdateTagDTO): Promise<TagDTO> {
    const { name } = data;

    if (!name || name.trim() === "") {
      throw new ApiError("O nome da tag para atualização é obrigatório.", ErrorsCode.BAD_REQUEST);
    }
    
    const tagExists = await tagsRepository.findById(id);
    if (!tagExists) {
      throw new ApiError("Tag não encontrada para atualização.", ErrorsCode.NOT_FOUND);
    }

    const updatedTag = await tagsRepository.update(id, { name });
    return updatedTag;
  },

  async delete(id: string): Promise<void> { 
    const tagExists = await tagsRepository.findById(id);
    if (!tagExists) {
      throw new ApiError("Tag não encontrada para exclusão.", ErrorsCode.NOT_FOUND);
    }

    await tagsRepository.delete(id);
  },
};