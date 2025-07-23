import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtpThunk, sendOtpThunk, resetOtpState } from '../slices/otpSlice';
import { setUser } from '../slices/authSlice';
import type { RootState } from '../reducers/store';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const maskMobile = (mobile?: string | null) => {
  if (!mobile) return '';
  // Mask all but last 4 digits
  return `+91-XXXXXX${mobile.slice(-4)}`;
};

const OtpPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otpId, loading, error, mobileNumber } = useSelector((state: RootState) => state.otp);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!otpId) {
      // navigate('/login');
    }
  }, [otpId, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    if (!otpId) return;
    const resultAction = await dispatch<any>(verifyOtpThunk({ otpId, otp }));
    if (verifyOtpThunk.rejected.match(resultAction)) {
      toast.error(typeof resultAction.payload === 'string' ? resultAction.payload : 'OTP verification failed');
    } else if (verifyOtpThunk.fulfilled.match(resultAction)) {
      const user = resultAction.payload?.data?.user;
      if (user && user.accessToken) {
        dispatch(setUser(user));
        Cookies.set('accessToken', user.accessToken, { expires: 7 });
        dispatch(resetOtpState());
        navigate('/');
      } else {
        toast.error('No user data returned');
      }
      toast.success('OTP verified successfully');
    }
  };

  const handleResend = async (via: 'whatsapp' | 'sms') => {
    if (!otpId || !mobileNumber) return;
    setTimer(30);
    const resultAction = await dispatch<any>(sendOtpThunk({ mobileNumber, via }));
    if (sendOtpThunk.rejected.match(resultAction)) {
      toast.error(typeof resultAction.payload === 'string' ? resultAction.payload : 'Failed to resend OTP');
    } else if (sendOtpThunk.fulfilled.match(resultAction)) {
      toast.success('OTP resent successfully');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-2 sm:px-6 py-8 relative font-sans">
      <Card className="w-full max-w-[500px] p-5 sm:p-8 space-y-7 shadow-2xl border-none bg-[var(--card)] text-[var(--card-foreground)] font-sans flex flex-col items-center relative">
        {/* Back Button inside Card */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="absolute left-4 top-4 flex items-center gap-1 px-2 py-1 rounded-md bg-transparent text-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition text-base font-medium"
          aria-label="Back to Login"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-1 text-[var(--primary)] tracking-tight w-full">Enter OTP</h2>
        {/* WhatsApp sent info */}
        
        <form onSubmit={handleVerify} className="w-full flex flex-col gap-5 sm:gap-6 mt-2">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="otp" className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center justify-center gap-2 w-full">
          <MessageCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm sm:text-base text-gray-500 text-center">OTP sent via <span className="font-semibold text-green-600">WhatsApp</span> on <span className="font-mono">{maskMobile(mobileNumber)}</span></span>
        </div>
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="text-base sm:text-lg tracking-widest text-center bg-[var(--background)] border-gray-300 text-[var(--foreground)] placeholder-gray-500 py-2 sm:py-3 rounded-md"
              inputMode="numeric"
              pattern="[0-9]{4,6}"
              maxLength={6}
              autoComplete="one-time-code"
              aria-label="OTP"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 w-full">
            {timer > 0 ? (
              <Button
                type="button"
                disabled
                className="w-full py-2 bg-[var(--primary)] text-[var(--primary-foreground)] opacity-80 cursor-not-allowed"
              >
                {`Resend in ${timer}s`}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => handleResend('whatsapp')}
                  disabled={loading}
                  className="flex-1 min-w-0 py-2 bg-green-600 text-white flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Resend via WhatsApp</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => handleResend('sms')}
                  disabled={loading}
                  className="flex-1 min-w-0 py-2 bg-blue-600 text-white flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10-4H7a2 2 0 00-2 2v0a2 2 0 002 2h10a2 2 0 002-2v0a2 2 0 00-2-2z" /></svg>
                  <span>Resend via SMS</span>
                </Button>
              </>
            )}
          </div>
          {error && <div className="text-[var(--destructive)] text-center text-sm mt-1" role="alert">{error}</div>}
          <Button type="submit" className="w-full py-3 text-base font-semibold bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-md shadow-sm transition" disabled={loading} aria-busy={loading} aria-live="polite">
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default OtpPage; 