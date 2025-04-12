// src/components/content/TagSelector.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import contentService from '../../services/content';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Fetch available tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const tags = await contentService.getTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);
  
  // Update suggestions when input changes
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedTags.includes(tag)
      );
      setSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, availableTags, selectedTags]);
  
  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const addTag = (tag: string) => {
    tag = tag.trim();
    
    if (!tag) return;
    
    // Check if we're at the max tags limit
    if (selectedTags.length >= maxTags) {
      return;
    }
    
    // Check if tag already exists
    if (selectedTags.includes(tag)) {
      return;
    }
    
    const newTags = [...selectedTags, tag];
    onChange(newTags);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Add to available tags if it's a new tag
    if (!availableTags.includes(tag)) {
      setAvailableTags([...availableTags, tag]);
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        addTag(suggestions[0]);
      } else {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      // Remove the last tag when backspace is pressed on empty input
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      // Focus the first suggestion
      const suggestionElements = suggestionsRef.current?.querySelectorAll('button');
      if (suggestionElements && suggestionElements.length > 0) {
        (suggestionElements[0] as HTMLElement).focus();
      }
    }
  };
  
  const handleSuggestionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, tag: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag(tag);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const suggestionElements = suggestionsRef.current?.querySelectorAll('button');
      if (suggestionElements && index < suggestionElements.length - 1) {
        (suggestionElements[index + 1] as HTMLElement).focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const suggestionElements = suggestionsRef.current?.querySelectorAll('button');
      if (suggestionElements && index > 0) {
        (suggestionElements[index - 1] as HTMLElement).focus();
      } else {
        // Focus back to input
        inputRef.current?.focus();
      }
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags
      </label>
      
      <div className="border border-gray-300 rounded-md p-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200"
              >
                <span className="sr-only">Remove tag {tag}</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
          
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (inputValue.trim() && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className="border-0 p-0 focus:ring-0 focus:outline-none text-sm w-full min-w-[120px]"
              placeholder={selectedTags.length === 0 ? "Add tags..." : ""}
              disabled={selectedTags.length >= maxTags}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
              >
                {suggestions.map((tag, index) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    onKeyDown={(e) => handleSuggestionKeyDown(e, tag, index)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedTags.length >= maxTags && (
        <p className="mt-1 text-xs text-amber-600">
          Maximum number of tags reached ({maxTags})
        </p>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Press Enter to add a tag. Use backspace to remove the last tag.
      </p>
    </div>
  );
};

export default TagSelector;