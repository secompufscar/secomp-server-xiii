import QRCode from 'qrcode';

export async function generateQRCode(userId: string): Promise<string> {
    try {
        const qrCodeImage = await QRCode.toDataURL(userId); 
        return qrCodeImage;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to generate QR code');
    }
}