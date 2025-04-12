// src/components/content/MediaUploader.tsx
'use client';
import { useState, useRef } from 'react';
import { useContent } from '../../hooks/useContent';

interface MediaUploaderProps {
  onUploadComplete: (url: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  label = 'Featured Image',
  accept = 'image/*',
  maxSize = 5, // Default 5MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadMedia } = useContent();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.match(accept.replace('*', ''))) {
      setError(`Invalid file type. Please upload ${accept.replace('*', 'files')}`);
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB`);
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        await processFile(file);
      }
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        await processFile(file);
      }
    }
  };
  
  const processFile = async (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Upload file
    try {
      setUploading(true);
      const url = await uploadMedia(file);
      if (url) {
        onUploadComplete(url);
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUploadComplete('');
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Uploaded media preview"
            className="w-full h-auto max-h-64 object-contain bg-gray-50 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            aria-label="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
          
          <p className="mt-2 text-sm text-gray-600">
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                Drag and drop or click to <span className="text-blue-500">browse</span>
              </>
            )}
          </p>
          
          <p className="mt-1 text-xs text-gray-500">
            {`Supported formats: ${accept.replace('image/', '').replace('*', 'jpg, png, gif, etc.')} (Max ${maxSize}MB)`}
          </p>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default MediaUploader;