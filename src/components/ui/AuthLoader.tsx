import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AuthLoader: React.FC<AuthLoaderProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {message}
        </p>
      </div>
    </div>
  );
};

interface AuthFlowLoaderProps {
  stage?: 'auth' | 'organization' | 'onboarding';
}

export const AuthFlowLoader: React.FC<AuthFlowLoaderProps> = ({ stage }) => {
  const messages: Record<string, string> = {
    auth: 'Authenticating...',
    organization: 'Loading organization info...',
    onboarding: 'Checking onboarding status...',
  };

  return <AuthLoader message={messages[stage || 'auth']} size="md" />;
};

