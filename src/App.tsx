import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  User, 
  BookOpen, 
  Target, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  RefreshCw,
  BrainCircuit,
  Award,
  Lightbulb
} from 'lucide-react';
import { StudentData, CounselingResult } from './types';
import { getCounseling } from './services/CounselorService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Markdown from 'react-markdown';

const INITIAL_DATA: StudentData = {
  name: '',
  className: '',
  attendanceNumber: '',
  grades: {
    bahasaIndonesia: 80,
    bahasaInggris: 80,
    matematika: 80,
    ipa: 80,
    ips: 80,
    informatika: 80,
    sejarah: 80,
    agama: 80,
    pendidikanPancasila: 80,
    pkwu: 80,
    bahasaJawa: 80,
  },
  interests: '',
  talents: '',
  aspirations: '',
};

const SUBJECT_LABELS: Record<string, string> = {
  bahasaIndonesia: 'Bahasa Indonesia',
  bahasaInggris: 'Bahasa Inggris',
  matematika: 'Matematika',
  ipa: 'IPA',
  ips: 'IPS',
  informatika: 'Informatika',
  sejarah: 'Sejarah',
  agama: 'Agama',
  pendidikanPancasila: 'Pendidikan Pancasila',
  pkwu: 'PKWU',
  bahasaJawa: 'Bahasa Jawa',
};

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CounselingResult | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (subject: keyof StudentData['grades'], value: string) => {
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setFormData(prev => ({
      ...prev,
      grades: { ...prev.grades, [subject]: numValue }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await getCounseling(formData);
      setResult(res);
      setStep(4);
    } catch (error) {
      console.error("Error fetching counseling:", error);
      alert("Terjadi kesalahan saat memproses data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Rekomendasi_Kelas_${formData.name}.pdf`);
  };

  const resetForm = () => {
    setStep(1);
    setResult(null);
    setFormData(INITIAL_DATA);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">EduPath Smada</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Kurikulum Merdeka</p>
            </div>
          </div>
          {step < 4 && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step >= s ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-400">Step {step} of 3</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Selamat Datang, Siswa Hebat!</h2>
                <p className="text-gray-500">Mari mulai dengan melengkapi identitas dirimu.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <User size={14} /> Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={14} /> Kelas
                    </label>
                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleInputChange}
                      placeholder="Contoh: X-A"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Award size={14} /> No. Absen
                    </label>
                    <input
                      type="text"
                      name="attendanceNumber"
                      value={formData.attendanceNumber}
                      onChange={handleInputChange}
                      placeholder="Contoh: 07"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.className}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                  >
                    Lanjutkan <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Input Nilai Akademik</h2>
                <p className="text-gray-500">Masukkan nilai rata-rata mata pelajaranmu di kelas 10.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(formData.grades).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 flex items-center justify-between">
                        {SUBJECT_LABELS[key]}
                        <span className="text-indigo-600">{value}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleGradeChange(key as keyof StudentData['grades'], e.target.value)}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-8 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-500 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    <ChevronLeft size={18} /> Kembali
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    Lanjutkan <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Minat, Bakat & Cita-cita</h2>
                <p className="text-gray-500">Bantu kami mengenalmu lebih dalam untuk saran yang lebih akurat.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14} /> Minat (Apa yang kamu sukai?)
                  </label>
                  <textarea
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="Contoh: Saya suka menggambar, membaca artikel teknologi, dan berdiskusi tentang isu sosial."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <BrainCircuit size={14} /> Bakat (Apa keahlianmu?)
                  </label>
                  <textarea
                    name="talents"
                    value={formData.talents}
                    onChange={handleInputChange}
                    placeholder="Contoh: Saya pandai dalam logika matematika dan mampu menjelaskan sesuatu dengan mudah."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Target size={14} /> Cita-cita (Ingin jadi apa nanti?)
                  </label>
                  <textarea
                    name="aspirations"
                    value={formData.aspirations}
                    onChange={handleInputChange}
                    placeholder="Contoh: Saya ingin menjadi Software Engineer atau Data Scientist."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-gray-500 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    <ChevronLeft size={18} /> Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.interests || !formData.aspirations}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="animate-spin" size={18} /> Menganalisis...
                      </>
                    ) : (
                      <>
                        Lihat Rekomendasi <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-gray-900">Hasil Rekomendasi</h2>
                  <p className="text-gray-500">Berdasarkan analisis cerdas terhadap profilmu.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <Download size={18} /> Simpan PDF
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-all"
                  >
                    <RefreshCw size={18} /> Mulai Ulang
                  </button>
                </div>
              </div>

              {/* PDF Report Container */}
              <div ref={reportRef} className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 space-y-10">
                {/* Report Header */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Laporan Konseling Pendidikan</p>
                    <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
                    <p className="text-sm text-gray-500">Kelas {formData.className} • Absen {formData.attendanceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-400">Tanggal Laporan</p>
                    <p className="text-sm font-bold text-gray-700">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Top 3 Recommendations */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Award size={20} />
                    <h4 className="font-bold uppercase tracking-wider text-xs">Top 3 Pilihan Kelas Terbaik</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {result.topRecommendations.map((rec, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-2xl border ${idx === 0 ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-50/50 border-gray-100'}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${idx === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                              {idx + 1}
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-900">Opsi Kelas {rec.optionId}</h5>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {rec.subjects.map((sub, i) => (
                                  <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 font-medium text-gray-600">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-indigo-600">{rec.percentage}%</div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kecocokan</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/50">
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <Lightbulb size={12} /> Mengapa Cocok?
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">{rec.reasoning}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <Target size={12} /> Rekomendasi Jurusan
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {rec.suggestedMajors.map((major, i) => (
                                <span key={i} className="text-xs font-semibold text-indigo-700 bg-indigo-100/50 px-3 py-1 rounded-lg">
                                  {major}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* General Advice */}
                <div className="bg-gray-900 text-white p-8 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Sparkles size={20} />
                    <h4 className="font-bold uppercase tracking-wider text-xs">Saran Pengembangan Diri</h4>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                    <Markdown>{result.generalAdvice}</Markdown>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-8 border-t border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 italic">
                    Laporan ini dihasilkan secara otomatis oleh sistem AI EduCounselor. 
                    Gunakan hasil ini sebagai bahan diskusi bersama orang tua dan guru BK.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <GraduationCap size={20} />
            <span className="font-bold tracking-widest text-xs uppercase">EduPath Smada</span>
          </div>
          <p className="text-sm text-gray-500">Membantu siswa menemukan masa depan yang cerah melalui Kurikulum Merdeka.</p>
        </div>
      </footer>
    </div>
  );
}
