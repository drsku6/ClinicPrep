
'use client'

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const TermsOfUsePage = () => {
  const { termsAgreed, setTermsAgreed } = useAuth();
  const router = useRouter();

  const handleAgree = () => {
    if (termsAgreed) {
      router.push('/symptom-checker');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Terms of Use</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            This tool is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p>
            By using this tool, you acknowledge and agree that the information provided is not intended to be a substitute for professional medical advice. You should not disregard professional medical advice or delay in seeking it because of something you have read or accessed through this tool.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <input
            type="checkbox"
            id="agree"
            checked={termsAgreed}
            onChange={() => setTermsAgreed(!termsAgreed)}
            className="mr-2"
          />
          <label htmlFor="agree">I have read and agree to the Terms of Use.</label>
        </div>
        <button
          onClick={handleAgree}
          disabled={!termsAgreed}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
