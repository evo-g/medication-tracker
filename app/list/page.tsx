'use client';

import MedicationsListClient from '@/components/MedicationsListClient';

type Props = {
  params: {
    date: string;
  };
};

export default function Page({ params }: Props) {
  return <MedicationsListClient date={params.date} />;
}
