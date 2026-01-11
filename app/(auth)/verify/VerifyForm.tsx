'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard, Button, Alert } from '@/components';
import { createClient } from '@/lib/supabase/client';
import { Mail, RefreshCw } from 'lucide-react';

export default function VerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (!email) return;
    
    setResending(true);
    setError('');
    setResent(false);

    try {
      const supabase = createClient();
      
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setResent(true);
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error('Resend error:', err);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard
      title="Verifique seu email"
      subtitle="Quase lá!"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-onsite-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-onsite-accent" />
        </div>

        {error && (
          <Alert type="error" message={error} className="mb-4" />
        )}

        {resent && (
          <Alert type="success" message="Email reenviado com sucesso!" className="mb-4" />
        )}

        <p className="text-onsite-text-secondary mb-2">
          Enviamos um link de confirmação para:
        </p>
        
        <p className="font-semibold text-onsite-dark mb-6">
          {email || 'seu email'}
        </p>

        <p className="text-sm text-onsite-text-muted mb-6">
          Clique no link do email para ativar sua conta. 
          Verifique também a pasta de spam.
        </p>

        {email && (
          <Button
            variant="secondary"
            onClick={handleResend}
            loading={resending}
            className="mb-4"
          >
            <RefreshCw className="w-4 h-4" />
            Reenviar email
          </Button>
        )}

        <div className="mt-6">
          <Link
            href="/login"
            className="text-sm text-onsite-text-secondary hover:text-onsite-dark transition-colors"
          >
            ← Voltar para login
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
