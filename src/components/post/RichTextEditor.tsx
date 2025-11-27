import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link2, Code, Quote, BoxIcon } from 'lucide-react';
import './prosemirror.css';
interface RichTextEditorProps {
  content: string;
  onUpdate: (html: string, text: string) => void;
  placeholder?: string;
  maxLength?: number;
  mode?: 'short' | 'long';
  onModeChange?: (mode: 'short' | 'long') => void;
}
export function RichTextEditor({
  content,
  onUpdate,
  placeholder = 'Share your thoughts...',
  maxLength = 1500,
  mode = 'short',
  onModeChange
}: RichTextEditorProps) {
  const [currentMode, setCurrentMode] = useState<'short' | 'long'>(mode);
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        'data-placeholder': placeholder
      }
    },
    onUpdate: ({
      editor
    }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const charCount = text.length;
      // Auto-switch to article mode if exceeds short limit
      if (currentMode === 'short' && charCount > 1500 && onModeChange) {
        setCurrentMode('long');
        onModeChange('long');
      }
      // Prevent exceeding max length
      const effectiveMax = currentMode === 'short' ? 1500 : maxLength;
      if (charCount > effectiveMax) {
        return;
      }
      onUpdate(html, text);
    }
  });
  if (!editor) {
    return null;
  }
  const charCount = editor.getText().length;
  const effectiveMax = currentMode === 'short' ? 1500 : maxLength;
  const percentage = charCount / effectiveMax * 100;
  const getCounterColor = () => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 90) return 'text-yellow-600';
    return 'text-gray-500';
  };
  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    label
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    label: string;
  }) => <button type="button" onClick={onClick} className={`
        px-2 py-1 rounded-md transition-all duration-200 ease-in-out text-sm
        ${isActive ? 'bg-brand-light-blue text-brand-blue' : 'text-gray-600 hover:text-brand-blue'}
      `} title={label}>
      <Icon className="h-4 w-4" />
    </button>;
  return <div className={`border border-gray-300 rounded-md bg-white focus-within:ring-2 ring-brand-teal transition-all duration-200 ${percentage >= 100 ? 'border-red-500' : ''}`}>
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex gap-2 rounded-t-lg flex-wrap">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} label="Bold" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} label="Italic" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({
        level: 2
      }).run()} isActive={editor.isActive('heading', {
        level: 2
      })} icon={BoxIcon} label="Heading" />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} label="Bullet List" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} label="Numbered List" />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} label="Quote" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} label="Code Block" />
      </div>
      {/* Editor - Clickable container */}
      <div className={`cursor-text ${currentMode === 'long' ? 'min-h-[400px]' : 'min-h-[200px]'}`} onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} className={`max-w-none p-3 focus:outline-none
                     ${currentMode === 'long' ? 'prose prose-lg min-h-[400px]' : 'prose prose-sm min-h-[200px]'}
                     [&_.ProseMirror]:${currentMode === 'long' ? 'min-h-[400px]' : 'min-h-[200px]'} 
                     [&_.ProseMirror]:outline-none
                     [&_.ProseMirror]:cursor-text`} />
      </div>
      {/* Character count with mode indicator */}
      <div className="px-3 py-2 text-xs border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <span className={getCounterColor()}>
          {charCount}/{effectiveMax} characters
          {currentMode === 'long' && ' (Article Mode)'}
        </span>
        {percentage >= 100 && <span className="text-red-600 font-medium">
            Character limit reached
          </span>}
      </div>
    </div>;
}