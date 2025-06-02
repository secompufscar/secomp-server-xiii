"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const swagger_1 = require("./swagger");
// Load environment variables early
dotenv.config();
const app = (0, express_1.default)();
// Set up view engine (EJS)
app.set('views', path_1.default.join(__dirname, '..', 'src', 'views'));
app.set('view engine', 'ejs');
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// API Routes
app.use('/api/v1', routes_1.default);
// Swagger Documentation
(0, swagger_1.setupSwagger)(app);
// Rota para confirmação de e-mail
app.get('/email-confirmado', (req, res) => {
    const { erro } = req.query;
    if (erro === 'usuario-nao-reconhecido') {
        return res.render('confirmationError', { motivo: "Usuário não reconhecido" });
    }
    if (erro === 'erro-interno') {
        return res.render('confirmationError', { motivo: "Erro interno" });
    }
    return res.render('confirmationSuccess');
});
// Catch-all route for API root
app.get('/*', (_, response) => response.status(200).json({ message: "API SECOMP UFSCar XIII" }));
// Error handling middleware
app.use(errorHandler_1.default);
// Start server
const PORT = process.env.PORT || 3000;
const MODE = process.env.NODE_ENV;
app.listen(PORT, () => {
    console.log(`> Servidor rodando na porta ${PORT}. Modo: ${MODE}`);
});
