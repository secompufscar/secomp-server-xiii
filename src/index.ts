import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import routes from './routes'
import path from "path"
import * as dotenv from 'dotenv';
import { setupSwagger } from './swagger';

// Load environment variables early
dotenv.config();

const app = express();

// Set up view engine (EJS)
app.set('views', path.join(__dirname, '..', 'src', 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/v1', routes);

// Swagger Documentation
setupSwagger(app);

// Catch-all route for API root
app.get('/*', (_, response) => response.status(200).json({ message: "API SECOMP UFSCar XIII" }));

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const MODE = process.env.NODE_ENV;
app.listen(PORT, () => {
    console.log(`> Servidor rodando na porta ${PORT}. Modo: ${MODE}`)
})
