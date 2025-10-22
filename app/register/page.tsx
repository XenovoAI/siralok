import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  // ...existing code...
}