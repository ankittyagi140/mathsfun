'use client';
import dynamic from 'next/dynamic';

const EquationBuilder = dynamic(
  () => import('@/components/EquationBuilder'),
  { ssr: false }
);

export default function Page() {
  return <EquationBuilder />;
} 