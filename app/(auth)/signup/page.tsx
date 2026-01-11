import { Suspense } from 'react';
import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <SignupForm />
    </Suspense>
  );
}
