'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard, Input, Button, Alert } from '@/components';
import { createClient } from '@/lib/supabase/client';
import { formatAuthError, getRedirectUrl, buildCallbackUrl } from '@/lib/utils';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(formatAuthError(authError.message));
        return;
      }

      if (data.session) {
        const redirectUrl = getRedirectUrl(searchParams);
        
        if (redirectUrl.startsWith('onsiteclub://') || 
            redirectUrl.startsWith('onsitecalculator://') || 
            redirectUrl.startsWith('onsitetimekeeper://')) {
          const callbackUrl = buildCallbackUrl(
            redirectUrl,
            data.session.access_token,
            data.session.refresh_token
          );
          window.location.href = callbackUrl;
        } else {
          router.push(redirectUrl);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta OnSite"
    >
      <form onSubmit={handleLogin}>
        {error && (
          <Alert type="error" message={error} className="mb-4" />
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
          autoFocus
        />

        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <div className="flex justify-end mb-6">
          <Link
            href={`/reset-password${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
            className="text-sm text-onsite-text-secondary hover:text-onsite-dark transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
        >
          Entrar
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-onsite-text-secondary">
          Não tem uma conta?{' '}
          <Link
            href={`/signup${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
            className="text-onsite-dark font-medium hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
