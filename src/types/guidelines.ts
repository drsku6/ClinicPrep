
export interface Recommendation {
  id: string;
  title: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'I';
  description: string;
  patientActionStep: string;
}
