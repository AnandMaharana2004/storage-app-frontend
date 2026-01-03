import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Clock,
  RefreshCw,
} from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isSubmitted || timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeLeft(60); // Start 60s timer
    }, 1500);
  };

  const handleResend = () => {
    setIsLoading(true);
    // Simulate API call for resend
    setTimeout(() => {
      setIsLoading(false);
      setTimeLeft(60); // Reset timer
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-brand-500/30">
            Z
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Reset Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {!isSubmitted
              ? "Enter your email to receive a reset link"
              : "Check your inbox"}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all sm:text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Link Sent!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              We've sent a password reset link to{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {email}
              </span>
              . Please check your email.
            </p>

            {/* Resend Logic */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Didn't receive the email? Check your spam folder or
              </p>

              {timeLeft > 0 ? (
                <div className="flex items-center justify-center text-sm font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 py-2 rounded-lg border border-slate-200 dark:border-slate-700 cursor-not-allowed select-none">
                  <Clock size={16} className="mr-2" />
                  Resend available in {formatTime(timeLeft)}
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2 px-4 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-lg text-sm font-medium transition-colors"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : (
                    <RefreshCw size={16} className="mr-2" />
                  )}
                  Click to Resend Email
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setTimeLeft(0);
              }}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium mb-4 block mx-auto hover:underline"
            >
              Try different email
            </button>
          </div>
        )}

        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
          <Link
            to="/sign-in"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
