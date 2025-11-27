import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { Button } from '../ui/button';
import { Input } from '../../components/ui/input';
import { X, Upload, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
interface UploadedFile {
  id: string;
  url: string;
  type: string;
  caption?: string;
}
interface InlineMediaUploadProps {
  file: UploadedFile | null;
  onFileChange: (file: UploadedFile | null) => void;
  userId: string;
}
export function InlineMediaUpload({
  file,
  onFileChange,
  userId
}: InlineMediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const uploadFile = async (selectedFile: File) => {
    try {
      setUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const {
        data,
        error
      } = await supabase.storage.from('community-posts').upload(fileName, selectedFile, {
        cacheControl: '3600',
        upsert: false
      });
      if (error) throw error;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('community-posts').getPublicUrl(data.path);
      onFileChange({
        id: data.path,
        url: publicUrl,
        type: selectedFile.type
      });
      toast.success('File uploaded');
    } catch (error: any) {
      console.error('Upload error:', error);
      const friendlyMessage = error.message.includes('row-level security') ? 'Upload failed. Please make sure you are signed in.' : `Upload failed: ${error.message}`;
      toast.error(friendlyMessage);
    } finally {
      setUploading(false);
    }
  };
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Use JPG, PNG, WebP, GIF, or MP4.');
      return;
    }
    if (selectedFile.size > maxSize) {
      toast.error('File too large. Max 10MB.');
      return;
    }
    await uploadFile(selectedFile);
  };
  const removeFile = async () => {
    if (!file) return;
    try {
      await supabase.storage.from('community-posts').remove([file.id]);
      onFileChange(null);
      toast.success('File removed');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to remove file');
    }
  };
  const updateCaption = (caption: string) => {
    if (!file) return;
    onFileChange({
      ...file,
      caption
    });
  };
  if (file) {
    return <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
        <div className="relative group">
          {file.type.startsWith('image/') ? <img src={file.url} alt="Upload preview" className="w-full h-32 object-cover rounded-md" /> : <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
              <Video className="h-8 w-8 text-gray-400" />
            </div>}
          
          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Input placeholder="Add caption (optional)" value={file.caption || ''} onChange={e => updateCaption(e.target.value)} className="text-sm" />
      </div>;
  }
  return <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          {uploading ? <Loader2 className="h-5 w-5 text-blue-600 animate-spin" /> : <Upload className="h-5 w-5 text-blue-600" />}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-900">
            {uploading ? 'Uploading...' : 'Upload media'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            JPG, PNG, WebP, GIF, MP4 • Max 10MB
          </p>
        </div>

        <Input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" onChange={handleFileSelect} disabled={uploading} className="hidden" id="inline-media-upload" />
        <label htmlFor="inline-media-upload">
          <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
            <span>Choose File</span>
          </Button>
        </label>
      </div>
    </div>;
}