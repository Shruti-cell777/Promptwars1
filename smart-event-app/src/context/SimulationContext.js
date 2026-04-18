/* eslint-disable */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  // --- CORE ENTITIES ---
  const [gates, setGates] = useState([
    { id: 1, name: "Gate 1 (North)", waitTime: 5, throughput: 42, status: "open", capacity: 80 },
    { id: 2, name: "Gate 2 (East)", waitTime: 12, throughput: 35, status: "open", capacity: 60 },
    { id: 3, name: "Gate 3 (South)", waitTime: 25, throughput: 18, status: "congested", capacity: 95 },
    { id: 4, name: "Gate 4 (West)", waitTime: 2, throughput: 55, status: "open", capacity: 30 },
    { id: 5, name: "Gate 5 (Backup)", waitTime: 0, throughput: 0, status: "closed", capacity: 0 }
  ]);

  const [zones, setZones] = useState([
    { id: 'FC', name: "Field Club", occupancy: 35, capacity: 5000 },
    { id: 'N', name: "North Stand", occupancy: 45, capacity: 12000 },
    { id: 'S', name: "South Stand", occupancy: 20, capacity: 12000 },
    { id: 'E', name: "East Stand", occupancy: 88, capacity: 10000 },
    { id: 'W', name: "West Stand", occupancy: 62, capacity: 10000 },
    { id: 'V', name: "VIP Lounge", occupancy: 95, capacity: 1000 },
    { id: 'CA', name: "Concourse A", occupancy: 75, capacity: 6000 },
    { id: 'CB', name: "Concourse B", occupancy: 50, capacity: 6000 }
  ]);

  const [services, setServices] = useState([
    { id: "s1", name: "Security Lane A", type: "security", waitTime: 12, queueLength: 45, speed: 15, nearestTo: "Gate 1" },
    { id: "s2", name: "Security Lane B", type: "security", waitTime: 4, queueLength: 12, speed: 18, nearestTo: "Gate 2" },
    { id: "f1", name: "Burger Bar (E)", type: "food", waitTime: 15, queueLength: 22, speed: 4, nearestTo: "East Stand",
      menu: [{id: 'b1', name:'Cheeseburger', desc:'Classic', price:8}] },
    { id: "f2", name: "Pizza Counter (N)", type: "food", waitTime: 5, queueLength: 8, speed: 6, nearestTo: "North Stand",
      menu: [{id: 'p1', name:'Slice', desc:'Cheese', price:5}] },
    { id: "f3", name: "Coffee Bar (V)", type: "food", waitTime: 2, queueLength: 3, speed: 5, nearestTo: "VIP Lounge",
      menu: [{id: 'c1', name:'Espresso', desc:'Hot', price:4}] },
    { id: "r1", name: "Washroom Block A", type: "restroom", waitTime: 3, queueLength: 5, speed: 8, nearestTo: "Concourse A" },
    { id: "m1", name: "Merchandise Mega", type: "merch", waitTime: 18, queueLength: 30, speed: 3, nearestTo: "Concourse B" }
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: "Officer Davis", team: "Security", zone: "East Stand", status: "Available", task: null },
    { id: 2, name: "Team Lead Sarah", team: "Operations", zone: "Gate 3", status: "Busy", task: "Crowd Control" },
    { id: 3, name: "Medic Unit 4", team: "Emergency", zone: "North Stand", status: "Available", task: null }
  ]);

  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  // --- REAL-TIME AI SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Jiggle Gates
      setGates(prev => prev.map(g => {
        if (g.status === 'closed') return g;
        let newWait = Math.max(0, g.waitTime + (Math.floor(Math.random() * 5) - 2));
        let tp = Math.max(10, g.throughput + (Math.floor(Math.random() * 6) - 3));
        return { ...g, waitTime: newWait, throughput: tp, status: newWait > 20 ? 'congested' : 'open' };
      }));
      
      // 2. Jiggle Zones
      setZones(prev => prev.map(z => {
        let occ = Math.max(10, Math.min(100, z.occupancy + (Math.floor(Math.random() * 7) - 3)));
        return { ...z, occupancy: occ };
      }));

      // 3. Jiggle Services (Queue tracking)
      setServices(prev => prev.map(s => {
        let q = Math.max(0, s.queueLength + (Math.floor(Math.random() * 5) - 2));
        let wait = Math.round(q / s.speed);
        return { ...s, queueLength: q, waitTime: Math.max(1, wait) };
      }));
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  // --- AI LOGIC: RESOURCE RECOMMENDATIONS ---
  useEffect(() => {
     let newRecs = [];
     
     // Gate Logic
     const congestedGate = gates.find(g => g.waitTime > 15);
     const closedGate = gates.find(g => g.status === 'closed');
     if (congestedGate && closedGate && !recommendations.find(r => r.type === 'gate')) {
       newRecs.push({
         id: Date.now() + 1,
         type: 'gate',
         title: 'High Gate Congestion',
         desc: `${congestedGate.name} wait time exceeds 15 mins. Suggest opening ${closedGate.name}.`,
         actionLabel: `Open ${closedGate.name}`,
         action: () => updateGate(closedGate.id, 'status', 'open')
       });
     }

     // Zone Logic
     const criticalZone = zones.find(z => z.occupancy > 80);
     if (criticalZone && !recommendations.find(r => r.type === 'zone')) {
       newRecs.push({
         id: Date.now() + 2,
         type: 'zone',
         title: 'Critical Occupancy',
         desc: `${criticalZone.name} is above 80% capacity. Suggest deploying Security.`,
         actionLabel: 'Deploy Staff',
         action: () => assignStaffTask(1, `Crowd Control in ${criticalZone.name}`)
       });
     }

     // Service Logic
     const busyService = services.find(s => s.queueLength > 25);
     if (busyService && !recommendations.find(r => r.type === 'service')) {
       newRecs.push({
         id: Date.now() + 3,
         type: 'service',
         title: 'Service Bottleneck',
         desc: `${busyService.name} queue is exceeding safe lengths. Suggest diverting traffic via notification.`,
         actionLabel: 'Broadcast Diversion Warning',
         action: () => pushAdminIncident('warning', `${busyService.name} is congested. Please use alternate counters.`)
       });
     }

     if (newRecs.length > 0) {
       setRecommendations(prev => {
          // keep max 4 recs
          let combo = [...newRecs, ...prev];
          const uniqueIds = Array.from(new Set(combo.map(r => r.type)));
          return uniqueIds.map(t => combo.find(c => c.type === t));
       });
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gates, zones, services]);


  // --- ADMIN ACTIONS ---
  const updateGate = (id, key, val) => {
    setGates(prev => prev.map(g => g.id === id ? { ...g, [key]: val, waitTime: val === 'closed' ? 0 : 5 } : g));
  };

  const assignStaffTask = (id, taskStr) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, task: taskStr, status: 'Busy' } : s));
  };

  const pushAdminIncident = (severity, msg) => {
    setAlerts(prev => [...prev, { id: Date.now(), msg, type: severity }]); // severity: danger, warning, info, success
  };

  const dismissAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const dismissRec = (type) => setRecommendations(prev => prev.filter(r => r.type !== type));

  // User Actions
  const getBestGate = () => [...gates.filter(g=>g.status !== 'closed')].sort((a, b) => a.waitTime - b.waitTime)[0];
  const getNearestFastService = (type) => [...services].filter(s => s.type === type).sort((a, b) => a.waitTime - b.waitTime)[0];
  const placeOrder = (orderPayload) => setAlerts(prev => [...prev, { id: Date.now(), msg: `Order Placed at ${orderPayload.vendor}! Pick up in ${orderPayload.readyIn} mins.`, type: "success" }]);

  return (
    <SimulationContext.Provider value={{ 
      gates, zones, services, staff, alerts, recommendations,
      getBestGate, getNearestFastService, placeOrder,
      updateGate, assignStaffTask, pushAdminIncident, dismissAlert, dismissRec
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  return useContext(SimulationContext);
}
