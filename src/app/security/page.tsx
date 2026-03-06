
'use client'

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TotpMultiFactorGenerator, multiFactor, getAuth } from 'firebase/auth';
import QRCode from 'qrcode.react';

const SecurityPage = () => {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEnroll = async () => {
    if (!user) return;
    const auth = getAuth();
    const multiFactorSession = await multiFactor(user).getSession();
    const secret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
    const uri = `otpauth://totp/ClinicPrep:${user.email}?secret=${secret.secretKey}&issuer=ClinicPrep`;
    setQrCode(uri);
  };

  const handleVerify = async () => {
    if (!user) return;
    const auth = getAuth();
    const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
      (await multiFactor(user).getSession()).id,
      verificationCode
    );
    try {
      await multiFactor(user).enroll(multiFactorAssertion, 'MFA');
      setSuccess('MFA enabled successfully!');
      setError('');
      setQrCode('');
    } catch (error: any) {
      setError(error.message);
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center">Security Settings</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        {!qrCode && (
          <button
            onClick={handleEnroll}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Enable MFA
          </button>
        )}
        {qrCode && (
          <div className="flex flex-col items-center">
            <p className="mb-4">Scan this QR code with your authenticator app:</p>
            <QRCode value={qrCode} />
            <div className="mt-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className="w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleVerify}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
