"use client";

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { 
    gates, zones, services, staff, alerts, recommendations,
    updateGate, pushAdminIncident, dismissAlert, dismissRec 
  } = useSimulation();

  const [incidentText, setIncidentText] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('warning');

  // --- KPI CALCULATIONS ---
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const currentAttendance = zones.reduce((sum, z) => sum + Math.round((z.occupancy / 100) * z.capacity), 0);
  const avgWait = Math.round(gates.filter(g=>g.status!=='closed').reduce((sum, g) => sum + g.waitTime, 0) / Math.max(1, gates.filter(g=>g.status!=='closed').length));
  
  const handleBroadcast = () => {
    if(!incidentText) return;
    pushAdminIncident(incidentSeverity, `ADMIN BROADCAST: ${incidentText}`);
    setIncidentText('');
  }

  const getZoneColor = (occ) => {
    if (occ < 40) return '#22c55e'; // Green
    if (occ <= 65) return '#eab308'; // Yellow
    if (occ <= 85) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }


  return (
    <div style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '1.5rem', zoom: 0.9 }}>
      
      {/* 1. TOP HEADER & KPIs */}
      <header className="flex-between" style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', margin: 0 }}>Central Command Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enterprise Stadium Operations & Intelligence</p>
        </div>
        <div className="flex-center" style={{ gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live Attendance</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{currentAttendance.toLocaleString()} <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>({Math.round((currentAttendance/totalCapacity)*100)}%)</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Gate Wait</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: avgWait > 15 ? 'var(--status-red)' : 'var(--text-main)' }}>{avgWait} mins</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open Incidents</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: alerts.length > 0 ? 'var(--status-yellow)' : 'var(--status-green)' }}>{alerts.length}</div>
          </div>
          <Link href="/" className="btn-primary" style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}>Exit</Link>
        </div>
      </header>

      {/* CORE GRID LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 350px 350px', gap: '1.5rem' }}>
        
        {/* COLUMN 1: HEATMAP & ZONES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-sky)' }}>🌡️ Live Crowd Density Map</h3>
            <div style={{ flex: 1, backgroundColor: '#020617', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
               {/* 2D Stadium Map Overlay */}
               <div style={{ position: 'absolute', inset: '10%', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '120px' }}></div>
               <div style={{ position: 'absolute', inset: '35%', backgroundColor: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '60px' }}></div>
               
               {/* Plotting the 8 required zones dynamically */}
               {zones.map((z, i) => {
                  let pos = {};
                  if(z.id === 'FC') pos = {top: '40%', left: '40%', width: '20%', height: '20%', borderRadius: '50px'};
                  else if(z.id === 'N') pos = {top: '2%', left: '20%', width: '60%', height: '15%', borderRadius: '20px'};
                  else if(z.id === 'S') pos = {bottom: '2%', left: '20%', width: '60%', height: '15%', borderRadius: '20px'};
                  else if(z.id === 'E') pos = {top: '20%', right: '2%', width: '15%', height: '60%', borderRadius: '20px'};
                  else if(z.id === 'W') pos = {top: '20%', left: '2%', width: '15%', height: '60%', borderRadius: '20px'};
                  else if(z.id === 'V') pos = {top: '40%', right: '20%', width: '10%', height: '20%', borderRadius: '10px'};
                  else if(z.id === 'CA') pos = {top: '15%', left: '15%', width: '20%', height: '20%', borderRadius: '100%'}
                  else if(z.id === 'CB') pos = {bottom: '15%', right: '15%', width: '20%', height: '20%', borderRadius: '100%'}

                  const c = getZoneColor(z.occupancy);
                  return (
                    <div key={z.id} style={{ position: 'absolute', background: `radial-gradient(circle, ${c} 0%, transparent 80%)`, opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.4s', ...pos }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textShadow: '0 0 5px black', color: 'white' }}>{z.id}: {z.occupancy}%</span>
                    </div>
                  )
               })}
            </div>
          </div>

          <div className="glass-panel flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
             {zones.map(z => (
               <div key={z.id} style={{ padding: '0.5rem', borderLeft: `3px solid ${getZoneColor(z.occupancy)}`, background: 'rgba(255,255,255,0.02)', width: 'calc(25% - 0.5rem)' }}>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{z.id} - {z.name}</div>
                 <div style={{ fontWeight: 'bold' }}>{z.occupancy}%</div>
               </div>
             ))}
          </div>
        </div>

        {/* COLUMN 2: QUEUES & OPERATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           
           {/* Gate Status Monitoring */}
           <div className="glass-panel" style={{ flex: 1 }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--accent-sky)' }}>🚪 Gate Operations</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {gates.map(g => (
                  <div key={g.id} className="flex-between" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: g.status === 'closed' ? '1px dashed rgba(255,255,255,0.2)' : `1px solid ${g.status === 'congested' ? 'var(--status-red)' : 'rgba(255,255,255,0.1)'}` }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>{g.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.status.toUpperCase()} | {g.throughput} pax/min</span>
                    </div>
                    <div className="flex-center" style={{ gap: '1rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: g.waitTime > 15 ? 'var(--status-red)' : 'var(--text-main)' }}>{g.waitTime}m</span>
                      <button onClick={() => updateGate(g.id, 'status', g.status === 'closed' ? 'open' : 'closed')} style={{ background: g.status === 'closed' ? 'var(--status-green)' : 'var(--bg-dark)', color: 'white', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                         {g.status === 'closed' ? 'Open' : 'Close'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Queue Monitoring System (Services) */}
           <div className="glass-panel" style={{ flex: 1, overflowY: 'auto' }}>
              <h3 style={{ color: 'var(--accent-sky)', marginBottom: '1rem' }}>⏱ Service Queues</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {services.map(s => (
                  <div key={s.id} className="flex-between" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                       <span style={{ fontSize: '0.85rem', display: 'block' }}>{s.name}</span>
                       <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Len: {s.queueLength} | Spd: {s.speed}/m</span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: s.waitTime > 10 ? 'var(--status-yellow)' : 'var(--status-green)' }}>{s.waitTime}m</span>
                  </div>
                ))}
              </div>
           </div>

        </div>

        {/* COLUMN 3: AI ALLOCATION & STAFF */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           
           {/* Dynamic Resource Allocation */}
           <div className="glass-panel" style={{ border: '1px solid var(--accent-sky)', boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)' }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--accent-sky)' }}>🧠 AI Resource Allocation</h3>
                <span className="status-dot green animate-pulse"></span>
              </div>
              {recommendations.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No critical actions recommended. Operations optimal.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   {recommendations.map(req => (
                     <div key={req.id} style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeft: '3px solid var(--accent-sky)', padding: '0.75rem', borderRadius: '4px' }}>
                       <strong style={{ fontSize: '0.85rem', color: 'var(--accent-sky)', display: 'block', marginBottom: '0.2rem' }}>{req.title}</strong>
                       <p style={{ fontSize: '0.75rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{req.desc}</p>
                       <div className="flex-between">
                         <button onClick={() => { req.action(); dismissRec(req.type); }} style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>{req.actionLabel}</button>
                         <button onClick={() => dismissRec(req.type)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>Dismiss</button>
                       </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

           {/* Incident Broadcast */}
           <div className="glass-panel">
              <h3 style={{ color: 'var(--accent-sky)', marginBottom: '1rem' }}>🚨 Broadcast Incident</h3>
              <select value={incidentSeverity} onChange={e => setIncidentSeverity(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: 'var(--bg-dark)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                 <option value="danger">Emergency (Red)</option>
                 <option value="warning">Warning (Yellow)</option>
                 <option value="info">General Info (Blue)</option>
              </select>
              <textarea 
                placeholder="E.g. Medical emergency in North Stand..."
                value={incidentText}
                onChange={e => setIncidentText(e.target.value)}
                style={{ width: '100%', height: '80px', padding: '0.5rem', background: 'var(--bg-dark)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', resize: 'none', marginBottom: '0.5rem', fontFamily: 'inherit', fontSize: '0.85rem' }} 
              />
              <button className="btn-primary" onClick={handleBroadcast} style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem', background: incidentSeverity === 'danger' ? 'var(--status-red)' : '' }}>Push to Mobile & Staff</button>

              {/* Feed Display */}
              <div style={{ marginTop: '1rem', maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {[...alerts].reverse().map(a => (
                   <div key={a.id} className="flex-between" style={{ fontSize: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', borderLeft: `2px solid ${a.type === 'danger' ? 'var(--status-red)' : a.type === 'warning' ? 'var(--status-yellow)' : 'var(--accent-sky)'}` }}>
                      <span style={{flex: 1, marginRight: '0.5rem'}}>{a.msg}</span>
                      <button onClick={() => dismissAlert(a.id)} style={{ background: 'none', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Staff Coordination Panel */}
           <div className="glass-panel" style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--accent-sky)', marginBottom: '1rem' }}>👥 Staff Workforce</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {staff.map(st => (
                   <div key={st.id} style={{ fontSize: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                      <div className="flex-between">
                         <strong>{st.name} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>({st.team})</span></strong>
                         <span style={{ color: st.status === 'Available' ? 'var(--status-green)' : 'var(--status-yellow)' }}>{st.status}</span>
                      </div>
                      <div className="flex-between" style={{ marginTop: '0.2rem' }}>
                         <span style={{ color: 'var(--text-muted)' }}>📍 {st.zone}</span>
                         <span style={{ fontStyle: 'italic', color: 'var(--accent-sky)' }}>{st.task || 'Standby'}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
