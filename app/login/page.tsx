import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  // ...existing code...
}