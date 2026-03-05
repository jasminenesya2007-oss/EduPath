export interface StudentData {
  name: string;
  className: string;
  attendanceNumber: string;
  grades: {
    bahasaIndonesia: number;
    bahasaInggris: number;
    matematika: number;
    ipa: number;
    ips: number;
    informatika: number;
    sejarah: number;
    agama: number;
    pendidikanPancasila: number;
    pkwu: number;
    bahasaJawa: number;
  };
  interests: string;
  talents: string;
  aspirations: string;
}

export interface Recommendation {
  optionId: number;
  subjects: string[];
  percentage: number;
  reasoning: string;
  suggestedMajors: string[];
}

export interface CounselingResult {
  topRecommendations: Recommendation[];
  generalAdvice: string;
}
