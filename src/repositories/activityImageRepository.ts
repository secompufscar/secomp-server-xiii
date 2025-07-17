import { PrismaClient } from "@prisma/client";

import { ActivityImage } from "../entities/ActivityImage";

import { CreateActivityImageDTOS, UpdateActivityImageDTOS, ActivityImageDTOS, ActivityImageSummaryDTOS, CreateActivityImageSummaryDTOS, UpdateActivityImageSummaryDTOS, ActivityImageBufferDTOS} from "../dtos/activityImageDtos";

const client = new PrismaClient();


export default{

    async create(data: CreateActivityImageDTOS): Promise<CreateActivityImageSummaryDTOS>{

        const response = await client.activityImage.create({
            data
        })
        return({
            id: response.id,
            activityId: response.activityId,
            typeOfImage: response.typeOfImage,
            mimeType: response.mimeType
        })
    }
,
    async list(): Promise <ActivityImageSummaryDTOS[]>{

        const response = await client.activityImage.findMany({
            select:{
                id:true,
                activityId:true,
                typeOfImage:true,
                mimeType:true
            }
        });

        return response;
        
    }
,
    async update(data: UpdateActivityImageDTOS, id:string): Promise<UpdateActivityImageSummaryDTOS>{

        const response = await client.activityImage.update({
            data,
            where:{
                id
            },
            select:{
                id:true,
                activityId:true,
                typeOfImage:true,
                mimeType:true
            }
        }
        )
        return response;
    }
,
    async findByActivityId (activityId:string): Promise <ActivityImageSummaryDTOS[]>{
        const response = await client.activityImage.findMany({
            where:{
                activityId
            },
            select:{
                id:true,
                activityId:true,
                typeOfImage:true,
                mimeType:true
            }
        })
        return response;
    }
,
    async findById(id:string): Promise <ActivityImageBufferDTOS|null>{
        const response = await client.activityImage.findUnique({
            where:{
                id
            },
            select:{
                id: true,
                image: true,
                mimeType:true
            }
        });
        if (!response) return null;

        return {
            id: response.id,
            image: response.image,
            mimeType: response.mimeType
        };
    }
,
    async deleteById(id:string): Promise <void>{
        await client.activityImage.delete({
            where:{
                id
            }
        })
    }
}