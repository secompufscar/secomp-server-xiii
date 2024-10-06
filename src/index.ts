import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import routes from './routes'
import path from "path"
import { setupSwagger } from './swagger';


const app = express()

app.set('views', path.join(__dirname, "..", "src", 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())
app.use(cors())
app.use('/api/v1', routes);

app.get('/*', (_, response) => response.status(200).json({ message: "API SECOMP UFSCar XII" }))

app.use(errorHandler);
setupSwagger(app);

const PORT  = process.env.PORT || 3333

app.listen(PORT, () => {
    console.log(`> Servidor rodando na porta ${PORT}`)
})
