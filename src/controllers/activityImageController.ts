import { Request, Response } from "express";

import activityImageService from "../services/activityImageService";
import activitiesService from "../services/activitiesService";



export default {
    async create(request: Request, response: Response) {
        try {
            const file = request.file;
            if (!file) return response.status(400).json({ msg: "image required" });

            const mimeType = file.mimetype

            const { activityId, typeOfImage } = request.body;

            const activityData = await activitiesService.findById(activityId);

            if(!activityData) return response.status(400).json({msg:"activity not found by this id"})

            const newCreateActivityImage = {
                activityId,
                typeOfImage,
                image: file.buffer,
                mimeType:mimeType
            }
          

            const serviceResponse = await activityImageService.create(newCreateActivityImage);
            return response.status(201).json(serviceResponse);
        } catch (err) {
            console.error(err);
            return response.status(500).json({ msg: "creating activityImage failed" });
        }
    },

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const data = await activityImageService.findById(id);
            if (!data) return response.status(400).json({ msg: "activityImage not found by this Id" });


            await activityImageService.deleteById(id);

            return response.status(200).json({ msg: "activityImage deleted successfully" });
        } catch (error) {
            return response.status(500).json({ msg: "deleting activityImage failed" });
        }
    },

    async list(request: Request, response: Response) {
        try {
            const data = await activityImageService.list();
            response.status(200).json(data);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "listing activityImages failed" });
        }
    },

    async findByActivityId(request: Request, response: Response) {
        try {
            const { activityId } = request.params;
            const data = await activityImageService.findByActivityId(activityId);

            if (!data) return response.status(404).json({ msg: "images not found" });

            return response.status(200).json(data);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "finding img by activity id failed" });
        }
    },

    async findById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const data = await activityImageService.findById(id);


            return response.status(200).setHeader("Content-Type", data.mimeType ).send(Buffer.from(data.image))

        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "finding list by id failed" });
        }
    },

    async updateById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const file = request.file as Express.Multer.File | undefined;


            if (file && file !== undefined) {
                const { activityId, typeOfImage } = request.body;
                const mimeType = file.mimetype

                const newData = {
                    activityId: activityId ,
                    typeOfImage: typeOfImage,
                    image: file.buffer,
                    mimeType:mimeType

                };

                const serviceResponse = await activityImageService.updateById(newData, id);
                return response.status(200).json(serviceResponse);
            } else {
                const currentImage = await activityImageService.findById(id);
                const { activityId, typeOfImage } = request.body;
                const newData = {
                    activityId: activityId ,
                    typeOfImage: typeOfImage,
                    image: currentImage.image
                };

                const serviceResponse = await activityImageService.updateById(newData, id);
                return response.status(200).json(serviceResponse);
            }
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "updating activityImage by id failed" });
        }
    },
};
