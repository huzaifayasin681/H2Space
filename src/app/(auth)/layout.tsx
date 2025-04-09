'use client';

import { useState } from 'react';
import { RiWaterFlashLine } from 'react-icons/ri';
import { HiOutlineLightBulb } from 'react-icons/hi';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const themeClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${themeClass} relative overflow-hidden`}>
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-800 shadow-md'} z-20`}
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
      
      <div className="max-w-md w-full space-y-4 z-10">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 border-2 border-white">
              <RiWaterFlashLine className="h-12 w-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">H2Space</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Content Creation & Publishing Platform
          </p>
        </div>
        
        {children}
      </div>
    </div>
  );
}