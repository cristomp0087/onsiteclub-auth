'use client';

import { useEffect, useState } from 'react';
import { AuthCard, Button } from '@/components';
import { CheckCircle, ArrowRight, Smartphone, Monitor } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuccessClientProps {
  appDisplayName: string;
  returnUrl: string;
  isMobileApp: boolean;
  sessionId?: string;
}

export function SuccessClient({
  appDisplayName,
  returnUrl,
  isMobileApp,
}: SuccessClientProps) {
  const [countdown, setCountdown] = useState(10);

  // Confetti effect on mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F6C343', '#1B2B27', '#10B981'],
    });
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      handleReturn();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleReturn = () => {
    window.location.href = returnUrl;
  };

  return (
    <AuthCard
      title="Payment Confirmed!"
      subtitle={`Your ${appDisplayName} subscription is now active`}
    >
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-6">
        <p className="text-onsite-text-secondary mb-2">
          Thank you for subscribing! All premium features are now available.
        </p>
        <p className="text-sm text-onsite-text-muted">
          A receipt has been sent to your email.
        </p>
      </div>

      {/* Return Instructions */}
      <div className="bg-onsite-gray rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          {isMobileApp ? (
            <Smartphone className="w-5 h-5 text-onsite-accent" />
          ) : (
            <Monitor className="w-5 h-5 text-onsite-accent" />
          )}
          <span className="font-medium text-onsite-dark">
            {isMobileApp ? 'Return to App' : 'Return to Website'}
          </span>
        </div>
        <p className="text-sm text-onsite-text-secondary">
          {isMobileApp
            ? 'Click the button below to return to the app and start using premium features.'
            : 'You will be redirected automatically or click the button below.'}
        </p>
      </div>

      {/* Return Button */}
      <Button
        onClick={handleReturn}
        fullWidth
        variant="accent"
        className="mb-4"
      >
        <ArrowRight className="w-5 h-5" />
        {isMobileApp ? 'Open App' : 'Return to Website'}
        <span className="text-sm opacity-75">({countdown}s)</span>
      </Button>

      {/* Help Text */}
      <p className="text-xs text-center text-onsite-text-muted">
        {isMobileApp
          ? 'If the app doesn\'t open automatically, make sure it\'s installed on your device.'
          : 'You will be redirected automatically in a few seconds.'}
      </p>

      {/* Manage Subscription Link */}
      <div className="mt-6 pt-4 border-t border-onsite-gray">
        <p className="text-xs text-center text-onsite-text-muted">
          Need to manage your subscription?{' '}
          <a href="/manage" className="text-onsite-accent hover:underline">
            Click here
          </a>
        </p>
      </div>
    </AuthCard>
  );
}
