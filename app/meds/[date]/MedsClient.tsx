'use client';

import { useQuery } from '@apollo/client';
import { GET_MED_FORMS_BY_DATE } from '@/lib/graphql/queries';
import type { MedicationForm } from '@/lib/graphql/queries';
import client from '@/lib/apollo-client.client'; // updated path

export default function MedsClient({ date }: { date: string }) {
  const { data, loading, error } = useQuery(GET_MED_FORMS_BY_DATE, {
    variables: { date },
    fetchPolicy: 'no-cache',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const entries: MedicationForm[] = data?.medicationForms || [];

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.medicationEntry.medication}</h3>
          <p>{entry.notes}</p>
        </div>
      ))}
    </div>
  );
}
