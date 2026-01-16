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
        title="Checkout Cancelado"
        subtitle={appDisplayName}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <Alert
          type="warning"
          message="Você cancelou o processo de pagamento. Quando estiver pronto, clique abaixo para tentar novamente."
          className="mb-6"
        />

        <Button onClick={handleRetry} fullWidth variant="accent">
          <RefreshCw className="w-5 h-5" />
          Tentar Novamente
        </Button>

        <p className="text-xs text-center text-onsite-text-muted mt-4">
          Você pode fechar esta página e voltar ao app a qualquer momento.
        </p>
      </AuthCard>
    );
  }

  // Error state
  return (
    <AuthCard
      title="Erro no Checkout"
      subtitle={appDisplayName}
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <Alert
        type="error"
        message="Ocorreu um erro ao iniciar o pagamento. Por favor, tente novamente."
        className="mb-6"
      />

      <Button onClick={handleRetry} fullWidth variant="accent">
        <RefreshCw className="w-5 h-5" />
        Tentar Novamente
      </Button>

      <p className="text-xs text-center text-onsite-text-muted mt-4">
        Se o problema persistir, entre em contato com{' '}
        <a href="mailto:suporte@onsiteclub.ca" className="text-onsite-accent hover:underline">
          suporte@onsiteclub.ca
        </a>
      </p>
    </AuthCard>
  );
}
