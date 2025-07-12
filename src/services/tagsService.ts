import tagsRepository from "../repositories/tagsRepository";
import { CreateTagDTO, TagDTO } from "../dtos/tagDtos";
import { ApiError, ErrorsCode } from "../utils/api-errors";
import { UpdateTagDTO } from "../dtos/tagDtos";

export default {
  async listAll(): Promise<TagDTO[]> {
    return tagsRepository.listAll();
  },

  async create(data: CreateTagDTO): Promise<TagDTO> {
    const { name } = data;
    if (!name || name.trim() === "") {
      throw new ApiError("O nome da tag é obrigatório.", ErrorsCode.BAD_REQUEST);
    }
    // Usar upsert previne a criação de tags duplicadas
    const newTag = await tagsRepository.upsert(name);
    return newTag;
  },
  async update(id: string, data: UpdateTagDTO) {
    const tagExists = await tagsRepository.findById(id);
    if (!tagExists) {
      throw new ApiError("Tag não encontrada.", ErrorsCode.NOT_FOUND);
    }
    return tagsRepository.update(id, data);
  },

  async delete(id: string) {
    const tagExists = await tagsRepository.findById(id);
    if (!tagExists) {
      throw new ApiError("Tag não encontrada.", ErrorsCode.NOT_FOUND);
    }
    return tagsRepository.delete(id);
  },
};
