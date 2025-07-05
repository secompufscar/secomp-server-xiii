import { Request,Response } from "express";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import dotenv from 'dotenv';
dotenv.config();

import acitivityImageService from "../services/activityImageService";

export default{
    async create(request: Request, response: Response){
        try{

            //recebe a imagem como tipo file
            const file = request.file;
            if(!file) return response.status(400).json({msg:'image required'})

            //sharp para otimizar a imagem ao máximo
            const optimizedImageBuffer = await sharp(file.buffer)
                .resize({ width: 1080 })
                .webp({ quality: 80 })
                .toBuffer();

            //criamos um novo uuid para a imagem
            const fileName = `${randomUUID()}.webp`;

    
            //cliente da amazon
            const s3 = new S3Client({
                region: process.env.AWS_REGION!,
                credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_KEY!,
                },
             });

             //comando para upload da imagem
             const uploadCommand = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: `uploads/${fileName}`,
                Body: optimizedImageBuffer,
                ContentType: "image/webp",
            });
            
            //mandando o comand para o cliente
            await s3.send(uploadCommand);

            //criamos uma url nova baseada nos dados que ja haviamos estabelecido
            const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;

            //resto dos campos para a entidade imagem
            const {activityId} = request.body;
            const {typeOfImage} = request.body;

            //objeto da atividade imagem
            const newCreateActivityImage ={
                activityId: activityId,
                typeOfImage: typeOfImage,
                imageUrl: imageUrl
            }
            
            //mandamos para o service salvar a entidade no banco
            const serviceResponse = await acitivityImageService.create(newCreateActivityImage);
            return response.json(serviceResponse);
            }
        catch(err){
            console.error(err)
        }
    }
}