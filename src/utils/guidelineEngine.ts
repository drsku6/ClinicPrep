
import { PatientProfile } from '@/interfaces/patient';
import { Recommendation } from '@/types/guidelines';

export const generateGuidelines = (profile: PatientProfile): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // 1. Colorectal Cancer Screening (Grade A)
  if (profile.age && profile.age >= 45 && profile.age <= 75) {
    recommendations.push({
      id: 'colorectal-cancer',
      title: 'Colorectal Cancer Screening',
      grade: 'A',
      description: 'The USPSTF recommends screening for colorectal cancer in all adults aged 45 to 75 years.',
      patientActionStep: 'Ask your doctor about the best screening test for you, such as a colonoscopy or stool-based test.',
    });
  }

  // 2. Lung Cancer Screening (Grade B)
  // Note: This logic will be updated to include pack-year calculations in a future build.
  if (profile.age && profile.age >= 50 && profile.age <= 80 && profile.historyOfSmoking === true) {
    recommendations.push({
      id: 'lung-cancer',
      title: 'Lung Cancer Screening',
      grade: 'B',
      description: 'The USPSTF recommends annual screening for lung cancer with low-dose computed tomography (LDCT) in adults aged 50 to 80 years who have a significant smoking history and are currently smoking or have quit within the past 15 years.',
      patientActionStep: 'If you are a current or former smoker, discuss with your doctor if a lung cancer screening is right for you.',
    });
  }

  // 3. Hypertension Screening (Grade A)
  if (profile.age && profile.age >= 18) {
    recommendations.push({
      id: 'hypertension',
      title: 'Hypertension Screening',
      grade: 'A',
      description: 'The USPSTF recommends screening for high blood pressure (hypertension) in adults 18 years or older.',
      patientActionStep: 'Get your blood pressure checked regularly. If it is high, discuss treatment options with your doctor.',
    });
  }

  // 4. BRCA Risk Assessment (Grade B)
  // Placeholder: Using familyHistoryOfHeartDisease as a proxy for broader cancer history.
  if (profile.gender === 'female' && profile.familyHistoryOfHeartDisease === true) {
    recommendations.push({
      id: 'brca-risk',
      title: 'BRCA-Related Cancer Risk Assessment',
      grade: 'B',
      description: 'The USPSTF recommends that primary care clinicians assess women with a personal or family history of breast, ovarian, tubal, or peritoneal cancer or who have an ancestry associated with BRCA1/2 gene mutations with an appropriate brief familial risk assessment tool.',
      patientActionStep: 'Discuss your family history of cancer with your doctor to see if you should be referred for genetic counseling and potentially BRCA testing.',
    });
  }

  return recommendations;
};
