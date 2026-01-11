import { Suspense } from 'react';
import VerifyForm from './VerifyForm';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <VerifyForm />
    </Suspense>
  );
}
