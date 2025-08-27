import activityImageRepository from "../repositories/activityImageRepository";
import { ApiError, ErrorsCode } from "../utils/api-errors";
import { UpdateActivityImageDTOS, CreateActivityImageDTOS, ActivityImageDTOS } from "../dtos/activityImageDtos";

export default {
  async create({
    activityId,
    typeOfImage,
    imageUrl,
  }: CreateActivityImageDTOS): Promise<CreateActivityImageDTOS> {
    const newImage = await activityImageRepository.create({
      activityId,
      typeOfImage,
      imageUrl,
    });
    return newImage;
  },

  async updateById(
    id: string,
    { activityId, typeOfImage, imageUrl }: UpdateActivityImageDTOS
  ): Promise<UpdateActivityImageDTOS> {
    const existingImage = await activityImageRepository.findById(id);

    if (!existingImage) {
      throw new ApiError("Imagem da atividade não encontrada", ErrorsCode.NOT_FOUND);
    }

    const updatedImage = await activityImageRepository.update(id, {
      activityId,
      typeOfImage,
      imageUrl,
    });
    return updatedImage;
  },

  async findByActivityId(activityId: string): Promise<ActivityImageDTOS[]> {
    const images = await activityImageRepository.findByActivityId(activityId);
    return images;
  },

  async list(): Promise<ActivityImageDTOS[]> {
    const images = await activityImageRepository.list();
    return images;
  },

  async findById(id: string): Promise<ActivityImageDTOS> {
    const image = await activityImageRepository.findById(id);
    if (!image) {
      throw new ApiError("Imagem da atividade não encontrada", ErrorsCode.NOT_FOUND);
    }
    return image;
  },

  async deleteById(id: string): Promise<void> {
    const existingImage = await activityImageRepository.findById(id);
    if (!existingImage) {
      throw new ApiError("Imagem da atividade não encontrada para exclusão", ErrorsCode.NOT_FOUND);
    }

    await activityImageRepository.deleteById(id);
  },
};