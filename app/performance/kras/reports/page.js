import { redirect } from 'next/navigation';

export default function LegacyKrasReportsRoute() {
  redirect('/performance/benchmarks');
}
