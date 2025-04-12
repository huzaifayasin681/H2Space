
'use client';
// src/components/content/ContentForm.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContentFormData, Content } from '../../types/content';
import { useContent } from '../../hooks/useContent';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';
import TagSelector from './TagSelector';
import ContentPreview from './ContentPreview';
import SeoTools, { SeoData } from './SeoTools';
import ContentVersions from './ContentVersions';
import DeleteContentModal from './DeleteContentModal';
import contentService from '../../services/content';

interface ContentFormProps {
  initialData?: Content;
  isEditing?: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<ContentFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || '',
    status: initialData?.status || 'draft',
    tags: initialData?.tags || [],
    category: initialData?.category || '',
  });
  
  const [seoData, setSeoData] = useState<SeoData | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showSeoTools, setShowSeoTools] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'versions'>('content');
  
  const router = useRouter();
  const { createContent, updateContent, error: apiError } = useContent();
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const availableCategories = await contentService.getCategories();
        setCategories(availableCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Set up autosave for editing mode
  useEffect(() => {
    if (!isEditing || !initialData?.id) return;
    
    const autoSaveInterval = setInterval(async () => {
      // Only autosave if there are changes
      if (
        formData.title !== initialData.title ||
        formData.content !== initialData.content ||
        formData.excerpt !== initialData.excerpt ||
        formData.featuredImage !== initialData.featuredImage ||
        formData.status !== initialData.status ||
        formData.category !== initialData.category ||
        JSON.stringify(formData.tags) !== JSON.stringify(initialData.tags)
      ) {
        await handleAutoSave();
      }
    }, 60000); // Autosave every minute
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [formData, initialData, isEditing]);
  
  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle rich text editor change
  const handleContentChange = (html: string) => {
    setFormData(prev => ({ ...prev, content: html }));
    
    // Clear error for content field
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };
  
  // Handle featured image upload
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, featuredImage: url }));
  };
  
  // Handle tags change
  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };
  
  // Handle SEO data update
  const handleSeoUpdate = (newSeoData: SeoData) => {
    setSeoData(newSeoData);
  };
  
  // Handle version restore
  const handleRestoreVersion = (versionId: string) => {
    // This would be implemented to restore the content to a previous version
    console.log('Restore version:', versionId);
    
    // Mock implementation - in a real app, this would fetch the version data
    alert(`Version ${versionId} would be restored`);
  };
  
  // Handle version comparison
  const handleCompareVersions = (versionId1: string, versionId2: string) => {
    // This would be implemented to show a diff between versions
    console.log('Compare versions:', versionId1, versionId2);
    
    // Mock implementation - in a real app, this would show a comparison view
    alert(`Comparing versions ${versionId1} and ${versionId2}`);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt should be 300 characters or less';
    }
    
    if (!formData.category && categories.length > 0) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const dataToSave = {
        ...formData,
        seo: seoData // Include SEO data
      };
      
      if (isEditing && initialData?.id) {
        await updateContent(initialData.id, dataToSave);
        setLastSaved(new Date());
      } else {
        const newContent = await createContent(dataToSave);
        if (newContent?.id) {
          router.push(`/content/edit/${newContent.id}`);
        }
      }
    } catch (err) {
      console.error('Failed to save content:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle autosave
  const handleAutoSave = async () => {
    if (!isEditing || !initialData?.id) return;
    
    setIsAutoSaving(true);
    
    try {
      const dataToSave = {
        ...formData,
        seo: seoData // Include SEO data
      };
      
      await updateContent(initialData.id, dataToSave);
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to autosave content:', err);
    } finally {
      setIsAutoSaving(false);
    }
  };
  
  // Handle publish action
  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const dataToSave = {
        ...formData,
        status: 'published',
        seo: seoData // Include SEO data
      };
      
      if (isEditing && initialData?.id) {
        await updateContent(initialData.id, dataToSave);
        setLastSaved(new Date());
      } else {
        const newContent = await createContent(dataToSave);
        if (newContent?.id) {
          router.push(`/content/edit/${newContent.id}`);
        }
      }
    } catch (err) {
      console.error('Failed to publish content:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
            {isEditing ? 'Edit Content' : 'Create New Content'}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
            {isEditing && lastSaved && (
              <span className="text-sm text-gray-500 mb-2 sm:mb-0">
                {isAutoSaving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
              </span>
            )}
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-gray-50 px-6 py-2 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'content'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Content
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'seo'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            SEO
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => setActiveTab('versions')}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'versions'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Versions
            </button>
          )}
        </div>
      </div>
      
      {apiError && (
        <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        </div>
      )}
      
      {showPreview ? (
        <div className="p-6">
          <ContentPreview content={formData} />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {activeTab === 'content' && (
            <div className="p-6 grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border ${
                    errors.excerpt ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter a brief excerpt (max 300 characters)"
                  maxLength={300}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.excerpt.length}/300 characters
                </p>
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <RichTextEditor
                  initialContent={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <MediaUploader
                    onUploadComplete={handleImageUpload}
                    label="Featured Image"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                  
                  <TagSelector
                    selectedTags={formData.tags}
                    onChange={handleTagsChange}
                  />
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'seo' && (
            <div className="p-6">
              <SeoTools
                content={formData}
                onSeoUpdate={handleSeoUpdate}
                initialSeoData={seoData || undefined}
              />
            </div>
          )}
          
          {activeTab === 'versions' && isEditing && initialData?.id && (
            <div className="p-6">
              <ContentVersions
                contentId={initialData.id}
                onRestoreVersion={handleRestoreVersion}
                onCompareVersions={handleCompareVersions}
              />
            </div>
          )}
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/content')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save as Draft'}
            </button>
            
            <button
              type="button"
              onClick={handlePublish}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSaving}
            >
              {formData.status === 'published' ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      )}
      
      {/* Delete Modal */}
      {isEditing && initialData && (
        <DeleteContentModal
          contentId={initialData.id}
          contentTitle={initialData.title}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ContentForm;