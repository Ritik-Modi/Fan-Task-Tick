import QRCode from 'qrcode';

const generateQrCode = async (id , title , quantity) => {
    try {
        const ticketData = { id, title, quantity };
        const qrCode = await QRCode.toDataURL(JSON.stringify(ticketData), {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
        });
        return qrCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }

}

export default generateQrCode;
