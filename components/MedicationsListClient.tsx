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
  medicationEntries: MedicationEntry[]; // update to reflect plural after schema change!
  timeGiven: string;
  notes: string;
};

export default function MedicationsListClient() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [todayStr, setTodayStr] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    const localDateStr = today.toLocaleDateString('en-CA'); 
    setSelectedDate(localDateStr);
    setTodayStr(localDateStr);
  }, []);


  const { data, loading, error } = useQuery(GET_MED_FORMS_BY_DATE, {
    variables: { date: selectedDate },
    skip: !selectedDate
  });

  const medicationForms: MedicationForm[] = data?.medicationForms ?? [];

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">
        Medications on {selectedDate || '(choose date)'}
      </h2>

      {todayStr && (
        <input
          type="date"
          value={selectedDate || ''}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 mb-4 w-full"
          max={todayStr || ''}
        />
      )}

      {loading && <p>Loading...</p>}
      {error && <p>Error loading medications</p>}
      {!loading && medicationForms.length === 0 && (
        <p className="text-gray-500 italic">No medications recorded for this date.</p>
      )}

      <ul className="space-y-2">
        {medicationForms.map((form) => (
          <li key={form.id} className="card hover:bg-gray-50 transition">
            {form.medicationEntries?.map((entry, i) => (
              <p key={i}>
                <strong>{entry.medication}</strong> - {entry.quantity} {entry.unit} at {form.timeGiven}
              </p>
            ))}
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
