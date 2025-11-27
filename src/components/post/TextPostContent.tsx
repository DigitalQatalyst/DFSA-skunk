import React from 'react';
interface TextPostContentProps {
  content: string;
  content_html?: string;
}
export function TextPostContent({
  content,
  content_html
}: TextPostContentProps) {
  return <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
      {content_html ? <div dangerouslySetInnerHTML={{
      __html: content_html
    }} /> : <p className="whitespace-pre-wrap leading-relaxed">{content}</p>}
    </div>;
}