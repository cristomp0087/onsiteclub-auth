'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard, Input, Button, Alert } from '@/components';
import { createClient } from '@/lib/supabase/client';
import { formatAuthError, isValidEmail, validatePassword, getRedirectUrl, buildCallbackUrl } from '@/lib/utils';

const TRADES = [
  { value: '', label: 'Selecione sua profissão' },
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'hvac', label: 'HVAC Technician' },
  { value: 'painter', label: 'Painter' },
  { value: 'roofer', label: 'Roofer' },
  { value: 'mason', label: 'Mason' },
  { value: 'welder', label: 'Welder' },
  { value: 'heavy_equipment', label: 'Heavy Equipment Operator' },
  { value: 'laborer', label: 'Laborer' },
  { value: 'supervisor', label: 'Site Supervisor' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'estimator', label: 'Estimator' },
  { value: 'other', label: 'Other' },
];

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    trade: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Nome é obrigatório.';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Sobrenome é obrigatório.';
    }

    if (!isValidEmail(formData.email)) {
      errors.email = 'Email inválido.';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.message!;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            trade: formData.trade,
          },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (authError) {
        setError(formatAuthError(authError.message));
        return;
      }

      if (data.user && !data.session) {
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else if (data.session) {
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
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Comece seu trial de 6 meses grátis"
    >
      <form onSubmit={handleSignup}>
        {error && (
          <Alert type="error" message={error} className="mb-4" />
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nome"
            type="text"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="João"
            required
            autoComplete="given-name"
            autoFocus
            error={fieldErrors.firstName}
          />

          <Input
            label="Sobrenome"
            type="text"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Silva"
            required
            autoComplete="family-name"
            error={fieldErrors.lastName}
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
          error={fieldErrors.email}
        />

        <div className="mb-4">
          <label className="label">Profissão (opcional)</label>
          <select
            value={formData.trade}
            onChange={(e) => updateField('trade', e.target.value)}
            className="input-field"
          >
            {TRADES.map((trade) => (
              <option key={trade.value} value={trade.value}>
                {trade.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Senha"
          type="password"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          autoComplete="new-password"
          error={fieldErrors.password}
        />

        <Input
          label="Confirmar Senha"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          placeholder="Repita a senha"
          required
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />

        <div className="bg-onsite-gray rounded-onsite p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-onsite-accent text-onsite-dark text-xs font-bold px-2 py-1 rounded">
              6 MESES GRÁTIS
            </span>
          </div>
          <p className="text-sm text-onsite-text-secondary">
            Acesso completo a todos os recursos. Sem cartão de crédito necessário.
          </p>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
        >
          Criar Conta Grátis
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-onsite-text-secondary">
          Já tem uma conta?{' '}
          <Link
            href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
            className="text-onsite-dark font-medium hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>

      <p className="text-xs text-onsite-text-muted text-center mt-4">
        Ao criar uma conta, você concorda com nossos{' '}
        <a href="https://onsiteclub.ca/terms" className="underline">
          Termos de Uso
        </a>{' '}
        e{' '}
        <a href="https://onsiteclub.ca/privacy" className="underline">
          Política de Privacidade
        </a>
        .
      </p>
    </AuthCard>
  );
}
