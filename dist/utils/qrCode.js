"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = generateQRCode;
const qrcode_1 = __importDefault(require("qrcode"));
function generateQRCode(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const qrCodeImage = yield qrcode_1.default.toDataURL(userId, {
                color: {
                    dark: '#FFFFFF', // Cor dos quadradinhos do QR (branco)
                    light: '#00000000' // Fundo transparente (RGBA com alpha 0)
                },
                margin: 1 // Opcional: reduz a borda em torno do QR
            });
            return qrCodeImage;
        }
        catch (err) {
            console.error(err);
            throw new Error('Failed to generate QR code');
        }
    });
}
