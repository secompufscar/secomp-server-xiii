"use strict";
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
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1', routes_1.default);
app.get('/*', (_, response) => response.status(200).json({ message: "API SECOMP UFSCar XII" }));
app.use(errorHandler_1.default);
(0, swagger_1.setupSwagger)(app);
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`> Servidor rodando na porta ${PORT}`);
});
