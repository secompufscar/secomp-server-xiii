import activityImageRepository from "../repositories/activityImageRepository";
import { ActivityImage } from "@entities/ActivityImage";

import { ApiError, ErrorsCode } from "@utils/api-errors";

import { UpdateActivityImageDTOS, CreateActivityImageDTOS, ActivityImageDTOS } from "../dtos/activityImageDtos";

export default{

    async create({activityId, typeOfImage, imageUrl}:CreateActivityImageDTOS): Promise<CreateActivityImageDTOS>{
        
        const newData = await activityImageRepository.create({
            activityId,
            typeOfImage,
            imageUrl
        })

        return newData;
    }
}