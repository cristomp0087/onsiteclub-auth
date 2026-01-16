'use client';

import { AuthCard, Button, Alert } from '@/components';
import { XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface CheckoutMessageProps {
  type: 'error' | 'canceled';
  appDisplayName: string;
  retryUrl: string;
}

export function CheckoutMessage({ type, appDisplayName, retryUrl }: CheckoutMessageProps) {
  const handleRetry = () => {
    window.location.href = retryUrl;
  };

  if (type === 'canceled') {
    return (
      <AuthCard
        title="Checkout Canceled"
        subtitle={appDisplayName}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <Alert
          type="warning"
          message="You canceled the payment process. When you're ready, click below to try again."
          className="mb-6"
        />

        <Button onClick={handleRetry} fullWidth variant="accent">
          <RefreshCw className="w-5 h-5" />
          Try Again
        </Button>

        <p className="text-xs text-center text-onsite-text-muted mt-4">
          You can close this page and return to the app at any time.
        </p>
      </AuthCard>
    );
  }

  // Error state
  return (
    <AuthCard
      title="Checkout Error"
      subtitle={appDisplayName}
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <Alert
        type="error"
        message="An error occurred while starting the payment. Please try again."
        className="mb-6"
      />

      <Button onClick={handleRetry} fullWidth variant="accent">
        <RefreshCw className="w-5 h-5" />
        Try Again
      </Button>

      <p className="text-xs text-center text-onsite-text-muted mt-4">
        If the problem persists, contact{' '}
        <a href="mailto:support@onsiteclub.ca" className="text-onsite-accent hover:underline">
          support@onsiteclub.ca
        </a>
      </p>
    </AuthCard>
  );
}
