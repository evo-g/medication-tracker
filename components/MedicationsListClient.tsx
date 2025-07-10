'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MED_FORMS_BY_DATE } from '@/lib/graphql/queries/getMedicationFormsByDate';
import Link from 'next/link';

type MedicationEntry = {
  medication: string;
  quantity: number;
  unit: string;
};

type MedicationForm = {
  id: string;
  medicationEntry: MedicationEntry;
  timeGiven: string;
  notes: string;
};

type MedicationsListClientProps = {
  date: string;
};

export default function MedicationsListClient({ date }: MedicationsListClientProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const { data, loading, error } = useQuery(GET_MED_FORMS_BY_DATE, {
    variables: { date: selectedDate },
    skip: !selectedDate
  });

  const medicationForms: MedicationForm[] = data?.medicationForms ?? [];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Medications on {selectedDate}</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border p-2 mb-4 w-full"
        max={todayStr}
      />

      {loading && <p>Loading...</p>}
      {error && <p>Error loading medications</p>}
      {!loading && medicationForms.length === 0 && (
        <p className="text-gray-500 italic">No medications recorded for this date.</p>
      )}

      <ul className="space-y-2">
        {medicationForms.map((form) => (
          <li key={form.id} className="border p-2 rounded hover:bg-gray-100">
            <p>
              <strong>{form.medicationEntry.medication}</strong> - {form.medicationEntry.quantity} {form.medicationEntry.unit} at {form.timeGiven}
            </p>
            {form.notes && form.notes.length > 50 ? (
              <details>
                <summary>Show notes</summary>
                <p>{form.notes}</p>
              </details>
            ) : (
              <p className="text-sm text-gray-500">{form.notes}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 text-center">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
