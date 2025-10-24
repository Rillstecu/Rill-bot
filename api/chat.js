// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Cegah method selain POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Ambil pesan dari body request
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });
    }

    // Pastikan API key tersedia
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API Key Gemini tidak ditemukan" });
    }

    // Inisialisasi koneksi ke Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Kirim prompt ke model Gemini
    const result = await model.generateContent(message);

    // Ambil hasil teks dari respons
    const text = result.response.text();

    // Kirim hasil balik ke frontend
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error API Gemini:", error);
    res.status(500).json({ error: "Gagal mendapatkan respons dari Gemini API 😢" });
  }
}
