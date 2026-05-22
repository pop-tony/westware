// src/components/NewsletterSignup.jsx
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribe:', email);
    alert('Welcome to AURA Luxe! Check your email for 10% off.');
    setEmail('');
  };

  return (
    <section className="bg-rose-500 px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-bold">Join the AURA List</h2>
        <p className="mb-8 text-rose-100">Get first access to drops, styling tips, and exclusive events in Accra.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder="Your email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 rounded-full px-6 py-3 text-black outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-zinc-800"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}