import { Badge } from '../../components/ui/badge';
import { UserRole, getRoleBadgeVariant, formatRole } from '../hooks/useUserRole';
import { Shield, Star, User } from 'lucide-react';
interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}
export function RoleBadge({
  role,
  size = 'md'
}: RoleBadgeProps) {
  const variant = getRoleBadgeVariant(role);
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const Icon = role === 'admin' ? Shield : role === 'moderator' ? Star : User;
  return <Badge variant={variant} className="gap-1">
      <Icon className={iconSize} />
      {formatRole(role)}
    </Badge>;
}