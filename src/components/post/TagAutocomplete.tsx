import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase/client';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../../components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { X, TrendingUp } from 'lucide-react';
interface TagData {
  tag: string;
  usage_count: number;
}
interface TagAutocompleteProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}
export const TagAutocomplete: React.FC<TagAutocompleteProps> = ({
  selectedTags,
  onTagsChange,
  maxTags = 5
}) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetchPopularTags();
  }, []);
  const fetchPopularTags = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.rpc('get_trending_topics', {
      limit_count: 50
    });
    if (!error && data) {
      setAllTags(data.map((item: any) => ({
        tag: item.tag,
        usage_count: Number(item.post_count)
      })));
    }
    setLoading(false);
  };
  const filteredTags = allTags.filter(tagData => tagData.tag.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tagData.tag));
  const isPopularTag = (usageCount: number) => usageCount >= 3;
  const handleAddTag = (tag: string) => {
    if (selectedTags.length >= maxTags) return;
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onTagsChange([...selectedTags, trimmedTag]);
      setInputValue('');
      setOpen(false);
      inputRef.current?.focus();
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (filteredTags.length > 0) {
        handleAddTag(filteredTags[0].tag);
      } else {
        handleAddTag(inputValue);
      }
    }
  };
  const canAddMoreTags = selectedTags.length < maxTags;
  return <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:bg-muted rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>)}
      </div>

      <Popover open={open && canAddMoreTags} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input ref={inputRef} type="text" placeholder={canAddMoreTags ? "Add tags..." : `Max ${maxTags} tags reached`} value={inputValue} onChange={e => {
            setInputValue(e.target.value);
            setOpen(true);
          }} onKeyDown={handleKeyDown} onFocus={() => setOpen(true)} disabled={!canAddMoreTags} className="w-full" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {selectedTags.length}/{maxTags}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandList>
              {loading ? <div className="p-4 text-sm text-muted-foreground">Loading tags...</div> : <>
                  {filteredTags.length > 0 ? <CommandGroup heading="Existing Tags">
                      {filteredTags.map(tagData => <CommandItem key={tagData.tag} onSelect={() => handleAddTag(tagData.tag)} className="cursor-pointer">
                          <div className="flex items-center justify-between w-full">
                            <span>{tagData.tag}</span>
                            {isPopularTag(tagData.usage_count) && <Badge variant="default" className="ml-2 gap-1 text-xs">
                                <TrendingUp className="h-3 w-3" />
                                {tagData.usage_count}
                              </Badge>}
                          </div>
                        </CommandItem>)}
                    </CommandGroup> : inputValue.trim() ? <CommandEmpty>
                      <div className="p-2">
                        <button type="button" onClick={() => handleAddTag(inputValue)} className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-md">
                          Create new tag: <Badge variant="outline" className="ml-1">{inputValue}</Badge>
                        </button>
                      </div>
                    </CommandEmpty> : <CommandEmpty>Start typing to search or create tags</CommandEmpty>}
                </>}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>;
};