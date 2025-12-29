import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import Icon from './AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-onBackground mb-2">Page Not Found</h2>
        <p className="text-onBackground/70 mb-8">
          The page you're looking for doesn't exist. Let's get you back!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => window.history?.back()}
          >
            <Icon name="ArrowLeft" />
            <span className="ml-2">Go Back</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleGoHome}
          >
            <Icon name="Home" />
            <span className="ml-2">Back to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;