import { PrismaClient } from "@prisma/client";

import { ActivityImage } from "../entities/ActivityImage";

import { CreateActivityImageDTOS, UpdateActivityImageDTOS, ActivityImageDTOS } from "../dtos/activityImageDtos";

const client = new PrismaClient();

export default{

    async create(data: CreateActivityImageDTOS): Promise<CreateActivityImageDTOS>{

        const response = await client.activityImage.create({
            data
        })
        return response;
    }
}