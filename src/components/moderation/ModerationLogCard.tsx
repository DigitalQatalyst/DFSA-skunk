import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { AlertCircle, CheckCircle, EyeOff, Trash2, AlertTriangle, RotateCcw } from 'lucide-react';
import { ModerationAPI } from '../../services/ModerationAPI';
import { cn } from '../../lib/utils';
type ActionFilter = 'all' | 'warn' | 'hide' | 'approve' | 'delete' | 'restore';
interface ModerationLogCardProps {
  communityIds: string[];
  refreshKey?: number;
}
const getActionIcon = (actionType: string) => {
  switch (actionType.toLowerCase()) {
    case 'warn':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'hide':
    case 'delete':
      return <EyeOff className="h-4 w-4 text-red-500" />;
    case 'approve':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'restore':
      return <RotateCcw className="h-4 w-4 text-blue-500" />;
    case 'dismiss':
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};
const getActionColor = (actionType: string) => {
  switch (actionType.toLowerCase()) {
    case 'warn':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'hide':
    case 'delete':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'approve':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'restore':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'dismiss':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
export function ModerationLogCard({
  communityIds,
  refreshKey
}: ModerationLogCardProps) {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActionFilter>('all');
  useEffect(() => {
    fetchActions();
  }, [communityIds, refreshKey]);
  const fetchActions = async () => {
    if (communityIds.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const recentActions = await ModerationAPI.getRecentActions({
      communityId: communityIds.length === 1 ? communityIds[0] : undefined,
      limit: 15
    });
    if (recentActions) {
      setActions(recentActions);
    }
    setLoading(false);
  };
  const filteredActions = actions.filter(action => {
    if (filter === 'all') return true;
    return action.actionType?.toLowerCase() === filter;
  });
  const filters: {
    value: ActionFilter;
    label: string;
  }[] = [{
    value: 'all',
    label: 'All'
  }, {
    value: 'warn',
    label: 'Warnings'
  }, {
    value: 'hide',
    label: 'Hides'
  }, {
    value: 'approve',
    label: 'Approvals'
  }, {
    value: 'delete',
    label: 'Deletes'
  }, {
    value: 'restore',
    label: 'Restores'
  }];
  if (loading) {
    return <Card>
        <CardHeader>
          <CardTitle>Recent Actions</CardTitle>
          <CardDescription>Latest moderation activity across your communities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        </CardContent>
      </Card>;
  }
  return <Card>
      <CardHeader>
        <CardTitle>Recent Actions</CardTitle>
        <CardDescription>Latest moderation activity across your communities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map(f => <Badge key={f.value} variant={filter === f.value ? 'default' : 'outline'} className="cursor-pointer hover:bg-primary/90 transition-colors" onClick={() => setFilter(f.value)}>
              {f.label}
            </Badge>)}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredActions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">
                {filter === 'all' ? 'No recent actions yet' : `No ${filter} actions found`}
              </p> : filteredActions.map(action => <Card key={action.id} className={cn("rounded-xl border hover:shadow-sm transition-all cursor-pointer", getActionColor(action.actionType))} onClick={() => {
            if (action.targetType === 'post' && action.targetId) {
              window.open(`/post/${action.targetId}`, '_blank');
            }
          }}>
                  <div className="p-3 flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActionIcon(action.actionType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm capitalize mb-1">
                        {action.actionType} by {action.moderatorUsername}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        on {action.targetType}: "{action.description.substring(0, 60)}
                        {action.description.length > 60 ? '...' : ''}"
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{action.communityName}</span>
                        <span>•</span>
                        <span>{format(new Date(action.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                </Card>)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>;
}