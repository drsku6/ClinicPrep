
'use client'

import { useEffect, useState } from 'react';
import { PatientProfile } from '@/interfaces/patient';
import { Recommendation } from '@/types/guidelines';
import { generateGuidelines } from '@/utils/guidelineEngine';

const ResultsPage = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'checklist'>('summary');

  useEffect(() => {
    // Retrieve profile from localStorage
    const storedProfile = localStorage.getItem('patientProfile');
    if (storedProfile) {
      const parsedProfile: PatientProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      // Generate guidelines based on the retrieved profile
      const generated = generateGuidelines(parsedProfile);
      setRecommendations(generated);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!profile) {
    // This can show while the component mounts and retrieves data
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Results...</div>;
  }

  // Empty State: No specific recommendations triggered
  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Screening Recommendations</h1>
            <div className="bg-blue-900/50 border border-blue-700 p-6 rounded-lg">
                <p className="text-lg">
                    Based on the basic information provided, there are no specific high-risk screenings triggered today. Routine preventive care is still important. Discuss a standard wellness schedule with your primary care provider.
                </p>
            </div>
            <div className="mt-6 text-xs text-gray-400">
                <p><b>Disclaimer:</b> This is an educational tool and not a substitute for professional medical advice.</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="print:hidden">
            <h1 className="text-3xl font-bold mb-2 text-center">Your Preventive Health Report</h1>
            <p className="text-center text-gray-400 mb-6">Generated based on the information you provided.</p>
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 p-4 rounded-lg mb-8 text-center">
            <p><b>Important:</b> This tool is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always discuss these recommendations with a qualified healthcare provider.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-700 print:hidden">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => setActiveTab('summary')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'summary' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                    Clinical Summary
                </button>
                <button onClick={() => setActiveTab('checklist')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'checklist' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                    Doctor Discussion Guide
                </button>
            </nav>
        </div>

        {/* Tab Content */}
        <div>
            {/* View 1: Clinical Summary */}
            <div className={`${activeTab === 'summary' ? 'block' : 'hidden'} print:hidden`}>
                <div className="space-y-6">
                    {recommendations.map(rec => (
                        <div key={rec.id} className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
                            <h2 className="font-bold text-xl text-white mb-2">{rec.title}</h2>
                            <p className="font-mono text-sm text-yellow-400 bg-gray-900 inline-block px-2 py-1 rounded mb-3">USPSTF Grade {rec.grade}</p>
                            <p className="text-gray-300">{rec.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* View 2: Doctor Discussion Checklist */}
            <div className={`${activeTab === 'checklist' ? 'block' : 'hidden'} print:block`}>
                 <div className="bg-gray-800 p-8 rounded-lg shadow-md">
                    <div className="text-center mb-8 print:text-black">
                        <h2 className="text-2xl font-bold">Doctor Discussion Guide</h2>
                        <p className="text-gray-400 print:text-gray-600">Bring this guide to your next appointment.</p>
                    </div>
                    
                    <div className="mb-8 border-b border-gray-600 pb-4 print:border-gray-300 print:text-black">
                        <p><b>Patient Information:</b> Age {profile.age}, Gender: {profile.gender}</p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-lg font-semibold print:text-black">Topics to discuss with your provider:</p>
                        {recommendations.map(rec => (
                            <div key={rec.id} className="flex items-start space-x-4">
                                <div className="border-2 border-gray-500 w-6 h-6 mt-1 flex-shrink-0 print:border-black"></div>
                                <p className="print:text-black">{rec.patientActionStep}</p>
                            </div>
                        ))}
                    </div>

                     <div className="mt-10 text-center print:hidden">
                        <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline">
                            Print This Guide
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
