'use client';

import MedicationsListClient from '@/components/MedicationsListClient';

export default function Page({ params }: { params: { date: string } }) {
  return <MedicationsListClient date={params.date} />;
}
