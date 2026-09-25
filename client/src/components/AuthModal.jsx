import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalReason,
    login,
    register,
    loginWithGoogle
  } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setError('');
      setIsSubmitting(false);
    }
  }, [isAuthModalOpen, mode]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Real-time validations
  const cleanEmail = email.trim().toLowerCase();
  const isEmailValidGmail = GMAIL_REGEX.test(cleanEmail);
  const showEmailDomainWarning = email.includes('@') && !email.toLowerCase().endsWith('@gmail.com');
  const doPasswordsMatch = mode === 'signin' || (password.length > 0 && password === confirmPassword);
  const isPasswordLengthOk = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strict client-side check
    if (!cleanEmail) {
      setError('Email address is required.');
      return;
    }

    if (!isEmailValidGmail) {
      setError('Only @gmail.com email addresses are permitted.');
      return;
    }

    if (!isPasswordLengthOk) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register' && !doPasswordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await login(cleanEmail, password);
      } else {
        await register(cleanEmail, password, displayName || cleanEmail.split('@')[0]);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('No credential received from Google.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or encountered an error.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Modal Surface */}
      <div 
        className="relative w-full max-w-md bg-[#fcfbf9] border border-[#dbd7cd] rounded-[28px] shadow-2xl p-6 sm:p-8 overflow-hidden text-black transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Reason Banner */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wide uppercase bg-stone-100 text-stone-600 border border-[#dbd7cd]/80 mb-3">
            {authModalReason === 'save_gate' && (
              <>
                <Sparkles className="w-3 h-3 text-black" />
                <span>Save to Library</span>
              </>
            )}
            {authModalReason === 'run_limit' && (
              <>
                <AlertCircle className="w-3 h-3 text-amber-700" />
                <span>Guest Limit Reached</span>
              </>
            )}
            {authModalReason === 'manual' && (
              <>
                <Lock className="w-3 h-3 text-stone-500" />
                <span>Studio Access</span>
              </>
            )}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-light text-black tracking-[-0.02em] leading-tight">
            {authModalReason === 'save_gate' && 'Preserve your brand in your library.'}
            {authModalReason === 'run_limit' && 'Free guest tests completed.'}
            {authModalReason === 'manual' && (mode === 'signin' ? 'Sign in to Brand Studio.' : 'Create your Studio account.')}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
            {authModalReason === 'save_gate' && 'Create an account or sign in to save your synthesized brand kits, tokens, and manifesto to MongoDB Atlas.'}
            {authModalReason === 'run_limit' && 'You have completed your 2 free guest brand tests. Sign in with your @gmail.com to continue creating unlimited brand identities.'}
            {authModalReason === 'manual' && 'Access all past brand sessions, export CSS tokens, and iterate with Socratic AI.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#dbd7cd] mb-6">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2.5 text-xs uppercase tracking-[0.06em] font-medium transition-colors border-b-2 -mb-[1px] ${
              mode === 'signin'
                ? 'border-black text-black'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 text-xs uppercase tracking-[0.06em] font-medium transition-colors border-b-2 -mb-[1px] ${
              mode === 'register'
                ? 'border-black text-black'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50/80 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth One-Click */}
        <div className="mb-5 flex flex-col items-center">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="pill"
              theme="outline"
              size="large"
              text={mode === 'signin' ? 'signin_with' : 'signup_with'}
              width="320"
            />
          </div>

          <div className="w-full flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-[#dbd7cd]" />
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono">or email</span>
            <div className="flex-1 h-[1px] bg-[#dbd7cd]" />
          </div>
        </div>

        {/* Custom Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name (Only in Register mode) */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Studio Director"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#dbd7cd] rounded-xl text-black placeholder-stone-400 focus:outline-none focus:border-black transition-colors"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          {/* Email with Strict @gmail.com feedback */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] uppercase tracking-wider text-stone-500">
                Email Address <span className="text-black font-semibold">(@gmail.com only)</span>
              </label>
              {isEmailValidGmail && (
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Valid
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@gmail.com"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-xl text-black placeholder-stone-400 focus:outline-none transition-colors ${
                  showEmailDomainWarning
                    ? 'border-amber-400 focus:border-amber-500'
                    : isEmailValidGmail
                    ? 'border-emerald-400 focus:border-emerald-500'
                    : 'border-[#dbd7cd] focus:border-black'
                }`}
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            {showEmailDomainWarning && (
              <p className="mt-1 text-[11px] text-amber-700 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Only @gmail.com email addresses are allowed.
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
              Password {mode === 'register' && <span className="text-stone-400">(min 6 characters)</span>}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#dbd7cd] rounded-xl text-black placeholder-stone-400 focus:outline-none focus:border-black transition-colors"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Confirm Password (Registration Only) with Real-Time Matching */}
          {mode === 'register' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] uppercase tracking-wider text-stone-500">
                  Confirm Password
                </label>
                {confirmPassword && (
                  <span
                    className={`text-[11px] font-mono flex items-center gap-1 ${
                      doPasswordsMatch ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {doPasswordsMatch ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" /> Passwords do not match
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-xl text-black placeholder-stone-400 focus:outline-none transition-colors ${
                    confirmPassword && !doPasswordsMatch
                      ? 'border-rose-400 focus:border-rose-500'
                      : confirmPassword && doPasswordsMatch
                      ? 'border-emerald-400 focus:border-emerald-500'
                      : 'border-[#dbd7cd] focus:border-black'
                  }`}
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || !isEmailValidGmail || (mode === 'register' && (!doPasswordsMatch || !isPasswordLengthOk))}
            className="w-full mt-2 py-3 px-4 rounded-full bg-black text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed font-medium text-xs uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to Studio' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer info note */}
        <p className="mt-4 text-center text-[11px] text-stone-400 font-mono">
          Security: Salted bcrypt passwords &bull; MongoDB session archive
        </p>
      </div>
    </div>
  );
}
