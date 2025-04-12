// src/app/(protected)/content/create/page.tsx
import ContentForm from '../../../../components/content/ContentForm';

export const metadata = {
  title: 'Create Content | H2Space',
  description: 'Create new content in H2Space',
};

export default function CreateContentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Content</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new article, blog post, or other content in your workspace.
        </p>
      </div>
      
      <ContentForm />
    </div>
  );
}