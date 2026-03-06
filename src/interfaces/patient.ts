
export interface PatientProfile {
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  historyOfSmoking: boolean | null;
  historyOfDiabetes: boolean | null;
  familyHistoryOfHeartDisease: boolean | null;
}
