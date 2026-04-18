"use client";

import React, { useState, useEffect } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import Link from 'next/link';

export default function AttendeeApp() {
  const { gates, services, alerts, getBestGate, getNearestFastService, placeOrder } = useSimulation();
  const [activeTab, setActiveTab] = useState('ticket');

  const bestGate = getBestGate();
  const assignedGate = gates.find(g => g.id === 3);
  const shouldReroute = assignedGate?.waitTime > 15;

  // -- Ticket State
  const [facialRecognitionActive, setFacialRecognitionActive] = useState(false);

  // -- Food Ordering State
  const [cart, setCart] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const foodVendors = services.filter(s => s.type === 'food');

  const addToCart = (vendor, item) => {
    setCart(prev => [...prev, { ...item, vendorId: vendor.id, vendorName: vendor.name }]);
  };

  const processPayment = () => {
    placeOrder({ vendor: cart[0].vendorName, readyIn: 5 });
    setCart([]);
    setIsCheckingOut(false);
    setActiveTab('alerts');
  };

  // Nav calculations
  const fastFood = getNearestFastService('food');
  const fastRest = getNearestFastService('restroom');

  return (
    <div style={{ backgroundColor: 'var(--bg-darker)', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      
      {/* Mobile Device Simulator Container */}
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Mock Status Bar */}
        <div className="flex-between" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>9:41</span>
          <div style={{ display: 'flex', gap: '5px' }}><span>LTE</span> <span>100%</span></div>
        </div>

        {/* Global Warning Toaster Wrapper */}
        <div style={{ position: 'absolute', top: '40px', left: 0, right: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
           {alerts.slice(-1).map(a => (
              <div key={a.id} style={{ pointerEvents: 'auto', margin: '0.5rem', padding: '1rem', width: '90%', backgroundColor: a.type === 'danger' ? 'var(--status-red)' : a.type === 'success' ? 'var(--status-green)' : 'var(--status-yellow)', color: a.type === 'yellow' ? 'black' : 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', animation: 'slideDown 0.3s ease' }}>
                <strong style={{ fontSize: '0.9rem' }}>{a.type === 'danger' ? '🚨 EMERGENCY ALERT' : a.type === 'success' ? '✅ SUCCESS' : 'ℹ️ NOTIFICATION'}</strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.9 }}>{a.msg}</p>
              </div>
           ))}
        </div>

        {/* Dynamic Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
          
          {/* TICKET TAB */}
          {activeTab === 'ticket' && (
            <div style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                 <h2 style={{ fontSize: '1.5rem', margin: 0 }}>My Ticket</h2>
                 👤
              </div>

              {shouldReroute && (
                <div className="glass-panel pulse" style={{ border: '1px solid var(--status-yellow)', background: 'rgba(234, 179, 8, 0.1)', marginBottom: '1.5rem', padding: '1rem' }}>
                   <strong style={{ color: 'var(--status-yellow)', display: 'block' }}>Smart Routing Recommends</strong>
                   <span style={{ fontSize: '0.85rem' }}>Assigned {assignedGate.name} is congested. Please route to <strong>{bestGate.name}</strong> to save {assignedGate.waitTime - bestGate.waitTime} minutes!</span>
                </div>
              )}

              <div className="glass-panel" style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderTop: '4px solid var(--accent-sky)', textAlign: 'center', position: 'relative' }}>
                <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>Sektor East</h3>
                  <div className="flex-center" style={{ gap: '1rem', color: 'var(--text-muted)' }}>
                     <span>Row: 14</span><span>|</span><span>Seat: 22B</span>
                  </div>
                </div>
                
                <div style={{ padding: '1rem', background: 'white', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem' }}>
                   {/* Highly Complex Mock QR */}
                   <div style={{ width: '180px', height: '180px', background: 'url(https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg) no-repeat center/contain', opacity: facialRecognitionActive ? 0.3 : 1, transition: '0.3s' }}></div>
                   {facialRecognitionActive && (
                     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--status-green)', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
                       Facial Entry<br/>Verified
                     </div>
                   )}
                </div>

                {/* Facial Recog Toggle */}
                <div className="flex-between" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                   <span style={{ fontSize: '0.85rem' }}>Fast-track Facial Entry</span>
                   <button 
                     onClick={() => setFacialRecognitionActive(!facialRecognitionActive)}
                     style={{ width: '50px', height: '24px', borderRadius: '12px', background: facialRecognitionActive ? 'var(--status-green)' : 'rgba(255,255,255,0.2)', border: 'none', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                      <div style={{ position: 'absolute', top: '2px', left: facialRecognitionActive ? '28px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s' }}/>
                   </button>
                </div>
              </div>
            </div>
          )}

          {/* MAP / NAVIGATION TAB */}
          {activeTab === 'nav' && (
            <div style={{ padding: '0' }}>
               <div style={{ padding: '1.5rem', paddingBottom: '0.5rem' }}>
                 <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Smart Navigator</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time stadium congestion mapping.</p>
               </div>

               {/* Simulated Map Container */}
               <div style={{ height: '350px', width: '100%', position: 'relative', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  {/* Map Grid Pattern */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Dynamic Hotspots driven by SimulationContext */}
                  {gates.map((g, i) => {
                    let color = g.waitTime > 15 ? 'rgba(239, 68, 68, 0.4)' : g.waitTime > 8 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(34, 197, 94, 0.1)';
                    let pos = [{top: '20%', left: '20%'}, {top: '20%', right: '20%'}, {bottom: '20%', left: '20%'}, {bottom: '20%', right: '20%'}][i % 4];
                    return (
                      <div key={g.id} style={{ position: 'absolute', ...pos, width: '100px', height: '100px', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, transform: 'translate(-50%, -50%)' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.7rem', fontWeight: 'bold' }}>{g.name}</div>
                      </div>
                    )
                  })}
                  
                  {/* Fake User Location Pin */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '12px', background: 'var(--accent-sky)', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 10px var(--accent-sky)', animation: 'pulse 2s infinite' }} />
               </div>

               <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Fastest Routes Nearby</h3>
                  <div className="glass-panel flex-between" style={{ marginBottom: '0.75rem', padding: '1rem', borderLeft: '3px solid var(--accent-sky)' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Nearest Quick Entry</span>
                      <strong style={{ fontSize: '1rem' }}>{bestGate.name}</strong>
                    </div>
                    <span style={{ color: 'var(--status-green)', fontWeight: 'bold' }}>{bestGate.waitTime}m wait</span>
                  </div>
                  {fastFood && (
                    <div className="glass-panel flex-between" style={{ marginBottom: '0.75rem', padding: '1rem', borderLeft: '3px solid var(--status-yellow)' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Fastest Food Available</span>
                        <strong style={{ fontSize: '1rem' }}>{fastFood.name}</strong>
                      </div>
                      <span style={{ color: 'var(--status-green)', fontWeight: 'bold' }}>{fastFood.waitTime}m wait</span>
                    </div>
                  )}
                  {fastRest && (
                     <div className="glass-panel flex-between" style={{ padding: '1rem', borderLeft: '3px solid white' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Nearest Washroom</span>
                        <strong style={{ fontSize: '1rem' }}>{fastRest.name}</strong>
                      </div>
                      <span style={{ color: 'var(--status-green)', fontWeight: 'bold' }}>{fastRest.waitTime}m wait</span>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* CONCESSIONS / FOOD TAB */}
          {activeTab === 'food' && (
            <div style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                 <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Concessions</h2>
                 <div style={{ position: 'relative' }}>
                    🍔
                    {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--status-red)', color: 'white', fontSize: '0.7rem', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</span>}
                 </div>
              </div>

              {!isCheckingOut ? (
                <>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Order now to skip the queues during the innings break.</p>
                  
                  {foodVendors.map(vendor => (
                    <div key={vendor.id} style={{ marginBottom: '2rem' }}>
                       <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-sky)' }}>{vendor.name}</h3>
                          <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>Queue: {vendor.waitTime}m</span>
                       </div>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {vendor.menu.map(item => (
                            <div key={item.id} className="glass-panel flex-between" style={{ padding: '1rem' }}>
                               <div>
                                 <strong style={{ display: 'block', fontSize: '0.95rem' }}>{item.name}</strong>
                                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                                 <div style={{ color: 'var(--status-green)', marginTop: '0.25rem', fontSize: '0.9rem' }}>${item.price.toFixed(2)}</div>
                               </div>
                               <button onClick={() => addToCart(vendor, item)} style={{ background: 'var(--accent-blue)', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}

                  {cart.length > 0 && (
                    <button onClick={() => setIsCheckingOut(true)} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', position: 'sticky', bottom: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                       Review Order ({cart.length} items)
                    </button>
                  )}
                </>
              ) : (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                   <h3 style={{ marginBottom: '1.5rem' }}>Checkout Summary</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      {cart.map((c, i) => (
                        <div key={i} className="flex-between">
                           <span style={{ fontSize: '0.9rem' }}>{c.name}</span>
                           <span style={{ fontSize: '0.9rem' }}>${c.price.toFixed(2)}</span>
                        </div>
                      ))}
                   </div>
                   <div className="flex-between" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                      <span>Total</span>
                      <span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                   </div>

                   <button onClick={processPayment} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(to right, #22c55e, #16a34a)', padding: '1rem' }}>
                     Pay via Digital Wallet
                   </button>
                   <button onClick={() => setIsCheckingOut(false)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', marginTop: '1rem', padding: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                </div>
              )}
            </div>
          )}

          {/* ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Notification Center</h2>
              {alerts.length === 0 ? (
                 <p style={{ color: 'var(--text-muted)' }}>No historical alerts.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {[...alerts].reverse().map(a => (
                      <div key={a.id} className="glass-panel" style={{ borderLeft: `4px solid ${a.type === 'danger' ? 'var(--status-red)' : a.type === 'success' ? 'var(--status-green)' : a.type === 'info' ? 'var(--accent-sky)' : 'var(--status-yellow)'}` }}>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Just now</span>
                         <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{a.msg}</p>
                      </div>
                   ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom Tab Bar */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem', paddingBottom: '2rem', zIndex: 10 }}>
           {[
             { id: 'ticket', icon: '🎟', label: 'Ticket' },
             { id: 'nav', icon: '🧭', label: 'Navigate' },
             { id: 'food', icon: '🍔', label: 'Order' },
             { id: 'alerts', icon: '🔔', label: 'Alerts' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{ flex: 1, background: 'none', border: 'none', color: activeTab === tab.id ? 'var(--accent-sky)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', transition: '0.2s' }}>
               <span style={{ fontSize: '1.2rem', transform: activeTab === tab.id ? 'scale(1.2)' : 'scale(1)' }}>{tab.icon}</span>
               <span style={{ fontSize: '0.75rem', fontWeight: activeTab === tab.id ? 'bold' : 'normal' }}>{tab.label}</span>
             </button>
           ))}
        </div>

      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .pulse {
          animation: pulseBorder 2s infinite;
        }
        @keyframes pulseBorder {
          0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }
      `}</style>
    </div>
  );
}
