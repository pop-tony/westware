// src/components/BookingForm.jsx
import { useEffect, useState } from 'react';

export default function BookingForm({ selectedItem, preselectedService }) {
  const [form, setForm] = useState({ name: '', date: '', service: 'Styling Consultation' });

  useEffect(() => {
    if (preselectedService) {
      setForm(prev => ({...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const services = [
    'Styling Consultation',
    'Personal Shopping',
    'Hair Styling',
    'Makeup Session',
    'Full Glam Package'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking:', {...form, item: selectedItem });
    alert(`Booked! ${form.service} on ${form.date}. We’ll text you details.`);
  };

  return (
    <section id="book" className="bg-zinc-50 px-4 py-20 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center text-4xl font-bold text-zinc-900 dark:text-white">Book a Session</h2>

        {selectedItem && (
          <div className="mb-8 flex items-center gap-4 rounded-xl bg-white p-4 dark:bg-zinc-900">
            <img src={selectedItem.image} alt={selectedItem.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="text-zinc-900 dark:text-white">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Selected</p>
              <p className="font-semibold">{selectedItem.name}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full rounded-lg bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-rose-500 dark:bg-zinc-900 dark:text-white"
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <select
            className="w-full rounded-lg bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-rose-500 dark:bg-zinc-900 dark:text-white"
            onChange={e => setForm({...form, service: e.target.value})}
            value={form.service}
          >
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            required
            className="w-full rounded-lg bg-white px-4 py-3 text-zinc-900 outline-none focus:ring-2 focus:ring-rose-500 dark:bg-zinc-900 dark:text-white"
            onChange={e => setForm({...form, date: e.target.value})}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-rose-500 py-3 font-bold text-white transition hover:bg-rose-400"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
}