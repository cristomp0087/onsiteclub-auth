'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthCard, Input, Button, Alert } from '@/components';
import { createClient } from '@/lib/supabase/client';
import { isValidEmail } from '@/lib/utils';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/callback?next=/update-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard
        title="Email enviado"
        subtitle="Verifique sua caixa de entrada"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-green-600" />
          </div>

          <p className="text-onsite-text-secondary mb-2">
            Enviamos um link de redefinição para:
          </p>
          
          <p className="font-semibold text-onsite-dark mb-6">
            {email}
          </p>

          <p className="text-sm text-onsite-text-muted mb-6">
            Clique no link do email para criar uma nova senha.
            O link expira em 1 hora.
          </p>

          <Link href="/login">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4" />
              Voltar para login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Esqueceu a senha?"
      subtitle="Enviaremos um link para redefinir"
    >
      <form onSubmit={handleSubmit}>
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

        <Button
          type="submit"
          fullWidth
          loading={loading}
          className="mt-2"
        >
          Enviar link de redefinição
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-onsite-text-secondary hover:text-onsite-dark transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </Link>
      </div>
    </AuthCard>
  );
}
