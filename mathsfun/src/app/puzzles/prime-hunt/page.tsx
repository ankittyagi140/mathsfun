'use client';
import dynamic from 'next/dynamic';

const PrimeHunt = dynamic(
  () => import('@/components/PrimeHunt'),
  { ssr: false }
);

export default function Page() {
  return <PrimeHunt />;
} 