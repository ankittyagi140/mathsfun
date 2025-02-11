'use client';
import dynamic from 'next/dynamic';

const EquationBalancer = dynamic(
  () => import('@/components/EquationBalancer'),
  { ssr: false }
);

export default function Page() {
  return <EquationBalancer />;
}