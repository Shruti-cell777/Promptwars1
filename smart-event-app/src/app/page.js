"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
        Smart Event Experience Management
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px', lineHeight: '1.6' }}>
        Welcome to the intelligent stadium ecosystem. Navigate to the Venue Command Center to monitor real-time AI analytics, or simulate a spectator&apos;s match-day lifecycle from the Attendee App.
      </p>

      <div className="grid-cols-2" style={{ gap: '2rem', maxWidth: '900px' }}>
        <Link href="/admin" className="glass-panel hover-scale" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', transition: 'transform 0.2s' }}>
           <h2 style={{ color: 'var(--accent-sky)' }}>🏟 Command Center</h2>
           <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Enterprise dashboard for real-time crowd dynamics, heatmaps, queue monitoring, and security alerts.</p>
           <button className="btn-primary" style={{ marginTop: 'auto' }}>Launch Dashboard</button>
        </Link>
        <Link href="/attendee" className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', transition: 'transform 0.2s' }}>
           <h2 style={{ color: 'var(--accent-sky)' }}>📱 Attendee App</h2>
           <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Smart mobile application offering e-ticketing, dynamic wayfinding, and real-time fast-track service routing.</p>
           <button className="btn-primary" style={{ marginTop: 'auto' }}>Open Mobile View</button>
        </Link>
      </div>

      <style jsx>{`
        .hover-scale:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}
