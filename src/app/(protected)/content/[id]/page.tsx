// src/app/(protected)/content/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import contentService from '../../../../services/content';

interface ContentViewPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ContentViewPageProps) {
  try {
    const content = await contentService.getContent(params.id);
    return {
      title: `${content.title} | H2Space`,
      description: content.excerpt,
    };
  } catch (error) {
    return {
      title: 'Content Not Found | H2Space',
      description: 'The requested content could not be found.',
    };
  }
}

export default async function ContentViewPage({ params }: ContentViewPageProps) {
  // Fetch content data
  let content;
  
  try {
    content = await contentService.getContent(params.id);
  } catch (error) {
    return notFound();
  }
  
  if (!content) {
    return notFound();
  }
  
  // Format dates
  const publishedDate = content.publishedAt 
    ? new Date(content.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
    
  const updatedDate = new Date(content.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              content.status === 'published' ? 'bg-green-100 text-green-800' :
              content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
            </span>
            
            <span className="mx-2">•</span>
            
            <span>
              {publishedDate 
                ? `Published on ${publishedDate}` 
                : `Last modified on ${updatedDate}`}
            </span>
            
            {content.category && (
              <>
                <span className="mx-2">•</span>
                <span>Category: {content.category}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={`/content/edit/${content.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
          
          <Link
            href="/content"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to List
          </Link>
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
            alt={content.title}
            className="w-full h-auto max-h-96 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
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
  );
}