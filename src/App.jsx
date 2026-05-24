import { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Zap, Package, ShieldCheck, RotateCcw, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Sun } from 'lucide-react';

// ============================================================================
// GAME CONSTANTS
// ============================================================================

const STRATEGIES = {
  lean: {
    key: 'lean',
    name: 'Lean / JIT',
    tagline: 'Minimize inventory. Maximize cash velocity.',
    startInventory: 25,
    baseReplenish: 30,
    holdingCost: 2,
    unitCost: 80,
    supplierRedundancy: false,
    description: 'You hold almost nothing. Capital is free. But when the world hiccups, you bleed.',
    bestFor: 'Calm, predictable years',
    weakAgainst: 'Demand spikes, supplier failures',
    icon: 'lean',
  },
  buffered: {
    key: 'buffered',
    name: 'Safety Stock',
    tagline: 'Hold inventory. Sleep at night.',
    startInventory: 70,
    baseReplenish: 30,
    holdingCost: 5,
    unitCost: 80,
    supplierRedundancy: false,
    description: 'You carry weeks of cover. It costs you, but you can absorb almost any demand shock.',
    bestFor: 'Volatile demand',
    weakAgainst: 'Long supplier outages, recessions',
    icon: 'buffered',
  },
  dual: {
    key: 'dual',
    name: 'Dual Source',
    tagline: 'Pay a premium. Sleep through supplier crises.',
    startInventory: 35,
    baseReplenish: 30,
    holdingCost: 4,
    unitCost: 92,
    supplierRedundancy: true,
    description: 'Two qualified suppliers, geographically split. If one falls, the other rises.',
    bestFor: 'Supply-side shocks',
    weakAgainst: 'Margin-thin calm years',
    icon: 'dual',
  },
};

const PRICE_PER_UNIT = 200;
const STOCKOUT_REPUTATION_HIT = 4;
const STARTING_CASH = 50000;

const EVENTS = [
  {
    id: 'calm-1', severity: 'calm', title: 'Steady State',
    flavor: 'Operations are quiet. Forecasts are on target. Nothing to do but execute.',
    demand: [28, 35], choices: null,
  },
  {
    id: 'calm-2', severity: 'calm', title: 'Forecast On Target',
    flavor: 'Sales matches plan. The S&OP team is, briefly, smug.',
    demand: [27, 33], choices: null,
  },
  {
    id: 'calm-3', severity: 'calm', title: 'Quiet Month',
    flavor: 'Nothing to report. Enjoy it.',
    demand: [29, 34], choices: null,
  },
  {
    id: 'viral', severity: 'opportunity', title: 'Viral Moment',
    flavor: 'A creator with 4M followers posted a glowing review. Demand has nearly doubled overnight.',
    demand: [55, 70],
    choices: [
      { label: 'Air-freight an emergency lot', detail: '+25 units · costs $4,000', preview: 'inv-up', effect: { extraInventory: 25, cashCost: 4000 } },
      { label: 'Ride the wave; let stockouts happen', detail: 'Save cash · lose sales', preview: 'stockout', effect: {} },
    ],
  },
  {
    id: 'holiday', severity: 'opportunity', title: 'Holiday Surge',
    flavor: 'Seasonal demand is up roughly 50%. Your team saw this coming — but did you order enough?',
    demand: [42, 52],
    choices: [
      { label: 'Run an extra production shift', detail: '+15 units · costs $2,000', preview: 'inv-up', effect: { extraInventory: 15, cashCost: 2000 } },
      { label: 'Hold the line on costs', detail: 'No extra spend', preview: 'flat', effect: {} },
    ],
  },
  {
    id: 'supplier-fail', severity: 'crisis', title: 'Supplier Bankruptcy',
    flavor: 'Your primary supplier just filed Chapter 11. Two months of inbound shipments are frozen in their warehouse.',
    demand: [28, 35], supplierEvent: true,
    choices: [
      { label: 'Source from the spot market', detail: '+$60/unit for 2 months', preview: 'cash-down', effect: { unitCostBump: 60, costBumpDuration: 2 } },
      { label: 'Wait it out — no replenishment for 2 months', detail: 'Save cash · pray for inventory', preview: 'inv-down', effect: { skipReplenish: 2 } },
    ],
  },
  {
    id: 'port-strike', severity: 'crisis', title: 'Port Strike',
    flavor: 'Longshoremen walked off the job. This month\'s replenishment is sitting in a container ship offshore.',
    demand: [28, 35],
    choices: [
      { label: 'Air-freight at premium', detail: 'Costs $5,500 · units land on time', preview: 'cash-down', effect: { cashCost: 5500 } },
      { label: 'Wait — replenishment delayed 1 month', detail: 'No cash cost · units come next month', preview: 'inv-down', effect: { skipReplenish: 1 } },
    ],
  },
  {
    id: 'tariff', severity: 'crisis', title: 'Tariff Shock',
    flavor: 'A surprise 25% tariff just hit your import category. Every unit now costs $20 more to land.',
    demand: [27, 33],
    choices: [
      { label: 'Absorb the cost', detail: 'Margin compresses for 3 months', preview: 'cash-down', effect: { unitCostBump: 20, costBumpDuration: 3 } },
      { label: 'Pre-buy a hedge of inventory', detail: 'Costs $6,000 now · no impact later', preview: 'inv-up', effect: { cashCost: 6000, extraInventory: 30 } },
    ],
  },
  {
    id: 'recall', severity: 'crisis', title: 'Quality Recall',
    flavor: 'QA found a defect in a recent lot. Roughly a third of your inventory must be quarantined.',
    demand: [28, 35],
    choices: [
      { label: 'Quarantine the lot · 33% inventory loss', detail: 'Clean break · no further risk', preview: 'inv-down', effect: { inventoryLossPct: 0.33 } },
      { label: 'Rework over 2 months · 15% loss', detail: 'Costs $3,000 in rework labor', preview: 'cash-down', effect: { inventoryLossPct: 0.15, cashCost: 3000 } },
    ],
  },
  {
    id: 'recession', severity: 'slump', title: 'Recession Headlines',
    flavor: 'Consumer confidence hit a 5-year low. Channel partners are pulling back orders for the next 2 months.',
    demand: [16, 22], lingering: { months: 2, demandMultiplier: 0.65 },
    choices: [
      { label: 'Cut replenishment by 50% for 2 months', detail: 'Right-size with demand', preview: 'flat', effect: { replenishCut: 0.5, replenishCutDuration: 2 } },
      { label: 'Hold the line — bet on rebound', detail: 'Keep inventory flowing', preview: 'inv-up', effect: {} },
    ],
  },
  {
    id: 'competitor', severity: 'slump', title: 'New Competitor',
    flavor: 'A well-funded entrant just launched at 20% below your price. Distributors are reshuffling.',
    demand: [18, 24], lingering: { months: 3, demandMultiplier: 0.7 },
    choices: [
      { label: 'Launch a counter-promotion', detail: '$3,500 spend · partially restores demand', preview: 'cash-down', effect: { cashCost: 3500, demandRestore: 0.85 } },
      { label: 'Hold price and ride it out', detail: 'No spend · accept lower volume', preview: 'flat', effect: {} },
    ],
  },
];

// ============================================================================
// GAME LOGIC
// ============================================================================

function shuffleDeck(seed) {
  const calms = EVENTS.filter(e => e.severity === 'calm');
  const disruptions = EVENTS.filter(e => e.severity !== 'calm');
  let rng = seedRng(seed);
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const chosen = [
    ...shuffle(calms).slice(0, 3),
    ...shuffle(disruptions).slice(0, 6),
    ...shuffle(disruptions).slice(0, 3),
  ];
  const final = shuffle(chosen);
  const calmIdx = final.findIndex(e => e.severity === 'calm');
  if (calmIdx > 0) [final[0], final[calmIdx]] = [final[calmIdx], final[0]];
  return final.slice(0, 12);
}

function seedRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function randInt(rng, [lo, hi]) {
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

function simulateYear(strategyKey, eventSeq, playerDecisions = null, seed = 1) {
  const strat = STRATEGIES[strategyKey];
  const rng = seedRng(seed + strategyKey.length * 1000);

  let cash = STARTING_CASH;
  let inventory = strat.startInventory;
  let reputation = 100;
  let unitCostBump = 0;
  let unitCostBumpRemaining = 0;
  let skipReplenishRemaining = 0;
  let replenishCutPct = 0;
  let replenishCutRemaining = 0;
  let lingeringDemandMult = 1;
  let lingeringRemaining = 0;

  const history = [];
  let totalDemand = 0;
  let totalFulfilled = 0;
  let stockoutMonths = 0;

  for (let m = 0; m < eventSeq.length; m++) {
    const event = eventSeq[m];
    let demand = randInt(rng, event.demand);
    if (lingeringRemaining > 0) {
      demand = Math.round(demand * lingeringDemandMult);
      lingeringRemaining--;
    }

    const decision = playerDecisions
      ? playerDecisions[m]
      : event.choices ? heuristicDecision(strat, event) : -1;

    let extraInventory = 0;
    let cashCost = 0;
    let inventoryLossPct = 0;
    let demandRestoreMult = 1;

    if (event.choices && decision >= 0 && event.choices[decision]) {
      const eff = event.choices[decision].effect;
      if (eff.extraInventory) extraInventory += eff.extraInventory;
      if (eff.cashCost) cashCost += eff.cashCost;
      if (eff.unitCostBump) { unitCostBump = eff.unitCostBump; unitCostBumpRemaining = eff.costBumpDuration || 1; }
      if (eff.skipReplenish) skipReplenishRemaining = eff.skipReplenish;
      if (eff.replenishCut) { replenishCutPct = eff.replenishCut; replenishCutRemaining = eff.replenishCutDuration || 1; }
      if (eff.inventoryLossPct) inventoryLossPct = eff.inventoryLossPct;
      if (eff.demandRestore) demandRestoreMult = eff.demandRestore;
    }

    let supplierImmune = false;
    if (event.supplierEvent && strat.supplierRedundancy) {
      supplierImmune = true;
      unitCostBump = 0; unitCostBumpRemaining = 0; skipReplenishRemaining = 0;
    }

    if (inventoryLossPct > 0) inventory = Math.floor(inventory * (1 - inventoryLossPct));

    let replenish = 0;
    if (skipReplenishRemaining > 0) {
      skipReplenishRemaining--;
    } else {
      replenish = strat.baseReplenish;
      if (replenishCutRemaining > 0) {
        replenish = Math.floor(replenish * (1 - replenishCutPct));
        replenishCutRemaining--;
      }
      cash -= replenish * (strat.unitCost + unitCostBump);
      inventory += replenish;
    }

    inventory += extraInventory;
    cash -= cashCost;
    demand = Math.round(demand * demandRestoreMult);

    if (event.lingering && lingeringRemaining === 0) {
      lingeringDemandMult = event.lingering.demandMultiplier;
      lingeringRemaining = event.lingering.months;
    }

    const fulfilled = Math.min(inventory, demand);
    const stockout = demand - fulfilled;
    inventory -= fulfilled;
    cash += fulfilled * PRICE_PER_UNIT;
    cash -= inventory * strat.holdingCost;

    if (stockout > 0) { reputation -= STOCKOUT_REPUTATION_HIT; stockoutMonths++; }
    reputation = Math.max(0, Math.min(100, reputation));

    if (unitCostBumpRemaining > 0) {
      unitCostBumpRemaining--;
      if (unitCostBumpRemaining === 0) unitCostBump = 0;
    }

    totalDemand += demand;
    totalFulfilled += fulfilled;

    history.push({
      month: m + 1, event: event.title, eventId: event.id, severity: event.severity,
      demand, fulfilled, stockout, inventory, cash: Math.round(cash), reputation,
      replenish, supplierImmune,
      decision: decision >= 0 && event.choices ? event.choices[decision].label : null,
    });
  }

  const fillRate = totalDemand > 0 ? (totalFulfilled / totalDemand) * 100 : 100;
  return { history, cash, reputation, fillRate, stockoutMonths, totalDemand, totalFulfilled };
}

function heuristicDecision(strat, event) {
  if (!event.choices) return -1;
  if (strat.key === 'lean') {
    for (let i = 0; i < event.choices.length; i++) if (!event.choices[i].effect.cashCost) return i;
    return 1;
  }
  if (strat.key === 'buffered') {
    for (let i = 0; i < event.choices.length; i++) {
      const eff = event.choices[i].effect;
      if (eff.extraInventory || eff.unitCostBump) return i;
    }
    return 0;
  }
  return 0;
}

// ============================================================================
// STYLES (injected once at app root)
// ============================================================================

const GAME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --paper: #f4ecd8;
    --paper-warm: #faf3df;
    --paper-dark: #e8dcbf;
    --ink: #1c1f2b;
    --ink-soft: #5b6478;
    --rust: #b8412b;
    --rust-bright: #d4571a;
    --moss: #1e4d3c;
    --sage: #6b8e6e;
    --amber: #c8861a;
    --sky-deep: #2b5470;
    --sky-light: #b8d4d9;
    --tan: #c9bc99;
    --water: #6ba0a8;
    --gold: #d4a017;
  }

  .game-root { font-family: 'DM Sans', system-ui, sans-serif; color: var(--ink); }
  .game-root .font-display { font-family: 'Fraunces', Georgia, serif; }
  .game-root .font-display-italic { font-family: 'Fraunces', Georgia, serif; font-style: italic; }
  .game-root .font-mono { font-family: 'JetBrains Mono', monospace; }

  .bg-paper { background-color: var(--paper); }
  .bg-paper-warm { background-color: var(--paper-warm); }
  .bg-paper-dark { background-color: var(--paper-dark); }
  .text-ink { color: var(--ink); }
  .text-ink-soft { color: var(--ink-soft); }
  .text-rust { color: var(--rust); }
  .text-rust-bright { color: var(--rust-bright); }
  .text-moss { color: var(--moss); }
  .text-amber-game { color: var(--amber); }
  .bg-rust { background-color: var(--rust); }
  .bg-rust-bright { background-color: var(--rust-bright); }
  .bg-moss { background-color: var(--moss); }
  .bg-sage { background-color: var(--sage); }
  .bg-amber-game { background-color: var(--amber); }
  .bg-sky-deep { background-color: var(--sky-deep); }
  .border-tan { border-color: var(--tan); }
  .border-ink { border-color: var(--ink); }

  /* Paper texture overlay */
  .paper-texture {
    background-color: var(--paper);
    background-image:
      radial-gradient(circle at 20% 30%, rgba(184, 159, 107, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 70% 70%, rgba(184, 159, 107, 0.06) 1px, transparent 1px),
      radial-gradient(circle at 40% 80%, rgba(184, 159, 107, 0.05) 1px, transparent 1px);
    background-size: 80px 80px, 60px 60px, 100px 100px;
  }

  /* === SUPPLY CHAIN SCENE ANIMATIONS === */
  @keyframes conveyor {
    from { transform: translateX(-80px); }
    to { transform: translateX(1480px); }
  }
  @keyframes conveyor-slow {
    from { transform: translateX(-80px); }
    to { transform: translateX(1480px); }
  }
  @keyframes smoke-rise {
    0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
    100% { transform: translate(8px, -50px) scale(2.4); opacity: 0; }
  }
  @keyframes ship-bob {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50% { transform: translateY(-3px) rotate(1deg); }
  }
  @keyframes wave-flow {
    from { transform: translateX(0); }
    to { transform: translateX(-40px); }
  }
  @keyframes crane-swing {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(8deg); }
  }
  @keyframes truck-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
  @keyframes door-flap {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(0.92); }
  }
  @keyframes flag-wave {
    0%, 100% { transform: skewX(-3deg); }
    50% { transform: skewX(3deg); }
  }
  @keyframes shake-x {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-2px); }
    40%, 80% { transform: translateX(2px); }
  }
  @keyframes pulse-warn {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes drop-stamp {
    0% { transform: scale(2.5) rotate(-15deg); opacity: 0; }
    60% { transform: scale(0.9) rotate(-12deg); opacity: 1; }
    100% { transform: scale(1) rotate(-12deg); opacity: 1; }
  }
  @keyframes slide-from-top {
    0% { transform: translateY(-30px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes slam-in {
    0% { transform: scale(0.85) translateY(20px); opacity: 0; }
    55% { transform: scale(1.03) translateY(-4px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes hearts-float {
    0% { transform: translateY(0) scale(0.8); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
  }
  @keyframes line-down {
    0% { transform: translateY(-20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  .smoke { animation: smoke-rise 3s ease-out infinite; transform-origin: center; }
  .smoke-2 { animation: smoke-rise 3s ease-out infinite; animation-delay: -1s; }
  .smoke-3 { animation: smoke-rise 3s ease-out infinite; animation-delay: -2s; }
  .factory-dead .smoke,
  .factory-dead .smoke-2,
  .factory-dead .smoke-3 { animation: none; opacity: 0; }
  .factory-dead .factory-body { fill: var(--ink-soft); }

  .ship-anim { animation: ship-bob 3s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
  .ship-stopped { animation: none; }
  .ship-stopped .ship-anim { animation: none; }

  .wave { animation: wave-flow 4s linear infinite; }
  .crane-arm { animation: crane-swing 4s ease-in-out infinite; transform-origin: 510px 60px; transform-box: fill-box; }
  .crane-paused { animation: none; }

  .package { animation: conveyor 14s linear infinite; }
  .package-slow { animation-duration: 22s; }
  .scene-recession .package { animation-duration: 22s; opacity: 0.65; }
  .scene-recession .package-3, .scene-recession .package-4 { opacity: 0; }
  .scene-viral .package { animation-duration: 7s; }

  .truck { animation: truck-bounce 0.6s ease-in-out infinite; transform-origin: bottom; transform-box: fill-box; }
  .flag-wave { animation: flag-wave 1.5s ease-in-out infinite; transform-origin: left center; transform-box: fill-box; }

  .crisis-shake { animation: shake-x 0.4s ease-in-out 3; }
  .pulse-warn { animation: pulse-warn 1.4s ease-in-out infinite; }
  .stamp { animation: drop-stamp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform-origin: center; transform-box: fill-box; }
  .slide-top { animation: slide-from-top 0.5s ease-out forwards; }
  .slam-in { animation: slam-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .fade-up { animation: fade-up 0.45s ease-out forwards; opacity: 0; }
  .fade-up-1 { animation-delay: 0.15s; }
  .fade-up-2 { animation-delay: 0.3s; }
  .fade-up-3 { animation-delay: 0.45s; }
  .fade-in { animation: fade-in 0.5s ease-out forwards; }
  .hearts { animation: hearts-float 1.6s ease-out infinite; }
  .hearts-2 { animation: hearts-float 1.6s ease-out infinite; animation-delay: -0.5s; }
  .hearts-3 { animation: hearts-float 1.6s ease-out infinite; animation-delay: -1s; }
  .line-down { animation: line-down 0.6s ease-out forwards; }

  .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
  .hover-lift:hover { transform: translateY(-2px); }

  .choice-card { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
  .choice-card:hover:not(:disabled) {
    border-color: var(--rust-bright);
    box-shadow: 0 8px 20px -8px rgba(180, 70, 40, 0.3);
    transform: translateY(-3px);
  }
  .choice-card:hover .choice-preview { opacity: 1; }
  .choice-preview { opacity: 0; transition: opacity 0.25s ease; }

  .grain {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  }
`;

// ============================================================================
// SUPPLY CHAIN SCENE (animated background)
// ============================================================================

function SupplyChainScene({ event, monthKey }) {
  const eid = event?.id || '';
  const sev = event?.severity || 'calm';
  const supplierFail = eid === 'supplier-fail';
  const portStrike = eid === 'port-strike';
  const tariff = eid === 'tariff';
  const recall = eid === 'recall';
  const viral = eid === 'viral' || eid === 'holiday';
  const slump = sev === 'slump';

  return (
    <div className="relative w-full h-44 bg-gradient-to-b from-[#f9e9b8] to-[#f4ecd8] border-y-2 border-tan overflow-hidden" key={monthKey}>
      {/* sun */}
      <svg viewBox="0 0 1400 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <circle cx="700" cy="30" r="18" fill="#f5c11e" opacity={slump ? 0.4 : 0.9} />
        {!slump && [0,1,2,3,4,5,6,7].map(i => (
          <line key={i} x1="700" y1="30" x2={700 + Math.cos(i*Math.PI/4)*32} y2={30 + Math.sin(i*Math.PI/4)*32}
                stroke="#f5c11e" strokeWidth="2" opacity="0.5" />
        ))}

        {/* ground */}
        <line x1="0" y1="150" x2="1400" y2="150" stroke="#7a6f4f" strokeWidth="2" />
        <rect x="0" y="150" width="1400" height="30" fill="#d8c89b" opacity="0.4" />

        {/* === FACTORY === */}
        <g className={supplierFail ? 'factory-dead' : ''}>
          {/* smokestack */}
          <rect x="78" y="55" width="14" height="48" fill="#3a3027" />
          <rect x="74" y="52" width="22" height="6" fill="#2a221b" />
          {/* smoke puffs */}
          <g className={supplierFail ? '' : ''}>
            <circle cx="85" cy="48" r="7" fill="#cdc3a8" className="smoke" />
            <circle cx="85" cy="48" r="9" fill="#bdb398" className="smoke-2" />
            <circle cx="85" cy="48" r="6" fill="#cdc3a8" className="smoke-3" />
          </g>
          {/* body */}
          <rect x="30" y="90" width="100" height="60" fill="#1e4d3c" className="factory-body" />
          <polygon points="30,90 80,68 130,90" fill="#15392c" />
          <rect x="44" y="106" width="14" height="16" fill="#f9e9b8" stroke="#1c1f2b" strokeWidth="1" />
          <rect x="72" y="106" width="14" height="16" fill="#f9e9b8" stroke="#1c1f2b" strokeWidth="1" />
          <rect x="100" y="106" width="14" height="16" fill="#f9e9b8" stroke="#1c1f2b" strokeWidth="1" />
          <rect x="68" y="128" width="22" height="22" fill="#3a3027" />

          {supplierFail && (
            <g className="stamp" transform="translate(80, 110)">
              <rect x="-32" y="-12" width="64" height="24" fill="#b8412b" opacity="0.92" />
              <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="DM Sans">CLOSED</text>
            </g>
          )}
        </g>

        {/* Road from factory to port */}
        <line x1="130" y1="150" x2="480" y2="150" stroke="#7a6f4f" strokeDasharray="14,10" strokeWidth="2" opacity="0.5" />

        {/* === CONVEYOR PACKAGES === */}
        <g className={`packages-group ${viral ? 'scene-viral' : ''} ${slump ? 'scene-recession' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <g key={i} className={`package package-${i+1}`} style={{ animationDelay: `${i * -3.5}s` }}>
              <rect x="0" y="138" width="22" height="14" fill={i % 2 === 0 ? '#d4571a' : '#b8412b'} stroke="#2a221b" strokeWidth="1" rx="1" />
              <line x1="11" y1="138" x2="11" y2="152" stroke="#2a221b" strokeWidth="1" />
              {recall && <text x="11" y="149" fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle">×</text>}
            </g>
          ))}
        </g>

        {/* === PORT === */}
        <g className={portStrike ? 'crisis-shake' : ''}>
          {/* crane base */}
          <rect x="450" y="80" width="6" height="70" fill="#3a3027" />
          <rect x="488" y="80" width="6" height="70" fill="#3a3027" />
          {/* crane arm */}
          <g className={portStrike ? 'crane-paused' : 'crane-arm'}>
            <line x1="472" y1="78" x2="472" y2="48" stroke="#3a3027" strokeWidth="4" />
            <rect x="448" y="44" width="100" height="8" fill="#3a3027" />
            <line x1="540" y1="52" x2="540" y2="86" stroke="#3a3027" strokeWidth="2" />
            <rect x="532" y="86" width="16" height="12" fill="#d4571a" stroke="#2a221b" strokeWidth="1" />
          </g>
          {/* dock */}
          <rect x="440" y="148" width="120" height="6" fill="#3a3027" />
        </g>

        {/* Water */}
        <g>
          <rect x="560" y="148" width="280" height="14" fill="#6ba0a8" />
          <g className="wave">
            {Array.from({length: 12}).map((_, i) => (
              <path key={i} d={`M ${560 + i*40} 152 Q ${570 + i*40} 148, ${580 + i*40} 152 T ${600 + i*40} 152`}
                    fill="none" stroke="#8db8c0" strokeWidth="1.5" />
            ))}
          </g>
        </g>

        {/* === SHIP === */}
        <g className={portStrike ? 'ship-stopped crisis-shake' : ''} transform="translate(600, 110)">
          <g className="ship-anim">
            {/* hull */}
            <polygon points="0,30 180,30 168,52 12,52" fill="#b8412b" stroke="#2a221b" strokeWidth="1.5" />
            {/* deck superstructure */}
            <rect x="60" y="6" width="70" height="24" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1" />
            <rect x="72" y="14" width="9" height="10" fill="#5b6478" />
            <rect x="89" y="14" width="9" height="10" fill="#5b6478" />
            <rect x="106" y="14" width="9" height="10" fill="#5b6478" />
            {/* stacks */}
            <rect x="135" y="-4" width="8" height="14" fill="#3a3027" />
            <rect x="145" y="-2" width="8" height="12" fill="#3a3027" />
            {/* flag */}
            <line x1="95" y1="6" x2="95" y2="-12" stroke="#3a3027" strokeWidth="1.5" />
            <polygon points="95,-12 110,-9 95,-6" fill="#d4571a" className="flag-wave" />

            {portStrike && (
              <g className="stamp" transform="translate(90, 25)">
                <rect x="-36" y="-10" width="72" height="20" fill="#b8412b" />
                <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="DM Sans">ANCHORED</text>
              </g>
            )}
          </g>
        </g>

        {/* Road port -> warehouse */}
        <line x1="840" y1="150" x2="1180" y2="150" stroke="#7a6f4f" strokeDasharray="14,10" strokeWidth="2" opacity="0.5" />

        {/* TARIFF BARRIER */}
        {tariff && (
          <g className="line-down">
            <rect x="900" y="100" width="6" height="50" fill="#b8412b" />
            <rect x="980" y="100" width="6" height="50" fill="#b8412b" />
            <rect x="900" y="100" width="86" height="10" fill="#d4571a" />
            <g className="pulse-warn">
              <circle cx="943" cy="124" r="14" fill="#f4ecd8" stroke="#b8412b" strokeWidth="2" />
              <text x="943" y="129" fontSize="16" fontWeight="800" fill="#b8412b" textAnchor="middle" fontFamily="DM Sans">$</text>
            </g>
          </g>
        )}

        {/* TRUCK */}
        <g className="truck" transform="translate(1000, 122)">
          <rect x="22" y="0" width="34" height="22" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1.5" />
          <rect x="0" y="6" width="26" height="16" fill="#d4571a" stroke="#2a221b" strokeWidth="1.5" />
          <rect x="4" y="9" width="10" height="8" fill="#9bb8c0" />
          <circle cx="9" cy="26" r="5" fill="#2a221b" />
          <circle cx="32" cy="26" r="5" fill="#2a221b" />
          <circle cx="48" cy="26" r="5" fill="#2a221b" />
        </g>

        {/* === WAREHOUSE === */}
        <g transform="translate(1190, 78)">
          <rect x="0" y="20" width="120" height="52" fill="#d4571a" stroke="#2a221b" strokeWidth="1.5" />
          <polygon points="0,20 60,0 120,20" fill="#b8412b" stroke="#2a221b" strokeWidth="1.5" />
          {/* doors */}
          <g className="door-flap">
            <rect x="14" y="40" width="22" height="32" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1" />
            <line x1="25" y1="40" x2="25" y2="72" stroke="#2a221b" strokeWidth="0.5" />
          </g>
          <g>
            <rect x="84" y="40" width="22" height="32" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1" />
            <line x1="95" y1="40" x2="95" y2="72" stroke="#2a221b" strokeWidth="0.5" />
          </g>
          {/* sign */}
          <rect x="42" y="32" width="36" height="8" fill="#f9e9b8" stroke="#2a221b" strokeWidth="0.5" />
          <line x1="46" y1="36" x2="74" y2="36" stroke="#2a221b" strokeWidth="0.5" />
        </g>

        {/* VIRAL HEARTS */}
        {viral && (
          <g>
            {[0, 1, 2].map(i => (
              <g key={i} className={i === 0 ? 'hearts' : i === 1 ? 'hearts-2' : 'hearts-3'}
                 transform={`translate(${1240 + i*22}, 120)`}>
                <path d="M 0,4 C -3,-1 -8,-1 -8,4 C -8,8 0,14 0,14 C 0,14 8,8 8,4 C 8,-1 3,-1 0,4 Z"
                      fill="#d4571a" stroke="#2a221b" strokeWidth="1" />
              </g>
            ))}
          </g>
        )}

        {/* slump arrow */}
        {slump && (
          <g className="fade-in" transform="translate(680, 60)">
            <path d="M 0,0 L 40,30 L 80,15 L 120,45" fill="none" stroke="#b8412b" strokeWidth="3" />
            <polygon points="115,40 125,48 118,52" fill="#b8412b" />
          </g>
        )}
      </svg>

      {/* event banner */}
      {event && (
        <div className="absolute top-2 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft bg-paper-warm px-2 py-1 border border-tan slide-top">
            Live · Operations Feed
          </div>
          <div className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border slide-top ${
            sev === 'crisis' ? 'bg-rust text-white border-rust' :
            sev === 'opportunity' ? 'bg-sage text-white border-sage' :
            sev === 'slump' ? 'bg-sky-deep text-white border-sky-deep' :
            'bg-paper-warm text-ink-soft border-tan'
          }`}>
            {sev === 'crisis' ? '⚠ Disruption' : sev === 'opportunity' ? '↑ Spike' : sev === 'slump' ? '↓ Headwind' : '— Steady'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EVENT ILLUSTRATIONS (hero icons inside the event card)
// ============================================================================

function EventIllustration({ eventId, severity }) {
  const colorMap = {
    crisis: { primary: '#b8412b', secondary: '#d4571a', bg: '#f9e0d4' },
    opportunity: { primary: '#6b8e6e', secondary: '#1e4d3c', bg: '#dde9d8' },
    slump: { primary: '#2b5470', secondary: '#6ba0a8', bg: '#d4e1e6' },
    calm: { primary: '#c8861a', secondary: '#d4a017', bg: '#f5e9c8' },
  };
  const c = colorMap[severity] || colorMap.calm;

  const renderShape = () => {
    switch (eventId) {
      case 'supplier-fail':
        return (
          <g>
            <rect x="20" y="40" width="60" height="40" fill={c.primary} stroke="#1c1f2b" strokeWidth="2" />
            <polygon points="20,40 50,22 80,40" fill={c.secondary} stroke="#1c1f2b" strokeWidth="2" />
            <rect x="30" y="50" width="10" height="12" fill="#f4ecd8" stroke="#1c1f2b" strokeWidth="1" />
            <rect x="46" y="50" width="10" height="12" fill="#f4ecd8" stroke="#1c1f2b" strokeWidth="1" />
            <rect x="62" y="50" width="10" height="12" fill="#f4ecd8" stroke="#1c1f2b" strokeWidth="1" />
            <line x1="15" y1="20" x2="85" y2="90" stroke="#b8412b" strokeWidth="5" />
            <line x1="85" y1="20" x2="15" y2="90" stroke="#b8412b" strokeWidth="5" />
          </g>
        );
      case 'port-strike':
        return (
          <g>
            <polygon points="15,55 85,55 78,72 22,72" fill={c.primary} stroke="#1c1f2b" strokeWidth="2" />
            <rect x="35" y="42" width="30" height="13" fill="#f4ecd8" stroke="#1c1f2b" strokeWidth="1.5" />
            <rect x="60" y="36" width="5" height="9" fill="#1c1f2b" />
            <line x1="50" y1="80" x2="50" y2="92" stroke="#1c1f2b" strokeWidth="2" />
            <path d="M 45 88 Q 50 95 55 88" fill="none" stroke="#1c1f2b" strokeWidth="2" />
          </g>
        );
      case 'tariff':
        return (
          <g>
            <rect x="22" y="40" width="6" height="40" fill={c.primary} stroke="#1c1f2b" strokeWidth="1.5" />
            <rect x="72" y="40" width="6" height="40" fill={c.primary} stroke="#1c1f2b" strokeWidth="1.5" />
            <rect x="22" y="40" width="56" height="10" fill={c.secondary} stroke="#1c1f2b" strokeWidth="1.5" />
            <circle cx="50" cy="65" r="10" fill="#f4ecd8" stroke={c.primary} strokeWidth="2" />
            <text x="50" y="70" fontSize="14" fontWeight="800" fill={c.primary} textAnchor="middle" fontFamily="DM Sans">$</text>
          </g>
        );
      case 'recall':
        return (
          <g>
            <polygon points="50,22 80,75 20,75" fill={c.secondary} stroke="#1c1f2b" strokeWidth="2" />
            <line x1="50" y1="40" x2="50" y2="58" stroke="#1c1f2b" strokeWidth="3" />
            <circle cx="50" cy="66" r="2.5" fill="#1c1f2b" />
          </g>
        );
      case 'viral':
        return (
          <g>
            <rect x="32" y="22" width="36" height="60" fill="#1c1f2b" rx="4" />
            <rect x="35" y="28" width="30" height="44" fill="#f4ecd8" />
            <circle cx="50" cy="78" r="2" fill="#f4ecd8" />
            <g transform="translate(50, 50)">
              <path d="M 0,4 C -4,-2 -10,-2 -10,5 C -10,11 0,18 0,18 C 0,18 10,11 10,5 C 10,-2 4,-2 0,4 Z"
                    fill={c.primary} stroke="#1c1f2b" strokeWidth="1.5" />
            </g>
          </g>
        );
      case 'holiday':
        return (
          <g>
            <rect x="22" y="40" width="56" height="40" fill={c.primary} stroke="#1c1f2b" strokeWidth="2" />
            <rect x="45" y="40" width="10" height="40" fill={c.secondary} />
            <rect x="22" y="55" width="56" height="6" fill={c.secondary} />
            <path d="M 45,40 Q 38,28 42,22 Q 48,28 50,40" fill={c.primary} stroke="#1c1f2b" strokeWidth="1.5" />
            <path d="M 55,40 Q 62,28 58,22 Q 52,28 50,40" fill={c.primary} stroke="#1c1f2b" strokeWidth="1.5" />
          </g>
        );
      case 'recession':
      case 'competitor':
        return (
          <g>
            <line x1="15" y1="35" x2="85" y2="35" stroke="#1c1f2b" strokeWidth="1" opacity="0.3" />
            <line x1="15" y1="55" x2="85" y2="55" stroke="#1c1f2b" strokeWidth="1" opacity="0.3" />
            <line x1="15" y1="75" x2="85" y2="75" stroke="#1c1f2b" strokeWidth="1" opacity="0.3" />
            <polyline points="15,30 30,42 45,55 60,70 80,82" fill="none" stroke={c.primary} strokeWidth="3" />
            <polygon points="78,76 86,84 78,88" fill={c.primary} />
            <circle cx="30" cy="42" r="3" fill={c.primary} />
            <circle cx="45" cy="55" r="3" fill={c.primary} />
            <circle cx="60" cy="70" r="3" fill={c.primary} />
          </g>
        );
      default:
        return (
          <g>
            <circle cx="50" cy="50" r="20" fill={c.secondary} stroke="#1c1f2b" strokeWidth="2" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <line key={i} x1="50" y1="50" x2={50 + Math.cos(i * Math.PI / 4) * 35}
                    y2={50 + Math.sin(i * Math.PI / 4) * 35}
                    stroke={c.primary} strokeWidth="3" opacity="0.7" />
            ))}
            <circle cx="50" cy="50" r="14" fill={c.primary} />
          </g>
        );
    }
  };

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill={c.bg} stroke="#1c1f2b" strokeWidth="2" />
        {renderShape()}
      </svg>
    </div>
  );
}

// ============================================================================
// STAT CARD with animated counter
// ============================================================================

function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(null);
  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    const from = display;
    const delta = target - from;
    if (Math.abs(delta) < 0.5) { setDisplay(target); return; }
    let raf;
    const step = (t) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + delta * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return display;
}

function StatTile({ label, value, format, tone = 'neutral', icon }) {
  const animated = useAnimatedNumber(value);
  const display = format ? format(animated) : Math.round(animated).toString();
  const toneClass = {
    neutral: 'text-ink',
    good: 'text-moss',
    warn: 'text-amber-game',
    bad: 'text-rust',
  }[tone];
  return (
    <div className="bg-paper-warm border-2 border-ink relative overflow-hidden">
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          {icon}
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">{label}</div>
        </div>
        <div className={`font-display text-2xl font-semibold ${toneClass} tracking-tight leading-none`}>
          {display}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STRATEGY SELECTOR
// ============================================================================

function StrategySelector({ onSelect }) {
  return (
    <div className="min-h-screen paper-texture relative">
      <div className="grain"></div>
      <div className="max-w-6xl mx-auto px-6 py-10 relative">
        <div className="mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-rust mb-3">A Supply Chain Game · 12 Months · 1 Decision</div>
          <h1 className="font-display text-7xl md:text-8xl font-semibold text-ink leading-none mb-4 tracking-tight">
            The <span className="font-display-italic">Disruption</span> Game
          </h1>
          <p className="text-ink-soft max-w-2xl text-lg leading-relaxed">
            You run a supply chain through one fiscal year. Twelve months. Twelve events.
            Choose your strategy now — and live with it. The same disruptions hit every strategy differently.
          </p>
        </div>

        <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft flex items-center gap-3">
          <span className="bg-ink text-paper-warm px-2 py-0.5">01</span>
          <span>Lock In Your Strategy</span>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {Object.values(STRATEGIES).map((s, idx) => (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className={`text-left bg-paper-warm border-2 border-ink p-6 hover-lift relative group fade-up fade-up-${idx}`}
              style={{ boxShadow: '6px 6px 0 0 var(--ink)' }}
            >
              <StrategyVignette type={s.icon} />

              <div className="flex items-baseline gap-2 mt-4 mb-1">
                <h3 className="font-display text-3xl font-semibold tracking-tight">{s.name}</h3>
              </div>
              <p className="font-display-italic text-rust text-base mb-4">{s.tagline}</p>
              <p className="text-ink-soft text-[14px] mb-5 leading-relaxed">{s.description}</p>

              <div className="space-y-1.5 pt-4 border-t border-tan text-xs font-mono">
                <div className="flex justify-between"><span className="text-ink-soft">Start Inventory</span><span className="text-ink font-medium">{s.startInventory} units</span></div>
                <div className="flex justify-between"><span className="text-ink-soft">Unit Cost</span><span className="text-ink font-medium">${s.unitCost}</span></div>
                <div className="flex justify-between"><span className="text-ink-soft">Holding Cost</span><span className="text-ink font-medium">${s.holdingCost}/mo</span></div>
                <div className="flex justify-between"><span className="text-ink-soft">Dual Source</span><span className="text-ink font-medium">{s.supplierRedundancy ? 'Yes' : 'No'}</span></div>
              </div>

              <div className="mt-4 pt-3 border-t border-tan space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-moss">Wins</span>
                  <span className="text-sm text-ink">{s.bestFor}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-rust">Loses</span>
                  <span className="text-sm text-ink">{s.weakAgainst}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-rust font-medium text-sm group-hover:gap-3 transition-all">
                <span>Choose this strategy</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 font-mono text-[11px] text-ink-soft max-w-3xl">
          ↳ At year-end, you'll see how the same twelve months would have played out under <em>each</em> strategy. That's the game.
        </div>
      </div>
    </div>
  );
}

function StrategyVignette({ type }) {
  if (type === 'lean') return (
    <svg viewBox="0 0 200 80" className="w-full h-20">
      <rect x="10" y="35" width="35" height="30" fill="#1e4d3c" stroke="#1c1f2b" strokeWidth="1.5" />
      <polygon points="10,35 27,22 45,35" fill="#15392c" stroke="#1c1f2b" strokeWidth="1.5" />
      <rect x="160" y="35" width="35" height="30" fill="#d4571a" stroke="#1c1f2b" strokeWidth="1.5" />
      <polygon points="160,35 177,22 195,35" fill="#b8412b" stroke="#1c1f2b" strokeWidth="1.5" />
      <line x1="50" y1="65" x2="155" y2="65" stroke="#7a6f4f" strokeDasharray="6,4" strokeWidth="1.5" />
      <g><rect x="0" y="55" width="14" height="9" fill="#d4571a" stroke="#1c1f2b" strokeWidth="1" className="package" style={{animationDuration: '6s'}} /></g>
    </svg>
  );
  if (type === 'buffered') return (
    <svg viewBox="0 0 200 80" className="w-full h-20">
      <rect x="10" y="35" width="35" height="30" fill="#1e4d3c" stroke="#1c1f2b" strokeWidth="1.5" />
      <polygon points="10,35 27,22 45,35" fill="#15392c" stroke="#1c1f2b" strokeWidth="1.5" />
      <g transform="translate(70, 20)">
        <rect x="0" y="20" width="60" height="40" fill="#d4571a" stroke="#1c1f2b" strokeWidth="1.5" />
        <polygon points="0,20 30,8 60,20" fill="#b8412b" stroke="#1c1f2b" strokeWidth="1.5" />
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={4 + (i%4)*14} y={28 + Math.floor(i/4)*14} width="11" height="11" fill="#f4ecd8" stroke="#1c1f2b" strokeWidth="0.5" />
        ))}
      </g>
      <rect x="160" y="35" width="35" height="30" fill="#c8861a" stroke="#1c1f2b" strokeWidth="1.5" />
    </svg>
  );
  return (
    <svg viewBox="0 0 200 80" className="w-full h-20">
      <rect x="5" y="20" width="32" height="26" fill="#1e4d3c" stroke="#1c1f2b" strokeWidth="1.5" />
      <polygon points="5,20 21,10 37,20" fill="#15392c" stroke="#1c1f2b" strokeWidth="1.5" />
      <rect x="5" y="48" width="32" height="20" fill="#2b5470" stroke="#1c1f2b" strokeWidth="1.5" />
      <polygon points="5,48 21,40 37,48" fill="#1f3f54" stroke="#1c1f2b" strokeWidth="1.5" />
      <line x1="42" y1="34" x2="120" y2="50" stroke="#7a6f4f" strokeDasharray="5,3" strokeWidth="1.5" />
      <line x1="42" y1="58" x2="120" y2="52" stroke="#7a6f4f" strokeDasharray="5,3" strokeWidth="1.5" />
      <rect x="130" y="35" width="60" height="30" fill="#d4571a" stroke="#1c1f2b" strokeWidth="1.5" />
      <polygon points="130,35 160,22 190,35" fill="#b8412b" stroke="#1c1f2b" strokeWidth="1.5" />
    </svg>
  );
}

// ============================================================================
// MONTH SCREEN
// ============================================================================

function MonthScreen({ state, strategy, currentEvent, onDecision, onContinue }) {
  const strat = STRATEGIES[strategy];
  const [decided, setDecided] = useState(false);
  const [chosenIdx, setChosenIdx] = useState(-1);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [revealKey, setRevealKey] = useState(0);

  const dualImmune = currentEvent.supplierEvent && strat.supplierRedundancy;

  useEffect(() => {
    setDecided(false);
    setChosenIdx(-1);
    setHoveredIdx(-1);
    setRevealKey(k => k + 1);
  }, [currentEvent.id, state.month]);

  const makeDecision = (idx) => {
    setChosenIdx(idx);
    setDecided(true);
    onDecision(idx);
  };

  const skipDecision = () => {
    setDecided(true);
    onDecision(-1);
  };

  // Hover preview: which stat indicator highlights
  const previewIdx = hoveredIdx >= 0 ? hoveredIdx : -1;
  const preview = previewIdx >= 0 && currentEvent.choices ? currentEvent.choices[previewIdx]?.preview : null;

  return (
    <div className="min-h-screen paper-texture relative">
      <div className="grain"></div>

      {/* Top header */}
      <div className="bg-ink text-paper-warm border-b-2 border-ink px-6 py-2.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest relative">
        <div className="flex items-center gap-3">
          <span className="text-rust-bright">●</span>
          <span>Disruption Game</span>
          <span className="opacity-40">/</span>
          <span className="opacity-70">{strat.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Month</span>
          <span className="text-rust-bright font-semibold">{String(state.month + 1).padStart(2, '0')}</span>
          <span className="opacity-50">/ 12</span>
        </div>
      </div>

      {/* Supply chain scene */}
      <SupplyChainScene event={currentEvent} monthKey={revealKey} />

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-6 py-4 max-w-6xl mx-auto w-full">
        <StatTile
          label="Cash"
          value={state.cash}
          format={(v) => `$${(v / 1000).toFixed(1)}K`}
          tone={state.cash > 30000 ? 'good' : state.cash > 0 ? 'warn' : 'bad'}
          icon={<span className="font-display text-base text-ink-soft leading-none">$</span>}
        />
        <StatTile
          label="Inventory"
          value={state.inventory}
          tone={state.inventory > 30 ? 'good' : state.inventory > 10 ? 'warn' : 'bad'}
          icon={<Package className="w-3 h-3 text-ink-soft" />}
        />
        <StatTile
          label="Fill Rate"
          value={state.fillRate}
          format={(v) => `${v.toFixed(0)}%`}
          tone={state.fillRate > 95 ? 'good' : state.fillRate > 85 ? 'warn' : 'bad'}
          icon={<TrendingUp className="w-3 h-3 text-ink-soft" />}
        />
        <StatTile
          label="Reputation"
          value={state.reputation}
          tone={state.reputation > 85 ? 'good' : state.reputation > 60 ? 'warn' : 'bad'}
          icon={<ShieldCheck className="w-3 h-3 text-ink-soft" />}
        />
      </div>

      {/* Main event card */}
      <div className="max-w-4xl mx-auto px-6 pb-10 w-full">
        <div className="bg-paper-warm border-2 border-ink p-6 md:p-8 mb-5 slam-in" key={`card-${revealKey}`}
             style={{ boxShadow: '8px 8px 0 0 var(--ink)' }}>
          <div className="flex gap-5">
            <EventIllustration eventId={currentEvent.id} severity={currentEvent.severity} />
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                Month {state.month + 1} Report
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-3 tracking-tight">
                {currentEvent.title}
              </h2>
              <p className="text-ink text-base leading-relaxed">
                {currentEvent.flavor}
              </p>

              {dualImmune && (
                <div className="mt-5 bg-paper-dark border-l-4 border-moss px-4 py-3 fade-up">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-moss mb-1">Dual Source Activated</div>
                  <p className="text-sm text-ink leading-snug">
                    Your secondary supplier ramps up overnight. The crisis affects competitors — not you. No action required.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decision */}
        {currentEvent.choices && !dualImmune && (
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-2 flex items-center gap-2">
              <span className="bg-ink text-paper-warm px-1.5 py-0.5">02</span>
              <span>Your Move — Hover to Preview</span>
            </div>
            {currentEvent.choices.map((c, i) => (
              <button
                key={i}
                disabled={decided}
                onMouseEnter={() => !decided && setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                onClick={() => makeDecision(i)}
                className={`choice-card w-full text-left p-5 border-2 fade-up fade-up-${i+1} ${
                  decided
                    ? chosenIdx === i
                      ? 'bg-rust-bright text-paper-warm border-ink'
                      : 'bg-paper-warm border-tan opacity-30'
                    : 'bg-paper-warm border-ink'
                }`}
                style={!decided ? { boxShadow: '4px 4px 0 0 var(--ink)' } : {}}
              >
                <div className="flex items-start gap-4">
                  <div className={`font-display text-3xl font-semibold leading-none w-8 ${
                    decided && chosenIdx === i ? 'text-paper-warm' : 'text-rust'
                  }`}>{String.fromCharCode(65 + i)}</div>
                  <div className="flex-1">
                    <div className={`text-base font-medium mb-1 ${decided && chosenIdx === i ? 'text-paper-warm' : 'text-ink'}`}>
                      {c.label}
                    </div>
                    <div className={`font-mono text-xs ${decided && chosenIdx === i ? 'text-paper-warm opacity-90' : 'text-ink-soft'}`}>
                      {c.detail}
                    </div>
                  </div>
                  <ChoicePreview kind={c.preview} active={hoveredIdx === i && !decided} />
                </div>
              </button>
            ))}
          </div>
        )}

        {(!currentEvent.choices || dualImmune) && !decided && (
          <button
            onClick={skipDecision}
            className="w-full bg-ink text-paper-warm border-2 border-ink px-6 py-4 transition-all hover:bg-rust-bright flex items-center justify-center gap-2 fade-up font-medium tracking-wide"
            style={{ boxShadow: '4px 4px 0 0 var(--rust)' }}
          >
            <span>Execute the month</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {decided && (
          <button
            onClick={onContinue}
            className="w-full mt-5 bg-rust-bright text-paper-warm border-2 border-ink px-6 py-5 hover:bg-rust transition-all flex items-center justify-center gap-3 font-display text-xl tracking-tight slide-top"
            style={{ boxShadow: '6px 6px 0 0 var(--ink)' }}
          >
            <span>{state.month === 11 ? 'See year-end results' : 'Advance to next month'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <YearTape history={state.history} currentMonth={state.month} />
    </div>
  );
}

function ChoicePreview({ kind, active }) {
  if (!kind) return null;
  const colorClass = active ? 'text-rust' : 'text-ink-soft';
  const cls = `choice-preview flex flex-col items-center gap-0.5 ${colorClass}`;
  return (
    <div className={cls}>
      {kind === 'inv-up' && <><TrendingUp className="w-5 h-5" /><span className="font-mono text-[9px] uppercase">+Inv</span></>}
      {kind === 'inv-down' && <><TrendingDown className="w-5 h-5" /><span className="font-mono text-[9px] uppercase">−Inv</span></>}
      {kind === 'cash-down' && <><TrendingDown className="w-5 h-5" /><span className="font-mono text-[9px] uppercase">−Cash</span></>}
      {kind === 'stockout' && <><AlertTriangle className="w-5 h-5" /><span className="font-mono text-[9px] uppercase">Risk</span></>}
      {kind === 'flat' && <><span className="w-5 h-0.5 bg-current my-2" /><span className="font-mono text-[9px] uppercase">Hold</span></>}
    </div>
  );
}

function YearTape({ history, currentMonth }) {
  return (
    <div className="border-t-2 border-tan bg-paper-dark">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-2">Year Tape</div>
        <div className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => {
            const h = history[i];
            const isCurrent = i === currentMonth;
            const sev = h?.severity || 'pending';
            const colorMap = {
              calm: 'bg-amber-game',
              opportunity: 'bg-sage',
              slump: 'bg-sky-deep',
              crisis: 'bg-rust',
              pending: 'bg-paper-warm border border-tan',
            };
            return (
              <div key={i} className="flex-1">
                <div
                  className={`h-2.5 ${colorMap[sev]} ${isCurrent ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper-dark' : ''}`}
                  title={h ? `M${i+1}: ${h.event}` : `M${i+1}`}
                />
                <div className="font-mono text-[9px] text-ink-soft text-center mt-1">{String(i+1).padStart(2,'0')}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LEARNING OBJECTIVES
// ============================================================================

function LearningObjectives({ strategy, playerResult, alternateResults }) {
  const strat = STRATEGIES[strategy];
  const all = [
    { key: strategy, ...playerResult },
    ...Object.entries(alternateResults).map(([k, v]) => ({ key: k, ...v })),
  ];
  const winner = all.reduce((b, x) => (x.cash > b.cash ? x : b), all[0]);
  const playerWon = winner.key === strategy;

  const supplierEvents = playerResult.history.filter(h =>
    EVENTS.find(e => e.id === h.eventId)?.supplierEvent
  ).length;
  const crisisMonths = playerResult.history.filter(h => h.severity === 'crisis').length;
  const stockoutMonths = playerResult.stockoutMonths;
  const best = all[0];
  const worst = all[all.length - 1];

  const objectives = [
    {
      number: '01',
      principle: 'Strategy locks in your vulnerability before the year starts',
      evidence: supplierEvents >= 2 && strategy !== 'dual'
        ? `You faced ${supplierEvents} supplier disruptions. Dual Source players were immune — they paid a premium in January so they didn't have to scramble in Q3. The decision was made before the crisis, not during it.`
        : crisisMonths >= 3
        ? `You navigated ${crisisMonths} crisis months. Every one of them tested assumptions baked into your strategy — assumptions you locked in before seeing a single event card. That's exactly how real supply chains work.`
        : `Your ${strat.name} choice determined which events would hurt you and which wouldn't — before Month 1 even started. You were already exposed to certain risks the moment you chose.`,
    },
    {
      number: '02',
      principle: 'The same disruptions hit every strategy differently',
      evidence: (() => {
        const spread = best.cash - worst.cash;
        return `Same twelve months. ${STRATEGIES[best.key].name} ended at $${(best.cash / 1000).toFixed(1)}K. ${STRATEGIES[worst.key].name} ended at $${(worst.cash / 1000).toFixed(1)}K. A $${(spread / 1000).toFixed(1)}K gap — from identical events. The disruption sequence didn't change. The strategy absorbed it differently.`;
      })(),
    },
    {
      number: '03',
      principle: 'Resilience has a real price — and so does the absence of it',
      evidence: (() => {
        if (stockoutMonths >= 3) {
          return `${stockoutMonths} months of stockouts hit your reputation and cost you sales. That's the hidden invoice for lean inventory. Safety Stock or Dual Source would have absorbed those spikes — at a higher holding cost paid every single month, not just the bad ones.`;
        }
        if (strategy === 'dual') {
          const leanResult = alternateResults['lean'];
          if (leanResult && playerResult.cash < leanResult.cash) {
            return `Your Dual Source premium ran all year. In a year with few supplier shocks, Lean pocketed that difference. Resilience you didn't need this year still shows up on your P&L. This is why the decision is genuinely hard.`;
          }
          return `Dual Source paid its premium and — this year — earned it back. But ask yourself: would you have known this in advance? That's the actual challenge.`;
        }
        return `Every strategy trades cost-now for safety-later, or vice versa. Safety Stock costs you holding fees on every calm month. Lean costs you stockouts on every volatile one. There is no free option — only different timing of when you pay.`;
      })(),
    },
    {
      number: '04',
      principle: 'Tactical execution matters inside any strategy',
      evidence: (() => {
        const premiumMoves = playerResult.history.filter(h =>
          h.decision && (
            h.decision.toLowerCase().includes('air-freight') ||
            h.decision.toLowerCase().includes('spot market') ||
            h.decision.toLowerCase().includes('pre-buy')
          )
        );
        if (premiumMoves.length >= 2) {
          return `You made ${premiumMoves.length} premium tactical calls — spot market, air-freight, hedges. Each was defensible in isolation. But they compound quickly and can undercut even a sound strategy. Choosing when to spend extra is its own skill, separate from the strategy itself.`;
        }
        return `Even a well-chosen strategy can be undone by costly month-to-month responses. When to expedite, ration, or wait isn't written in the strategy document — it's judgment under pressure, usually with incomplete information.`;
      })(),
    },
    {
      number: '05',
      principle: 'Hindsight is not foresight',
      evidence: playerWon
        ? `You won — but you chose before seeing any events. The right question isn't "did I pick the right strategy?" It's "was my reasoning process sound enough to trust in future years with different disruption mixes?" Run it again and test that.`
        : `It's obvious now that ${STRATEGIES[winner.key].name} was the call to make. It wasn't obvious before Month 1. Real supply chain decisions are made under the same uncertainty you just experienced — which is exactly why this lesson is worth internalizing.`,
    },
  ];

  return (
    <div className="bg-paper-warm border-2 border-ink p-6 md:p-8 mb-8" style={{ boxShadow: '5px 5px 0 0 var(--ink)' }}>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-1">Learning Objectives</div>
      <h3 className="font-display text-4xl font-semibold mb-2 tracking-tight">What this game teaches</h3>
      <p className="text-ink-soft text-base mb-8 max-w-xl">
        Five principles — each one illustrated by what just happened in your run.
      </p>
      <div className="space-y-0">
        {objectives.map((obj, i) => (
          <div key={i} className={`flex gap-6 py-6 border-b-2 border-tan last:border-0 fade-up`} style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <div className="font-display text-6xl font-semibold leading-none flex-shrink-0 w-14 pt-1"
                 style={{ color: 'var(--paper-dark)', WebkitTextStroke: '1.5px var(--tan)' }}>
              {obj.number}
            </div>
            <div className="flex-1">
              <div className="font-display text-xl font-semibold text-ink mb-2 tracking-tight leading-snug">
                {obj.principle}
              </div>
              <div className="text-ink-soft text-sm leading-relaxed">{obj.evidence}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// DEBRIEF SCREEN
// ============================================================================

function DebriefScreen({ playerResult, alternateResults, strategy, onReplay }) {
  const playerStrat = STRATEGIES[strategy];

  const chartData = playerResult.history.map((h, i) => {
    const point = { month: `M${i + 1}` };
    point[STRATEGIES[strategy].name] = Math.round(h.cash / 1000);
    Object.entries(alternateResults).forEach(([k, r]) => {
      point[STRATEGIES[k].name] = Math.round(r.history[i].cash / 1000);
    });
    return point;
  });

  const stratColors = { lean: '#1e4d3c', buffered: '#c8861a', dual: '#2b5470' };
  const lesson = generateLesson(strategy, playerResult, alternateResults);

  const sorted = [
    { key: strategy, isPlayer: true, ...playerResult },
    ...Object.entries(alternateResults).map(([k, v]) => ({ key: k, isPlayer: false, ...v })),
  ].sort((a, b) => b.cash - a.cash);

  return (
    <div className="min-h-screen paper-texture relative">
      <div className="grain"></div>
      <div className="max-w-6xl mx-auto px-6 py-10 relative">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-rust mb-3">Fiscal Year Complete · Annual Report</div>
        <h1 className="font-display text-7xl font-semibold mb-3 tracking-tight">
          The <span className="font-display-italic">Debrief</span>
        </h1>
        <p className="text-ink-soft text-lg mb-10 max-w-2xl">
          You ran <span className="text-ink font-medium">{playerStrat.name}</span> for twelve months.
          Here's how it played out — and how the alternatives would have fared against the same disruptions.
        </p>

        {/* Scorecard */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {sorted.map((r, idx) => {
            const s = STRATEGIES[r.key];
            return (
              <div
                key={r.key}
                className={`p-5 border-2 fade-up fade-up-${idx} ${
                  r.isPlayer ? 'bg-rust-bright text-paper-warm border-ink' : 'bg-paper-warm border-ink'
                }`}
                style={{ boxShadow: '5px 5px 0 0 var(--ink)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`font-mono text-[10px] uppercase tracking-widest ${r.isPlayer ? 'text-paper-warm opacity-80' : 'text-ink-soft'}`}>
                    {idx === 0 ? '🥇 Winner' : idx === 1 ? 'Runner-up' : '3rd'}
                  </div>
                  {r.isPlayer && <div className="font-mono text-[10px] uppercase tracking-widest text-paper-warm bg-ink px-1.5 py-0.5">You</div>}
                </div>
                <div className="font-display text-3xl font-semibold mb-1 tracking-tight">{s.name}</div>
                <div className={`font-mono text-3xl mb-3 ${r.isPlayer ? 'text-paper-warm' : ''}`}
                     style={!r.isPlayer ? { color: stratColors[r.key] } : {}}>
                  ${(r.cash / 1000).toFixed(1)}K
                </div>
                <div className={`font-mono text-xs space-y-1 ${r.isPlayer ? 'text-paper-warm opacity-90' : 'text-ink-soft'}`}>
                  <div className="flex justify-between"><span>Fill Rate</span><span>{r.fillRate.toFixed(0)}%</span></div>
                  <div className="flex justify-between"><span>Reputation</span><span>{r.reputation}</span></div>
                  <div className="flex justify-between"><span>Stockout Months</span><span>{r.stockoutMonths}</span></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cash trajectory chart */}
        <div className="bg-paper-warm border-2 border-ink p-6 mb-8" style={{ boxShadow: '5px 5px 0 0 var(--ink)' }}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1">Cash Trajectory</div>
          <h3 className="font-display text-3xl font-semibold mb-6 tracking-tight">Twelve months, three timelines</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c9bc99" />
              <XAxis dataKey="month" stroke="#5b6478" style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} />
              <YAxis stroke="#5b6478" style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} label={{ value: 'Cash ($K)', angle: -90, position: 'insideLeft', fill: '#5b6478', style: { fontSize: 11 } }} />
              <Tooltip contentStyle={{ background: '#faf3df', border: '2px solid #1c1f2b', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans, sans-serif' }} />
              {Object.keys(STRATEGIES).map((k) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={STRATEGIES[k].name}
                  stroke={stratColors[k]}
                  strokeWidth={k === strategy ? 3.5 : 1.8}
                  strokeDasharray={k === strategy ? '0' : '5 5'}
                  dot={{ r: k === strategy ? 4 : 0, fill: stratColors[k] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event log */}
        <div className="bg-paper-warm border-2 border-ink p-6 mb-8" style={{ boxShadow: '5px 5px 0 0 var(--ink)' }}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-1">Event Log</div>
          <h3 className="font-display text-3xl font-semibold mb-6 tracking-tight">What you actually faced</h3>
          <div className="space-y-1">
            {playerResult.history.map((h, i) => {
              const colorMap = {
                calm: 'bg-amber-game',
                opportunity: 'bg-sage',
                slump: 'bg-sky-deep',
                crisis: 'bg-rust',
              };
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-tan last:border-0">
                  <div className="font-mono text-xs text-ink-soft w-10">M{String(i+1).padStart(2,'0')}</div>
                  <div className={`w-1.5 h-9 ${colorMap[h.severity]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-ink text-sm font-medium truncate">{h.event}</div>
                    {h.decision && <div className="font-mono text-[10px] text-ink-soft mt-0.5 truncate">↳ {h.decision}</div>}
                    {h.supplierImmune && <div className="font-mono text-[10px] text-moss mt-0.5">↳ Dual source absorbed it</div>}
                  </div>
                  <div className="text-right font-mono text-xs hidden md:block">
                    <div className="text-ink">D{h.demand} · F{h.fulfilled}</div>
                    <div className={h.stockout > 0 ? 'text-rust' : 'text-ink-soft'}>
                      {h.stockout > 0 ? `−${h.stockout} short` : '✓'}
                    </div>
                  </div>
                  <div className="text-right font-mono text-sm w-20 text-ink">
                    ${(h.cash / 1000).toFixed(1)}K
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning objectives */}
        <LearningObjectives
          strategy={strategy}
          playerResult={playerResult}
          alternateResults={alternateResults}
        />

        {/* Lesson */}
        <div className="bg-ink text-paper-warm border-2 border-ink p-8 mb-8" style={{ boxShadow: '5px 5px 0 0 var(--rust)' }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-rust-bright mb-3">The Lesson</div>
          <h3 className="font-display text-4xl font-semibold mb-4 tracking-tight">
            {lesson.headline}
          </h3>
          <p className="text-paper-warm opacity-90 text-base leading-relaxed">{lesson.body}</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={onReplay}
            className="bg-rust-bright text-paper-warm border-2 border-ink px-6 py-4 hover:bg-rust transition-all flex items-center gap-2 font-medium"
            style={{ boxShadow: '4px 4px 0 0 var(--ink)' }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Year — New Scenario</span>
          </button>
          <div className="font-mono text-xs text-ink-soft">↳ Same game, different draw</div>
        </div>

        <div className="mt-12 font-mono text-[11px] text-ink-soft">
          Built as a teaching tool. Share with anyone learning supply chain resilience.
        </div>
      </div>
    </div>
  );
}

function generateLesson(strategy, playerResult, alts) {
  const all = [{ key: strategy, ...playerResult }, ...Object.entries(alts).map(([k, v]) => ({ key: k, ...v }))];
  const winner = all.reduce((b, x) => (x.cash > b.cash ? x : b), all[0]);
  const playerStrat = STRATEGIES[strategy];

  const eventTypes = playerResult.history.reduce((acc, h) => {
    acc[h.severity] = (acc[h.severity] || 0) + 1;
    return acc;
  }, {});
  const supplierEvents = playerResult.history.filter(h =>
    EVENTS.find(e => e.id === h.eventId)?.supplierEvent
  ).length;
  const playerWon = winner.key === strategy;

  if (playerWon) {
    return {
      headline: `You picked the right strategy for this year.`,
      body: `${playerStrat.name} matched the disruption profile you faced — ${eventTypes.crisis || 0} crises, ${eventTypes.opportunity || 0} demand spikes, ${eventTypes.slump || 0} slumps. Shuffle the deck and the answer changes. The real lesson of supply chain isn't picking the "best" strategy — it's understanding what each one buys you and what it costs. Lean wins calm years. Safety stock wins volatile demand. Dual source wins supplier shocks. Real operations rarely get a pure year of any one type.`,
    };
  }

  const winnerStrat = STRATEGIES[winner.key];
  let body = '';
  if (winner.key === 'dual' && supplierEvents >= 2) {
    body = `This year had ${supplierEvents} supplier-side disruptions. Dual Source paid its premium and earned it back many times over. ${playerStrat.name} got hit because the disruption profile was supplier-heavy, not demand-heavy. The deeper point: paying for resilience feels expensive — until you need it. Most leaders only learn this lesson once, the hard way.`;
  } else if (winner.key === 'buffered' && (eventTypes.opportunity || 0) >= 2) {
    body = `Demand swung hard this year — ${eventTypes.opportunity || 0} upside spikes. Safety Stock captured them while ${playerStrat.name} ran out of product and watched sales walk to a competitor. Holding inventory is a tax on calm years and an insurance payout on volatile ones. The trade-off is the whole job.`;
  } else if (winner.key === 'lean' && (eventTypes.calm || 0) >= 3) {
    body = `It was a quiet year. ${(eventTypes.calm || 0)} months of calm meant Lean's lower holding costs compounded into a clear win. ${playerStrat.name} paid for resilience it didn't need. The harder question: would you have known in advance? If not, the right question isn't "which strategy wins?" but "which strategy survives the worst plausible year?"`;
  } else {
    body = `${winnerStrat.name} edged ahead this run. Different years reward different strategies. Run it again with a different draw and watch the leaderboard flip. That's the point: resilience strategies are bets on a probability distribution of futures, not predictions of one.`;
  }

  return {
    headline: `${winnerStrat.name} won this year. Here's why.`,
    body,
  };
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [strategy, setStrategy] = useState(null);
  const [seed, setSeed] = useState(() => Date.now() % 1000000);
  const [eventSeq, setEventSeq] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [state, setState] = useState(null);
  const [currentMonthEvent, setCurrentMonthEvent] = useState(null);
  const [results, setResults] = useState(null);

  const startGame = (stratKey) => {
    const newSeq = shuffleDeck(seed);
    setStrategy(stratKey);
    setEventSeq(newSeq);
    setDecisions([]);
    setState({
      month: 0, cash: STARTING_CASH, inventory: STRATEGIES[stratKey].startInventory,
      reputation: 100, fillRate: 100, history: [],
    });
    setCurrentMonthEvent(newSeq[0]);
    setPhase('playing');
  };

  const handleDecision = (decisionIdx) => {
    const newDecisions = [...decisions];
    newDecisions[state.month] = decisionIdx;
    setDecisions(newDecisions);
  };

  const handleContinue = () => {
    const newDecisions = [...decisions];
    if (newDecisions[state.month] === undefined) newDecisions[state.month] = -1;

    const partial = simulateYear(strategy, eventSeq.slice(0, state.month + 1), newDecisions, seed);

    if (state.month === 11) {
      const playerResult = simulateYear(strategy, eventSeq, newDecisions, seed);
      const alts = {};
      Object.keys(STRATEGIES).forEach((k) => {
        if (k !== strategy) alts[k] = simulateYear(k, eventSeq, null, seed);
      });
      setResults({ playerResult, alts });
      setPhase('end');
    } else {
      const nextMonth = state.month + 1;
      const nextEvent = eventSeq[nextMonth];
      const lastEntry = partial.history[partial.history.length - 1];
      setState({
        month: nextMonth, cash: lastEntry.cash, inventory: lastEntry.inventory,
        reputation: lastEntry.reputation, fillRate: partial.fillRate, history: partial.history,
      });
      setCurrentMonthEvent(nextEvent);
      setDecisions(newDecisions);
    }
  };

  const replay = () => {
    setPhase('intro');
    setStrategy(null);
    setResults(null);
    setSeed(Date.now() % 1000000);
  };

  return (
    <div className="game-root">
      <style>{GAME_STYLES}</style>
      {phase === 'intro' && <StrategySelector onSelect={startGame} />}
      {phase === 'playing' && state && currentMonthEvent && (
        <MonthScreen
          state={state}
          strategy={strategy}
          currentEvent={currentMonthEvent}
          onDecision={handleDecision}
          onContinue={handleContinue}
        />
      )}
      {phase === 'end' && results && (
        <DebriefScreen
          playerResult={results.playerResult}
          alternateResults={results.alts}
          strategy={strategy}
          onReplay={replay}
        />
      )}
    </div>
  );
}
