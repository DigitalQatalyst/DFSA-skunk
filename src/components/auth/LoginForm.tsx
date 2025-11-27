import { useAuth } from '../../context/UnifiedAuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { LogIn } from 'lucide-react';
import { Button } from '../ui/button';

interface LoginFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export function LoginForm({
  onSuccess,
  compact = false
}: LoginFormProps) {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    // MSAL will handle redirect and callback
    // onSuccess will be called after user returns and is provisioned
    login();
  };

  if (compact) {
    return (
      <div className="flex gap-2 items-center">
        <Button 
          onClick={handleLogin} 
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity h-10"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In with Microsoft
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-[var(--shadow-elegant)] border-border/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in with your Microsoft account to access communities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In with Microsoft
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure authentication powered by Microsoft Entra
          </p>
        </div>
      </CardContent>
    </Card>
  );
}