import { useState } from 'react';
import { Shield, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
interface HiddenContentPlaceholderProps {
  contentType: 'post' | 'comment';
  reason?: string;
  canModerate: boolean;
  onShow?: () => void;
  children: React.ReactNode;
}
export function HiddenContentPlaceholder({
  contentType,
  reason,
  canModerate,
  onShow,
  children
}: HiddenContentPlaceholderProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const handleReveal = () => {
    setIsRevealed(true);
    onShow?.();
  };
  if (isRevealed) {
    return <>{children}</>;
  }
  return <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Shield className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-amber-900">
              Content Hidden
            </h4>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {contentType === 'post' ? 'Post' : 'Comment'}
            </Badge>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            This {contentType} has been hidden by moderators{reason ? `: ${reason}` : '.'}
          </p>
          {canModerate && <Button variant="outline" size="sm" onClick={handleReveal} className="border-amber-300 text-amber-900 hover:bg-amber-100">
              <Eye className="h-4 w-4 mr-2" />
              Show Anyway
            </Button>}
        </div>
      </div>
    </div>;
}