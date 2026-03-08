
'use client'

import { useForm, SubmitHandler } from 'react-hook-form';
import { PatientProfile } from '@/interfaces/patient';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Import useRouter

type FormValues = PatientProfile & {
  symptoms: string;
};

const SymptomCheckerPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const { user } = useAuth();
  const router = useRouter(); // Initialize router

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
      alert('You must be signed in to save your profile.');
      return;
    }

    try {
      const profileForDb = {
        ...data,
        age: Number(data.age), // Ensure age is a number
        historyOfSmoking: data.historyOfSmoking,
        familyHistoryOfColonCancer: data.familyHistoryOfColonCancer,
      };

      // 1. Save profile to Firestore
      await setDoc(doc(db, 'patientProfiles', user.uid), profileForDb);
      
      // 2. Pass profile data via query params for the results page
      const queryString = new URLSearchParams({ 
        profile: JSON.stringify(profileForDb)
      }).toString();

      // 3. Redirect to the results page
      router.push(`/results?${queryString}`);

    } catch (error) {
      console.error('Error in submission process: ', error);
      alert('There was an error during the submission process. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Symptom Checker</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Age</label>
              <input
                type="number"
                {...register('age', { required: 'Age is required', valueAsNumber: true })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Sex</label>
              <select
                {...register('sex', { required: 'Sex is required' })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <span className="block text-gray-400 mb-2">History of Smoking?</span>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" {...register('historyOfSmoking', { required: 'This field is required' })} value="true" className="mr-2"/> Yes
              </label>
              <label className="flex items-center">
                <input type="radio" {...register('historyOfSmoking', { required: 'This field is required' })} value="false" className="mr-2"/> No
              </label>
            </div>
            {errors.historyOfSmoking && <p className="text-red-500 text-sm mt-1">{errors.historyOfSmoking.message}</p>}
          </div>

          <div className="mt-6">
            <span className="block text-gray-400 mb-2">Family History of Colon Cancer?</span>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" {...register('familyHistoryOfColonCancer', { required: 'This field is required' })} value="true" className="mr-2"/> Yes
              </label>
              <label className="flex items-center">
                <input type="radio" {...register('familyHistoryOfColonCancer', { required: 'This field is required' })} value="false" className="mr-2"/> No
              </label>
            </div>
            {errors.familyHistoryOfColonCancer && <p className="text-red-500 text-sm mt-1">{errors.familyHistoryOfColonCancer.message}</p>}
          </div>

          <div className="mt-6">
            <label className="block text-gray-400 mb-2">Enter your symptoms (comma-separated)</label>
            <textarea
              {...register('symptoms', { required: 'Symptoms are required' })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              rows={4}
            />
            {errors.symptoms && <p className="text-red-500 text-sm mt-1">{errors.symptoms.message}</p>}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            View My Recommendations
          </button>
        </form>

      </div>
    </div>
  );
};

export default SymptomCheckerPage;
