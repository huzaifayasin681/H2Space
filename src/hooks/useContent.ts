// src/hooks/useContent.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import contentService from '../services/content';
import { Content, ContentFormData, ContentFilter } from '../types/content';

export const useContent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get content by ID
  const getContent = useCallback(async (id: string): Promise<Content | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await contentService.getContent(id);
      return content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Create new content
  const createContent = useCallback(async (data: ContentFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newContent = await contentService.createContent(data);
      // Redirect to edit page after creation
      router.push(`/content/${newContent.id}`);
      return newContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  
  // Update existing content
  const updateContent = useCallback(async (id: string, data: Partial<ContentFormData>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedContent = await contentService.updateContent(id, data);
      return updatedContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Delete content
  const deleteContent = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await contentService.deleteContent(id);
      router.push('/content');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  
  // Upload media
  const uploadMedia = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await contentService.uploadMedia(file);
      return result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getContent,
    createContent,
    updateContent,
    deleteContent,
    uploadMedia,
  };
};