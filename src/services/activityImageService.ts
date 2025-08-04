import activityImageRepository from "../repositories/activityImageRepository";
import { ActivityImage } from "@entities/ActivityImage";

import { ApiError, ErrorsCode } from "../utils/api-errors";

import { UpdateActivityImageDTOS, CreateActivityImageDTOS, ActivityImageDTOS } from "../dtos/activityImageDtos";

export default{

    async create({activityId, typeOfImage, imageUrl}:CreateActivityImageDTOS): Promise<CreateActivityImageDTOS>{
        
        const newData = await activityImageRepository.create({
            activityId,
            typeOfImage,
            imageUrl
        })

        return newData;
    },

    async updateById({activityId,typeOfImage,imageUrl}:UpdateActivityImageDTOS, id:string): Promise<UpdateActivityImageDTOS>{

        const existingImage = await activityImageRepository.findById(id);
        
        if(!existingImage){
            throw new ApiError("Activity Image not found",ErrorsCode.NOT_FOUND)
        }

        const newData= await activityImageRepository.update({
            activityId,
            typeOfImage,
            imageUrl
        },id)

        return newData;
    },
    async findByActivityId(activityId:string): Promise<ActivityImageDTOS[]>{
        const newData = await activityImageRepository.findByActivityId(activityId);
        return newData;
    },
    async list(): Promise<ActivityImageDTOS[]>{
        return await activityImageRepository.list();
    },
    async findById(id:string): Promise<ActivityImageDTOS>{
        const newData = await activityImageRepository.findById(id);
        if(!newData){
            throw new ApiError("ActivityImage not found",ErrorsCode.NOT_FOUND);
        }
        return newData;
    },

    async deleteById(id:string): Promise<void>{
        return await activityImageRepository.deleteById(id)
    }
}