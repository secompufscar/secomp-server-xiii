import 'express-async-errors'
import express from 'express'
import errorHandler from './middlewares/errorHandler'
import routes from './routes'


const app = express()

app.use(express.json())

app.use('/api/v1', routes);

app.use(errorHandler);

const PORT  = process.env.PORT || 3333

app.listen(PORT, () => {
    console.log(`> Servidor rodando na porta ${PORT}`)
})
