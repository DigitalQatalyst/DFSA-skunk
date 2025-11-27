import React from 'react';
import { Badge } from '../ui/badge';
import { Shield, EyeOff, AlertCircle } from 'lucide-react';
interface ModerationBadgeProps {
  status: 'flagged' | 'deleted' | 'active';
  className?: string;
}
export function ModerationBadge({
  status,
  className
}: ModerationBadgeProps) {
  const getConfig = () => {
    switch (status) {
      case 'flagged':
        return {
          icon: AlertCircle,
          label: 'Flagged',
          colorClass: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'deleted':
        return {
          icon: EyeOff,
          label: 'Deleted',
          colorClass: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'active':
        return {
          icon: Shield,
          label: 'Active',
          colorClass: 'bg-green-100 text-green-800 border-green-200'
        };
      default:
        return null;
    }
  };
  const config = getConfig();
  if (!config) return null;
  const Icon = config.icon;
  return <Badge className={`text-xs px-2 py-0.5 font-medium border ${config.colorClass} ${className || ''}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>;
}