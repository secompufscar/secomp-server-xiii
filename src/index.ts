import express, {Express, Request, Response} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client';
import categoryRoutes from './routes/categories';
import bodyParser from 'body-parser';

const app:Express = express()

app.use(express.json())
app.use(bodyParser.json());

app.use('/api', rootRouter);
app.use('/categories', categoryRoutes);



export const prismaClient = new PrismaClient({
    log: ['query']
})

app.listen(PORT, () => (console.log('App working')))

