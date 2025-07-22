import { Request, Response } from "express";
import { randomUUID } from "crypto";
import activityImageService from "../services/activityImageService";
import streamifier from "streamifier";

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


dotenv.config();

function uploadToCloudinary(buffer: Buffer, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

function extractPublicIdFromUrl(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    if (!match) throw new Error("Invalid Cloudinary image URL");
    return match[1];
}

export default {
    async create(request: Request, response: Response) {
        try {
            const file = request.file;
            if (!file) return response.status(400).json({ msg: "image required" });

            const result = await uploadToCloudinary(file.buffer, "uploads");

            const { activityId, typeOfImage } = request.body;

            const newCreateActivityImage = {
                activityId,
                typeOfImage,
                imageUrl: result.secure_url,
            };

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

            const publicId = extractPublicIdFromUrl(data.imageUrl);
            await cloudinary.uploader.destroy(publicId);

            await activityImageService.deleteById(id);

            return response.status(200).json({ msg: "activityImage deleted successfully" });
        } catch (error) {
            console.error("erro ao deletar imagem do Cloudinary:", error);
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
            return response.status(200).json(data);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "finding list by id failed" });
        }
    },

    async updateById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const previousImage = await activityImageService.findById(id);
            const file = request.file;

            if (!previousImage) {
                return response.status(404).json({ msg: "activityImage not found" });
            }

            if (!file) {
                const { activityId, typeOfImage } = request.body;
                const newData = {
                    activityId: activityId || previousImage.activityId,
                    typeOfImage: typeOfImage || previousImage.typeOfImage,
                    imageUrl: previousImage.imageUrl,
                };

                const serviceResponse = await activityImageService.updateById(newData, id);
                return response.status(200).json(serviceResponse);
            } else {
                // Deleta imagem anterior
                const publicId = extractPublicIdFromUrl(previousImage.imageUrl);
                await cloudinary.uploader.destroy(publicId);

                // Faz upload da nova imagem
                const result = await uploadToCloudinary(file.buffer, "uploads");

                const { activityId, typeOfImage } = request.body;
                const newData = {
                    activityId: activityId || previousImage.activityId,
                    typeOfImage: typeOfImage || previousImage.typeOfImage,
                    imageUrl: result.secure_url,
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
