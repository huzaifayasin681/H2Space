// src/components/content/RichTextEditor.tsx
'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Toolbar button component with improved accessibility
const ToolbarButton = ({ 
  onClick, 
  active = false, 
  disabled = false, 
  title,
  children 
}: { 
  onClick: (e: React.MouseEvent) => void; 
  active?: boolean; 
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      if (!disabled) onClick(e);
    }}
    disabled={disabled}
    title={title}
    aria-label={title}
    aria-pressed={active}
    className={`p-2 rounded ${
      active 
        ? 'bg-blue-100 text-blue-800' 
        : 'hover:bg-gray-100'
    } ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
    }`}
  >
    {children}
  </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'Start writing...',
}) => {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const linkInputRef = useRef<HTMLInputElement>(null);
  const linkMenuRef = useRef<HTMLDivElement>(null);
  const [editorMounted, setEditorMounted] = useState(false);
  
  // Create editor with improved configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      Link.configure({
        openOnClick: true, // Changed to true for better UX
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => {
      // Close link menu when editor is focused elsewhere
      if (isLinkMenuOpen && !editor?.isActive('link')) {
        setIsLinkMenuOpen(false);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none',
      },
    },
  });

  // Mark editor as mounted after initialization
  useEffect(() => {
    if (editor) {
      setEditorMounted(true);
    }
  }, [editor]);

  // Handle changes to initialContent
  useEffect(() => {
    if (editor && editorMounted && initialContent !== editor.getHTML()) {
      // Use transaction to prevent history stack issues
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor, editorMounted]);

  // Focus the link input when the menu opens
  useEffect(() => {
    if (isLinkMenuOpen && linkInputRef.current) {
      // Get the current selection's URL if a link is selected
      if (editor?.isActive('link')) {
        const linkAttrs = editor.getAttributes('link');
        setLinkUrl(linkAttrs.href || '');
      } else {
        setLinkUrl('');
      }
      
      // Focus the input with a small delay to ensure DOM is ready
      setTimeout(() => {
        linkInputRef.current?.focus();
      }, 50);
    }
  }, [isLinkMenuOpen, editor]);

  // Close the link menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        linkMenuRef.current &&
        !linkMenuRef.current.contains(event.target as Node)
      ) {
        setIsLinkMenuOpen(false);
      }
    };

    if (isLinkMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLinkMenuOpen]);

  // Handle ESC key to close link menu
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isLinkMenuOpen) {
        setIsLinkMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isLinkMenuOpen]);

  if (!editor) {
    return <div className="border border-gray-300 rounded-md p-4">Loading editor...</div>;
  }

  const addImage = () => {
    // Improved image dialog with validation
    const url = window.prompt('Enter the image URL');
    if (url) {
      // More comprehensive URL validation
      if (url.match(/^(https?:\/\/|data:image\/)/i)) {
        editor.chain().focus().setImage({ src: url }).run();
      } else {
        alert('Please enter a valid image URL (must start with http://, https://, or be a data URL)');
      }
    }
  };

  const setLink = () => {
    if (linkUrl) {
      try {
        // Improved URL validation and normalization
        let url = linkUrl.trim();
        
        // Check if it's a valid URL or a relative path
        if (!url.match(/^(https?:\/\/|\/|#)/i)) {
          url = `https://${url}`;
        }
        
        // Try to construct a URL to validate it (will throw if invalid)
        new URL(url.startsWith('/') ? `https://example.com${url}` : url);
        
        editor.chain().focus().setLink({ href: url }).run();
        setIsLinkMenuOpen(false);
        setLinkUrl('');
      } catch (e) {
        alert('Please enter a valid URL');
      }
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsLinkMenuOpen(false);
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text formatting */}
        <div className="flex gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="4" x2="10" y2="4"></line>
              <line x1="14" y1="20" x2="5" y2="20"></line>
              <line x1="15" y1="4" x2="9" y2="20"></line>
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Inline Code"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
        </div>
        
        {/* Lists */}
        <div className="flex gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="9" y1="6" x2="20" y2="6"></line>
              <line x1="9" y1="12" x2="20" y2="12"></line>
              <line x1="9" y1="18" x2="20" y2="18"></line>
              <circle cx="5" cy="6" r="2"></circle>
              <circle cx="5" cy="12" r="2"></circle>
              <circle cx="5" cy="18" r="2"></circle>
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="10" y1="6" x2="21" y2="6"></line>
              <line x1="10" y1="12" x2="21" y2="12"></line>
              <line x1="10" y1="18" x2="21" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0 0 0-1 2-2c1 0 0 0 0 0"></path>
              <path d="M6 14v0a2 2 0 0 0-2 2"></path>
            </svg>
          </ToolbarButton>
        </div>
        
        {/* Other formatting */}
        <div className="flex gap-1 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 15H4V8l4 4h2z"></path>
              <path d="M20 15h-6V8l4 4h2z"></path>
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </ToolbarButton>
        </div>
        
        {/* Link handling with improved positioning */}
        <div className="relative" ref={linkMenuRef}>
          <ToolbarButton
            onClick={(e) => {
              e.stopPropagation();
              setIsLinkMenuOpen(!isLinkMenuOpen);
            }}
            active={editor.isActive('link')}
            title="Link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </ToolbarButton>
          
          {isLinkMenuOpen && (
            <div className="absolute left-0 z-10 mt-2 p-2 bg-white shadow-lg rounded-md border border-gray-200 flex flex-col w-64">
              <input
                ref={linkInputRef}
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setLink();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsLinkMenuOpen(false);
                  }
                }}
              />
              <div className="flex">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setLink();
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm flex-1"
                >
                  {editor.isActive('link') ? 'Update' : 'Add'} Link
                </button>
                {editor.isActive('link') && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeLink();
                    }}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Image with improved handling */}
        <ToolbarButton onClick={addImage} title="Insert Image">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </ToolbarButton>
        
        {/* History */}
        <div className="flex gap-1 ml-auto">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().undo().run()}
            title="Undo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h12a6 6 0 1 1 0 12h-3"></path>
              <path d="M3 12l4-4m0 8l-4-4"></path>
            </svg>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().redo().run()}
            title="Redo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12H9a6 6 0 1 0 0 12h3"></path>
              <path d="M21 12l-4-4m0 8l4-4"></path>
            </svg>
          </ToolbarButton>
        </div>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[200px]"
      />
      
      {/* Debugging - uncomment if needed */}
      {/* <div className="p-2 text-xs text-gray-500 border-t border-gray-200">
        Editor HTML content: {editor.getHTML()}
      </div> */}
    </div>
  );
};

export default RichTextEditor;