// src/components/content/ContentVersions.tsx

'use client';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ContentVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  changes: {
    field: string;
    type: 'added' | 'modified' | 'removed';
  }[];
}

interface ContentVersionsProps {
  contentId: string;
  onRestoreVersion: (versionId: string) => void;
  onCompareVersions: (versionId1: string, versionId2: string) => void;
}

const ContentVersions: React.FC<ContentVersionsProps> = ({
  contentId,
  onRestoreVersion,
  onCompareVersions,
}) => {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  
  // Mock fetch versions
  useEffect(() => {
    const fetchVersions = async () => {
      setIsLoading(true);
      
      try {
        // This would be an API call in a real implementation
        // For now, we'll just fake it with some sample data
        const mockVersions: ContentVersion[] = [
          {
            id: 'v1',
            versionNumber: 3,
            createdAt: new Date().toISOString(),
            createdBy: {
              id: 'user1',
              name: 'Current Version',
            },
            changes: [
              { field: 'title', type: 'modified' },
              { field: 'content', type: 'modified' },
            ],
          },
          {
            id: 'v2',
            versionNumber: 2,
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            createdBy: {
              id: 'user1',
              name: 'John Doe',
            },
            changes: [
              { field: 'content', type: 'modified' },
              { field: 'tags', type: 'added' },
            ],
          },
          {
            id: 'v3',
            versionNumber: 1,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            createdBy: {
              id: 'user1',
              name: 'John Doe',
            },
            changes: [
              { field: 'title', type: 'added' },
              { field: 'content', type: 'added' },
              { field: 'excerpt', type: 'added' },
            ],
          },
        ];
        
        setVersions(mockVersions);
      } catch (error) {
        console.error('Failed to fetch content versions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVersions();
  }, [contentId]);
  
  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      // If already selected, remove it
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      }
      
      // If we already have 2 selections, replace the oldest one
      if (prev.length >= 2) {
        return [prev[1], versionId];
      }
      
      // Otherwise add it
      return [...prev, versionId];
    });
  };
  
  const toggleVersionDetails = (versionId: string) => {
    setExpandedVersion(prev => prev === versionId ? null : versionId);
  };
  
  const formatChangeType = (type: 'added' | 'modified' | 'removed') => {
    switch (type) {
      case 'added':
        return 'bg-green-100 text-green-800';
      case 'modified':
        return 'bg-blue-100 text-blue-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Version History</h3>
        <p className="mt-1 text-sm text-gray-500">
          View and restore previous versions of this content
        </p>
      </div>
      
      {isLoading ? (
        <div className="p-4 text-center">
          <svg 
            className="animate-spin h-6 w-6 text-gray-500 mx-auto" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-sm text-gray-500">Loading versions...</p>
        </div>
      ) : (
        <>
          {selectedVersions.length === 2 && (
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700">
                  <b>2 versions selected.</b> You can compare these versions or restore the older one.
                </p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => onCompareVersions(selectedVersions[0], selectedVersions[1])}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => onRestoreVersion(selectedVersions[0])}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVersions([])}
                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <ul className="divide-y divide-gray-200">
            {versions.map(version => (
              <li key={version.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id={`select-${version.id}`}
                      checked={selectedVersions.includes(version.id)}
                      onChange={() => handleVersionSelect(version.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          Version {version.versionNumber}
                        </span>
                        
                        {version.versionNumber === versions[0].versionNumber && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>By {version.createdBy.name}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => toggleVersionDetails(version.id)}
                        className="mt-1 flex items-center text-xs text-blue-600 hover:text-blue-800"
                      >
                        {expandedVersion === version.id ? (
                          <>
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Hide changes
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Show changes
                          </>
                        )}
                      </button>
                      
                      {expandedVersion === version.id && (
                        <div className="mt-2 bg-gray-50 rounded-md p-2 text-sm">
                          <h4 className="font-medium text-gray-700 mb-1">Changes:</h4>
                          <ul className="space-y-1">
                            {version.changes.map((change, index) => (
                              <li key={index} className="flex items-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${formatChangeType(change.type)}`}>
                                  {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                                </span>
                                <span className="ml-2 text-gray-600">
                                  {change.field.charAt(0).toUpperCase() + change.field.slice(1)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    {version.versionNumber !== versions[0].versionNumber && (
                      <button
                        type="button"
                        onClick={() => onRestoreVersion(version.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ContentVersions;