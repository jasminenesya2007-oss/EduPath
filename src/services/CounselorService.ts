import { GoogleGenAI, Type } from "@google/genai";
import { StudentData, CounselingResult } from "../types";

const CLASS_OPTIONS = [
  { id: 1, subjects: ["Kimia", "Biologi", "Sosiologi", "Bahasa Jepang"] },
  { id: 2, subjects: ["Kimia", "Biologi", "Geografi", "Bahasa Jepang"] },
  { id: 3, subjects: ["Fisika", "Antropologi", "Matematika Tingkat Lanjut", "Bahasa Inggris Tingkat Lanjut"] },
  { id: 4, subjects: ["Informatika", "Matematika Tingkat Lanjut", "Sejarah Tingkat Lanjut", "Bahasa Inggris Tingkat Lanjut"] },
  { id: 5, subjects: ["Bahasa Jepang", "Bahasa Inggris Lanjut", "Antropologi", "Sejarah Tingkat Lanjut"] },
  { id: 6, subjects: ["Matematika Tingkat Lanjut", "Fisika", "Bahasa Inggris Tingkat Lanjut", "Geografi"] },
  { id: 7, subjects: ["Ekonomi", "Bahasa Indonesia Tingkat Lanjut", "Matematika Tingkat Lanjut", "Bahasa Inggris Tingkat Lanjut"] },
  { id: 8, subjects: ["Bahasa Indonesia Tingkat Lanjut", "Sosiologi", "Ekonomi", "Bahasa Inggris Tingkat Lanjut"] },
  { id: 9, subjects: ["Matematika Tingkat Lanjut", "Ekonomi", "Geografi", "Bahasa Inggris Tingkat Lanjut"] },
  { id: 10, subjects: ["Matematika Tingkat Lanjut", "Ekonomi", "Sejarah Tingkat Lanjut", "Bahasa Inggris Tingkat Lanjut"] },
];

export async function getCounseling(studentData: StudentData): Promise<CounselingResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const prompt = `
    Anda adalah konselor pendidikan ahli untuk Kurikulum Merdeka di Indonesia.
    Tugas Anda adalah menganalisis data siswa kelas 10 untuk memberikan rekomendasi 3 paket mata pelajaran pilihan (kelas) terbaik dari 10 opsi yang tersedia.

    Data Siswa:
    Nama: ${studentData.name}
    Nilai: ${JSON.stringify(studentData.grades)}
    Minat: ${studentData.interests}
    Bakat: ${studentData.talents}
    Cita-cita: ${studentData.aspirations}

    Daftar Opsi Kelas:
    ${CLASS_OPTIONS.map(opt => `${opt.id}. ${opt.subjects.join(", ")}`).join("\n")}

    Kriteria Analisis:
    1. Kesesuaian nilai mata pelajaran dasar dengan mata pelajaran pilihan di paket.
    2. Keselarasan antara minat, bakat, dan cita-cita dengan paket mata pelajaran.
    3. Proyeksi jurusan kuliah yang relevan dengan paket tersebut.

    Berikan output dalam format JSON yang sesuai dengan skema berikut.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                optionId: { type: Type.INTEGER },
                subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                percentage: { type: Type.NUMBER, description: "Persentase kecocokan 0-100" },
                reasoning: { type: Type.STRING, description: "Alasan singkat mengapa paket ini cocok" },
                suggestedMajors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Daftar jurusan kuliah yang sesuai" }
              },
              required: ["optionId", "subjects", "percentage", "reasoning", "suggestedMajors"]
            }
          },
          generalAdvice: { type: Type.STRING, description: "Saran umum untuk pengembangan diri siswa" }
        },
        required: ["topRecommendations", "generalAdvice"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result;
}
