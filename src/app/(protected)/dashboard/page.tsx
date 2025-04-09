'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiPlus, 
  FiEdit2, 
  FiEye, 
  FiFileText, 
  FiCheckCircle, 
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { 
  RiWaterFlashLine, 
  RiDraftLine, 
  RiFileList2Line, 
  RiLineChartLine 
} from 'react-icons/ri';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    totalViews: 0
  });
  
  const [recentContent, setRecentContent] = useState([
    { id: 1, title: 'Getting Started with H2Space', status: 'published', date: '2025-04-01', views: 245, change: 12 },
    { id: 2, title: 'Content Monetization Strategies', status: 'draft', date: '2025-04-05', views: 0, change: 0 },
    { id: 3, title: 'Audience Engagement Techniques', status: 'published', date: '2025-03-28', views: 189, change: -3 }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('week');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const themeClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800';
  const cardClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700 shadow-lg' 
    : 'bg-white border-gray-100 shadow-md';
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalContent: 8,
        publishedContent: 5,
        draftContent: 3,
        totalViews: 1248
      });
      setIsLoading(false);
    }, 800);
  }, []);
  
  if (isLoading) {
    return (
      <div className={`h-screen flex justify-center items-center ${themeClass} transition-colors duration-300`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className={`text-${theme === 'dark' ? 'gray-300' : 'gray-600'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${themeClass} min-h-screen transition-colors duration-300 pb-10`}>
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-full z-50 ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-800 shadow-md'}`}
      >
        <HiOutlineLightBulb className="w-5 h-5" />
      </button>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex items-center">
            <div className="relative mr-3">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-40"></div>
              <div className={`relative rounded-full p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <RiWaterFlashLine className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Dashboard
            </h1>
          </div>
          
          {/* Time Period Selector */}
          <div className="mt-4 md:mt-0 flex items-center">
            <div className={`mr-4 p-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex text-sm">
                {['day', 'week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimePeriod(period)}
                    className={`px-3 py-1 rounded-md ${
                      selectedTimePeriod === period
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium'
                        : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
                    } transition-all`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <Link
              href="/content/new"
              className="inline-flex items-center px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Create Content
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className={`${cardClass} overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <div className="px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Content
                  </p>
                  <p className="mt-1 text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                    {stats.totalContent}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
                  <RiFileList2Line className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 text-xs">
                <span className="text-green-500 font-medium flex items-center">
                  <FiArrowUp className="mr-1" /> 12% 
                  <span className={`ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>from last {selectedTimePeriod}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className={`${cardClass} overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <div className="px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Published
                  </p>
                  <p className="mt-1 text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">
                    {stats.publishedContent}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'}`}>
                  <FiCheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 text-xs">
                <span className="text-green-500 font-medium flex items-center">
                  <FiArrowUp className="mr-1" /> 8% 
                  <span className={`ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>from last {selectedTimePeriod}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className={`${cardClass} overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <div className="px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Drafts
                  </p>
                  <p className="mt-1 text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
                    {stats.draftContent}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-100'}`}>
                  <RiDraftLine className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-3 text-xs">
                <span className="text-amber-500 font-medium flex items-center">
                  <FiClock className="mr-1" /> 2 due soon
                </span>
              </div>
            </div>
          </div>
          
          <div className={`${cardClass} overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <div className="px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Views
                  </p>
                  <p className="mt-1 text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500">
                    {stats.totalViews}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
                  <FiEye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-3 text-xs">
                <span className="text-green-500 font-medium flex items-center">
                  <FiArrowUp className="mr-1" /> 24% 
                  <span className={`ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>from last {selectedTimePeriod}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity & Performance Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className={`lg:col-span-2 ${cardClass} rounded-xl border transition-all duration-300 hover:shadow-lg`}>
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>View Performance</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-1.5"></div>
                    <span className="text-xs">This {selectedTimePeriod}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-300 mr-1.5"></div>
                    <span className="text-xs">Last {selectedTimePeriod}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5">
              {/* Placeholder for chart - in a real app you'd use a charting library */}
              <div className="h-64 w-full bg-gradient-to-b from-transparent to-blue-50 dark:to-blue-900/10 rounded-lg flex justify-center items-center relative overflow-hidden">
                {/* Sample chart drawn with divs */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end px-4">
                  {[40, 60, 30, 70, 50, 85, 65].map((height, i) => (
                    <div key={i} className="flex-1 mx-1 flex flex-col items-center justify-end">
                      <div className={`w-full rounded-t-md ${theme === 'dark' ? 'bg-blue-500/70' : 'bg-blue-500'}`} style={{ height: `${height}%` }}></div>
                      <div className="mt-2 text-xs">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-1/4 w-full h-px bg-gray-200 dark:bg-gray-700"></div>
                  <div className="absolute top-2/4 w-full h-px bg-gray-200 dark:bg-gray-700"></div>
                  <div className="absolute top-3/4 w-full h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className={`${cardClass} rounded-xl border transition-all duration-300 hover:shadow-lg overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Recent Activity</span>
              </h3>
            </div>
            <div className="px-5 py-4 space-y-5 overflow-y-auto max-h-64">
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'} mr-3`}>
                  <FiCheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Published "Getting Started with H2Space"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiCalendar className="mr-1 h-3 w-3" /> Today, 10:30 AM
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-100'} mr-3`}>
                  <RiDraftLine className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Updated draft "Content Monetization Strategies"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiCalendar className="mr-1 h-3 w-3" /> Yesterday, 4:15 PM
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100'} mr-3`}>
                  <FiEye className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Reached 1,000 total views</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiCalendar className="mr-1 h-3 w-3" /> 2 days ago
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'} mr-3`}>
                  <FiFileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Created "Audience Engagement Techniques"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiCalendar className="mr-1 h-3 w-3" /> March 28, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Content */}
        <div className={`${cardClass} rounded-xl border transition-all duration-300 hover:shadow-lg overflow-hidden`}>
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Recent Content</span>
            </h3>
            <Link
              href="/content"
              className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} flex items-center`}
            >
              View all
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                {recentContent.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md mr-3 ${
                          content.status === 'published' 
                            ? theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100' 
                            : theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-100'
                        }`}>
                          {content.status === 'published' 
                            ? <FiCheckCircle className="h-5 w-5 text-green-600" />
                            : <RiDraftLine className="h-5 w-5 text-amber-600" />
                          }
                        </div>
                        <div className="text-sm font-medium">
                          {content.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        content.status === 'published' 
                          ? theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800' 
                          : theme === 'dark' ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {content.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiCalendar className="mr-1.5 h-4 w-4" />
                        {content.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FiEye className="mr-1.5 h-4 w-4" />
                          {content.views}
                        </div>
                        {content.change !== 0 && (
                          <div className={`ml-2 flex items-center text-xs ${
                            content.change > 0 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {content.change > 0 
                              ? <FiArrowUp className="h-3 w-3 mr-0.5" /> 
                              : <FiArrowDown className="h-3 w-3 mr-0.5" />
                            }
                            {Math.abs(content.change)}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center">
                        <Link href={`/content/${content.id}`} className={`text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 mr-3`}>
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <Link href={`/content/${content.id}/edit`} className={`text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 mr-3`}>
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button className={`text-gray-400 hover:text-gray-500 dark:hover:text-gray-300`}>
                          <BsThreeDotsVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}