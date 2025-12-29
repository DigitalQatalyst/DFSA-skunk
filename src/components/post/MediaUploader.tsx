import React, { useState, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { Button } from '../ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { X, Upload, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
interface UploadedFile {
  id: string;
  url: string;
  type: string;
  size: number;
  caption?: string;
  order: number;
}
interface MediaUploaderProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  userId: string;
  maxFiles?: number;
}
export function MediaUploader({
  files,
  onFilesChange,
  userId,
  maxFiles = 5
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const {
        data,
        error
      } = await supabase.storage.from('community-posts').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (error) throw error;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('community-posts').getPublicUrl(data.path);
      return {
        id: data.path,
        url: publicUrl,
        type: file.type,
        size: file.size,
        order: files.length
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
      return null;
    }
  };
  const handleFiles = async (fileList: FileList) => {
    if (files.length >= maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    const remainingSlots = maxFiles - files.length;
    const filesToUpload = Array.from(fileList).slice(0, remainingSlots);

    // Validate file types and sizes
    const validFiles = filesToUpload.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Only images and videos allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;
    setUploading(true);
    const uploadPromises = validFiles.map(file => uploadFile(file));
    const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean) as UploadedFile[];
    onFilesChange([...files, ...uploadedFiles]);
    setUploading(false);
  };
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [files, maxFiles]);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);
  const removeFile = async (fileId: string) => {
    try {
      // Delete from storage
      await supabase.storage.from('community-posts').remove([fileId]);

      // Remove from state
      onFilesChange(files.filter(f => f.id !== fileId).map((f, i) => ({
        ...f,
        order: i
      })));
      toast.success('File removed');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to remove file');
    }
  };
  const updateCaption = (fileId: string, caption: string) => {
    onFilesChange(files.map(f => f.id === fileId ? {
      ...f,
      caption
    } : f));
  };
  return <div className="space-y-4">
      {/* Upload Area */}
      <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            {uploading ? <Loader2 className="h-6 w-6 text-blue-600 animate-spin" /> : <Upload className="h-6 w-6 text-blue-600" />}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Click or drag files to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Images (JPG, PNG, WebP, GIF) or Videos (MP4) • Max 10MB • Up to {maxFiles} files
            </p>
          </div>

          <Input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime" multiple onChange={e => e.target.files && handleFiles(e.target.files)} disabled={uploading || files.length >= maxFiles} className="hidden" id="media-upload" />
          <Label htmlFor="media-upload" className="cursor-pointer">
            <Button type="button" variant="outline" disabled={uploading || files.length >= maxFiles} asChild>
              <span>Choose Files</span>
            </Button>
          </Label>
        </div>
      </div>

      {/* Uploaded Files Grid */}
      {files.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file, index) => <div key={file.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="relative group">
                {file.type.startsWith('image/') ? <img src={file.url} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-md" /> : <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>}
                
                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFile(file.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Input placeholder="Add caption (optional)" value={file.caption || ''} onChange={e => updateCaption(file.id, e.target.value)} className="text-xs" />

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  {file.type.startsWith('image/') ? <ImageIcon className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <span>#{index + 1}</span>
              </div>
            </div>)}
        </div>}
    </div>;
}