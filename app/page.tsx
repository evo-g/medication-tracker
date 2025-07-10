'use client';

import ApolloWrapper from './ApolloWrapper';
import MedicationFormClient from '@/components/MedicationFormClient';
import Link from 'next/link';

export default function HomePage() {
  return (
    <ApolloWrapper>
      <div className="max-w-md mx-auto p-4">
        <MedicationFormClient />

        <div className="mt-4 text-center">
          <Link href="/list" className="text-blue-500 hover:underline">
            View Medication List
          </Link>
        </div>
      </div>
    </ApolloWrapper>
  );
}
