'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_MED_FORM } from '@/lib/graphql/mutations/createMedicationForm';
import { PUBLISH_MED_FORM } from '@/lib/graphql/mutations/publishMedicationForm';

type MedicationEntry = {
  medication: string;
  quantity: string;
  unit: string;
};

export default function MedicationFormClient() {
  const [date, setDate] = useState('');
  const [todayStr, setTodayStr] = useState('');
  const [timeGiven, setTimeGiven] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [entries, setEntries] = useState<MedicationEntry[]>([
    { medication: '', quantity: '', unit: '' }
  ]);

  const [createMedForm, { loading: creating }] = useMutation(CREATE_MED_FORM);
  const [publishMedForm, { loading: publishing }] = useMutation(PUBLISH_MED_FORM);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA');
    setDate(today);
    setTodayStr(today);
  }, []);

  const getDefaultUnit = (medication: string) => {
    switch (medication) {
      case 'sinemet':
      case 'venla':
        return 'tablet';
      case 'amantadine':
        return 'pill';
      case 'patch':
        return 'patch';
      default:
        return 'ml';
    }
  };

  const handleEntryChange = (index: number, field: keyof MedicationEntry, value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    if (field === 'medication') updated[index].unit = getDefaultUnit(value);
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { medication: '', quantity: '', unit: '' }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validEntries = entries.filter(entry =>
      entry.medication &&
      entry.unit &&
      entry.quantity &&
      !isNaN(parseInt(entry.quantity)) &&
      parseInt(entry.quantity) > 0
    );

    if (validEntries.length === 0) {
      setFormError("Please add at least one valid medication entry");
      return;
    }

    const createdAt = new Date().toISOString();

    const payload = {
      createdAt,
      date,
      timeGiven,
      notes,
      medicationEntries: {
        create: validEntries.map(entry => ({
          medication: entry.medication,
          quantity: entry.quantity,
          unit: entry.unit,
        })),
      }
    };

    try {
      const { data } = await createMedForm({ variables: payload });
      const id = data?.createMedicationForm?.id;
      if (id) await publishMedForm({ variables: { id } });

      setEntries([{ medication: '', quantity: '', unit: '' }]);
      setTimeGiven('');
      setNotes('');
      setFormError(null);
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong while submitting. Please try again.");
    }
  };


  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Medication(s)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {todayStr && (
          <input
            type="date"
            value={date || ''}
            max={todayStr || ''}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2"
            disabled={!date || !todayStr}
          />
        )}

        {entries.map((entry, index) => (
          <div key={index} className="border p-2 rounded space-y-2">
            <div className="flex justify-between items-center">
              <strong>Medication {index + 1}</strong>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <select
              value={entry.medication}
              onChange={(e) => handleEntryChange(index, 'medication', e.target.value)}
              className="w-full border p-2"
            >
              <option value="">Select Medication</option>
              <option value="sinemet">Sinemet</option>
              <option value="zofran">Zofran</option>
              <option value="amantadine">Amantadine</option>
              <option value="patch">Patch</option>
              <option value="venla">Venla</option>
              <option value="keppra">Keppra</option>
              <option value="lacosamide">Lacosamide</option>
              <option value="gaba">Gaba</option>
              <option value="lactulose">Lactulose</option>
              <option value="tylenol">Tylenol</option>
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={entry.quantity}
              onChange={(e) => handleEntryChange(index, 'quantity', e.target.value)}
              className="w-full border p-2"
            />

            <select
              value={entry.unit}
              onChange={(e) => handleEntryChange(index, 'unit', e.target.value)}
              className="w-full border p-2"
            >
              <option value="">Select Unit</option>
              <option value="ml">ml</option>
              <option value="tablet">tablet</option>
              <option value="pill">pill</option>
              <option value="patch">patch</option>
            </select>
          </div>
        ))}

        <button
          type="button"
          onClick={addEntry}
          className="text-blue-600 underline"
        >
          + Add another medication
        </button>

        <input
          type="text"
          placeholder="Time Given (e.g. 12:00 PM)"
          value={timeGiven}
          onChange={(e) => setTimeGiven(e.target.value)}
          className="w-full border p-2"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2"
        />

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-2">
            {formError}
          </div>
        )}

        <button type="submit" disabled={creating || publishing} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {creating || publishing ? 'Saving...' : 'Submit All'}
        </button>

      </form>

      {entries.some(entry => entry.medication || entry.quantity || entry.unit) && (
        <div className="mt-6">
          <h2 className="font-semibold">Attached medications:</h2>
          <ul className="list-disc list-inside text-sm">
            {entries
              .filter(entry => entry.medication || entry.quantity || entry.unit)
              .map((entry, index) => (
                <li key={index}>
                  {entry.medication && `${entry.medication}`}
                  {entry.quantity && ` - ${entry.quantity}`}
                  {entry.unit && ` ${entry.unit}`}
                </li>
              ))}
          </ul>
          {timeGiven && <p className="text-sm">Time Given: {timeGiven}</p>}
          {notes && <p className="text-sm">Notes: {notes}</p>}
        </div>
      )}
    </div>
  );
}
