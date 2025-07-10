'use client';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_MED_FORM } from '@/lib/graphql/mutations/createMedicationForm';
import { PUBLISH_MED_FORM } from '@/lib/graphql/mutations/publishMedicationForm';

type MedicationFormData = {
  medication: string;
  quantity: number;
  unit: string;
  timeGiven: string;
  notes: string;
  date?: string; // ✅ mark as optional
};

export default function MedicationFormClient() {
  const [hydrated, setHydrated] = useState(false); // NEW
  const [formData, setFormData] = useState({
    medication: 'sinemet',
    quantity: '',
    unit: '',
    timeGiven: '',
    notes: '',
    date: ''

  });

  const [createMedForm, { loading: creating }] = useMutation(CREATE_MED_FORM);
  const [publishMedForm, { loading: publishing }] = useMutation(PUBLISH_MED_FORM);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
    setHydrated(true); // NEW
  }, []);

  if (!hydrated) return null; // ✅ skip render until after hydration


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdAt = new Date().toISOString();

    const payload = {
      medicationEntry: {
        medication: formData.medication,
        quantity: formData.quantity,
        unit: formData.unit,
      },
      timeGiven: formData.timeGiven,
      notes: formData.notes,
      date: formData.date,
      createdAt,
    };

    console.log('Payload to send:', payload);

    try {
      const { data } = await createMedForm({ variables: payload });
      const id = data?.createMedicationForm?.id;
      if (id) await publishMedForm({ variables: { id } });
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Medication</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={formData.medication}
          onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
          className="w-full border p-2"
        >
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
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full border p-2"
        />

        <select
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          className="w-full border p-2"
        >
          <option value="">Select Unit</option>
          <option value="ml">ml</option>
          <option value="tablet">tablet</option>
          <option value="patch">patch</option>
        </select>


        <input
          type="text"
          placeholder="Time Given (e.g. 12:00 PM)"
          value={formData.timeGiven}
          onChange={(e) => setFormData({ ...formData, timeGiven: e.target.value })}
          className="w-full border p-2"
        />

        <textarea
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full border p-2"
        />

        {/* 🛠 Guard input until after hydration */}
        {formData.date && (
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border p-2"
          />
        )}

        <button
          type="submit"
          disabled={creating || publishing}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {creating || publishing ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
