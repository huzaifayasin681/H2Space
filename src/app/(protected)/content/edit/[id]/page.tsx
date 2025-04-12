// src/app/(protected)/content/edit/[id]/page.tsx
import { notFound } from 'next/navigation';
import ContentForm from '../../../../../components/content/ContentForm';
import contentService from '../../../../../services/content';

interface EditContentPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Edit Content | H2Space',
  description: 'Edit your content in H2Space',
};

export default async function EditContentPage({ params }: EditContentPageProps) {
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
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your content "{content.title}"
        </p>
      </div>
      
      <ContentForm
        initialData={content}
        isEditing={true}
      />
    </div>
  );
}