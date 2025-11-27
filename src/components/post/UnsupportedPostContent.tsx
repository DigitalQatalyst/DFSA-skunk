import React from 'react';
import { AlertCircle } from 'lucide-react';
interface UnsupportedPostContentProps {
  post_type?: string;
  content?: string;
}
export function UnsupportedPostContent({
  post_type,
  content
}: UnsupportedPostContentProps) {
  return <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Unsupported Post Type
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This post type "{post_type || 'unknown'}" is not yet supported in
            the current version. The content will be displayed as plain text.
          </p>
          {content && <div className="bg-white border border-gray-200 rounded-lg p-4 mt-2">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {content}
              </p>
            </div>}
        </div>
      </div>
    </div>;
}