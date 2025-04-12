// src/components/content/SeoTools.tsx
'use client';
import { useState, useEffect } from 'react';
import { ContentFormData } from '../../types/content';

interface SeoToolsProps {
  content: ContentFormData;
  onSeoUpdate: (seoData: SeoData) => void;
  initialSeoData?: SeoData;
}

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  twitterCardType: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  noIndex: boolean;
  noFollow: boolean;
}

const defaultSeoData: SeoData = {
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonicalUrl: '',
  openGraphTitle: '',
  openGraphDescription: '',
  openGraphImage: '',
  twitterCardType: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  noIndex: false,
  noFollow: false,
};

const SeoTools: React.FC<SeoToolsProps> = ({
  content,
  onSeoUpdate,
  initialSeoData,
}) => {
  const [seoData, setSeoData] = useState<SeoData>({
    ...defaultSeoData,
    ...initialSeoData,
  });
  
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced'>('basic');
  const [seoScore, setSeoScore] = useState(0);
  const [seoIssues, setSeoIssues] = useState<string[]>([]);
  
  // Update SEO data when content changes
  useEffect(() => {
    if (!initialSeoData) {
      // Auto-populate fields if not already set
      const newSeoData = { ...seoData };
      
      if (!newSeoData.metaTitle && content.title) {
        newSeoData.metaTitle = content.title;
      }
      
      if (!newSeoData.metaDescription && content.excerpt) {
        newSeoData.metaDescription = content.excerpt;
      }
      
      if (!newSeoData.openGraphTitle && content.title) {
        newSeoData.openGraphTitle = content.title;
      }
      
      if (!newSeoData.openGraphDescription && content.excerpt) {
        newSeoData.openGraphDescription = content.excerpt;
      }
      
      if (!newSeoData.twitterTitle && content.title) {
        newSeoData.twitterTitle = content.title;
      }
      
      if (!newSeoData.twitterDescription && content.excerpt) {
        newSeoData.twitterDescription = content.excerpt;
      }
      
      if (!newSeoData.openGraphImage && content.featuredImage) {
        newSeoData.openGraphImage = content.featuredImage;
      }
      
      if (!newSeoData.twitterImage && content.featuredImage) {
        newSeoData.twitterImage = content.featuredImage;
      }
      
      setSeoData(newSeoData);
      onSeoUpdate(newSeoData);
    }
  }, [content, initialSeoData, seoData, onSeoUpdate]);
  
  // Analyze SEO score
  useEffect(() => {
    const issues: string[] = [];
    let score = 0;
    const totalChecks = 10;
    
    // Check meta title
    if (seoData.metaTitle) {
      if (seoData.metaTitle.length < 30 || seoData.metaTitle.length > 60) {
        issues.push("Meta title should be between 30-60 characters");
      } else {
        score++;
      }
    } else {
      issues.push("Meta title is missing");
    }
    
    // Check meta description
    if (seoData.metaDescription) {
      if (seoData.metaDescription.length < 70 || seoData.metaDescription.length > 160) {
        issues.push("Meta description should be between 70-160 characters");
      } else {
        score++;
      }
    } else {
      issues.push("Meta description is missing");
    }
    
    // Check focus keyword
    if (seoData.focusKeyword) {
      const keywordInTitle = seoData.metaTitle.toLowerCase().includes(seoData.focusKeyword.toLowerCase());
      const keywordInDescription = seoData.metaDescription.toLowerCase().includes(seoData.focusKeyword.toLowerCase());
      const keywordInContent = content.content.toLowerCase().includes(seoData.focusKeyword.toLowerCase());
      
      if (!keywordInTitle) {
        issues.push("Focus keyword should appear in the title");
      } else {
        score++;
      }
      
      if (!keywordInDescription) {
        issues.push("Focus keyword should appear in the meta description");
      } else {
        score++;
      }
      
      if (!keywordInContent) {
        issues.push("Focus keyword should appear in the content");
      } else {
        score++;
      }
    } else {
      issues.push("Focus keyword is missing");
    }
    
    // Check social media
    if (!seoData.openGraphTitle || !seoData.openGraphDescription) {
      issues.push("Open Graph title and description should be set for social sharing");
    } else {
      score++;
    }
    
    if (!seoData.twitterTitle || !seoData.twitterDescription) {
      issues.push("Twitter Card title and description should be set for Twitter sharing");
    } else {
      score++;
    }
    
    // Check images
    if (!seoData.openGraphImage) {
      issues.push("Open Graph image is missing for social sharing");
    } else {
      score++;
    }
    
    if (!seoData.twitterImage) {
      issues.push("Twitter Card image is missing for Twitter sharing");
    } else {
      score++;
    }
    
    // Check canonical URL
    if (!seoData.canonicalUrl && !content.title) {
      issues.push("Canonical URL should be set for avoiding duplicate content issues");
    } else {
      score++;
    }
    
    // Calculate percentage score
    const percentScore = Math.floor((score / totalChecks) * 100);
    
    setSeoScore(percentScore);
    setSeoIssues(issues);
  }, [seoData, content]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSeoData(prev => {
      const newData = {
        ...prev,
        [name]: value,
      };
      onSeoUpdate(newData);
      return newData;
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSeoData(prev => {
      const newData = {
        ...prev,
        [name]: checked,
      };
      onSeoUpdate(newData);
      return newData;
    });
  };
  
  // Get score color
  const getScoreColor = () => {
    if (seoScore >= 80) return 'text-green-600';
    if (seoScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
          
          <div className="flex items-center">
            <div className={`text-lg font-bold ${getScoreColor()}`}>
              {seoScore}%
            </div>
            <div className="ml-2 h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  seoScore >= 80 ? 'bg-green-500' : 
                  seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${seoScore}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'basic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic SEO
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'social'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Social Media
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'advanced'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={seoData.metaTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter meta title"
              />
              <p className={`mt-1 text-xs ${
                seoData.metaTitle.length < 30 ? 'text-red-500' :
                seoData.metaTitle.length > 60 ? 'text-red-500' : 'text-green-500'
              }`}>
                {seoData.metaTitle.length}/60 characters (Recommended: 30-60)
              </p>
            </div>
            
            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={seoData.metaDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter meta description"
              ></textarea>
              <p className={`mt-1 text-xs ${
                seoData.metaDescription.length < 70 ? 'text-red-500' :
                seoData.metaDescription.length > 160 ? 'text-red-500' : 'text-green-500'
              }`}>
                {seoData.metaDescription.length}/160 characters (Recommended: 70-160)
              </p>
            </div>
            
            <div>
              <label htmlFor="focusKeyword" className="block text-sm font-medium text-gray-700 mb-1">
                Focus Keyword
              </label>
              <input
                type="text"
                id="focusKeyword"
                name="focusKeyword"
                value={seoData.focusKeyword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter focus keyword"
              />
              <p className="mt-1 text-xs text-gray-500">
                The main keyword you want this content to rank for
              </p>
            </div>
            
            <div>
              <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                id="canonicalUrl"
                name="canonicalUrl"
                value={seoData.canonicalUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/page-url"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use this to avoid duplicate content issues. Leave blank to use the default URL.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Facebook / Open Graph</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="openGraphTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    OG Title
                  </label>
                  <input
                    type="text"
                    id="openGraphTitle"
                    name="openGraphTitle"
                    value={seoData.openGraphTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter Open Graph title"
                  />
                </div>
                
                <div>
                  <label htmlFor="openGraphDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    OG Description
                  </label>
                  <textarea
                    id="openGraphDescription"
                    name="openGraphDescription"
                    value={seoData.openGraphDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter Open Graph description"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="openGraphImage" className="block text-sm font-medium text-gray-700 mb-1">
                    OG Image URL
                  </label>
                  <input
                    type="text"
                    id="openGraphImage"
                    name="openGraphImage"
                    value={seoData.openGraphImage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended size: 1200 x 630 pixels
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Twitter Card</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="twitterCardType" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Card Type
                  </label>
                  <select
                    id="twitterCardType"
                    name="twitterCardType"
                    value={seoData.twitterCardType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="twitterTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    id="twitterTitle"
                    name="twitterTitle"
                    value={seoData.twitterTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter Twitter title"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitterDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Description
                  </label>
                  <textarea
                    id="twitterDescription"
                    name="twitterDescription"
                    value={seoData.twitterDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter Twitter description"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="twitterImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Image URL
                  </label>
                  <input
                    type="text"
                    id="twitterImage"
                    name="twitterImage"
                    value={seoData.twitterImage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended size for Summary Card: 120 x 120 pixels<br />
                    Recommended size for Summary with Large Image: 1200 x 675 pixels
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Search Engine Indexing</h4>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noIndex"
                    name="noIndex"
                    checked={seoData.noIndex}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="noIndex" className="ml-2 block text-sm text-gray-700">
                    No Index (Prevent search engines from indexing this page)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noFollow"
                    name="noFollow"
                    checked={seoData.noFollow}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="noFollow" className="ml-2 block text-sm text-gray-700">
                    No Follow (Prevent search engines from following links on this page)
                  </label>
                </div>
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                Warning: Use these options with caution as they can prevent your content from appearing in search results.
              </p>
            </div>
          </div>
        )}
        
        {seoIssues.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 mb-2">SEO Suggestions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {seoIssues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <svg 
                    className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoTools;