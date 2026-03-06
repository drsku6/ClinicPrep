'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TotpMultiFactorGenerator, multiFactor, TotpSecret } from 'firebase/auth';
import { QRCodeCanvas } from 'qrcode.react';

const SecurityPage = () => {
  const { user } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      const mfaInfo = multiFactor(user).enrolledFactors;
      setMfaEnabled(mfaInfo.length > 0);
    }
  }, [user]);

  const handleEnableMfa = async () => {
    if (!user) return;

    try {
      const multiFactorSession = await multiFactor(user).getSession();
      const secret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);
      setTotpSecret(secret);
      setSuccess('Scan the QR code with your authenticator app and enter the code to verify.');
    } catch (error) {
      console.error('Error enabling MFA:', error);
      setError('Failed to start MFA enrollment. Please try again.');
    }
  };

  const handleVerifyMfa = async () => {
    if (!user || !totpSecret) return;

    try {
      const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, verificationCode);
      await multiFactor(user).enroll(multiFactorAssertion, 'My TOTP Authenticator');
      setMfaEnabled(true);
      setTotpSecret(null);
      setSuccess('MFA has been enabled successfully!');
      setError('');
    } catch (error) {
      console.error('Error verifying MFA:', error);
      setError('Invalid verification code. Please try again.');
    }
  };

  const handleDisableMfa = async () => {
    if (!user) return;

    try {
      const mfaInfo = multiFactor(user).enrolledFactors;
      if (mfaInfo.length > 0) {
        await multiFactor(user).unenroll(mfaInfo[0].uid);
        setMfaEnabled(false);
        setSuccess('MFA has been disabled successfully!');
        setError('');
      }
    } catch (error) {
      console.error('Error disabling MFA:', error);
      setError('Failed to disable MFA. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6">Security Settings</h1>
        {user ? (
          <div>
            {mfaEnabled ? (
              <div className="text-center">
                <p className="text-lg text-green-600 mb-4">Multi-Factor Authentication is Enabled</p>
                <button
                  onClick={handleDisableMfa}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Disable MFA
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg text-yellow-600 mb-4">Multi-Factor Authentication is Disabled</p>
                {!totpSecret ? (
                  <button
                    onClick={handleEnableMfa}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Enable MFA
                  </button>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="mb-4">Scan this QR code with your authenticator app:</p>
                    <div className="p-4 bg-white border rounded">
                        <QRCodeCanvas value={totpSecret.generateQrCodeUrl(user?.email || "User", "ClinicPrep")} size={256} />
                    </div>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter verification code"
                      className="w-full mt-4 p-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={handleVerifyMfa}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Verify & Enable
                    </button>
                  </div>
                )}
              </div>
            )}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {success && <p className="text-green-500 text-center mt-4">{success}</p>}
          </div>
        ) : (
          <p className="text-center">Please sign in to manage your security settings.</p>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
