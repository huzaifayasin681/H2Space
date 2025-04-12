// src/components/content/ContentPreview.tsx

'use client';
import { Content } from '../../types/content';

interface ContentPreviewProps {
  content: Partial<Content>;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content }) => {
  // Format date for display
  const formattedDate = content.publishedAt 
    ? new Date(content.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {content.title || 'Untitled Content'}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              content.status === 'published' ? 'bg-green-100 text-green-800' :
              content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {content.status 
                ? content.status.charAt(0).toUpperCase() + content.status.slice(1)
                : 'Draft'
              }
            </span>
            
            <span className="mx-2">•</span>
            
            <span>
              {content.status === 'published' 
                ? `Published on ${formattedDate}` 
                : `Preview - ${formattedDate}`}
            </span>
            
            {content.category && (
              <>
                <span className="mx-2">•</span>
                <span>Category: {content.category}</span>
              </>
            )}
          </div>
        </div>
        
        {content.excerpt && (
          <div className="mb-8 text-xl text-gray-500 font-light italic border-l-4 border-gray-200 pl-4">
            {content.excerpt}
          </div>
        )}
        
        {content.featuredImage && (
          <div className="mb-8">
            <img
              src={content.featuredImage}
              alt={content.title || 'Content preview'}
              className="w-full h-auto max-h-96 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="prose prose-lg max-w-none">
          {content.content ? (
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          ) : (
            <p className="text-gray-400 italic">No content yet...</p>
          )}
        </div>
        
        {content.tags && content.tags.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {content.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPreview;