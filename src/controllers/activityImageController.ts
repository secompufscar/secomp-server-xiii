import { Request, Response } from "express";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import dotenv from 'dotenv';
dotenv.config();

import activityImageService from "../services/activityImageService";

// Cliente S3
const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
});

export default {
    async create(request: Request, response: Response) {
        try {
            const file = request.file;
            if (!file) return response.status(400).json({ msg: 'image required' });

            // Gera nome de arquivo com extensão original
            const extension = file.originalname.split('.').pop();
            const fileName = `${randomUUID()}.${extension}`;

            // Upload da imagem original
            const uploadCommand = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: `uploads/${fileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await s3.send(uploadCommand);

            const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;

            const { activityId, typeOfImage } = request.body;

            const newCreateActivityImage = {
                activityId,
                typeOfImage,
                imageUrl
            };

            const serviceResponse = await activityImageService.create(newCreateActivityImage);
            return response.status(201).json(serviceResponse);
        } catch (err) {
            console.error(err);
            return response.status(500).json({ msg: 'creating activityImage failed' });
        }
    },

    async delete(request: Request, response: Response) {
        try {
            const bucketName = process.env.AWS_BUCKET_NAME!;
            const bucketBaseUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

            const { id } = request.params;
            const data = await activityImageService.findById(id);

            if (!data) return response.status(400).json({ msg: 'activityImage not found by this Id' });

            const url = data.imageUrl;
            if (!url.startsWith(bucketBaseUrl)) throw new Error("Invalid image URL");

            const key = url.replace(bucketBaseUrl, "");

            const deleteCommand = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            await s3.send(deleteCommand);
            console.log("imagem deletada do S3 com sucesso:", key);

            await activityImageService.deleteById(id);

            return response.status(200).json({ msg: "activityImage deleted successfully" });
        } catch (error) {
            console.error("erro ao deletar imagem do S3:", error);
            throw error;
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

            if (!data) return response.status(404).json({ msg: 'images not found' });

            return response.status(200).json(data);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: 'finding img by activity id failed' });
        }
    },

    async findById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const data = await activityImageService.findById(id);
            return response.status(200).json(data);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: 'finding list by id failed' });
        }
    },

    async updateById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const previousImage = await activityImageService.findById(id);
            const file = request.file;

            if (!file) {
                const { activityId, typeOfImage } = request.body;
                const newData = {
                    activityId: activityId || previousImage.activityId,
                    typeOfImage: typeOfImage || previousImage.typeOfImage,
                    imageUrl: previousImage.imageUrl
                };

                const serviceResponse = await activityImageService.updateById(newData, id);
                if (!serviceResponse) return response.status(404).json({ msg: 'activityImage not found by this id' });
                return response.status(200).json(serviceResponse);
            } else {
                // Apaga a imagem antiga do S3
                const bucketName = process.env.AWS_BUCKET_NAME!;
                const bucketBaseUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

                const data = await activityImageService.findById(id);
                if (!data) return response.status(400).json({ msg: 'activityImage not found by this Id' });

                const url = data.imageUrl;
                if (!url.startsWith(bucketBaseUrl)) throw new Error("Invalid image URL");

                const key = url.replace(bucketBaseUrl, "");

                const deleteCommand = new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: key,
                });

                await s3.send(deleteCommand);
                console.log("imagem deletada do S3 com sucesso:", key);

                // Envia nova imagem original para S3
                const extension = file.originalname.split('.').pop();
                const fileName = `${randomUUID()}.${extension}`;

                const uploadCommand = new PutObjectCommand({
                    Bucket: bucketName,
                    Key: `uploads/${fileName}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                });

                await s3.send(uploadCommand);

                const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;

                const { activityId, typeOfImage } = request.body;

                const newData = {
                    activityId: activityId || previousImage.activityId,
                    typeOfImage: typeOfImage || previousImage.typeOfImage,
                    imageUrl
                };

                const serviceResponse = await activityImageService.updateById(newData, id);
                if (!serviceResponse) return response.status(404).json({ msg: 'activityImage not found by this id' });

                return response.status(200).json(serviceResponse);
            }
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "updating activityImage by id failed" });
        }
    }
};
