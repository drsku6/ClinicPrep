
// This is a simplified simulation of a clinical guideline engine.
// In a real-world scenario, this would be a far more complex system.

interface PatientProfile {
  age: number;
  sex: 'male' | 'female';
  historyOfSmoking: boolean | any; // Allow for testing of non-boolean values
  familyHistoryOfColonCancer: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  guideline: string;
}

export const getScreeningRecommendations = (profile: PatientProfile): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Colorectal Cancer Screening (USPSTF)
  if (profile.age >= 45 && profile.age <= 75) {
    recommendations.push({
      id: 'colo-01',
      title: 'Colorectal Cancer Screening',
      description: 'Regular screening for colorectal cancer is recommended for adults aged 45 to 75.',
      guideline: 'USPSTF Grade A',
    });
  }

  // Lung Cancer Screening (USPSTF)
  // Safely handle non-boolean values for historyOfSmoking
  if (profile.age >= 50 && profile.age <= 80 && profile.historyOfSmoking === true) {
    recommendations.push({
      id: 'lung-01',
      title: 'Lung Cancer Screening',
      description: 'Annual screening for lung cancer with low-dose computed tomography (LDCT) is recommended for adults aged 50 to 80 years who have a 20 pack-year smoking history and currently smoke or have quit within the past 15 years.',
      guideline: 'USPSTF Grade B',
    });
  }

  return recommendations;
};
