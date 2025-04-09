'use client';

import { useState } from 'react';
import Link from 'next/link';
// Import React Icons
import { FiMail, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { RiWaterFlashLine } from 'react-icons/ri';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const themeClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
  const cardClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700 shadow-xl shadow-blue-900/10' 
    : 'bg-white shadow-2xl shadow-blue-200/50';
  const inputClass = theme === 'dark'
    ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
    : 'bg-white border-gray-200 text-gray-800 placeholder:text-gray-400';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // This would be replaced with actual API call
      console.log('Requesting password reset for:', email);
      
      // Mock successful password reset request
      setTimeout(() => {
        setIsSubmitted(true);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to process your request. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${themeClass}`}>
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-800 shadow-md'}`}
      >
        <HiOutlineLightBulb className="w-6 h-6" />
      </button>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 transform -skew-y-2 origin-top-left"></div>
      
      <div className="absolute -bottom-8 right-0 w-full h-20 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 transform skew-y-2 origin-bottom-right"></div>
      
      <div className="absolute top-1/3 -left-10 w-32 h-32 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
      <div className="absolute bottom-1/3 -right-10 w-32 h-32 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
      
      <div className={`w-full max-w-md relative z-10 transition-all duration-500 ${cardClass} rounded-3xl overflow-hidden border`}>
        <div className="py-8 px-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 border-2 border-white">
                <RiWaterFlashLine className="h-10 w-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
              </div>
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Reset your password</h2>
          
          {isSubmitted ? (
            <div className="text-center">
              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-800 dark:text-green-400 mb-6 flex flex-col items-center">
                <FiCheckCircle className="h-12 w-12 mb-2 text-green-500" />
                <p>If an account exists with the email <strong>{email}</strong>, you will receive password reset instructions.</p>
              </div>
              <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-flex items-center justify-center gap-2 transform hover:scale-[1.02]">
                <FiArrowLeft className="h-4 w-4" />
                <span>Return to login</span>
              </Link>
            </div>
          ) : (
            <>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6 text-center`}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-400 flex items-start gap-2 animate-shake">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className={theme === 'dark' ? 'text-gray-400' : 'text-blue-500'} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${inputClass} appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {loading ? 'Submitting...' : 'Reset password'}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 text-center">
                <Link href="/login" className={`text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors inline-flex items-center gap-1`}>
                  <FiArrowLeft className="h-3 w-3" />
                  <span>Back to login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}