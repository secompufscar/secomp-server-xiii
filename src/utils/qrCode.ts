import QRCode from "qrcode";

export async function generateQRCode(userId: string): Promise<string> {
  try {
    const qrCodeImage = await QRCode.toDataURL(userId, {
      color: {
        dark: "#FFFFFF", // Cor dos quadradinhos do QR (branco)
        light: "#00000000", // Fundo transparente (RGBA com alpha 0)
      },
      margin: 1, // Opcional: reduz a borda em torno do QR
    });
    return qrCodeImage;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate QR code");
  }
}
