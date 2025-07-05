import { Request,Response } from "express";
import sharp from "sharp";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import dotenv from 'dotenv';
dotenv.config();

import activityImageService from "../services/activityImageService";

//cliente da amazon
const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
});


export default{
    async create(request: Request, response: Response){
        try{

            //recebe a imagem como tipo file
            const file = request.file;
            if(!file) return response.status(400).json({msg:'image required'})

            //sharp para otimizar a imagem ao máximo
            const optimizedImageBuffer = await sharp(file.buffer)
                .rotate()
                .resize({ width: 1080 })
                .webp({ quality: 80 })
                .toBuffer();

            //criamos um novo uuid para a imagem
            const fileName = `${randomUUID()}.webp`;

    

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
            const serviceResponse = await activityImageService.create(newCreateActivityImage);
            return response.status(201).json(serviceResponse);
            }
        catch(err){
            console.error(err)
            return response.status(500).json({msg:'creating activityImage failed'})
        }
    },
    async delete(request: Request, response:Response){
         try {
            const bucketName = process.env.AWS_BUCKET_NAME!;
            const bucketBaseUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

            const {id} = request.params;
            const data = await activityImageService.findById(id);

            if(data==null){
                return response.status(400).json({msg:'activityImage not found by this Id'});
            }

            const url = data.imageUrl;

            if (!url.startsWith(bucketBaseUrl)) {
            throw new Error("Invalid image URL");
            }

            // Extração da chave a partir da URL
            const key = url.replace(bucketBaseUrl, "");

            const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
            });

            await s3.send(deleteCommand);
            console.log("imagem deletada do S3 com sucesso:", key);

            await activityImageService.deleteById(id);

            return response.status(200).json({msg:"activityImage deleted successfully"})
        } catch (error) {
            console.error("erro ao deletar imagem do S3:", error);
            throw error;
        }

    },
    async list(request:Request, response:Response){
        try{
        const data = await activityImageService.list();
        
        response.status(200).json(data);
        }
        catch(error){
            console.error(error)
            return response.status(500).json({msg:"listing activityImages failed"})
        }
    }
    ,
    async findByActivityId(request: Request, response: Response){

        try{
        const{activityId} = request.params;

        const data = await activityImageService.findByActivityId(activityId);

        if(!data){
            return response.status(404).json({msg:'images not found'})
        }

        return response.status(200).json(data);

        }
        catch(error){
            console.error(error);
            return response.status(500).json({msg:'finding img by activity id failed'})
        }
    },
    async findById(request:Request, response:Response){
        try{
        const {id} = request.params;
        const data = await activityImageService.findById(id);

        return response.status(200).json(data);
        }
        catch(error){
            console.error(error)
            return response.status(500).json({msg:'finding list by id failed'})
        }
    },

    async updateById(request:Request, response:Response)
    {
        try{
        const {id} = request.params;
        
        const previousImage = await activityImageService.findById(id);

        const file = request.file;

        //se não estivermos recebendo um novo arquivo, apenas atualizamos o resto dos campos
        if(!file){
            const {activityId, typeOfImage} = request.body;
            const newData ={
                activityId: activityId,
                typeOfImage: typeOfImage,
                imageUrl: previousImage.imageUrl
            }

            const serviceResponse = await activityImageService.updateById(newData,id)

            if(!serviceResponse){
                return response.status(404).json({msg:'activityImage not found by this id'})
            }

            return response.status(200).json(serviceResponse)
        }
        //se detectarmos um arquivo, deletamos o arquivo previo para liberar espaço no s3
        else{
            
            /*
            
            Lógica para deletar a imagem antiga
            */
            const bucketName = process.env.AWS_BUCKET_NAME!;
            const bucketBaseUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        
            const data = await activityImageService.findById(id);

            if(data==null){
                return response.status(400).json({msg:'activityImage not found by this Id'});
            }

            const url = data.imageUrl;

            if (!url.startsWith(bucketBaseUrl)) {
                throw new Error("Invalid image URL");
            }

            const key = url.replace(bucketBaseUrl, "");

            const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
            });

            await s3.send(deleteCommand);
            console.log("imagem deletada do S3 com sucesso:", key);

            /*
            
            Lógica para mandar a nova imagem para o cloud storage
            */
            const optimizedImageBuffer = await sharp(file.buffer)
                .rotate()
                .resize({ width: 1080 })
                .webp({ quality: 80 })
                .toBuffer();

            const fileName = `${randomUUID()}.webp`;

            const uploadCommand = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: `uploads/${fileName}`,
                Body: optimizedImageBuffer,
                ContentType: "image/webp",
            });
            
            await s3.send(uploadCommand);

            const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
            
            /**
             * Lógica para popular o banco de dados com uma nova entrada
             */
            const {activityId, typeOfImage} = request.body;
            
            const newData = {
                activityId: activityId || previousImage.activityId,
                typeOfImage: typeOfImage || previousImage.typeOfImage,
                imageUrl: imageUrl
                };

            const serviceResponse = await activityImageService.updateById(newData,id)

            if(!serviceResponse){
                return response.status(404).json({msg:'activityImage not found by this id'})
            }
            return response.status(200).json(serviceResponse);

        }
        }
        catch(error){
            console.error(error)
            return response.status(500).json({msg:"updating activityImage by id failed"})
        }
    }
}