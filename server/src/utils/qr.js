import QRCode from "qrcode";

export const generateQRCode = async (slug) => {
  // 1. Point to your FRONTEND port (5173)
  // 2. Use the /profile/ path defined in your App.jsx
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173"; 
  const fullUrl = `${baseUrl}/profile/${slug}`;

  // Generates base64 image string for the Admin Dashboard to display
  const qrDataURL = await QRCode.toDataURL(fullUrl, {
    color: {
      dark: '#000000', // Black dots
      light: '#ffffff' // White background
    },
    width: 400,
    margin: 2
  });

  return {
    url: fullUrl,
    qr: qrDataURL
  };
};