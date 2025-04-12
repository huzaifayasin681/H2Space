// src/services/content.ts
import api from './api';
import { Content, ContentFormData, ContentFilter, ContentListItem } from '../types/content';

const contentService = {
  /**
   * Get all content with pagination and filtering
   */
  getContents: async (
    page = 1, 
    limit = 10, 
    filters: ContentFilter = {}
  ): Promise<{ data: ContentListItem[]; total: number; page: number; totalPages: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters.search ? { search: filters.search } : {},
      ...filters.status && filters.status !== 'all' ? { status: filters.status } : {},
      ...filters.category ? { category: filters.category } : {},
      ...filters.tag ? { tag: filters.tag } : {},
      ...filters.dateRange?.from ? { from: filters.dateRange.from } : {},
      ...filters.dateRange?.to ? { to: filters.dateRange.to } : {},
    });

    const response = await api.get(`/contents?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single content by ID
   */
  getContent: async (id: string): Promise<Content> => {
    const response = await api.get(`/contents/${id}`);
    return response.data;
  },

  /**
   * Create new content
   */
  createContent: async (contentData: ContentFormData): Promise<Content> => {
    const response = await api.post('/contents', contentData);
    return response.data;
  },

  /**
   * Update existing content
   */
  updateContent: async (id: string, contentData: Partial<ContentFormData>): Promise<Content> => {
    const response = await api.put(`/contents/${id}`, contentData);
    return response.data;
  },

  /**
   * Delete content
   */
  deleteContent: async (id: string): Promise<void> => {
    await api.delete(`/contents/${id}`);
  },

  /**
   * Upload media file and get URL
   */
  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  /**
   * Track a content view
   */
  trackView: async (id: string): Promise<void> => {
    await api.post(`/contents/${id}/view`);
  },
  
  /**
   * Get content analytics
   */
  getContentAnalytics: async (id: string): Promise<{
    views: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    referrers: { source: string; count: number }[];
  }> => {
    const response = await api.get(`/contents/${id}/analytics`);
    return response.data;
  },
  
  /**
   * Get all available categories
   */
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  /**
   * Get all available tags
   */
  getTags: async (): Promise<string[]> => {
    const response = await api.get('/tags');
    return response.data;
  }
};

export default contentService;