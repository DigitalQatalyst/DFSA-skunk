import React from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../ui/button';
import { X, Plus } from 'lucide-react';
interface PollOptionsInputProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
}
export function PollOptionsInput({
  options,
  onOptionsChange
}: PollOptionsInputProps) {
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };
  const addOption = () => {
    if (options.length < 5) {
      onOptionsChange([...options, '']);
    }
  };
  const removeOption = (index: number) => {
    if (options.length > 2) {
      onOptionsChange(options.filter((_, i) => i !== index));
    }
  };
  return <div className="space-y-2">
      {options.map((option, index) => <div key={index} className="flex items-center gap-2">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            {index + 1}
          </div>
          <Input placeholder={`Option ${index + 1}`} value={option} onChange={e => updateOption(index, e.target.value)} maxLength={100} className="flex-1" />
          {options.length > 2 && <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>}
        </div>)}
      
      {options.length < 5 && <Button type="button" variant="outline" size="sm" onClick={addOption} className="w-full">
          <Plus className="h-4 w-4 mr-1.5" />
          Add option (up to 5)
        </Button>}
    </div>;
}