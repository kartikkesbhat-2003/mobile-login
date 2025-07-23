import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOtpThunk } from '../slices/otpSlice';
import type { RootState } from '../reducers/store';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { toast } from 'sonner';

const COUNTRY_CODES = [
  { code: '+91', label: 'India', flag: '🇮🇳' },
  { code: '+1', label: 'United States', flag: '🇺🇸' },
  { code: '+44', label: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', label: 'Australia', flag: '🇦🇺' },
  { code: '+971', label: 'United Arab Emirates', flag: '🇦🇪' },
  // Add more as needed
];

const LoginPage: React.FC = () => {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  // Remove via state
  // const [via, setVia] = useState<'sms' | 'whatsapp'>('sms');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.otp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    const fullNumber = mobileNumber;
    // Always send via 'whatsapp'
    const resultAction = await dispatch<any>(sendOtpThunk({ mobileNumber: fullNumber, via: 'whatsapp' }));
    if (sendOtpThunk.rejected.match(resultAction)) {
      toast.error(typeof resultAction.payload === 'string' ? resultAction.payload : 'Failed to send OTP');
    } else if (sendOtpThunk.fulfilled.match(resultAction)) {
      toast.success('OTP sent successfully');
      navigate('/verify-otp');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-8 font-sans">
      <Card className="w-full max-w-lg p-8 space-y-6 shadow-lg border-none bg-[var(--card)] text-[var(--card-foreground)] font-sans">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-[var(--primary)]">Sign in with Mobile</h2>
        <p className="text-center text-gray-400 text-base mb-4">Enter your mobile number to receive an OTP</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</Label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="rounded-md border border-gray-300 bg-[var(--background)] px-2 py-2 text-base focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] min-w-[70px] text-[var(--foreground)] font-sans country-select"
                aria-label="Country code"
                style={{ minWidth: 70 }}
              >
                {COUNTRY_CODES.map(opt => (
                  <option key={opt.code} value={opt.code} style={{ background: '#fff', color: '#181c2a' }}>{opt.code}</option>
                ))}
              </select>
              <Input
                id="mobileNumber"
                type="tel"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your mobile number"
                required
                className="mt-0 text-base flex-1 bg-[var(--background)] border-gray-300 text-[var(--foreground)] placeholder-gray-500"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                autoComplete="tel"
                aria-label="Mobile Number"
              />
            </div>
          </div>
          {error && <div className="text-[var(--destructive)] text-center text-sm" role="alert">{error}</div>}
          <Button type="submit" className="w-full py-3 text-base font-semibold bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]" disabled={loading} aria-busy={loading} aria-live="polite">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage; 