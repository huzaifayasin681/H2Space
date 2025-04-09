'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiBarChart2, FiFilter, FiChevronDown, FiEye, FiCalendar, FiTag } from 'react-icons/fi';

export default function ContentPage() {
  const [contentItems, setContentItems] = useState([
    { id: 1, title: 'Getting Started with H2Space', status: 'published', date: '2025-04-01', category: 'Tutorial', views: 245 },
    { id: 2, title: 'Content Monetization Strategies', status: 'draft', date: '2025-04-05', category: 'Business', views: 0 },
    { id: 3, title: 'Audience Engagement Techniques', status: 'published', date: '2025-03-28', category: 'Marketing', views: 189 },
    { id: 4, title: 'Creating Compelling Content', status: 'published', date: '2025-03-15', category: 'Tutorial', views: 432 },
    { id: 5, title: 'SEO Best Practices', status: 'draft', date: '2025-04-02', category: 'Marketing', views: 0 },
    { id: 6, title: 'Platform Features Overview', status: 'published', date: '2025-03-20', category: 'Tutorial', views: 312 },
    { id: 7, title: 'Analytics Deep Dive', status: 'draft', date: '2025-04-07', category: 'Business', views: 0 },
    { id: 8, title: 'Community Building Strategies', status: 'published', date: '2025-03-25', category: 'Marketing', views: 156 }
  ]);
  
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get stats for the dashboard
  const publishedCount = contentItems.filter(item => item.status === 'published').length;
  const draftCount = contentItems.filter(item => item.status === 'draft').length;
  const totalViews = contentItems.reduce((sum, item) => sum + item.views, 0);
  
  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(contentItems.map(item => item.category))];
  
  // Filter content based on multiple criteria
  const filteredContent = contentItems
    .filter(item => filter === 'all' || item.status === filter)
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'views') {
        return sortDirection === 'asc' ? a.views - b.views : b.views - a.views;
      } else if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });
  
  // Handle sort change
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Handle delete content
  const handleDelete = (id) => {
    setContentItems(contentItems.filter(item => item.id !== id));
    setShowDeleteConfirm(null);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Content Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your content, track performance, and optimize for engagement
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/content/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Create New
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiEye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiBarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Published Content</p>
              <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FiEdit className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Draft Content</p>
              <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
            </div>
          </div>
        </div>
        
        {/* Filter and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            {/* Status Filter */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filter === 'all' 
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                      : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('published')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filter === 'published' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setFilter('draft')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filter === 'draft' 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                      : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Drafts
                </button>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                <FiChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setCategoryFilter(category);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                        categoryFilter === category ? 'font-medium text-indigo-600' : 'text-gray-700'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Content Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {sortBy === 'title' && (
                        <FiChevronDown 
                          className={`ml-1 h-4 w-4 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        <FiChevronDown 
                          className={`ml-1 h-4 w-4 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center">
                      Views
                      {sortBy === 'views' && (
                        <FiChevronDown 
                          className={`ml-1 h-4 w-4 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((content) => (
                  <tr 
                    key={content.id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors duration-200">
                          {content.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        content.status === 'published' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {content.status === 'published' ? (
                          <div className="flex items-center">
                            <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                            Published
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="w-2 h-2 mr-1.5 rounded-full bg-yellow-500"></span>
                            Draft
                          </div>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiTag className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{content.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{content.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiEye className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{content.views}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3 justify-end">
                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 flex items-center">
                          <FiEdit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        
                        {showDeleteConfirm === content.id ? (
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleDelete(content.id)}
                              className="text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors duration-200"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-gray-600 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowDeleteConfirm(content.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                          >
                            <FiTrash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredContent.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                <FiSearch className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No content found matching your filters.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
        
        {/* Pagination (simplified for demo) */}
        {filteredContent.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm mt-6 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredContent.length}</span> of <span className="font-medium">{contentItems.length}</span> items
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700 font-medium text-sm">
                1
              </button>
              <button className="px-3 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}