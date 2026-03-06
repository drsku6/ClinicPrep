'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PatientProfile } from '@/interfaces/patient';
import { Recommendation } from '@/types/guidelines';
import { getScreeningRecommendations } from '@/utils/guidelineEngine';

const ResultsPage = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const profileData = searchParams.get('profile');
    if (profileData) {
      const parsedProfile = JSON.parse(profileData);
      setProfile(parsedProfile);
      const generatedRecommendations = getScreeningRecommendations(parsedProfile);
      setRecommendations(generatedRecommendations);
    }
  }, [searchParams]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Screening Recommendations</h1>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-2">Patient Profile</h2>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Sex:</strong> {profile.sex}</p>
          <p><strong>Smoking History:</strong> {profile.historyOfSmoking ? 'Yes' : 'No'}</p>
          <p><strong>Family History of Colon Cancer:</strong> {profile.familyHistoryOfColonCancer ? 'Yes' : 'No'}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Personalized Recommendations</h2>
          {recommendations.length > 0 ? (
            <ul className="space-y-4">
              {recommendations.map((rec) => (
                <li key={rec.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold text-blue-600">{rec.title}</h3>
                  <p className="text-gray-700 mt-2">{rec.description}</p>
                  <p className="text-sm text-gray-500 mt-4">Guideline: {rec.guideline}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No specific screening recommendations based on the provided profile.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
