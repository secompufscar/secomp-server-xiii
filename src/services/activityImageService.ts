import activityImageRepository from "../repositories/activityImageRepository";
import { ActivityImage } from "@entities/ActivityImage";

import { ApiError, ErrorsCode } from "../utils/api-errors";

import { UpdateActivityImageDTOS, CreateActivityImageDTOS, ActivityImageDTOS, ActivityImageSummaryDTOS, CreateActivityImageSummaryDTOS, UpdateActivityImageSummaryDTOS, ActivityImageBufferDTOS } from "../dtos/activityImageDtos";

export default{

    async create({activityId, typeOfImage, image, mimeType}:CreateActivityImageDTOS): Promise<CreateActivityImageSummaryDTOS>{
        
        const newData = await activityImageRepository.create({
            activityId,
            typeOfImage,
            image,
            mimeType
        })

        return({
            id: newData.id,
            activityId:newData.activityId,
            typeOfImage:newData.typeOfImage,
            mimeType: newData.mimeType
        })
    },

    async updateById({activityId,typeOfImage,image,mimeType}:UpdateActivityImageDTOS, id:string): Promise<UpdateActivityImageSummaryDTOS>{

        const existingImage = await activityImageRepository.findById(id);
        
        if(!existingImage){
            throw new ApiError("Activity Image not found",ErrorsCode.NOT_FOUND)
        }

        const newData= await activityImageRepository.update({
            activityId,
            typeOfImage,
            image,
            mimeType
        },id)

        return newData;
    },
    async findByActivityId(activityId:string): Promise<ActivityImageSummaryDTOS[]>{
        const newData = await activityImageRepository.findByActivityId(activityId);
        return newData;
    },
    async list(): Promise<ActivityImageSummaryDTOS[]>{
        return await activityImageRepository.list();
    },
    async findById(id:string): Promise<ActivityImageBufferDTOS>{
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