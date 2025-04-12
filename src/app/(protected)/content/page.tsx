'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiBarChart2, FiFilter, FiChevronDown, FiEye, FiCalendar, FiTag } from 'react-icons/fi';
import contentService from '../../../services/content';
import DeleteContentModal from '../../../components/content/DeleteContentModal';
import { ContentListItem, ContentFilter } from '../../../types/content';

export default function ContentPage() {
  const router = useRouter();
  const [contentItems, setContentItems] = useState<ContentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteContent, setDeleteContent] = useState<{ id: string, title: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get stats for the dashboard
  const publishedCount = contentItems.filter(item => item.status === 'published').length;
  const draftCount = contentItems.filter(item => item.status === 'draft').length;
  const totalViews = contentItems.reduce((sum, item) => sum + (item.views || 0), 0);
  
  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Prepare filter object for API
        const apiFilter: ContentFilter = {
          search: searchTerm || undefined,
          status: filter !== 'all' ? filter as 'published' | 'draft' | 'archived' : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined
        };
        
        // Call API
        const result = await contentService.getContents(page, 10, apiFilter);
        
        setContentItems(result.data);
        setTotalCount(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [page, filter, categoryFilter, searchTerm, sortBy, sortDirection]);
  
  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await contentService.getCategories();
        setCategories(['all', ...categoriesData]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle sort change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Handle delete content
  const handleDeleteConfirm = (content: ContentListItem) => {
    setDeleteContent({
      id: content.id,
      title: content.title
    });
    setShowDeleteModal(true);
  };
  
  // Handle content deletion
  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteContent(id);
      // Refresh content list after deletion
      setContentItems(contentItems.filter(item => item.id !== id));
      setShowDeleteModal(false);
      setDeleteContent(null);
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                href="/content/create"
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
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-500">Loading content...</p>
            </div>
          ) : (
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
                      onClick={() => handleSort('updatedAt')}
                    >
                      <div className="flex items-center">
                        Last Updated
                        {sortBy === 'updatedAt' && (
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
                  {contentItems.map((content) => (
                    <tr 
                      key={content.id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {content.featuredImage && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={content.featuredImage} 
                                alt="" 
                              />
                            </div>
                          )}
                          <Link 
                            href={`/content/${content.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
                          >
                            {content.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          content.status === 'published' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : content.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {content.status === 'published' ? (
                            <div className="flex items-center">
                              <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                              Published
                            </div>
                          ) : content.status === 'draft' ? (
                            <div className="flex items-center">
                              <span className="w-2 h-2 mr-1.5 rounded-full bg-yellow-500"></span>
                              Draft
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="w-2 h-2 mr-1.5 rounded-full bg-red-500"></span>
                              Archived
                            </div>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiTag className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{content.category || 'Uncategorized'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{formatDate(content.updatedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiEye className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{content.views || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-3 justify-end">
                          <Link 
                            href={`/content/edit/${content.id}`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 flex items-center"
                          >
                            <FiEdit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                          
                          <button 
                            onClick={() => handleDeleteConfirm(content)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                          >
                            <FiTrash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!isLoading && contentItems.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                <FiSearch className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No content found matching your filters.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria.</p>
              <div className="mt-6">
                <Link
                  href="/content/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Create New Content
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {!isLoading && contentItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm mt-6 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{contentItems.length}</span> of <span className="font-medium">{totalCount}</span> items
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                className={`px-3 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
                disabled={page <= 1}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button 
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded border ${
                      pageNum === page
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-medium'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    } text-sm`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className={`px-3 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Modal */}
      {deleteContent && (
        <DeleteContentModal
          contentId={deleteContent.id}
          contentTitle={deleteContent.title}
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteContent(null);
          }}
        />
      )}
    </div>
  );
}