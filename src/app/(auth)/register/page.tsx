'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import React Icons
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiGithub } from 'react-icons/fi';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { MdOutlineWavingHand } from 'react-icons/md';
import { RiWaterFlashLine } from 'react-icons/ri';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // This would be replaced with actual API call
      console.log('Registering with:', formData);
      
      // Mock successful registration
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 1000);
      
    } catch (err) {
      setError('Failed to register account. Please try again.');
      setLoading(false);
    }
  };

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
      
      {/* Floating icons */}
      <div className="absolute top-1/4 left-1/4 text-blue-500 opacity-10 animate-pulse">
        <RiWaterFlashLine className="w-24 h-24" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 text-purple-500 opacity-10 animate-pulse delay-1000">
        <RiWaterFlashLine className="w-24 h-24" />
      </div>
      
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
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Join H2Space</h2>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Create your account</span>
              <MdOutlineWavingHand className="text-yellow-400 w-4 h-4 animate-wave" />
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-400 flex items-start gap-2 animate-shake">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className={theme === 'dark' ? 'text-gray-400' : 'text-blue-500'} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="John Doe"
                />
              </div>
            </div>
            
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className={theme === 'dark' ? 'text-gray-400' : 'text-blue-500'} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Create a password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className={theme === 'dark' ? 'text-gray-400' : 'text-blue-500'} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none block w-full pl-10 pr-12 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Confirm your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
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
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-3 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                Or register with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-4 gap-3">
            <button className={`w-full aspect-square flex items-center justify-center rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'} transition-all hover:scale-110 duration-200`}>
              <FaGoogle className="h-5 w-5 text-red-500" />
            </button>
            <button className={`w-full aspect-square flex items-center justify-center rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'} transition-all hover:scale-110 duration-200`}>
              <FaFacebookF className="h-5 w-5 text-blue-600" />
            </button>
            <button className={`w-full aspect-square flex items-center justify-center rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'} transition-all hover:scale-110 duration-200`}>
              <FaApple className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            </button>
            <button className={`w-full aspect-square flex items-center justify-center rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'} transition-all hover:scale-110 duration-200`}>
              <FiGithub className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} />
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}