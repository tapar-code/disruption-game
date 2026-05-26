import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Zap, Package, ShieldCheck, RotateCcw, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Trophy, X, Sparkles } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  :root{--paper:#f4ecd8;--paper-warm:#faf3df;--paper-dark:#e8dcbf;--ink:#1c1f2b;--ink-soft:#5b6478;--rust:#b8412b;--rust-bright:#d4571a;--moss:#1e4d3c;--sage:#6b8e6e;--amber:#c8861a;--sky:#2b5470;--tan:#c9bc99;--water:#6ba0a8;}
  .gr{font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);}
  .fd{font-family:'Fraunces',Georgia,serif;}.fdi{font-family:'Fraunces',Georgia,serif;font-style:italic;}
  .fm{font-family:'JetBrains Mono',monospace;}
  .paper{background-color:var(--paper);}.papw{background-color:var(--paper-warm);}.papd{background-color:var(--paper-dark);}
  .t-ink{color:var(--ink);}.t-soft{color:var(--ink-soft);}.t-rust{color:var(--rust);}.t-rbr{color:var(--rust-bright);}
  .t-moss{color:var(--moss);}.t-amb{color:var(--amber);}.t-sky{color:var(--sky);}
  .bg-rust{background-color:var(--rust);}.bg-rbr{background-color:var(--rust-bright);}.bg-moss{background-color:var(--moss);}.bg-sky{background-color:var(--sky);}.bg-sage{background-color:var(--sage);}.bg-amb{background-color:var(--amber);}
  .b-tan{border-color:var(--tan);}.b-ink{border-color:var(--ink);}
  .grain{position:absolute;inset:0;pointer-events:none;opacity:.04;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");}
  .paper-bg{background-color:var(--paper);background-image:radial-gradient(circle at 20% 30%,rgba(184,159,107,.08) 1px,transparent 1px),radial-gradient(circle at 70% 70%,rgba(184,159,107,.06) 1px,transparent 1px);background-size:80px 80px,60px 60px;}
  .shadow-ink{box-shadow:5px 5px 0 0 var(--ink);}.shadow-rust{box-shadow:5px 5px 0 0 var(--rust);}.shadow-sm{box-shadow:3px 3px 0 0 var(--ink);}
  .lift{transition:transform .2s ease,box-shadow .2s ease;}.lift:hover{transform:translateY(-3px);box-shadow:7px 7px 0 0 var(--ink);}
  .choice-card{transition:all .22s cubic-bezier(.4,0,.2,1);}.choice-card:hover:not(:disabled){border-color:var(--rust-bright);transform:translateY(-2px);box-shadow:6px 6px 0 0 var(--ink);}
  @keyframes belt{from{transform:translateX(-80px)}to{transform:translateX(1480px)}}
  @keyframes smoke{0%{transform:translate(0,0) scale(1);opacity:.7}100%{transform:translate(8px,-50px) scale(2.4);opacity:0}}
  @keyframes bob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-3px) rotate(1deg)}}
  @keyframes wave{from{transform:translateX(0)}to{transform:translateX(-40px)}}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
  @keyframes stamp{0%{transform:scale(2.5) rotate(-15deg);opacity:0}60%{transform:scale(.9) rotate(-12deg);opacity:1}100%{transform:scale(1) rotate(-12deg);opacity:1}}
  @keyframes slam{0%{transform:scale(.85) translateY(20px);opacity:0}55%{transform:scale(1.03) translateY(-4px);opacity:1}100%{transform:scale(1) translateY(0);opacity:1}}
  @keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadein{from{opacity:0}to{opacity:1}}
  @keyframes heartsfloat{0%{transform:translateY(0) scale(.8);opacity:0}30%{opacity:1}100%{transform:translateY(-30px) scale(1.2);opacity:0}}
  @keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}}
  @keyframes linedown{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes slidetop{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes glow{0%,100%{box-shadow:0 0 0 0 var(--rust-bright)}50%{box-shadow:0 0 14px 2px var(--rust-bright)}}
  @keyframes rain{0%{transform:translateY(-20px);opacity:0}10%{opacity:.8}90%{opacity:.8}100%{transform:translateY(110px);opacity:0}}
  @keyframes flicker{0%,100%{opacity:1}3%{opacity:.2}6%{opacity:1}38%{opacity:1}40%{opacity:.4}43%{opacity:1}80%{opacity:1}82%{opacity:.3}85%{opacity:1}}
  @keyframes drip{0%{transform:translateY(0) scale(.4);opacity:0}30%{opacity:.9}70%{opacity:.9}100%{transform:translateY(28px) scale(1);opacity:0}}
  @keyframes beltrev{from{transform:translateX(1480px)}to{transform:translateX(-80px)}}
  .smoke{animation:smoke 3s ease-out infinite;}.smoke2{animation:smoke 3s ease-out infinite;animation-delay:-1s;}.smoke3{animation:smoke 3s ease-out infinite;animation-delay:-2s;}
  .factory-dead .smoke,.factory-dead .smoke2,.factory-dead .smoke3{animation:none;opacity:0;}.factory-dead .fb{fill:var(--ink-soft);}
  .ship-bob{animation:bob 3s ease-in-out infinite;transform-origin:center;transform-box:fill-box;}.ship-stop{animation:none;}
  .wave-anim{animation:wave 4s linear infinite;}
  .pkg{animation:belt 14s linear infinite;}.scene-viral .pkg{animation-duration:7s;}.scene-slump .pkg{animation-duration:22s;opacity:.6;}
  .hearts{animation:heartsfloat 1.6s ease-out infinite;}.hearts2{animation:heartsfloat 1.6s ease-out infinite;animation-delay:-.5s;}.hearts3{animation:heartsfloat 1.6s ease-out infinite;animation-delay:-1s;}
  .pulse{animation:pulse 1.4s ease-in-out infinite;}.stamp{animation:stamp .6s cubic-bezier(.34,1.56,.64,1) forwards;transform-origin:center;transform-box:fill-box;}
  .shake{animation:shake .4s ease-in-out 3;}.slam{animation:slam .55s cubic-bezier(.34,1.56,.64,1) forwards;}
  .fu{animation:fadeup .45s ease-out forwards;opacity:0;}.fu1{animation-delay:.1s;}.fu2{animation-delay:.22s;}.fu3{animation-delay:.34s;}.fu4{animation-delay:.46s;}
  .fi{animation:fadein .5s ease-out forwards;}.st{animation:slidetop .5s ease-out forwards;}.ld{animation:linedown .6s ease-out forwards;}
  .sig-glow{animation:glow 2.4s ease-in-out infinite;}
  .rain{animation:rain 1.2s linear infinite;}
  .flicker{animation:flicker 2.4s linear infinite;}
  .drip{animation:drip 1.6s ease-in infinite;}
  .pkgrev{animation:beltrev 14s linear infinite;}
  input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:0;background:var(--tan);outline:none;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;background:var(--ink);cursor:pointer;border:2px solid var(--paper-warm);}
  input[type=range]::-moz-range-thumb{width:18px;height:18px;background:var(--ink);cursor:pointer;border:2px solid var(--paper-warm);border-radius:0;}
`;

// ── INDUSTRIES with peril mechanics ─────────────────────────────────────────
const INDUSTRIES = {
  fmcg:{key:'fmcg',name:'FMCG / Consumer Goods',short:'FMCG',tagline:'High volume, thin margins, promotional spikes.',
    description:'You sell everyday consumer products through major retailers. Promotions drive volume swings. A stockout means a competitor takes your shelf slot — permanently.',
    unitPrice:200,stockoutPenalty:5,startCash:50000,demandBase:[28,35],
    seasonal:[.75,.78,.88,.92,.98,1.02,.95,.92,1.05,1.1,1.35,1.45],
    perilName:'Shelf-Share Decay',
    perilDesc:'Every month you stock out, retailers permanently shrink your shelf space. Each stockout month cuts -2 units from baseline demand for the rest of the year.',
    perilColor:'rust'},
  pharma:{key:'pharma',name:'Pharmaceuticals',short:'Pharma',tagline:'Regulated, life-critical, zero tolerance for stockouts.',
    description:"You supply hospitals and pharmacies. Lead times are long due to regulatory controls. A stockout doesn't just cost revenue — it costs lives and license risk.",
    unitPrice:800,stockoutPenalty:12,startCash:50000,demandBase:[18,25],
    seasonal:[.95,.95,.98,1.0,1.0,.95,.92,.92,1.0,1.02,1.1,1.05],
    perilName:'Regulatory Tail Risk',
    perilDesc:'If reputation closes below 70 at year-end, the FDA issues a warning letter — a one-time $18,000 fine plus mandatory consent decree costs.',
    perilColor:'sky'},
  fashion:{key:'fashion',name:'Fast Fashion',short:'Fashion',tagline:'Seasonal peaks, obsolescence risk, trend-driven.',
    description:'You produce seasonal collections. Inventory unsold at end of season must be marked down 60%+. Demand is highly seasonal and trend-sensitive.',
    unitPrice:150,stockoutPenalty:6,startCash:50000,demandBase:[22,35],
    seasonal:[.5,.55,1.2,1.35,1.1,.75,.7,1.3,1.4,1.1,.8,.6],
    perilName:'End-of-Season Markdown',
    perilDesc:'Any inventory carried past Month 12 above a 25-unit threshold gets liquidated at -60% of unit value. Last year\'s trends do not sell.',
    perilColor:'amber'},
  auto:{key:'auto',name:'Automotive / Industrial',short:'Auto',tagline:'JIT-dependent, supplier-concentrated, high unit value.',
    description:'You supply parts to assembly lines. A single missing component halts an entire line. Supplier concentration is high and lead times are 8–12 weeks.',
    unitPrice:600,stockoutPenalty:15,startCash:50000,demandBase:[15,22],
    seasonal:[.8,.85,1.0,1.1,1.15,1.05,.7,.8,1.1,1.1,1.0,.8],
    perilName:'Line-Down Penalties',
    perilDesc:'OEM customers charge $1,200 per stockout unit. A missed shipment doesn\'t lose a sale — it triggers a contractual penalty on top of the lost revenue.',
    perilColor:'moss'},
};

// ── STRATEGIES with signature moves ─────────────────────────────────────────
const STRATEGIES = {
  lean:{key:'lean',name:'Lean / JIT',tagline:'Minimize inventory. Maximize cash velocity.',
    startInventory:25,baseReplenish:30,holdingCost:2,unitCost:80,supplierRedundancy:false,
    description:'You hold almost nothing. Capital is free. But when the world hiccups, you bleed.',
    bestFor:'Calm, predictable years',weakAgainst:'Demand spikes, supplier failures',
    signature:{
      name:'Defer Replenishment',
      tagline:'Skip a month of inbound — save the cash, hope demand cooperates.',
      uses:1,
      detail:'No replenishment this month · save full replenishment cost · all demand fulfilled from existing stock only.',
      when:'Use in a calm month when you have spare inventory and need cash.',
      effect:{skipReplenish:1,signature:'lean-defer'}
    }},
  buffered:{key:'buffered',name:'Safety Stock',tagline:'Hold inventory. Sleep at night.',
    startInventory:70,baseReplenish:30,holdingCost:5,unitCost:80,supplierRedundancy:false,
    description:'You carry weeks of cover. It costs you, but you can absorb almost any demand shock.',
    bestFor:'Volatile demand',weakAgainst:'Long supplier outages, recessions',
    signature:{
      name:'Promotional Sweep',
      tagline:'Liquidate excess stock at 40% off retail — convert holding cost into cash.',
      uses:1,
      detail:'Sell up to 25 units of inventory immediately at 60% of unit price. No demand needed.',
      when:'Use when sitting on excess inventory you won\'t sell at full price.',
      effect:{liquidate:25,signature:'buffered-sweep'}
    }},
  dual:{key:'dual',name:'Dual Source',tagline:'Pay a premium. Sleep through supplier crises.',
    startInventory:35,baseReplenish:30,holdingCost:4,unitCost:92,supplierRedundancy:true,
    description:'Two qualified suppliers, geographically split. If one falls, the other rises.',
    bestFor:'Supply-side shocks',weakAgainst:'Margin-thin calm years',
    signature:{
      name:'Spot Arbitrage',
      tagline:'Route this month\'s order through your cheaper supplier — $70/unit instead of $92.',
      uses:2,
      detail:'Replenishment cost drops to $70/unit this month. Only works if no active supplier disruption.',
      when:'Use in calm months to claw back the dual-source premium.',
      effect:{arbitrage:true,signature:'dual-arbitrage'}
    }},
};

// ── EVENTS: universal (any industry) + industry-specific ────────────────────
// Events with `industries` field only appear when matching. Otherwise universal.
const EVENTS = [
  // CALM (universal)
  {id:'calm-1',severity:'calm',title:'Steady State',flavor:'Operations are quiet. Forecasts are on target.',realWorld:'Supply chain disruptions now occur every 3.7 years on average per company — calm months are always temporary.',demand:[28,35],choices:null,insider:'Calm months are when great operators run their books. Boring is profitable.'},
  {id:'calm-2',severity:'calm',title:'Forecast On Target',flavor:'Sales matches plan. The S&OP team is, briefly, smug.',realWorld:'Most companies achieve only 60–70% forecast accuracy. A month at 95%+ is genuinely rare.',demand:[27,33],choices:null,insider:'A forecast that hits is data, not destiny. The next disruption is still coming.'},
  {id:'calm-3',severity:'calm',title:'Quiet Month',flavor:'Nothing to report. Enjoy it.',realWorld:'The 2017 consumer goods landscape: stable, predictable growth. Rare by 2020 standards.',demand:[29,34],choices:null,insider:'Use the calm to qualify a backup supplier or trim a slow-moving SKU — not just to coast.'},

  // OPPORTUNITY (universal)
  {id:'viral',severity:'opportunity',title:'Viral Moment',flavor:'A creator with 4M followers posted a glowing review. Demand has nearly doubled overnight.',realWorld:'Stanley cup went viral on TikTok in 2023 — demand spiked 3,000%, causing months of stockouts and $750M in lost sales for competitors who could not react.',demand:[55,70],
    choices:[
      {label:'Air-freight an emergency lot',detail:'+25 units · costs $4,000',preview:'inv-up',effect:{extraInventory:25,cashCost:4000},insider:'Air-freight margins die at 30%+ of unit cost. Worth it only when stockout cost > expedite cost.'},
      {label:'Pre-orders only — capture 60%',detail:'No cost · backlog demand',preview:'flat',effect:{demandRestore:.6},insider:'Backlogging captures intent but tests patience. Roughly 40% of pre-orders cancel within 6 weeks.'},
      {label:'Ride the wave; accept stockouts',detail:'Save cash · lose sales',preview:'stockout',effect:{},insider:'Stockouts during a viral moment are also the moment your competitor steals the audience.'}
    ]},
  {id:'holiday',severity:'opportunity',title:'Holiday Surge',flavor:'Seasonal demand is up ~50%. Did you order enough 12 weeks ago?',realWorld:'Amazon Prime Day 2023 drove 2–3× normal demand for partner brands who had placed inventory orders 3 months prior.',demand:[42,52],
    choices:[
      {label:'Run an extra production shift',detail:'+15 units · costs $2,000',preview:'inv-up',effect:{extraInventory:15,cashCost:2000},insider:'Overtime production looks expensive but compares favorably to lost holiday revenue (typically 3x markup).'},
      {label:'Reallocate from low-priority channels',detail:'+8 units · no cash cost',preview:'inv-up',effect:{extraInventory:8},insider:'Channel cannibalization works once. Customers in deprioritized channels remember.'},
      {label:'Hold the line on costs',detail:'No extra spend',preview:'flat',effect:{},insider:'Disciplined operators sometimes leave holiday revenue on the table to protect margin. Hard but rational.'}
    ]},
  {id:'growth',severity:'opportunity',title:'New Distribution Deal',flavor:'A major retailer just added you to their national planogram. Volume jumps 30% immediately.',realWorld:"When Costco added a new beverage brand in 2019, the supplier's demand jumped 35% in 4 weeks — before they had time to ramp production.",demand:[38,48],
    choices:[
      {label:'Pre-build inventory buffer',detail:'+20 units · costs $2,400',preview:'inv-up',effect:{extraInventory:20,cashCost:2400},insider:'New-listing stockouts often kill the relationship before it starts. Retailers track in-stock rate weekly.'},
      {label:'Fill from existing stock',detail:'No extra cost',preview:'flat',effect:{},insider:'Fine if you have buffer. Disaster if you don\'t — and the retailer is watching.'}
    ]},

  // CRISIS (universal)
  {id:'supplier-fail',severity:'crisis',title:'Supplier Bankruptcy',flavor:'Your primary supplier filed Chapter 11. Two months of inbound shipments are frozen.',realWorld:'Hanjin Shipping bankruptcy in 2016 stranded $14B of cargo at sea, affecting 8,000 containers and hundreds of suppliers with no backup plan.',demand:[28,35],supplierEvent:true,
    choices:[
      {label:'Source from the spot market',detail:'+$60/unit for 2 months',preview:'cash-down',effect:{unitCostBump:60,costBumpDuration:2},insider:'Spot-market sourcing during crisis runs 50–80% premiums. The capacity is there, but you\'re the price-taker.'},
      {label:'Partial spot + draw down inventory',detail:'+$30/unit for 1 month · ration',preview:'cash-down',effect:{unitCostBump:30,costBumpDuration:1,fulfillCapPct:.85},insider:'Hybrid responses are usually right. Full hedge or full exposure both leave money on the table.'},
      {label:'Wait it out — no replenishment for 2 months',detail:'Save cash · inventory at risk',preview:'inv-down',effect:{skipReplenish:2},insider:'Waiting works if you started with cover. For lean operators, it\'s often catastrophic.'}
    ]},
  {id:'climate',severity:'crisis',title:'Climate Disaster',flavor:'Severe flooding has shut down your primary supplier region. No output for 6–8 weeks.',realWorld:'2011 Thailand floods destroyed 14,000 factories, disrupting global hard drive supply for 18 months — affecting Apple, Dell, and HP simultaneously.',demand:[28,35],supplierEvent:true,
    choices:[
      {label:'Qualify emergency backup supplier',detail:'Costs $8,000 · limited supply next month',preview:'cash-down',effect:{cashCost:8000,extraInventory:12,skipReplenish:1},insider:'Emergency qualification skips normal QA steps. Useful for survival, dangerous for regulated industries.'},
      {label:'Air-freight partial cover + ration',detail:'$4,000 · 8 emergency units',preview:'cash-down',effect:{cashCost:4000,extraInventory:8,skipReplenish:1,fulfillCapPct:.8},insider:'Air-freight + ration is the textbook crisis playbook. Buys time without overcommitting capital.'},
      {label:'Ration remaining inventory',detail:'Fulfill only 70% of orders',preview:'inv-down',effect:{skipReplenish:2},insider:'Rationing protects cash but cedes market position. Customers ration-shop too — they go elsewhere.'}
    ]},
  {id:'esg-audit',severity:'crisis',title:'ESG Supplier Suspension',flavor:'Your primary supplier suspended pending a labor practices audit. Shipments halted.',realWorld:'Following the Rana Plaza collapse in 2013, H&M suspended 14 suppliers, causing 6–8 week supply gaps that companies with diversified sourcing absorbed without disruption.',demand:[26,34],supplierEvent:true,
    choices:[
      {label:'Accelerate dual-source qualification',detail:'Costs $5,000 · partial supply in 3 weeks',preview:'cash-down',effect:{cashCost:5000,skipReplenish:1},insider:'Crash-qualifying a new supplier mid-crisis costs 2–3x normal onboarding. Better than nothing.'},
      {label:'Wait for audit clearance',detail:'No replenishment this month',preview:'inv-down',effect:{skipReplenish:1},insider:'Audit clearance timelines slip 60% of the time. "1 month" usually means 6–10 weeks.'}
    ]},
  {id:'port-strike',severity:'crisis',title:'Port Strike',flavor:"Longshoremen walked off the job. This month's replenishment is sitting offshore.",realWorld:'The 2021 LA/Long Beach port backlog saw 100+ ships anchored offshore for weeks, adding 6–8 weeks to lead times and costing importers an estimated $1B/day.',demand:[28,35],slider:{label:'Units to air-freight',unit:'units',min:0,max:40,step:5,costPerUnit:180,heuristicValue:15,note:'$180/unit extra · 0 = skip this month entirely'},insider:'Air-freight unit economics: only worth it if your unit margin is greater than the premium. Most CPG fails this test; pharma passes easily.'},
  {id:'container-shortage',severity:'crisis',title:'Container Shortage',flavor:'Global container imbalance — 60% of containers are in wrong locations. Lead times just doubled.',realWorld:'The 2021 global container crisis pushed spot rates from $2,000 to $14,000 per 40ft container — a 600% increase that persisted 18 months.',demand:[27,34],slider:{label:'Units to air-freight',unit:'units',min:0,max:50,step:5,costPerUnit:160,heuristicValue:20,note:'$160/unit extra · 0 = replenishment delayed 1 month'},insider:'During the 2021 crisis, the best operators had multi-modal contracts in place from 2019. Resilience is bought before, not during.'},
  {id:'currency',severity:'crisis',title:'Currency Devaluation',flavor:"The currency in your sourcing country devalued 30% overnight. Import costs spike immediately.",realWorld:"Argentina's peso devalued 50% in 2018, making imported components 50% more expensive overnight — many companies had no hedging in place.",demand:[26,33],
    choices:[
      {label:'Lock in a forward contract',detail:'Costs $4,500 · protected for 3 months',preview:'cash-down',effect:{cashCost:4500},insider:'Forward contracts during crisis are expensive but bound. Spot exposure during the same window is unbounded.'},
      {label:'Absorb the spot rate increase',detail:'+$25/unit for 2 months',preview:'cash-down',effect:{unitCostBump:25,costBumpDuration:2},insider:'Roughly 70% of mid-cap CPG companies have zero FX hedging. Most "got away with it" until they didn\'t.'}
    ]},
  {id:'cyberattack',severity:'crisis',title:'Cyberattack on ERP',flavor:"Ransomware encrypted your ERP. You've lost visibility into inventory and open orders.",realWorld:"The 2017 NotPetya attack hit Maersk's entire global network — wiping 45,000 PCs, halting 76 port terminals, and costing $300M.",demand:[28,35],
    choices:[
      {label:'Pay for emergency IT recovery',detail:'Costs $6,000 · visibility restored',preview:'cash-down',effect:{cashCost:6000},insider:'Ransomware payment debate aside: paying for IT recovery (not ransom) restores ops in days vs weeks.'},
      {label:'Operate on manual counts — fly blind',detail:'No extra cost · higher risk',preview:'stockout',effect:{inventoryLossPct:.1},insider:'Manual counts during a ransomware incident average 8–12% inventory discrepancy. That\'s baked into the loss.'}
    ]},

  // SLUMP (universal)
  {id:'recession',severity:'slump',title:'Recession Headlines',flavor:'Consumer confidence hit a 5-year low. Channel partners are pulling back orders.',realWorld:'In March 2020 the first weeks of COVID-19 caused demand for many categories to drop 40–60% within days, leaving supply chains massively over-inventoried.',demand:[16,22],lingering:{months:2,demandMultiplier:.65},
    choices:[
      {label:'Cut replenishment 50% for 2 months',detail:'Right-size with demand',preview:'flat',effect:{replenishCut:.5,replenishCutDuration:2},insider:'Cutting replenishment mid-recession is the right call but takes nerve. Most companies under-cut.'},
      {label:'Cut 25% + promo spend $3,000',detail:'Partial right-size + demand support',preview:'cash-down',effect:{replenishCut:.25,replenishCutDuration:2,cashCost:3000,demandRestore:.85},insider:'Half-measures often outperform either extreme. Hedge against your own forecast being wrong.'},
      {label:'Hold the line — bet on rebound',detail:'Keep inventory flowing',preview:'inv-up',effect:{},insider:'Holding through a recession only works if it\'s short. V-shaped recoveries are rarer than people remember.'}
    ]},
  {id:'trade-war',severity:'slump',title:'Trade War Escalation',flavor:'New tariffs AND extended lead times across multiple categories simultaneously.',realWorld:'The 2018–2020 US-China trade war affected $550B of annual trade, forcing 400+ multinationals to restructure supply chains — median response time was 18 months.',demand:[22,30],
    choices:[
      {label:'Accelerate near-shoring',detail:'$7,000 one-time · +$15/unit ongoing',preview:'cash-down',effect:{cashCost:7000,unitCostBump:15,costBumpDuration:3},insider:'Near-shoring is permanent debt for permanent insurance. Right call if you believe the geopolitics is structural.'},
      {label:'Absorb both impacts',detail:'+$30/unit · longer lead times',preview:'cash-down',effect:{unitCostBump:30,costBumpDuration:2,skipReplenish:1},insider:'Absorbing tariff shocks is fine for 1–2 quarters. Doing it for a year erodes competitiveness permanently.'}
    ]},

  // ── FMCG-SPECIFIC ────────────────────────────────────────────────────────
  {id:'private-label',industries:['fmcg'],severity:'slump',title:'Private Label Invasion',flavor:'Walmart just launched a store-brand version of your top SKU at 30% below your price.',realWorld:'Private label now represents 19% of US grocery dollars — up from 13% in 2015. Costco Kirkland alone exceeds $80B in annual sales.',demand:[20,26],lingering:{months:3,demandMultiplier:.75},
    choices:[
      {label:'Cut your price by 15%',detail:'Lower revenue per unit for 3 months',preview:'cash-down',effect:{revenueCut:.15,revenueCutDuration:3,demandRestore:.9},insider:'Price-cutting against private label rarely wins. Walmart will follow you down — they have lower costs.'},
      {label:'Invest in brand marketing',detail:'$5,500 spend · partial demand defense',preview:'cash-down',effect:{cashCost:5500,demandRestore:.92},insider:'Brand-led defense works for emotional categories (beauty, premium food). Loses for commodities.'},
      {label:'Cede volume — protect margin',detail:'Accept the demand loss',preview:'flat',effect:{},insider:'Strategic retreat is sometimes correct. P&G has exited multiple categories rather than race to the bottom.'}
    ]},
  {id:'slotting-fee',industries:['fmcg'],severity:'crisis',title:'Slotting Fee Demand',flavor:'Your largest retailer is demanding $8,000 in slotting fees — pay or get cut to half-shelf.',realWorld:'US grocery slotting fees total an estimated $9B annually — a hidden tax that 67% of small CPG brands cite as their #1 growth barrier.',demand:[24,32],
    choices:[
      {label:'Pay the fee in full',detail:'$8,000 · keep full distribution',preview:'cash-down',effect:{cashCost:8000},insider:'Slotting fees are essentially shelf-rent. Worth paying when the shelf generates 3x+ the fee in annual revenue.'},
      {label:'Negotiate a $3,000 partial',detail:'$3,000 · half-shelf for 2 months',preview:'cash-down',effect:{cashCost:3000,demandRestore:.7,lingering:{months:2,multiplier:.7}}},
      {label:'Refuse — accept the cut',detail:'Lose 40% of this retailer\'s shelf',preview:'flat',effect:{demandRestore:.6,lingering:{months:3,multiplier:.7}},insider:'Saying no to slotting fees is brave. Often the right call for premium brands; rarely for commodities.'}
    ]},
  {id:'shelf-reset',industries:['fmcg'],severity:'opportunity',title:'Category Shelf Reset',flavor:'Quarterly planogram reset. You can buy premium shelf placement — eye-level — for the next 3 months.',realWorld:'Eye-level shelf placement increases unit velocity by 35–60% in grocery. Most CPG brands compete fiercely for this real estate every quarter.',demand:[34,42],
    choices:[
      {label:'Buy premium placement',detail:'$4,500 spend · +20% demand for 3 months',preview:'inv-up',effect:{cashCost:4500,demandRestore:1.2,lingering:{months:3,multiplier:1.15}},insider:'Eye-level premium pays back when your velocity supports it. Wrong call for slow-movers with thin margins.'},
      {label:'Accept standard placement',detail:'No spend',preview:'flat',effect:{},insider:'Standard placement is fine for established brands. Brutal for new entries trying to build trial.'}
    ]},
  {id:'promo-cannibalize',industries:['fmcg'],severity:'opportunity',title:'Promo Cannibalization',flavor:'Your buy-one-get-one promo worked too well. Next month\'s demand will be pulled forward — expect a hangover.',realWorld:'Procter & Gamble research shows 60% of promotional demand is pull-forward, not incremental. Most promo lifts disappear within 6 weeks.',demand:[44,55],lingering:{months:2,demandMultiplier:.7},
    choices:[
      {label:'Run the promo at full intensity',detail:'Sell now · take the hangover',preview:'inv-up',effect:{},insider:'Sometimes correct when you need to clear obsolete stock or seed a new SKU. Costly otherwise.'},
      {label:'Cap the promo at 50% allocation',detail:'Half the boost · half the hangover',preview:'flat',effect:{demandRestore:.7,lingering:{months:2,multiplier:.85}},insider:'Capping promos is unsexy but profitable. Most CPG companies overspend on promo by 20–30%.'}
    ]},

  // ── PHARMA-SPECIFIC ──────────────────────────────────────────────────────
  {id:'fda-inspection',industries:['pharma'],severity:'crisis',title:'FDA Inspection',flavor:'Surprise inspection of your fill-finish facility. Inspectors found minor documentation gaps — Form 483 issued.',realWorld:'FDA issued 1,500+ Form 483s in 2023. Roughly 8% escalate to warning letters within 90 days, costing companies an average $7M in remediation.',demand:[18,24],
    choices:[
      {label:'Full remediation now',detail:'$9,000 · clean inspection record',preview:'cash-down',effect:{cashCost:9000,reputationBoost:5},insider:'Full remediation is expensive but inspections compound. A clean record matters at the next audit.'},
      {label:'Address critical findings only',detail:'$3,500 · risk of escalation',preview:'cash-down',effect:{cashCost:3500,reputationHit:5},insider:'Partial remediation is a gamble. Pays off 80% of the time; the other 20% becomes a warning letter.'},
      {label:'Dispute the findings',detail:'No spend · reputation risk',preview:'flat',effect:{reputationHit:10},insider:'Disputing the FDA is legal but rarely strategic. Inspector relationships compound across years.'}
    ]},
  {id:'cold-chain',industries:['pharma'],severity:'crisis',title:'Cold Chain Failure',flavor:'A refrigeration unit at your DC failed overnight. 25% of inventory may be temperature-compromised.',realWorld:'The WHO estimates 25% of vaccines are wasted due to cold chain failures, costing $34B annually. Re-testing typically takes 14 days.',demand:[18,24],
    choices:[
      {label:'Destroy compromised inventory',detail:'Lose 25% · no risk',preview:'inv-down',effect:{inventoryLossPct:.25},insider:'Destroying compromised pharma inventory is the only safe call. Patient harm is non-negotiable.'},
      {label:'Re-test before destroying',detail:'$4,000 · recover 50% of affected',preview:'cash-down',effect:{cashCost:4000,inventoryLossPct:.12},insider:'Re-testing is standard for high-value biologics. Often recovers 60–80% of suspect lots.'},
      {label:'Ship and pray',detail:'No cost · severe reputation/legal risk',preview:'flat',effect:{reputationHit:25},insider:'This is how warning letters and consent decrees happen. Never the right answer in pharma.'}
    ]},
  {id:'generic-entry',industries:['pharma'],severity:'slump',title:'Generic Competition Launch',flavor:'A generic manufacturer just received approval for your top molecule. Expect 60% volume loss within 6 months.',realWorld:'When patents expire, branded pharma typically loses 80–90% of unit volume to generics within 18 months. The "patent cliff" is the most predictable disruption in pharma.',demand:[8,14],lingering:{months:3,demandMultiplier:.4},
    choices:[
      {label:'Switch focus to international markets',detail:'$6,000 · partial demand recovery',preview:'cash-down',effect:{cashCost:6000,demandRestore:.7,lingering:{months:3,multiplier:.55}},insider:'Lifecycle management — geographic expansion, new indications — is the standard playbook. Buys 12–18 months.'},
      {label:'Accept the volume loss',detail:'Right-size operations',preview:'flat',effect:{},insider:'Sometimes the right call. Pfizer has shut down product lines rather than fight unwinnable generic battles.'}
    ]},
  {id:'shortage-list',industries:['pharma'],severity:'opportunity',title:'Drug Shortage List',flavor:'FDA added a competitor\'s product to the shortage list. Your equivalent has captured emergency demand.',realWorld:'The FDA Drug Shortage list grew to 295 drugs in 2024. Competitor shortages are windfalls for manufacturers who can supply — but the demand is temporary.',demand:[35,42],lingering:{months:2,demandMultiplier:1.3},
    choices:[
      {label:'Ramp emergency production',detail:'$5,500 · +25 units · capture full demand',preview:'inv-up',effect:{cashCost:5500,extraInventory:25,demandRestore:1.0},insider:'Shortage windfalls reward operators with idle capacity. Worth disrupting production schedules for.'},
      {label:'Fulfill from existing stock',detail:'Capture what you can',preview:'flat',effect:{},insider:'Conservative response. The shortage may resolve faster than expected — over-production stings.'}
    ]},

  // ── FASHION-SPECIFIC ─────────────────────────────────────────────────────
  {id:'trend-miss',industries:['fashion'],severity:'crisis',title:'Trend Miss',flavor:'Your spring collection is dead on arrival. Style influencers moved on before you shipped.',realWorld:'Fast fashion brands like H&M and Zara write down an average 3–5% of inventory quarterly due to trend misses — the cost of being trend-led.',demand:[12,18],lingering:{months:2,demandMultiplier:.5},
    choices:[
      {label:'Aggressive markdown — 40% off',detail:'Move volume · half revenue per unit',preview:'cash-down',effect:{revenueCut:.4,revenueCutDuration:2,demandRestore:1.5},insider:'Early aggressive markdown is the Zara playbook. Eat the loss before the season ends.'},
      {label:'Slow-bleed markdown — 15% off',detail:'Partial discount · slower clearance',preview:'cash-down',effect:{revenueCut:.15,revenueCutDuration:3,demandRestore:1.1},insider:'Gradual markdowns preserve brand but tie up working capital. Often the worst of both worlds.'},
      {label:'Hold the price · accept the loss',detail:'No discount · inventory carries forward',preview:'flat',effect:{},insider:'Holding price on a trend miss is brand discipline. It also creates the dead stock you\'ll write down later.'}
    ]},
  {id:'return-tsunami',industries:['fashion'],severity:'crisis',title:'Return Tsunami',flavor:'Post-holiday returns surge — 25% of last month\'s units are coming back. Reverse logistics overwhelmed.',realWorld:'Online fashion returns average 25–30% — triple brick-and-mortar rates. Asos handles 60M+ returns annually at an estimated $400M cost.',demand:[22,28],
    choices:[
      {label:'Invest in returns processing',detail:'$3,500 · recover 80% as resaleable',preview:'cash-down',effect:{cashCost:3500,extraInventory:15},insider:'Returns processing infrastructure is a competitive moat. Amazon\'s reverse logistics dwarfs most retailers\' forward.'},
      {label:'Liquidate returns to third party',detail:'Recover 40% as cash · no processing cost',preview:'cash-down',effect:{cashCost:-3000},insider:'Bulk liquidation moves the problem off your books. Costly per unit but operationally clean.'},
      {label:'Process slowly with existing staff',detail:'No spend · creates ongoing drag',preview:'flat',effect:{fulfillCapPct:.85},insider:'DIY returns processing typically extends 6–8 weeks and costs more in lost forward capacity.'}
    ]},
  {id:'influencer-drop',industries:['fashion'],severity:'opportunity',title:'Influencer Drop',flavor:'A major TikTok creator featured your jacket in a video. Demand spiked — but only for size M in olive.',realWorld:'Aritzia\'s 2022 viral moment caused 4-month stockouts on specific SKUs while other colors and sizes sat in warehouses.',demand:[40,50],
    choices:[
      {label:'Air-freight more olive/M from supplier',detail:'$3,800 · +18 units of specific SKU',preview:'inv-up',effect:{cashCost:3800,extraInventory:18,demandRestore:1.0},insider:'SKU-specific air-freight is expensive but viral moments are short. Speed beats efficiency.'},
      {label:'Substitute with similar colorways',detail:'No spend · capture 50% of demand',preview:'flat',effect:{demandRestore:.5},insider:'Substitution works for less-passionate buyers. The viral-driven crowd wants exactly what they saw.'}
    ]},
  {id:'fabric-shortage',industries:['fashion'],severity:'crisis',title:'Fabric Shortage',flavor:'Your premium cotton supplier reports crop failure. Next season\'s key fabric is unavailable.',realWorld:'2022 cotton prices spiked 60% on supply chain issues + crop failures. Fashion brands with 6-month inventory pipelines were locked into higher costs through 2024.',demand:[22,28],supplierEvent:true,
    choices:[
      {label:'Switch to synthetic blend',detail:'+$25/unit for 2 months · faster sourcing',preview:'cash-down',effect:{unitCostBump:25,costBumpDuration:2},insider:'Material substitution affects positioning. Premium customers notice the change in 1–2 wears.'},
      {label:'Delay the launch · maintain quality',detail:'Skip 1 month replenishment · brand intact',preview:'inv-down',effect:{skipReplenish:1},insider:'Quality discipline costs revenue short-term, protects brand long-term. The Hermès playbook.'}
    ]},

  // ── AUTO-SPECIFIC ────────────────────────────────────────────────────────
  {id:'chip-shortage',industries:['auto'],severity:'crisis',title:'Semiconductor Shortage',flavor:'Your tier-2 chip supplier just allocated 60% of capacity to consumer electronics. Your line is now at risk.',realWorld:'The 2021–2023 auto chip shortage cost the industry $210B in lost production. Toyota was the only major OEM with significant inventory buffer.',demand:[18,24],supplierEvent:true,
    choices:[
      {label:'Pay allocation premium',detail:'+$50/unit for 3 months · maintain supply',preview:'cash-down',effect:{unitCostBump:50,costBumpDuration:3},insider:'Auto suppliers paid 2–5x normal chip prices during the shortage. Worth it to avoid line-down penalties.'},
      {label:'Qualify alternate chip + redesign',detail:'$8,000 one-time · 1 month skip',preview:'cash-down',effect:{cashCost:8000,skipReplenish:1},insider:'Redesigning around chip availability is a 2024 best practice. Tesla famously rewrote firmware to swap chips weekly.'},
      {label:'Accept reduced production',detail:'Fulfill 60% of demand · supply chain unchanged',preview:'inv-down',effect:{fulfillCapPct:.6},insider:'Auto OEMs that accepted reduced production lost market share to those who paid up. Ford lost 1.8M units in 2021.'}
    ]},
  {id:'line-down',industries:['auto'],severity:'crisis',title:'Customer Assembly Line Down',flavor:'Your largest OEM customer\'s line stopped — they\'re billing you $1,500/unit in line-down penalties.',realWorld:'Auto line-down penalties typically run $10K–$50K per minute. A single supplier failure that stops a Ford F-150 line costs $1M+ per hour.',demand:[18,24],
    choices:[
      {label:'Emergency air-freight at premium',detail:'$6,000 · resolve in 48 hours',preview:'cash-down',effect:{cashCost:6000,extraInventory:10},insider:'Auto suppliers air-freight at any cost during line-downs. The penalties dwarf the freight.'},
      {label:'Negotiate penalty waiver',detail:'$2,500 · waive 50% of penalty',preview:'cash-down',effect:{cashCost:2500,reputationHit:5},insider:'Waiver negotiations work once or twice. Repeat issues end the supply relationship entirely.'},
      {label:'Accept full penalty',detail:'$1,500 × stockout units · reputation hit',preview:'cash-down',effect:{reputationHit:10},insider:'Auto OEMs have long memories. Penalty-paying suppliers move to "secondary" status quickly.'}
    ]},
  {id:'tier-2-fail',industries:['auto'],severity:'crisis',title:'Tier-2 Sub-Supplier Failure',flavor:'Your supplier\'s supplier just failed — a wire harness component you didn\'t even know was a single-source.',realWorld:'2020 N95 shortages exposed deep tier-2 failures: PPE manufacturers had primary suppliers, but those suppliers had single-sourced their inputs without disclosing it.',demand:[18,24],supplierEvent:true,
    choices:[
      {label:'Crash-qualify alternate tier-2',detail:'$7,500 · +$20/unit for 2 months',preview:'cash-down',effect:{cashCost:7500,unitCostBump:20,costBumpDuration:2},insider:'Tier-2 visibility is the next frontier. Toyota maps 4 tiers deep; most OEMs map only 1.'},
      {label:'Pressure primary supplier to find substitute',detail:'No cost · 1 month skip · reputation hit',preview:'inv-down',effect:{skipReplenish:1,reputationHit:5},insider:'Pushing the problem upstream is cheap but slow. Most primary suppliers are not equipped for substitution work.'}
    ]},
  {id:'recall-mandate',industries:['auto'],severity:'crisis',title:'Recall Mandate',flavor:'NHTSA opened an investigation. Your part is implicated — 30% of recent shipments may be defective.',realWorld:'Takata airbag recall affected 67M units over 10 years, ultimately bankrupting the company. Auto recalls often outlive the supplier that caused them.',demand:[18,24],
    choices:[
      {label:'Full recall — replace defective stock',detail:'Lose 30% · $4,000 logistics',preview:'inv-down',effect:{inventoryLossPct:.3,cashCost:4000},insider:'Voluntary full recall is expensive but rarely fatal. Forced recalls can be company-ending.'},
      {label:'Limited recall by serial number',detail:'$8,000 · lose 12% · slower process',preview:'cash-down',effect:{cashCost:8000,inventoryLossPct:.12},insider:'Surgical recalls preserve volume but require traceability investment. Toyota does this well; most don\'t.'},
      {label:'Dispute the finding',detail:'No spend · severe reputation risk',preview:'flat',effect:{reputationHit:20},insider:'Disputing NHTSA findings sometimes works for legitimate cases. Often it just makes the eventual recall worse.'}
    ]},
];

// ── RNG & DECK SHUFFLE ─────────────────────────────────────────────────────
function seedRng(seed){let s=seed;return()=>{s=(s*1664525+1013904223)%4294967296;return s/4294967296;};}
function randInt(rng,[lo,hi]){return Math.floor(rng()*(hi-lo+1))+lo;}

function shuffleDeck(seed, industryKey){
  // Filter events: universal (no industries field) OR includes this industry
  const eligible = EVENTS.filter(e => !e.industries || e.industries.includes(industryKey));
  const calms = eligible.filter(e => e.severity === 'calm');
  const disruptions = eligible.filter(e => e.severity !== 'calm');
  let rng = seedRng(seed);
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  // Force at least 2 industry-specific events into the year so each industry feels distinct
  const industrySpecific = disruptions.filter(e => e.industries);
  const universal = disruptions.filter(e => !e.industries);
  const guaranteedSpecific = shuffle(industrySpecific).slice(0, Math.min(3, industrySpecific.length));
  const rest = shuffle([...universal, ...industrySpecific.filter(e => !guaranteedSpecific.includes(e))]).slice(0, 9 - guaranteedSpecific.length);
  const chosen = [...shuffle(calms).slice(0, 3), ...guaranteedSpecific, ...rest];
  const final = shuffle(chosen);
  // Ensure a calm month opens the year
  const ci = final.findIndex(e => e.severity === 'calm');
  if (ci > 0) [final[0], final[ci]] = [final[ci], final[0]];
  return final.slice(0, 12);
}

function getSliderEffect(event,val){
  const s=event.slider;
  if(!s)return{};
  if(s.tariffAlternative){if(val===0)return{unitCostBump:20,costBumpDuration:3};return{extraInventory:val,cashCost:val*s.costPerUnit};}
  if(val===0)return{skipReplenish:1};
  return{extraInventory:val,cashCost:val*s.costPerUnit};
}

// ── SIMULATION ─────────────────────────────────────────────────────────────
function simulateYear(stratKey, industryKey, eventSeq, playerDecisions = null, seed = 1, signatureUses = null){
  const strat = STRATEGIES[stratKey];
  const industry = INDUSTRIES[industryKey] || INDUSTRIES.fmcg;
  const rng = seedRng(seed + stratKey.length * 1000);
  let cash = industry.startCash, inventory = strat.startInventory, reputation = 100;
  let unitCostBump = 0, unitCostBumpRemaining = 0, skipReplenishRemaining = 0;
  let replenishCutPct = 0, replenishCutRemaining = 0;
  let lingeringDemandMult = 1, lingeringRemaining = 0;
  let revenueCutPct = 0, revenueCutRemaining = 0;
  // FMCG peril: each stockout month permanently reduces demand baseline by 2 units
  let baselineDecay = 0;
  const history = [];
  let totalDemand = 0, totalFulfilled = 0, stockoutMonths = 0;
  let lineDownPenalty = 0; // auto-specific
  let signatureBonusCash = 0;

  for (let m = 0; m < eventSeq.length; m++){
    const event = eventSeq[m];
    const seasonMult = industry.seasonal[m] || 1;
    let demand = Math.round(randInt(rng, industry.demandBase) * seasonMult);
    // Apply FMCG shelf-share decay
    if (industryKey === 'fmcg' && baselineDecay > 0) demand = Math.max(5, demand - baselineDecay);
    if (lingeringRemaining > 0){ demand = Math.round(demand * lingeringDemandMult); lingeringRemaining--; }

    let dec = playerDecisions ? playerDecisions[m] : null;
    if (dec === undefined) dec = null;
    // Signature move detection: decisions encoded as 'sig:lean-defer' etc.
    const isSignature = typeof dec === 'string' && dec.startsWith('sig:');
    const sigKey = isSignature ? dec.slice(4) : null;

    let eff = {};
    if (isSignature){
      // Player-only path — apply signature effect
      if (sigKey === 'lean-defer') eff = { skipReplenish: 1 };
      else if (sigKey === 'buffered-sweep') eff = { liquidate: 25 };
      else if (sigKey === 'dual-arbitrage') eff = { arbitrage: true };
    } else if (event.slider){
      const val = (dec !== null && dec !== undefined && typeof dec !== 'string') ? dec : event.slider.heuristicValue;
      eff = getSliderEffect(event, val);
    } else if (event.choices && typeof dec === 'number' && dec >= 0 && event.choices[dec]){
      eff = event.choices[dec].effect;
    } else if (event.choices && playerDecisions === null){
      // Heuristic for alternate-strategy simulation: prefer the safest (first) option
      const hi = strat.key === 'lean' ? Math.min(1, event.choices.length - 1) : 0;
      eff = event.choices[Math.min(hi, event.choices.length - 1)].effect;
    }

    const dualImmune = event.supplierEvent && strat.supplierRedundancy;
    if (dualImmune) eff = {};

    const extraInventory = eff.extraInventory || 0;
    const cashCost = eff.cashCost || 0;
    const inventoryLossPct = eff.inventoryLossPct || 0;
    const demandRestoreMult = eff.demandRestore || 1;
    const capPct = eff.fulfillCapPct || 1;
    const liquidate = eff.liquidate || 0;
    const arbitrage = eff.arbitrage || false;
    const reputationHit = eff.reputationHit || 0;
    const reputationBoost = eff.reputationBoost || 0;
    if (eff.unitCostBump && !dualImmune){ unitCostBump = eff.unitCostBump; unitCostBumpRemaining = eff.costBumpDuration || 1; }
    if (eff.skipReplenish && !dualImmune) skipReplenishRemaining = eff.skipReplenish;
    if (eff.replenishCut){ replenishCutPct = eff.replenishCut; replenishCutRemaining = eff.replenishCutDuration || 1; }
    if (eff.revenueCut){ revenueCutPct = eff.revenueCut; revenueCutRemaining = eff.revenueCutDuration || 1; }
    if (inventoryLossPct > 0) inventory = Math.floor(inventory * (1 - inventoryLossPct));

    // Liquidation signature move: sell up to N units immediately at 60% of price
    if (liquidate > 0 && inventory > 0){
      const liquidated = Math.min(liquidate, inventory);
      inventory -= liquidated;
      cash += liquidated * (industry.unitPrice * 0.6);
      signatureBonusCash += liquidated * (industry.unitPrice * 0.6);
    }

    let replenish = 0, replenishUnitCost = strat.unitCost + unitCostBump;
    if (arbitrage) replenishUnitCost = 70; // dual-source signature
    if (skipReplenishRemaining > 0){ skipReplenishRemaining--; }
    else{
      replenish = strat.baseReplenish;
      if (replenishCutRemaining > 0){ replenish = Math.floor(replenish * (1 - replenishCutPct)); replenishCutRemaining--; }
      cash -= replenish * replenishUnitCost;
      inventory += replenish;
    }
    inventory += extraInventory;
    cash -= cashCost;
    demand = Math.round(demand * demandRestoreMult);
    if (event.lingering && lingeringRemaining === 0){
      lingeringDemandMult = event.lingering.demandMultiplier;
      lingeringRemaining = event.lingering.months;
    }

    const maxFulfill = Math.floor(inventory * capPct);
    const fulfilled = Math.min(maxFulfill, demand);
    const stockout = demand - fulfilled;
    inventory -= fulfilled;
    const effectiveUnitPrice = industry.unitPrice * (1 - (revenueCutRemaining > 0 ? revenueCutPct : 0));
    if (revenueCutRemaining > 0) revenueCutRemaining--;
    cash += fulfilled * effectiveUnitPrice;
    cash -= inventory * strat.holdingCost;

    // Auto peril: line-down penalty per stockout unit
    if (industryKey === 'auto' && stockout > 0){
      lineDownPenalty += stockout * 1200;
      cash -= stockout * 1200;
    }
    // FMCG peril: compounding shelf-share decay
    if (industryKey === 'fmcg' && stockout > 0) baselineDecay += 2;

    if (stockout > 0){ reputation -= (industry.stockoutPenalty || 5); stockoutMonths++; }
    reputation -= reputationHit;
    reputation += reputationBoost;
    reputation = Math.max(0, Math.min(100, reputation));
    if (unitCostBumpRemaining > 0){ unitCostBumpRemaining--; if (unitCostBumpRemaining === 0) unitCostBump = 0; }
    totalDemand += demand; totalFulfilled += fulfilled;

    history.push({
      month: m + 1, event: event.title, eventId: event.id, severity: event.severity,
      demand, fulfilled, stockout, inventory: Math.max(0, inventory), cash: Math.round(cash),
      reputation, replenish, supplierImmune: dualImmune,
      isSignature, sigKey,
      decision: isSignature ? `★ ${STRATEGIES[stratKey].signature.name}`
        : event.slider ? `${(dec !== null && typeof dec !== 'string' ? dec : event.slider.heuristicValue)} units air-freighted`
        : (typeof dec === 'number' && dec >= 0 && event.choices) ? event.choices[dec].label : null
    });
  }

  // ── Year-end peril mechanics ─────────────────────────────────────────────
  let perilCost = 0, perilDetail = null;
  if (industryKey === 'pharma' && reputation < 70){
    perilCost = 18000;
    cash -= perilCost;
    perilDetail = `FDA warning letter issued. Reputation ${reputation} below 70 threshold. $${perilCost.toLocaleString()} in remediation + consent decree costs.`;
  } else if (industryKey === 'fashion' && inventory > 25){
    const excess = inventory - 25;
    perilCost = Math.round(excess * (industry.unitPrice * 0.6));
    cash -= perilCost;
    perilDetail = `${excess} units of unsold inventory marked down 60% at season-end. $${perilCost.toLocaleString()} write-down.`;
  } else if (industryKey === 'auto' && lineDownPenalty > 0){
    perilDetail = `Line-down penalties accumulated: $${lineDownPenalty.toLocaleString()} across ${stockoutMonths} stockout months.`;
    perilCost = lineDownPenalty;
  } else if (industryKey === 'fmcg' && baselineDecay > 0){
    perilDetail = `Shelf-share decay accumulated to -${baselineDecay} units/month. Future-year baseline permanently reduced.`;
  }

  const fillRate = totalDemand > 0 ? (totalFulfilled / totalDemand) * 100 : 100;
  return { history, cash: Math.round(cash), reputation, fillRate, stockoutMonths, totalDemand, totalFulfilled, perilCost, perilDetail, signatureBonusCash };
}

// ── PREVIEW (for receipt panel) ─────────────────────────────────────────────
function computeMonthPreview(stratKey, industryKey, inventory, event, decision, monthIndex){
  const strat = STRATEGIES[stratKey];
  const industry = INDUSTRIES[industryKey] || INDUSTRIES.fmcg;
  const dualImmune = event.supplierEvent && strat.supplierRedundancy;
  const seasonMult = industry.seasonal[monthIndex] || 1;
  const demand = Math.round(((industry.demandBase[0] + industry.demandBase[1]) / 2) * seasonMult);
  const isSignature = typeof decision === 'string' && decision.startsWith('sig:');
  const sigKey = isSignature ? decision.slice(4) : null;
  let eff = {};
  if (isSignature){
    if (sigKey === 'lean-defer') eff = { skipReplenish: 1 };
    else if (sigKey === 'buffered-sweep') eff = { liquidate: 25 };
    else if (sigKey === 'dual-arbitrage') eff = { arbitrage: true };
  } else if (event.slider && !dualImmune){
    const val = (decision !== null && decision !== undefined && typeof decision !== 'string') ? decision : event.slider.heuristicValue;
    eff = getSliderEffect(event, val);
  } else if (event.choices && !dualImmune && typeof decision === 'number' && decision >= 0 && event.choices[decision]){
    eff = event.choices[decision].effect;
  }
  if (dualImmune) eff = {};
  const skipReplenish = !dualImmune && eff.skipReplenish > 0;
  const replenish = skipReplenish ? 0 : strat.baseReplenish;
  const unitCostBump = dualImmune ? 0 : (eff.unitCostBump || 0);
  const unitCostUsed = eff.arbitrage ? 70 : (strat.unitCost + unitCostBump);
  const replenishCost = replenish * unitCostUsed;
  const extraInventory = dualImmune ? 0 : (eff.extraInventory || 0);
  const extraCashCost = eff.cashCost || 0;
  const inventoryLossPct = dualImmune ? 0 : (eff.inventoryLossPct || 0);
  const liquidate = eff.liquidate || 0;
  let inv = Math.floor(inventory * (1 - inventoryLossPct));
  const openingInventory = inv;
  const liquidated = Math.min(liquidate, inv);
  inv -= liquidated;
  const liquidationRevenue = liquidated * (industry.unitPrice * 0.6);
  inv += replenish + extraInventory;
  const capPct = eff.fulfillCapPct || 1;
  const maxFulfill = Math.floor(inv * capPct);
  const fulfilled = Math.min(maxFulfill, demand);
  const stockout = demand - fulfilled;
  const endInventory = Math.max(0, inv - fulfilled);
  const revenueCutPct = eff.revenueCut || 0;
  const effectivePrice = industry.unitPrice * (1 - revenueCutPct);
  const revenue = fulfilled * effectivePrice + liquidationRevenue;
  const holdingCost = endInventory * strat.holdingCost;
  const linedown = industryKey === 'auto' ? stockout * 1200 : 0;
  const net = revenue - replenishCost - holdingCost - extraCashCost - linedown;
  return { openingInventory, replenish, replenishCost, extraInventory, extraCashCost, inventoryLossPct, demand, availableInventory: inv, fulfilled, stockout, endInventory, revenue, holdingCost, net, dualImmune, skipReplenish, unitPrice: effectivePrice, liquidated, liquidationRevenue, linedown, isSignature, sigKey };
}

// ── STORAGE ─────────────────────────────────────────────────────────────────
async function saveScore(entry){try{await window.storage.set('score:'+Date.now(),JSON.stringify(entry),true);}catch(e){}}
async function loadScores(){
  try{
    const list=await window.storage.list('score:',true);
    if(!list||!list.keys||!list.keys.length)return[];
    const results=await Promise.all(list.keys.map(async k=>{try{const r=await window.storage.get(k,true);return r?JSON.parse(r.value):null;}catch{return null;}}));
    return results.filter(Boolean).sort((a,b)=>b.cash-a.cash).slice(0,15);
  }catch{return[];}
}

// ── ANIMATED NUMBER ────────────────────────────────────────────────────────
function useAnimatedNumber(target,duration=600){
  const[display,setDisplay]=useState(target);
  const fromRef=useRef(target),startRef=useRef(null);
  useEffect(()=>{
    startRef.current=null;const from=display,delta=target-from;
    if(Math.abs(delta)<0.5){setDisplay(target);return;}
    let raf;
    const step=t=>{if(!startRef.current)startRef.current=t;const p=Math.min(1,(t-startRef.current)/duration);const e=1-Math.pow(1-p,3);setDisplay(from+delta*e);if(p<1)raf=requestAnimationFrame(step);};
    raf=requestAnimationFrame(step);return()=>cancelAnimationFrame(raf);
  },[target]);
  return display;
}

// ── SCENE & ILLUSTRATION ───────────────────────────────────────────────────
// Each event archetype gets its own composition. Scenes share a sky/ground frame.
const PAL={ink:'#1c1f2b',rust:'#b8412b',rustB:'#d4571a',moss:'#1e4d3c',mossD:'#15392c',sage:'#6b8e6e',amb:'#d4a017',ambB:'#f5c11e',sky:'#6ba0a8',skyL:'#8db8c0',paper:'#f9e9b8',tan:'#d8c89b',soft:'#cdc3a8',inkS:'#3a3027',dark:'#2a221b'};

// ─ shared scenelets ─
const Sun=({sev})=>(<g><circle cx="700" cy="30" r="18" fill={PAL.ambB} opacity={sev==='slump'?.3:sev==='crisis'?.5:.85}/>{sev!=='slump'&&[0,1,2,3,4,5,6,7].map(i=><line key={i} x1="700" y1="30" x2={700+Math.cos(i*Math.PI/4)*32} y2={30+Math.sin(i*Math.PI/4)*32} stroke={PAL.ambB} strokeWidth="2" opacity={sev==='crisis'?.2:.45}/>)}</g>);
const Ground=()=>(<g><line x1="0" y1="150" x2="1400" y2="150" stroke="#7a6f4f" strokeWidth="2"/><rect x="0" y="150" width="1400" height="30" fill={PAL.tan} opacity=".4"/></g>);

// ─ SCENES ─
const SC={};

// CALM panorama
SC.calm=()=>(<g>
  <g transform="translate(80,55)"><rect x="-2" y="3" width="14" height="45" fill={PAL.inkS}/><circle cx="5" cy="-2" r="7" fill={PAL.soft} className="smoke"/><circle cx="5" cy="-4" r="9" fill="#bdb398" className="smoke2"/><circle cx="5" cy="-4" r="6" fill={PAL.soft} className="smoke3"/><rect x="-50" y="35" width="100" height="60" fill={PAL.moss}/><polygon points="-50,35 0,13 50,35" fill={PAL.mossD}/><rect x="-36" y="50" width="14" height="16" fill={PAL.paper} stroke={PAL.ink}/><rect x="-8" y="50" width="14" height="16" fill={PAL.paper} stroke={PAL.ink}/><rect x="20" y="50" width="14" height="16" fill={PAL.paper} stroke={PAL.ink}/></g>
  <rect x="430" y="148" width="380" height="14" fill={PAL.sky}/>
  <g className="wave-anim">{Array.from({length:14}).map((_,i)=><path key={i} d={`M${430+i*30} 152 Q${440+i*30} 148,${450+i*30} 152 T${470+i*30} 152`} fill="none" stroke={PAL.skyL} strokeWidth="1.5"/>)}</g>
  <g transform="translate(540,110)"><g className="ship-bob"><polygon points="0,30 180,30 168,52 12,52" fill={PAL.rust} stroke={PAL.dark} strokeWidth="1.5"/><rect x="60" y="6" width="70" height="24" fill={PAL.paper} stroke={PAL.dark}/><rect x="72" y="14" width="9" height="10" fill="#5b6478"/><rect x="89" y="14" width="9" height="10" fill="#5b6478"/><rect x="135" y="-4" width="8" height="14" fill={PAL.inkS}/><line x1="95" y1="6" x2="95" y2="-12" stroke={PAL.inkS} strokeWidth="1.5"/><polygon points="95,-12 110,-9 95,-6" fill={PAL.rustB}/></g></g>
  {[0,1,2,3].map(i=><g key={i} className="pkg" style={{animationDelay:`${i*-3.5}s`}}><rect x="0" y="138" width="22" height="14" fill={i%2===0?PAL.rustB:PAL.rust} stroke={PAL.dark} strokeWidth="1" rx="1"/></g>)}
  <g transform="translate(1000,123)"><rect x="22" y="0" width="34" height="22" fill={PAL.paper} stroke={PAL.dark} strokeWidth="1.5"/><rect x="0" y="6" width="26" height="16" fill={PAL.rustB} stroke={PAL.dark} strokeWidth="1.5"/><rect x="4" y="9" width="10" height="8" fill="#9bb8c0"/><circle cx="9" cy="26" r="5" fill={PAL.dark}/><circle cx="32" cy="26" r="5" fill={PAL.dark}/><circle cx="48" cy="26" r="5" fill={PAL.dark}/></g>
  <g transform="translate(1195,78)"><rect x="0" y="20" width="120" height="52" fill={PAL.rustB} stroke={PAL.dark} strokeWidth="1.5"/><polygon points="0,20 60,0 120,20" fill={PAL.rust} stroke={PAL.dark} strokeWidth="1.5"/><rect x="14" y="40" width="22" height="32" fill={PAL.paper} stroke={PAL.dark}/><rect x="84" y="40" width="22" height="32" fill={PAL.paper} stroke={PAL.dark}/></g>
</g>);

// VIRAL — big phone + hearts + spike graph
SC.viral=()=>(<g>
  <g transform="translate(280,40)"><rect x="-4" y="-4" width="148" height="108" fill={PAL.ink} rx="14"/><rect x="6" y="6" width="128" height="88" fill={PAL.paper}/><circle cx="70" cy="50" r="22" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/><polygon points="62,38 62,62 84,50" fill={PAL.paper}/><rect x="14" y="80" width="112" height="3" fill={PAL.rustB}/><circle cx="70" cy="100" r="3" fill={PAL.paper}/></g>
  {[0,1,2,3,4,5].map(i=><g key={i} className={['hearts','hearts2','hearts3','hearts','hearts2','hearts3'][i]} transform={`translate(${440+i*38},${90-i*4})`}><path d="M 0,4 C-5,-2-12,-2-12,5 C-12,12 0,22 0,22 C 0,22 12,12 12,5 C 12,-2 5,-2 0,4 Z" fill={PAL.rust} stroke={PAL.ink} strokeWidth="1.5"/></g>)}
  <g transform="translate(800,40)"><rect x="0" y="0" width="320" height="100" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2"/>{[20,40,60,80].map(y=><line key={y} x1="0" x2="320" y1={y} y2={y} stroke={PAL.tan} strokeWidth="1"/>)}<polyline points="10,85 60,80 110,70 160,55 210,30 260,18 310,10" fill="none" stroke={PAL.moss} strokeWidth="4"/><polygon points="305,10 320,12 308,22" fill={PAL.moss}/><text x="14" y="22" fontSize="11" fontWeight="800" fill={PAL.moss} fontFamily="DM Sans">DEMAND ↑</text></g>
  <Ground/>
</g>);

// HOLIDAY-SURGE — storefront with garlands & gifts
SC.holiday=()=>(<g>
  {/* bigger storefront with more detail */}
  <g transform="translate(360,30)">
    <rect x="0" y="50" width="680" height="100" fill={PAL.rustB} stroke={PAL.dark} strokeWidth="2"/>
    <polygon points="0,50 340,10 680,50" fill={PAL.rust} stroke={PAL.dark} strokeWidth="2"/>
    {/* big sign */}
    <rect x="240" y="20" width="200" height="22" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2"/>
    <text x="340" y="36" fontSize="14" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans" letterSpacing="2">HOLIDAY SALE</text>
    {/* windows w displays */}
    <rect x="30" y="74" width="120" height="64" fill={PAL.paper} stroke={PAL.dark} strokeWidth="2"/>
    {[0,1,2].map(i=><g key={i} transform={`translate(${50+i*36},96)`}><rect x="-8" y="0" width="16" height="32" fill={[PAL.moss,PAL.rust,PAL.amb][i]} stroke={PAL.ink}/><polygon points="-2,-6 2,-6 0,-12" fill={PAL.moss}/></g>)}
    {/* central doorway */}
    <rect x="294" y="80" width="92" height="70" fill={PAL.ink}/>
    <rect x="300" y="92" width="80" height="58" fill={PAL.paper}/>
    <line x1="340" y1="92" x2="340" y2="150" stroke={PAL.ink} strokeWidth="2"/>
    {/* right window w displays */}
    <rect x="530" y="74" width="120" height="64" fill={PAL.paper} stroke={PAL.dark} strokeWidth="2"/>
    {[0,1,2].map(i=><g key={i} transform={`translate(${550+i*36},96)`}><rect x="-7" y="0" width="14" height="32" fill={[PAL.sage,PAL.rust,PAL.moss][i]} stroke={PAL.ink}/><circle cx="0" cy="-4" r="4" fill={PAL.ambB}/></g>)}
    {/* big garland — bigger bulbs */}
    {Array.from({length:18}).map((_,i)=><g key={i} transform={`translate(${i*38+8},${48+(i%2)*6})`}><line x1="0" y1="-12" x2="0" y2="0" stroke={PAL.inkS} strokeWidth="1.5"/><circle cx="0" cy="3" r="7" fill={[PAL.ambB,PAL.rust,PAL.sage,PAL.amb][i%4]} stroke={PAL.ink} strokeWidth="1.5" className="pulse" style={{animationDelay:`${i*-.15}s`}}/></g>)}
    {/* wreath above sign */}
    <g transform="translate(340,12)"><circle cx="0" cy="0" r="14" fill="none" stroke={PAL.moss} strokeWidth="6"/><circle cx="0" cy="0" r="14" fill="none" stroke={PAL.mossD} strokeWidth="2" strokeDasharray="3,4"/><rect x="-5" y="10" width="10" height="6" fill={PAL.rust} stroke={PAL.ink}/></g>
  </g>
  {/* shoppers w gift bags — larger, in foreground */}
  {[0,1,2,3,4].map(i=><g key={i} transform={`translate(${120+i*250},116)`}>
    <circle cx="0" cy="-8" r="8" fill={PAL.inkS}/>
    {/* santa hat or scarf */}
    <rect x="-8" y="-16" width="16" height="4" fill={[PAL.rust,PAL.moss,PAL.amb,PAL.rust,PAL.sage][i]}/>
    <rect x="-7" y="0" width="14" height="22" fill={[PAL.rust,PAL.moss,PAL.amb,PAL.rust,PAL.sage][i]} stroke={PAL.ink}/>
    {/* gift bag with ribbon */}
    <g transform="translate(10,12)"><rect x="0" y="0" width="14" height="18" fill={PAL.ambB} stroke={PAL.ink} strokeWidth="1.5"/><rect x="6" y="0" width="2" height="18" fill={PAL.rust}/><rect x="0" y="-4" width="14" height="4" fill={PAL.rust}/></g>
    {/* legs */}
    <rect x="-5" y="22" width="4" height="12" fill={PAL.dark}/>
    <rect x="1" y="22" width="4" height="12" fill={PAL.dark}/>
  </g>)}
  {/* snowflakes drifting */}
  {[0,1,2,3,4,5].map(i=><g key={i} transform={`translate(${100+i*220},${20+(i%3)*8})`} className="pulse" style={{animationDelay:`${i*-.4}s`}}><circle cx="0" cy="0" r="2.5" fill={PAL.paper} stroke={PAL.ink} strokeWidth="1"/></g>)}
  <Ground/>
</g>);

// GROWTH — retail aisle with banner
SC.growth=()=>(<g>
  <g transform="translate(180,50)"><rect x="0" y="0" width="1040" height="20" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/><text x="520" y="15" fontSize="13" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans" letterSpacing="3">NEW NATIONAL LISTING</text></g>
  {/* shelves */}
  {[0,1,2].map(row=><g key={row} transform={`translate(180,${80+row*22})`}>{Array.from({length:20}).map((_,i)=><rect key={i} x={i*52} y="0" width="46" height="18" fill={(row*20+i)%5===0?PAL.rustB:PAL.paper} stroke={PAL.ink} strokeWidth="1"/>)}<line x1="0" x2="1040" y1="18" y2="18" stroke={PAL.ink} strokeWidth="2"/></g>)}
  {/* big arrow up */}
  <g transform="translate(1240,30)" className="pulse"><polygon points="0,40 30,40 30,90 60,90 30,130 0,90 30,90 30,40" fill={PAL.moss} stroke={PAL.ink} strokeWidth="2" transform="rotate(180,30,85)"/></g>
  <Ground/>
</g>);

// SUPPLIER-DOWN — close-up dead factory
SC.supplierDown=()=>(<g>
  <g className="factory-dead" transform="translate(450,30)">
    <rect x="50" y="40" width="20" height="60" fill={PAL.inkS}/><rect x="46" y="36" width="28" height="8" fill={PAL.dark}/>
    <circle cx="60" cy="30" r="8" fill={PAL.soft} className="smoke"/><circle cx="60" cy="26" r="10" fill="#bdb398" className="smoke2"/>
    <rect x="-50" y="60" width="200" height="80" fill={PAL.moss} className="fb"/><polygon points="-50,60 50,30 150,60" fill={PAL.mossD}/>
    {[0,1,2,3,4].map(i=><rect key={i} x={-32+i*38} y="82" width="22" height="22" fill={PAL.paper} stroke={PAL.ink} strokeWidth="1.5"/>)}
    <rect x="40" y="115" width="40" height="25" fill={PAL.inkS}/>
    <g className="stamp" transform="translate(50,90)"><rect x="-60" y="-18" width="120" height="36" fill={PAL.rust} opacity=".95"/><text x="0" y="8" textAnchor="middle" fontSize="22" fontWeight="800" fill={PAL.paper} fontFamily="DM Sans">CLOSED</text></g>
  </g>
  {/* shadows beyond */}<rect x="0" y="148" width="450" height="2" fill={PAL.ink} opacity=".3"/><rect x="800" y="148" width="600" height="2" fill={PAL.ink} opacity=".3"/>
  <Ground/>
</g>);

// FLOOD — submerged factory + rain
SC.flood=()=>(<g>
  {/* dark clouds */}
  <g><ellipse cx="300" cy="35" rx="80" ry="18" fill="#7a8593"/><ellipse cx="700" cy="28" rx="120" ry="22" fill="#5b6478"/><ellipse cx="1100" cy="38" rx="90" ry="18" fill="#7a8593"/></g>
  {/* rain */}
  {Array.from({length:60}).map((_,i)=><line key={i} x1={i*24+(i%3)*8} y1={50+(i%5)*20} x2={i*24+(i%3)*8-6} y2={70+(i%5)*20} stroke={PAL.skyL} strokeWidth="2" opacity=".7" className="rain" style={{animationDelay:`${i*-.1}s`}}/>)}
  {/* half-submerged factory */}
  <g transform="translate(500,50)" opacity=".7">
    <rect x="50" y="40" width="20" height="50" fill={PAL.inkS}/><rect x="-50" y="55" width="200" height="50" fill={PAL.moss}/><polygon points="-50,55 50,28 150,55" fill={PAL.mossD}/>{[0,1,2,3,4].map(i=><rect key={i} x={-32+i*38} y="75" width="22" height="22" fill={PAL.paper} stroke={PAL.ink} strokeWidth="1.5"/>)}
  </g>
  {/* flood water */}
  <rect x="0" y="100" width="1400" height="80" fill={PAL.sky} opacity=".7"/>
  <g className="wave-anim">{Array.from({length:35}).map((_,i)=><path key={i} d={`M${i*40} 104 Q${i*40+10} 100,${i*40+20} 104 T${i*40+40} 104`} fill="none" stroke={PAL.skyL} strokeWidth="2"/>)}</g>
  {/* warning */}<g transform="translate(700,130)"><polygon points="0,-15 18,15 -18,15" fill={PAL.ambB} stroke={PAL.ink} strokeWidth="2"/><text x="0" y="11" fontSize="20" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">!</text></g>
</g>);

// CROP-FAIL — withered cotton field
SC.cropFail=()=>(<g>
  {/* heavy sun */}
  <circle cx="700" cy="34" r="32" fill={PAL.rustB} opacity=".5"/><circle cx="700" cy="34" r="22" fill={PAL.ambB}/>
  {Array.from({length:14}).map((_,i)=><line key={i} x1="700" y1="34" x2={700+Math.cos(i*Math.PI/7)*48} y2={34+Math.sin(i*Math.PI/7)*48} stroke={PAL.ambB} strokeWidth="3" opacity=".5"/>)}
  {/* cracked dry earth strips */}
  {[0,1,2].map(row=><g key={row}>{Array.from({length:24}).map((_,i)=><g key={i} transform={`translate(${i*60+(row%2)*30},${85+row*20})`}>
    <ellipse cx="0" cy="0" rx="6" ry="10" fill={PAL.inkS} opacity=".7"/>
    <line x1="0" y1="0" x2="0" y2="14" stroke={PAL.dark} strokeWidth="2"/>
    <circle cx="-3" cy="-3" r="2.5" fill={PAL.soft} opacity=".5"/>
    <circle cx="3" cy="-2" r="2" fill={PAL.soft} opacity=".4"/>
  </g>)}</g>)}
  {/* cracks in ground */}
  <Ground/>
  {[100,400,750,1100].map(x=><g key={x}><line x1={x} y1="152" x2={x+30} y2="178" stroke={PAL.dark} strokeWidth="2" opacity=".5"/><line x1={x+15} y1="160" x2={x+50} y2="178" stroke={PAL.dark} strokeWidth="1.5" opacity=".4"/></g>)}
  <g className="stamp" transform="translate(1100,90)"><rect x="-60" y="-14" width="120" height="28" fill={PAL.rust}/><text x="0" y="6" textAnchor="middle" fontSize="14" fontWeight="800" fill={PAL.paper} fontFamily="DM Sans">CROP FAIL</text></g>
</g>);

// TIER-2 BROKEN — chain of factories with broken link
SC.tier2=()=>(<g>
  {[0,1,2].map(i=>{const x=200+i*400;const dead=i===1;return(<g key={i} transform={`translate(${x},60)`} className={dead?'factory-dead':''}>
    <rect x="35" y="20" width="14" height="50" fill={PAL.inkS}/><circle cx="42" cy="14" r="6" fill={PAL.soft} className="smoke"/><circle cx="42" cy="12" r="8" fill="#bdb398" className="smoke2"/>
    <rect x="0" y="40" width="100" height="50" fill={PAL.moss} className="fb"/><polygon points="0,40 50,18 100,40" fill={PAL.mossD}/>
    {[0,1,2].map(j=><rect key={j} x={12+j*28} y="55" width="16" height="14" fill={PAL.paper} stroke={PAL.ink}/>)}
    <text x="50" y="106" fontSize="11" fontWeight="700" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">TIER {3-i}</text>
  </g>)})}
  {/* chains between */}
  {[0,1].map(i=>{const x1=300+i*400,x2=600+i*400;const broken=i===0;return(<g key={i}>
    {Array.from({length:10}).map((_,j)=>(j!==5||!broken)&&<ellipse key={j} cx={x1+(x2-x1)*(j+1)/11} cy="100" rx="9" ry="5" fill="none" stroke={PAL.inkS} strokeWidth="3"/>)}
    {broken&&<g transform={`translate(${x1+(x2-x1)*6/11},100)`} className="shake"><line x1="-12" y1="-8" x2="12" y2="8" stroke={PAL.rust} strokeWidth="4"/><line x1="-12" y1="8" x2="12" y2="-8" stroke={PAL.rust} strokeWidth="4"/></g>}
  </g>)})}
  <Ground/>
</g>);

// CHIP-SHORTAGE — large microchip + allocation bar
SC.chip=()=>(<g>
  <g transform="translate(450,50)"><rect x="0" y="0" width="220" height="80" fill={PAL.ink}/><rect x="14" y="14" width="192" height="52" fill={PAL.moss}/>{Array.from({length:8}).map((_,i)=><rect key={i} x={20+i*22} y="24" width="14" height="14" fill={PAL.ambB} opacity=".6"/>)}{Array.from({length:8}).map((_,i)=><rect key={i} x={20+i*22} y="44" width="14" height="14" fill={PAL.sage} opacity=".6"/>)}
    {/* pins */}{Array.from({length:11}).map((_,i)=><rect key={i} x={6+i*20} y="-8" width="6" height="10" fill={PAL.inkS}/>)}{Array.from({length:11}).map((_,i)=><rect key={i} x={6+i*20} y="80" width="6" height="10" fill={PAL.inkS}/>)}
    {/* crack */}<polyline points="20,40 60,30 100,55 150,35 200,50" fill="none" stroke={PAL.rust} strokeWidth="4"/>
    <text x="110" y="-20" fontSize="13" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">SEMICONDUCTOR — SHORTAGE</text>
  </g>
  {/* allocation bar */}
  <g transform="translate(820,70)"><rect x="0" y="0" width="380" height="34" fill={PAL.tan} stroke={PAL.ink} strokeWidth="2"/><rect x="0" y="0" width="228" height="34" fill={PAL.rust}/><line x1="228" y1="-6" x2="228" y2="40" stroke={PAL.ink} strokeWidth="2" strokeDasharray="3,3"/><text x="14" y="22" fontSize="12" fontWeight="800" fill={PAL.paper} fontFamily="DM Sans">CONSUMER ELEC · 60%</text><text x="305" y="22" fontSize="11" fontWeight="700" fill={PAL.ink} fontFamily="DM Sans" textAnchor="middle">YOU · 40%</text></g>
  <Ground/>
</g>);

// PORT — crane + anchored ship + container stack
SC.port=()=>(<g>
  <rect x="0" y="148" width="1400" height="14" fill={PAL.sky}/>
  <g className="wave-anim">{Array.from({length:35}).map((_,i)=><path key={i} d={`M${i*40} 152 Q${i*40+10} 148,${i*40+20} 152 T${i*40+40} 152`} fill="none" stroke={PAL.skyL} strokeWidth="1.5"/>)}</g>
  {/* crane */}
  <g className="shake">
    <rect x="350" y="50" width="8" height="100" fill={PAL.inkS}/><rect x="450" y="50" width="8" height="100" fill={PAL.inkS}/>
    <rect x="346" y="40" width="120" height="12" fill={PAL.dark}/><line x1="406" y1="38" x2="406" y2="20" stroke={PAL.inkS} strokeWidth="3"/>
    {/* cable + container */}<line x1="600" y1="40" x2="600" y2="100" stroke={PAL.inkS} strokeWidth="2"/>
    <rect x="346" y="40" width="280" height="6" fill={PAL.dark}/>
    <g transform="translate(580,100)"><rect x="0" y="0" width="50" height="34" fill={PAL.rustB} stroke={PAL.dark} strokeWidth="1.5"/>{Array.from({length:5}).map((_,i)=><line key={i} x1={i*10} y1="0" x2={i*10} y2="34" stroke={PAL.dark} strokeWidth="1"/>)}</g>
  </g>
  {/* container stack */}
  <g transform="translate(740,80)">
    {[0,1,2].map(row=>[0,1,2,3].map(col=>(col+row<5)&&<g key={`${row}-${col}`} transform={`translate(${col*60},${row*-24})`}><rect x="0" y="46" width="54" height="22" fill={[PAL.rustB,PAL.moss,PAL.amb,PAL.sky][((row+col)%4)]} stroke={PAL.dark} strokeWidth="1.5"/>{Array.from({length:6}).map((_,i)=><line key={i} x1={i*9} y1="46" x2={i*9} y2="68" stroke={PAL.dark} strokeWidth="1"/>)}</g>))}
  </g>
  {/* anchored ship */}
  <g transform="translate(1080,110)">
    <polygon points="0,30 200,30 188,52 12,52" fill={PAL.rust} stroke={PAL.dark} strokeWidth="1.5"/>
    <rect x="60" y="6" width="80" height="24" fill={PAL.paper} stroke={PAL.dark}/>
    <rect x="72" y="14" width="9" height="10" fill="#5b6478"/><rect x="92" y="14" width="9" height="10" fill="#5b6478"/><rect x="112" y="14" width="9" height="10" fill="#5b6478"/>
    <rect x="150" y="-4" width="8" height="14" fill={PAL.inkS}/>
    <g className="stamp" transform="translate(100,28)"><rect x="-50" y="-12" width="100" height="24" fill={PAL.rust}/><text x="0" y="6" textAnchor="middle" fontSize="14" fontWeight="800" fill={PAL.paper} fontFamily="DM Sans">ANCHORED</text></g>
  </g>
  {/* dock */}<rect x="340" y="148" width="600" height="6" fill={PAL.inkS}/>
</g>);

// CUSTOMS — border post with tariff stamps
SC.customs=()=>(<g>
  {/* border post */}
  <g transform="translate(500,50)">
    <rect x="20" y="20" width="14" height="80" fill={PAL.rust}/><rect x="166" y="20" width="14" height="80" fill={PAL.rust}/>
    <rect x="20" y="20" width="160" height="14" fill={PAL.ink}/><text x="100" y="14" fontSize="12" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">CUSTOMS</text>
    {/* gate bar */}<rect x="180" y="62" width="180" height="6" fill={PAL.rust} stroke={PAL.ink}/>
    {/* stripes on bar */}{[0,1,2,3,4,5].map(i=><rect key={i} x={186+i*30} y="62" width="14" height="6" fill={PAL.paper}/>)}
  </g>
  {/* container being inspected */}
  <g transform="translate(720,100)"><rect x="0" y="0" width="160" height="50" fill={PAL.rustB} stroke={PAL.dark} strokeWidth="2"/>{Array.from({length:9}).map((_,i)=><line key={i} x1={i*18} y1="0" x2={i*18} y2="50" stroke={PAL.dark} strokeWidth="1"/>)}
    {/* $ stamps */}<g className="stamp" transform="translate(40,25) rotate(-15)"><circle cx="0" cy="0" r="18" fill="none" stroke={PAL.rust} strokeWidth="3"/><text x="0" y="6" fontSize="18" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">$</text></g>
    <g className="stamp" transform="translate(110,28) rotate(-12)" style={{animationDelay:'.15s'}}><circle cx="0" cy="0" r="18" fill="none" stroke={PAL.rust} strokeWidth="3"/><text x="0" y="6" fontSize="18" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">$</text></g>
  </g>
  {/* customs officer silhouette */}
  <g transform="translate(420,90)"><circle cx="0" cy="0" r="8" fill={PAL.dark}/><rect x="-7" y="8" width="14" height="24" fill={PAL.moss}/><rect x="-12" y="-4" width="24" height="6" fill={PAL.ink}/><line x1="6" y1="14" x2="20" y2="22" stroke={PAL.dark} strokeWidth="3"/></g>
  <Ground/>
</g>);

// CYBER — server rack with glitch + lock
SC.cyber=()=>(<g>
  {/* darkness overlay */}<rect x="0" y="0" width="1400" height="180" fill={PAL.ink} opacity=".15"/>
  {/* server racks */}
  {[0,1,2].map(i=><g key={i} transform={`translate(${360+i*240},40)`}>
    <rect x="0" y="0" width="180" height="110" fill={PAL.dark} stroke={PAL.ink} strokeWidth="2"/>
    {Array.from({length:6}).map((_,j)=><g key={j}><rect x="10" y={8+j*16} width="160" height="12" fill="#1a1a26"/>
      <rect x="14" y={11+j*16} width={120-j*5} height="6" fill={(i+j)%2?PAL.rust:PAL.rustB} className={(i+j)%3===0?'flicker':''}/>
      <circle cx="160" cy={14+j*16} r="2" fill={(j+i)%2?PAL.rust:PAL.sage} className="pulse"/>
    </g>)}
  </g>)}
  {/* big padlock with skull */}
  <g transform="translate(660,60)" className="slam"><rect x="0" y="20" width="80" height="60" fill={PAL.rust} stroke={PAL.ink} strokeWidth="3"/><path d="M 15 20 L 15 5 Q 15 -10 40 -10 Q 65 -10 65 5 L 65 20" fill="none" stroke={PAL.ink} strokeWidth="4"/><circle cx="40" cy="48" r="6" fill={PAL.ink}/><rect x="38" y="52" width="4" height="14" fill={PAL.ink}/></g>
  {/* error text */}
  <g transform="translate(80,80)"><rect x="0" y="0" width="240" height="60" fill={PAL.ink} stroke={PAL.rust} strokeWidth="2"/><text x="120" y="22" fontSize="14" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans" className="flicker">ERP LOCKED</text><text x="120" y="42" fontSize="9" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">NO INVENTORY VISIBILITY</text></g>
  <Ground/>
</g>);

// RECALL — trucks reversed with warning tape
SC.recall=()=>(<g>
  {/* warning tape diagonal across top */}
  <g transform="translate(0,30)"><polygon points="0,0 1400,-20 1400,20 0,40" fill={PAL.ambB} stroke={PAL.ink} strokeWidth="2"/>{Array.from({length:24}).map((_,i)=><polygon key={i} points={`${i*60+10},2 ${i*60+40},2 ${i*60+30},22 ${i*60},22`} fill={PAL.ink}/>)}<text x="700" y="22" fontSize="14" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">⚠ RECALL · DO NOT SHIP · RECALL · ⚠</text></g>
  {/* trucks heading left with red ! */}
  {[0,1,2].map(i=><g key={i} transform={`translate(${260+i*340},115)`}>
    <g transform="scale(-1,1)"><rect x="22" y="0" width="44" height="28" fill={PAL.paper} stroke={PAL.dark} strokeWidth="1.5"/><rect x="0" y="8" width="26" height="20" fill={PAL.rust} stroke={PAL.dark} strokeWidth="1.5"/><rect x="4" y="11" width="10" height="8" fill="#9bb8c0"/><circle cx="9" cy="32" r="6" fill={PAL.dark}/><circle cx="42" cy="32" r="6" fill={PAL.dark}/><circle cx="58" cy="32" r="6" fill={PAL.dark}/></g>
    {/* red ! mark */}<g transform="translate(50,-12)" className="pulse"><circle cx="0" cy="0" r="10" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/><rect x="-1.5" y="-5" width="3" height="6" fill={PAL.paper}/><circle cx="0" cy="4" r="1.5" fill={PAL.paper}/></g>
  </g>)}
  <Ground/>
</g>);

// COLD-CHAIN — fridge with rising thermometer
SC.coldChain=()=>(<g>
  {/* fridge unit */}
  <g transform="translate(440,40)">
    <rect x="0" y="0" width="200" height="110" fill={PAL.skyL} stroke={PAL.ink} strokeWidth="3"/><line x1="0" y1="40" x2="200" y2="40" stroke={PAL.ink} strokeWidth="2"/>
    <rect x="172" y="14" width="6" height="14" fill={PAL.ink}/><rect x="172" y="54" width="6" height="40" fill={PAL.ink}/>
    {/* vials */}{Array.from({length:5}).map((_,i)=><g key={i} transform={`translate(${20+i*30},48)`}><rect x="0" y="0" width="10" height="20" fill={PAL.paper} stroke={PAL.ink}/><rect x="2" y="4" width="6" height="12" fill={PAL.rustB} opacity=".6"/></g>)}
    {/* drip */}{[0,1,2].map(i=><circle key={i} cx={50+i*40} cy={108+(i%2)*4} r="3" fill={PAL.sky} className="drip" style={{animationDelay:`${i*-.6}s`}}/>)}
  </g>
  {/* thermometer */}
  <g transform="translate(720,40)">
    <rect x="0" y="0" width="20" height="100" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2"/><circle cx="10" cy="105" r="14" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/>
    <rect x="4" y="40" width="12" height="65" fill={PAL.rust}/>
    {/* graduations */}{Array.from({length:6}).map((_,i)=><line key={i} x1="20" x2="28" y1={15+i*15} y2={15+i*15} stroke={PAL.ink} strokeWidth="1.5"/>)}
    <text x="36" y="18" fontSize="9" fill={PAL.ink} fontFamily="DM Sans" fontWeight="700">+15°</text>
    <text x="36" y="78" fontSize="9" fill={PAL.ink} fontFamily="DM Sans" fontWeight="700">+2°</text>
    {/* arrow rising */}<g transform="translate(75,30)" className="pulse"><polygon points="0,40 14,40 14,10 24,10 7,-10 -10,10 0,10" fill={PAL.rust}/></g>
  </g>
  <g transform="translate(880,60)"><text x="0" y="0" fontSize="14" fontWeight="800" fill={PAL.rust} fontFamily="DM Sans">TEMP EXCURSION</text><text x="0" y="22" fontSize="11" fill={PAL.ink} fontFamily="DM Sans">25% INVENTORY AT RISK</text><text x="0" y="42" fontSize="11" fill={PAL.ink} fontFamily="DM Sans">14-DAY RETEST WINDOW</text></g>
  <Ground/>
</g>);

// FDA-INSPECT — clipboard 483 + magnifier
SC.fdaInspect=()=>(<g>
  {/* factory faded */}
  <g transform="translate(120,60)" opacity=".55"><rect x="35" y="20" width="14" height="50" fill={PAL.inkS}/><rect x="0" y="40" width="100" height="50" fill={PAL.moss}/><polygon points="0,40 50,18 100,40" fill={PAL.mossD}/>{[0,1,2].map(i=><rect key={i} x={12+i*28} y="55" width="16" height="14" fill={PAL.paper} stroke={PAL.ink}/>)}</g>
  {/* magnifier on facility */}
  <g transform="translate(220,90)" className="slam"><circle cx="0" cy="0" r="40" fill={PAL.paper} fillOpacity=".7" stroke={PAL.ink} strokeWidth="4"/><line x1="28" y1="28" x2="60" y2="60" stroke={PAL.ink} strokeWidth="8" strokeLinecap="round"/><line x1="28" y1="28" x2="60" y2="60" stroke={PAL.rust} strokeWidth="4" strokeLinecap="round"/></g>
  {/* clipboard with Form 483 */}
  <g transform="translate(580,30)" className="slam"><rect x="0" y="0" width="280" height="130" fill={PAL.paper} stroke={PAL.ink} strokeWidth="3"/><rect x="100" y="-12" width="80" height="18" fill={PAL.inkS} stroke={PAL.ink}/><circle cx="140" cy="-3" r="5" fill={PAL.tan}/>
    <text x="140" y="22" fontSize="14" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">FORM 483</text>
    <line x1="14" y1="38" x2="266" y2="38" stroke={PAL.ink} strokeWidth="1"/>
    {[0,1,2,3,4].map(i=><g key={i}><rect x="16" y={48+i*14} width="10" height="10" fill="none" stroke={PAL.ink} strokeWidth="1.5"/><line x1="32" y1={54+i*14} x2={170+(i%2)*60} y2={54+i*14} stroke={PAL.ink} strokeWidth="1" opacity=".6"/></g>)}
    {/* checkmark issued */}<line x1="18" y1="52" x2="22" y2="56" stroke={PAL.rust} strokeWidth="2"/><line x1="22" y1="56" x2="26" y2="48" stroke={PAL.rust} strokeWidth="2"/>
  </g>
  {/* inspector silhouette */}
  <g transform="translate(960,70)"><circle cx="0" cy="0" r="10" fill={PAL.dark}/><rect x="-9" y="10" width="18" height="36" fill={PAL.moss}/><rect x="-14" y="-3" width="28" height="6" fill={PAL.ink}/><line x1="9" y1="20" x2="22" y2="34" stroke={PAL.dark} strokeWidth="3"/></g>
  <Ground/>
</g>);

// LINE-DOWN — assembly arms frozen + $ counter
SC.lineDown=()=>(<g>
  {/* belt */}
  <rect x="120" y="100" width="1160" height="8" fill={PAL.inkS}/>
  {/* idle arms */}
  {[0,1,2,3].map(i=><g key={i} transform={`translate(${260+i*240},90)`} className="factory-dead">
    <rect x="-4" y="0" width="8" height="-40" fill={PAL.ambB} stroke={PAL.ink}/>
    <g transform="translate(0,-40) rotate(-30)"><rect x="0" y="-4" width="44" height="8" fill={PAL.rust} stroke={PAL.ink}/></g>
    <circle cx="0" cy="0" r="6" fill={PAL.ink}/>
  </g>)}
  {/* idle car bodies on belt */}
  {[0,1,2].map(i=><g key={i} transform={`translate(${200+i*340},85)`} opacity=".7">
    <rect x="0" y="0" width="120" height="14" fill={PAL.sky} stroke={PAL.dark} strokeWidth="1.5"/><polygon points="20,0 30,-10 90,-10 100,0" fill={PAL.sky} stroke={PAL.dark} strokeWidth="1.5"/><circle cx="24" cy="20" r="6" fill={PAL.dark}/><circle cx="96" cy="20" r="6" fill={PAL.dark}/>
  </g>)}
  {/* big $ counter */}
  <g transform="translate(560,20)"><rect x="0" y="0" width="280" height="50" fill={PAL.ink} stroke={PAL.rust} strokeWidth="3"/><text x="140" y="22" fontSize="11" fontWeight="700" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans" letterSpacing="2">LINE-DOWN PENALTY</text><text x="140" y="42" fontSize="18" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans" className="pulse">$1,500 / UNIT</text></g>
  <Ground/>
</g>);

// RECESSION — empty aisle + decline graph
SC.recession=()=>(<g>
  {/* gray sky already from sev */}
  {/* empty shelves */}
  {[0,1,2,3].map(row=><g key={row} transform={`translate(80,${70+row*18})`}>{Array.from({length:14}).map((_,i)=><rect key={i} x={i*40} y="0" width="36" height="14" fill={(row+i)%4===0?PAL.paper:'rgba(216,200,155,.3)'} stroke={PAL.ink} strokeWidth="1" opacity={(row+i)%4===0?1:.7}/>)}<line x1="0" x2="560" y1="14" y2="14" stroke={PAL.ink} strokeWidth="2"/></g>)}
  {/* declining graph */}
  <g transform="translate(720,40)"><rect x="0" y="0" width="380" height="120" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2"/>{[24,48,72,96].map(y=><line key={y} x1="0" x2="380" y1={y} y2={y} stroke={PAL.tan} strokeWidth="1"/>)}<polyline points="10,20 60,30 110,40 160,52 210,70 260,86 310,100 370,114" fill="none" stroke={PAL.rust} strokeWidth="4"/><polygon points="365,109 380,118 365,118" fill={PAL.rust}/><text x="14" y="22" fontSize="11" fontWeight="800" fill={PAL.rust} fontFamily="DM Sans">DEMAND ↓</text></g>
  <Ground/>
</g>);

// PRIVATE-LABEL — your product vs store brand
SC.privateLabel=()=>(<g>
  {/* shelf */}
  <line x1="160" y1="140" x2="1240" y2="140" stroke={PAL.ink} strokeWidth="3"/>
  {/* your product */}
  <g transform="translate(360,70)"><rect x="0" y="0" width="120" height="70" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/><rect x="14" y="20" width="92" height="14" fill={PAL.paper}/><text x="60" y="56" fontSize="11" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">YOURS</text><text x="60" y="-12" fontSize="14" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">$3.99</text></g>
  {/* VS */}
  <g transform="translate(560,100)"><text x="0" y="0" fontSize="20" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">VS</text></g>
  {/* store brand with crown */}
  <g transform="translate(640,70)" className="pulse"><rect x="0" y="0" width="120" height="70" fill={PAL.moss} stroke={PAL.ink} strokeWidth="2"/><rect x="14" y="20" width="92" height="14" fill={PAL.paper}/><text x="60" y="56" fontSize="11" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">STORE BRAND</text><text x="60" y="-12" fontSize="14" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">$2.79</text>
    {/* crown */}<g transform="translate(60,-32)"><polygon points="-22,0 -12,-14 0,-4 12,-14 22,0" fill={PAL.ambB} stroke={PAL.ink} strokeWidth="2"/><rect x="-22" y="0" width="44" height="6" fill={PAL.ambB} stroke={PAL.ink}/></g>
  </g>
  {/* arrows from shoppers */}
  {[0,1,2].map(i=><g key={i} transform={`translate(${860+i*70},120)`} className="pulse" style={{animationDelay:`${i*-.3}s`}}>
    <circle cx="0" cy="-12" r="5" fill={PAL.inkS}/><rect x="-3" y="-8" width="6" height="12" fill={i%2?PAL.sky:PAL.moss}/>
    <line x1="-12" y1="0" x2="-30" y2="0" stroke={PAL.ink} strokeWidth="2"/><polygon points="-30,-3 -36,0 -30,3" fill={PAL.ink}/>
  </g>)}
  <Ground/>
</g>);

// GENERIC-PILL — branded vs generic bottles
SC.genericPill=()=>(<g>
  {/* branded — small/fading */}
  <g transform="translate(280,55)" opacity=".6"><rect x="0" y="20" width="80" height="80" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/><rect x="-4" y="14" width="88" height="14" fill={PAL.rustB} stroke={PAL.ink} strokeWidth="2"/><rect x="10" y="40" width="60" height="40" fill={PAL.paper}/><text x="40" y="58" fontSize="9" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">BRAND</text><text x="40" y="72" fontSize="14" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">$45</text></g>
  {/* arrow shifting */}
  <g transform="translate(440,90)"><polygon points="0,-8 60,-8 60,-16 90,0 60,16 60,8 0,8" fill={PAL.rust}/></g>
  {/* generic — large, dominant */}
  <g transform="translate(580,30)" className="slam"><rect x="0" y="20" width="140" height="130" fill={PAL.sage} stroke={PAL.ink} strokeWidth="3"/><rect x="-6" y="12" width="152" height="18" fill={PAL.moss} stroke={PAL.ink} strokeWidth="3"/><rect x="14" y="46" width="112" height="84" fill={PAL.paper}/><text x="70" y="84" fontSize="14" fontWeight="800" fill={PAL.moss} textAnchor="middle" fontFamily="DM Sans">GENERIC</text><text x="70" y="112" fontSize="22" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">$8</text></g>
  {/* market share bar */}
  <g transform="translate(820,90)"><text x="0" y="-6" fontSize="11" fontWeight="700" fill={PAL.ink} fontFamily="DM Sans">MARKET SHARE</text><rect x="0" y="0" width="380" height="28" fill={PAL.tan} stroke={PAL.ink} strokeWidth="2"/><rect x="0" y="0" width="76" height="28" fill={PAL.rust}/><rect x="76" y="0" width="304" height="28" fill={PAL.sage}/><text x="38" y="20" fontSize="10" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">20%</text><text x="228" y="20" fontSize="10" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">GENERIC · 80%</text></g>
  <Ground/>
</g>);

// TREND-MISS — mannequin + sale tag
SC.trendMiss=()=>(<g>
  {/* mannequin — slightly smaller, anchored left */}
  <g transform="translate(220,42)">
    {/* discount sign behind */}
    <g transform="translate(-60,-10)" opacity=".7"><rect x="0" y="0" width="50" height="34" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2" transform="rotate(-8)"/><text x="25" y="22" fontSize="11" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans" transform="rotate(-8)">SALE</text></g>
    <circle cx="0" cy="0" r="14" fill={PAL.soft} stroke={PAL.ink} strokeWidth="2"/>
    <rect x="-18" y="14" width="36" height="48" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/>
    <rect x="-24" y="18" width="6" height="30" fill={PAL.rust} stroke={PAL.ink} strokeWidth="1.5"/>
    <rect x="18" y="18" width="6" height="30" fill={PAL.rust} stroke={PAL.ink} strokeWidth="1.5"/>
    <rect x="-12" y="60" width="10" height="34" fill={PAL.dark}/>
    <rect x="2" y="60" width="10" height="34" fill={PAL.dark}/>
    {/* big tag */}
    <g transform="translate(50,30)" className="pulse"><polygon points="0,-16 64,-16 80,0 64,16 0,16" fill={PAL.ambB} stroke={PAL.ink} strokeWidth="2"/><circle cx="8" cy="0" r="3" fill={PAL.ink}/><text x="40" y="6" fontSize="14" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">-70%</text></g>
  </g>
  {/* tumbleweed / empty middle indicator */}
  <g transform="translate(440,128)" opacity=".4"><circle cx="0" cy="0" r="14" fill="none" stroke={PAL.inkS} strokeWidth="2"/><path d="M -10,-6 Q 0,-14 10,-6 M -10,6 Q 0,14 10,6 M -8,0 L 8,0" fill="none" stroke={PAL.inkS} strokeWidth="1.5"/></g>
  {/* big arrow showing direction customers go (away from mannequin) */}
  <g transform="translate(500,86)" opacity=".5"><polygon points="0,-6 60,-6 60,-14 90,0 60,14 60,6 0,6" fill={PAL.inkS}/></g>
  {/* customers walking away — bigger and more obvious */}
  {[0,1,2,3].map(i=><g key={i} transform={`translate(${640+i*130},108)`}>
    <circle cx="0" cy="-16" r="9" fill={PAL.inkS}/>
    {/* shopping bag in other hand — looking elsewhere */}
    <rect x="-8" y="-7" width="16" height="22" fill={[PAL.moss,PAL.sky,PAL.sage,PAL.moss][i]} stroke={PAL.ink} strokeWidth="1.5"/>
    {/* arms swinging */}
    <line x1="8" y1="-2" x2="14" y2="10" stroke={PAL.inkS} strokeWidth="3"/>
    <line x1="-8" y1="-2" x2="-14" y2="6" stroke={PAL.inkS} strokeWidth="3"/>
    {/* legs in stride */}
    <rect x="-6" y="15" width="5" height="18" fill={PAL.dark}/>
    <rect x="1" y="15" width="5" height="18" fill={PAL.dark}/>
    {/* a different (correct) bag from a rival brand */}
    {i===1&&<g transform="translate(20,4)"><rect x="0" y="0" width="14" height="20" fill={PAL.ambB} stroke={PAL.ink}/><text x="7" y="13" fontSize="8" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">NEW</text></g>}
    {i===3&&<g transform="translate(20,4)"><rect x="0" y="0" width="14" height="20" fill={PAL.sage} stroke={PAL.ink}/><text x="7" y="13" fontSize="8" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">★</text></g>}
  </g>)}
  {/* mocking speech bubble */}
  <g transform="translate(1160,30)"><rect x="0" y="0" width="200" height="50" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2" rx="10"/><polygon points="20,50 36,50 24,68" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2"/><text x="100" y="22" fontSize="12" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">"that's so</text><text x="100" y="40" fontSize="12" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">last season"</text></g>
  <Ground/>
</g>);

// RETURNS — boxes flowing back, pile
SC.returns=()=>(<g>
  {/* warehouse left (overflowing) */}
  <g transform="translate(40,40)">
    <rect x="0" y="40" width="240" height="100" fill={PAL.tan} stroke={PAL.ink} strokeWidth="2"/>
    <polygon points="0,40 120,8 240,40" fill={PAL.amb} stroke={PAL.ink} strokeWidth="2"/>
    {/* open loading bay */}
    <rect x="80" y="80" width="80" height="60" fill={PAL.dark}/>
    <rect x="80" y="80" width="80" height="8" fill={PAL.inkS}/>
    <text x="120" y="32" fontSize="11" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">REVERSE LOGISTICS</text>
    {/* full sign */}
    <g transform="translate(200,18)" className="pulse"><rect x="-22" y="-8" width="44" height="22" fill={PAL.rust} stroke={PAL.ink}/><text x="0" y="7" fontSize="11" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">FULL</text></g>
  </g>
  {/* belt */}
  <rect x="0" y="146" width="1400" height="8" fill={PAL.inkS}/>
  {/* boxes flowing leftward (animated) */}
  {[0,1,2,3,4,5].map(i=><g key={i} className="pkgrev" style={{animationDelay:`${i*-2.5}s`}}><g transform="translate(0,128)"><rect x="0" y="0" width="28" height="18" fill={PAL.rust} stroke={PAL.dark} strokeWidth="1.5" rx="1"/><text x="14" y="14" fontSize="13" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">↩</text></g></g>)}
  {/* directional indicator — big leftward arrow */}
  <g transform="translate(700,90)" opacity=".4"><polygon points="60,-12 0,0 60,12 60,4 100,4 100,-4 60,-4" fill={PAL.rust}/></g>
  {/* growing pile in middle */}
  <g transform="translate(360,70)">
    {/* base row */}
    {[0,30,60,90,120,150,180,210].map((x,i)=><rect key={`b${i}`} x={x} y={64} width="32" height="20" fill={[PAL.rust,PAL.rustB,PAL.amb,PAL.rust,PAL.rustB,PAL.amb,PAL.rust,PAL.rustB][i]} stroke={PAL.dark} strokeWidth="1.5"/>)}
    {/* second row */}
    {[12,44,76,108,140,172].map((x,i)=><rect key={`s${i}`} x={x} y={44} width="32" height="20" fill={[PAL.amb,PAL.rust,PAL.rustB,PAL.amb,PAL.rust,PAL.rustB][i]} stroke={PAL.dark} strokeWidth="1.5"/>)}
    {/* third row */}
    {[26,58,90,122,154].map((x,i)=><rect key={`t${i}`} x={x} y={24} width="32" height="20" fill={[PAL.rust,PAL.amb,PAL.rust,PAL.rustB,PAL.amb][i]} stroke={PAL.dark} strokeWidth="1.5"/>)}
    {/* fourth row */}
    {[44,76,108,140].map((x,i)=><rect key={`q${i}`} x={x} y={4} width="32" height="20" fill={[PAL.rustB,PAL.rust,PAL.amb,PAL.rust][i]} stroke={PAL.dark} strokeWidth="1.5"/>)}
    {/* return arrows on top boxes */}
    {[44,76,108,140].map((x,i)=><text key={`a${i}`} x={x+16} y={18} fontSize="12" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">↩</text>)}
    {/* big label */}
    <text x="105" y="-8" fontSize="14" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">RETURN TSUNAMI</text>
    {/* 25% callout */}
    <g transform="translate(180,-32)" className="pulse"><circle cx="0" cy="0" r="22" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/><text x="0" y="6" fontSize="13" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">25%</text></g>
  </g>
  {/* angry/overwhelmed worker right */}
  <g transform="translate(1180,70)">
    <circle cx="0" cy="-12" r="12" fill={PAL.inkS}/>
    {/* sweat drops */}
    <circle cx="-16" cy="-22" r="3" fill={PAL.skyL} className="drip"/>
    <circle cx="16" cy="-20" r="3" fill={PAL.skyL} className="drip" style={{animationDelay:'-.8s'}}/>
    <rect x="-12" y="0" width="24" height="30" fill={PAL.moss} stroke={PAL.ink} strokeWidth="2"/>
    {/* hands up */}
    <line x1="-12" y1="6" x2="-26" y2="-8" stroke={PAL.inkS} strokeWidth="4" strokeLinecap="round"/>
    <line x1="12" y1="6" x2="26" y2="-8" stroke={PAL.inkS} strokeWidth="4" strokeLinecap="round"/>
    <rect x="-10" y="30" width="6" height="22" fill={PAL.dark}/>
    <rect x="4" y="30" width="6" height="22" fill={PAL.dark}/>
  </g>
  <Ground/>
</g>);

// SLOTTING-FEE — retailer hand + envelope of cash
SC.slottingFee=()=>(<g>
  {/* small supplier left */}
  <g transform="translate(180,80)" opacity=".7"><rect x="35" y="20" width="14" height="50" fill={PAL.inkS}/><rect x="0" y="40" width="100" height="50" fill={PAL.moss}/><polygon points="0,40 50,18 100,40" fill={PAL.mossD}/>{[0,1,2].map(i=><rect key={i} x={12+i*28} y="55" width="16" height="14" fill={PAL.paper} stroke={PAL.ink}/>)}<text x="50" y="106" fontSize="11" fontWeight="700" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">YOU</text></g>
  {/* envelope flying */}
  <g transform="translate(450,110)" className="slam"><rect x="0" y="0" width="80" height="50" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2"/><polyline points="0,0 40,28 80,0" fill="none" stroke={PAL.ink} strokeWidth="2"/><text x="40" y="38" fontSize="14" fontWeight="800" fill={PAL.moss} textAnchor="middle" fontFamily="DM Sans">$8K</text></g>
  {/* big retailer hand demanding */}
  <g transform="translate(700,60)"><rect x="0" y="40" width="80" height="60" fill={PAL.soft} stroke={PAL.ink} strokeWidth="2.5"/>
    {[0,1,2,3].map(i=><rect key={i} x={i*20} y="0" width="14" height="50" fill={PAL.soft} stroke={PAL.ink} strokeWidth="2.5"/>)}
    <rect x="80" y="40" width="40" height="14" fill={PAL.soft} stroke={PAL.ink} strokeWidth="2.5"/>
  </g>
  {/* large retailer store */}
  <g transform="translate(1000,40)"><rect x="0" y="20" width="280" height="100" fill={PAL.rust} stroke={PAL.ink} strokeWidth="3"/><polygon points="0,20 140,-4 280,20" fill={PAL.rustB} stroke={PAL.ink} strokeWidth="3"/><rect x="116" y="60" width="48" height="60" fill={PAL.ink}/><text x="140" y="14" fontSize="14" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">RETAILER</text></g>
  <Ground/>
</g>);

// SHELF-RESET — planogram grid with eye-level highlight
SC.shelfReset=()=>(<g>
  <g transform="translate(220,30)">
    {/* shelf rows */}
    {[0,1,2,3,4].map(row=>{const eyeLevel=row===2;return(<g key={row}>
      {Array.from({length:18}).map((_,i)=><rect key={i} x={i*52} y={row*24} width="48" height="22" fill={eyeLevel?(i===8||i===9?PAL.rustB:PAL.paper):(PAL.paper)} stroke={PAL.ink} strokeWidth="1.5" opacity={eyeLevel?1:.55}/>)}
      <line x1="0" x2="936" y1={row*24+22} y2={row*24+22} stroke={PAL.ink} strokeWidth="2"/>
      {eyeLevel&&<g><rect x="-30" y={row*24+2} width="22" height="18" fill={PAL.ambB} stroke={PAL.ink} strokeWidth="2"/><text x="-19" y={row*24+15} fontSize="11" fontWeight="800" fill={PAL.ink} textAnchor="middle" fontFamily="DM Sans">👁</text></g>}
    </g>)})}
    {/* highlight box */}
    <rect x="408" y="48" width="104" height="22" fill="none" stroke={PAL.rust} strokeWidth="4" className="pulse"/>
    <text x="460" y="146" fontSize="11" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">EYE-LEVEL · +35% VELOCITY</text>
  </g>
  <Ground/>
</g>);

// PROMO-CANNIBALIZE — BOGO sign + up-then-down
SC.promo=()=>(<g>
  {/* BOGO sign */}
  <g transform="translate(200,50)" className="slam"><polygon points="0,0 220,0 240,40 220,80 0,80 -20,40" fill={PAL.rust} stroke={PAL.ink} strokeWidth="3"/>
    <text x="110" y="34" fontSize="20" fontWeight="800" fill={PAL.paper} textAnchor="middle" fontFamily="DM Sans">BUY 1</text>
    <text x="110" y="60" fontSize="20" fontWeight="800" fill={PAL.ambB} textAnchor="middle" fontFamily="DM Sans">GET 1 FREE</text>
  </g>
  {/* up then down graph */}
  <g transform="translate(580,40)"><rect x="0" y="0" width="640" height="120" fill={PAL.paper} stroke={PAL.ink} strokeWidth="2"/>
    {[24,48,72,96].map(y=><line key={y} x1="0" x2="640" y1={y} y2={y} stroke={PAL.tan} strokeWidth="1"/>)}
    <polyline points="10,72 90,68 170,52 250,18 330,14 410,40 490,68 560,90 620,108" fill="none" stroke={PAL.moss} strokeWidth="4"/>
    {/* spike marker */}<circle cx="290" cy="14" r="6" fill={PAL.moss} stroke={PAL.ink} strokeWidth="2"/><text x="290" y="-4" fontSize="11" fontWeight="800" fill={PAL.moss} textAnchor="middle" fontFamily="DM Sans">PROMO</text>
    {/* dip marker */}<circle cx="560" cy="90" r="6" fill={PAL.rust} stroke={PAL.ink} strokeWidth="2"/><text x="560" y="78" fontSize="11" fontWeight="800" fill={PAL.rust} textAnchor="middle" fontFamily="DM Sans">HANGOVER</text>
    <text x="14" y="22" fontSize="10" fontWeight="700" fill={PAL.ink} fontFamily="DM Sans" opacity=".6">DEMAND</text>
  </g>
  <Ground/>
</g>);

// SCENE MAP
const SCENE_MAP={
  'calm-1':SC.calm,'calm-2':SC.calm,'calm-3':SC.calm,
  'viral':SC.viral,'influencer-drop':SC.viral,'shortage-list':SC.viral,
  'holiday':SC.holiday,'growth':SC.growth,
  'supplier-fail':SC.supplierDown,'esg-audit':SC.supplierDown,
  'climate':SC.flood,
  'fabric-shortage':SC.cropFail,
  'tier-2-fail':SC.tier2,
  'chip-shortage':SC.chip,
  'port-strike':SC.port,'container-shortage':SC.port,
  'tariff':SC.customs,'currency':SC.customs,'trade-war':SC.customs,
  'cyberattack':SC.cyber,
  'recall':SC.recall,'recall-mandate':SC.recall,
  'cold-chain':SC.coldChain,
  'fda-inspection':SC.fdaInspect,
  'line-down':SC.lineDown,
  'recession':SC.recession,'demand-collapse':SC.recession,'competitor':SC.recession,
  'private-label':SC.privateLabel,
  'generic-entry':SC.genericPill,
  'trend-miss':SC.trendMiss,
  'return-tsunami':SC.returns,
  'slotting-fee':SC.slottingFee,
  'shelf-reset':SC.shelfReset,
  'promo-cannibalize':SC.promo,
};

function SupplyChainScene({event,monthKey}){
  const eid=event?.id||'',sev=event?.severity||'calm';
  const sevColors={calm:'papd b-tan t-soft',opportunity:'bg-sage text-white',slump:'bg-sky text-white',crisis:'bg-rust text-white'};
  const sevLabels={calm:'— Steady',opportunity:'↑ Spike',slump:'↓ Headwind',crisis:'⚠ Disruption'};
  const sky=sev==='crisis'?'linear-gradient(to bottom,#e8c8b5,#f0d8b8)':sev==='slump'?'linear-gradient(to bottom,#c9d4dc,#dde0d4)':sev==='opportunity'?'linear-gradient(to bottom,#f9e4a8,#f4ecd8)':'linear-gradient(to bottom,#f9e9b8,#f4ecd8)';
  const Scene=SCENE_MAP[eid]||(sev==='slump'?SC.recession:SC.calm);
  return(
    <div className="relative w-full h-44 overflow-hidden border-y-2 b-ink" key={monthKey} style={{background:sky}}>
      <svg viewBox="0 0 1400 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <Sun sev={sev}/>
        <Scene/>
      </svg>
      {event&&<div className="absolute top-2 left-4 right-4 flex justify-between pointer-events-none">
        <div className="fm text-[10px] uppercase tracking-widest t-soft papw px-2 py-1 border b-tan st">Live · Ops Feed</div>
        <div className={`fm text-[10px] uppercase tracking-widest px-2 py-1 border b-ink st ${sevColors[sev]}`}>{sevLabels[sev]}</div>
      </div>}
    </div>
  );
}
const ILLUS={crisis:{p:'#b8412b',s:'#d4571a',bg:'#f9e0d4'},opportunity:{p:'#6b8e6e',s:'#1e4d3c',bg:'#dde9d8'},slump:{p:'#2b5470',s:'#6ba0a8',bg:'#d4e1e6'},calm:{p:'#c8861a',s:'#d4a017',bg:'#f5e9c8'}};
function EventIllustration({eventId,severity}){
  const c=ILLUS[severity]||ILLUS.calm;
  let shape;
  if(['supplier-fail','climate','esg-audit','fabric-shortage','chip-shortage','tier-2-fail'].includes(eventId))shape=<g><rect x="20" y="40" width="60" height="40" fill={c.p} stroke="#1c1f2b" strokeWidth="2"/><polygon points="20,40 50,22 80,40" fill={c.s} stroke="#1c1f2b" strokeWidth="2"/><line x1="15" y1="20" x2="85" y2="90" stroke="#b8412b" strokeWidth="5"/><line x1="85" y1="20" x2="15" y2="90" stroke="#b8412b" strokeWidth="5"/></g>;
  else if(['port-strike','container-shortage'].includes(eventId))shape=<g><polygon points="15,55 85,55 78,72 22,72" fill={c.p} stroke="#1c1f2b" strokeWidth="2"/><rect x="35" y="42" width="30" height="13" fill="#f4ecd8" stroke="#1c1f2b" strokeWidth="1.5"/><line x1="50" y1="80" x2="50" y2="92" stroke="#1c1f2b" strokeWidth="2"/></g>;
  else if(['tariff','currency','trade-war','slotting-fee'].includes(eventId))shape=<g><rect x="22" y="40" width="6" height="40" fill={c.p}/><rect x="72" y="40" width="6" height="40" fill={c.p}/><rect x="22" y="40" width="56" height="10" fill={c.s}/><circle cx="50" cy="65" r="10" fill="#f4ecd8" stroke={c.p} strokeWidth="2"/><text x="50" y="70" fontSize="14" fontWeight="800" fill={c.p} textAnchor="middle" fontFamily="DM Sans">$</text></g>;
  else if(['recall','cyberattack','labor-strike','recall-mandate','cold-chain','fda-inspection','line-down'].includes(eventId))shape=<g><polygon points="50,22 80,75 20,75" fill={c.s} stroke="#1c1f2b" strokeWidth="2"/><line x1="50" y1="40" x2="50" y2="58" stroke="#1c1f2b" strokeWidth="3"/><circle cx="50" cy="66" r="2.5" fill="#1c1f2b"/></g>;
  else if(['viral','holiday','growth','shortage-list','influencer-drop','shelf-reset','promo-cannibalize'].includes(eventId))shape=<g><rect x="32" y="22" width="36" height="60" fill="#1c1f2b" rx="4"/><rect x="35" y="28" width="30" height="44" fill="#f4ecd8"/><circle cx="50" cy="78" r="2" fill="#f4ecd8"/><path d="M 0,4 C-4,-2-10,-2-10,5 C-10,11 0,18 0,18 C 0,18 10,11 10,5 C 10,-2 4,-2 0,4 Z" transform="translate(50,48)" fill={c.p} stroke="#1c1f2b" strokeWidth="1.5"/></g>;
  else if(['recession','competitor','demand-collapse','private-label','trend-miss','generic-entry','return-tsunami'].includes(eventId))shape=<g><line x1="15" y1="35" x2="85" y2="35" stroke="#1c1f2b" strokeWidth="1" opacity=".3"/><line x1="15" y1="55" x2="85" y2="55" stroke="#1c1f2b" strokeWidth="1" opacity=".3"/><line x1="15" y1="75" x2="85" y2="75" stroke="#1c1f2b" strokeWidth="1" opacity=".3"/><polyline points="15,30 30,42 45,55 60,70 80,82" fill="none" stroke={c.p} strokeWidth="3"/><polygon points="78,76 86,84 78,88" fill={c.p}/></g>;
  else shape=<g><circle cx="50" cy="50" r="20" fill={c.s} stroke="#1c1f2b" strokeWidth="2"/>{[0,1,2,3,4,5,6,7].map(i=><line key={i} x1="50" y1="50" x2={50+Math.cos(i*Math.PI/4)*35} y2={50+Math.sin(i*Math.PI/4)*35} stroke={c.p} strokeWidth="3" opacity=".7"/>)}<circle cx="50" cy="50" r="14" fill={c.p}/></g>;
  return (<div className="w-28 h-28 flex-shrink-0"><svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" fill={c.bg} stroke="#1c1f2b" strokeWidth="2"/>{shape}</svg></div>);
}

// ── STAT TILE ──────────────────────────────────────────────────────────────
function StatTile({label,value,format,tone='neutral',icon}){
  const anim=useAnimatedNumber(value);
  const display=format?format(anim):Math.round(anim).toString();
  const tc={neutral:'t-ink',good:'t-moss',warn:'t-amb',bad:'t-rust'}[tone];
  return (<div className="papw border-2 b-ink px-3 py-2.5"><div className="flex items-center gap-1.5 mb-1">{icon}<div className="fm text-[9px] uppercase tracking-widest t-soft">{label}</div></div><div className={`fd text-2xl font-semibold ${tc} tracking-tight leading-none`}>{display}</div></div>);
}

// ── SLIDER ─────────────────────────────────────────────────────────────────
function SliderInput({slider,value,onChange,disabled}){
  const cost=value*(slider.costPerUnit||0);
  const preview=slider.tariffAlternative?(value===0?'Absorb $20/unit cost for 3 months':`Pre-buy ${value} units at old price — $${cost.toLocaleString()} now`):(value===0?'No air-freight — replenishment delayed 1 month':`Air-freight ${value} units · extra $${cost.toLocaleString()}`);
  return (<div className="papd border-2 b-ink p-5 shadow-sm"><div className="fd text-xl font-semibold mb-1">{slider.label}</div><div className="fm text-[10px] t-soft uppercase tracking-widest mb-4">{slider.note}</div><input type="range" min={slider.min} max={slider.max} step={slider.step} value={value} onChange={e=>onChange(Number(e.target.value))} disabled={disabled}/><div className="flex justify-between fm text-[10px] t-soft mt-1"><span>{slider.min} (do nothing)</span><span>{slider.max} {slider.unit}</span></div><div className={`mt-3 fm text-sm font-medium ${value>0?'t-rust':'t-moss'}`}>{preview}</div></div>);
}

// ── MONTH RESULT PANEL (receipt) ───────────────────────────────────────────
function MonthResultPanel({preview,stratKey,event,allPreviews,industry,insiderNote}){
  const strat=STRATEGIES[stratKey];const pos=preview.net>=0;
  const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  return (<div className="papd border-2 b-ink mt-4 p-5 fi shadow-sm">
    <div className="fm text-[10px] uppercase tracking-widest t-soft mb-4 flex items-center gap-2"><span className="bg-ink text-white px-1.5 py-0.5">Receipt</span><span>This month · {strat.name} · {ind.short}</span></div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4 text-sm fm">
      <div className="col-span-2 fm text-[9px] uppercase tracking-widest t-soft mb-1 border-b b-tan pb-1">Supply</div>
      <div className="flex justify-between"><span className="t-soft">Opening inventory</span><span>{preview.openingInventory} units</span></div>
      {preview.liquidated>0&&<div className="flex justify-between"><span className="t-soft">Liquidated (signature)</span><span className="t-amb">−{preview.liquidated} units</span></div>}
      {preview.replenish>0&&<div className="flex justify-between"><span className="t-soft">Replenishment</span><span className="t-moss">+{preview.replenish} units</span></div>}
      {preview.skipReplenish&&<div className="flex justify-between"><span className="t-soft">Replenishment</span><span className="t-rust">+0 (blocked / deferred)</span></div>}
      {preview.extraInventory>0&&<div className="flex justify-between"><span className="t-soft">Emergency stock</span><span className="t-moss">+{preview.extraInventory} units</span></div>}
      {preview.inventoryLossPct>0&&<div className="flex justify-between"><span className="t-soft">Recalled / lost</span><span className="t-rust">−{Math.round(preview.inventoryLossPct*100)}%</span></div>}
      <div className="flex justify-between font-semibold"><span className="t-soft">Available to sell</span><span>{preview.availableInventory} units</span></div>
      <div className="col-span-2 fm text-[9px] uppercase tracking-widest t-soft mb-1 border-b b-tan pb-1 mt-3">Demand</div>
      <div className="flex justify-between"><span className="t-soft">Est. demand (seasonal)</span><span>{preview.demand} units</span></div>
      <div className="flex justify-between"><span className="t-soft">Fulfilled</span><span className="t-moss">{preview.fulfilled} units</span></div>
      {preview.stockout>0?<div className="col-span-2 flex justify-between px-2 py-1 -mx-2" style={{background:'rgba(184,65,43,.1)'}}><span className="t-rust">⚠ Stockout</span><span className="t-rust font-semibold">−{preview.stockout} lost</span></div>:<div className="flex justify-between"><span className="t-soft">Stockout</span><span className="t-moss">None ✓</span></div>}
      <div className="col-span-2 fm text-[9px] uppercase tracking-widest t-soft mb-1 border-b b-tan pb-1 mt-3">Cash</div>
      <div className="flex justify-between"><span className="t-soft">Revenue ({preview.fulfilled} × ${Math.round(preview.unitPrice)})</span><span className="t-moss">+${Math.round(preview.revenue - preview.liquidationRevenue).toLocaleString()}</span></div>
      {preview.liquidationRevenue>0&&<div className="flex justify-between"><span className="t-soft">Liquidation proceeds</span><span className="t-moss">+${preview.liquidationRevenue.toLocaleString()}</span></div>}
      <div className="flex justify-between"><span className="t-soft">Replenishment cost</span><span className="t-rust">−${preview.replenishCost.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="t-soft">Holding ({preview.endInventory} × ${strat.holdingCost})</span><span className="t-rust">−${preview.holdingCost.toLocaleString()}</span></div>
      {preview.extraCashCost>0&&<div className="flex justify-between"><span className="t-soft">Decision cost</span><span className="t-rust">−${preview.extraCashCost.toLocaleString()}</span></div>}
      {preview.linedown>0&&<div className="flex justify-between"><span className="t-rust">⚠ Line-down penalty ({preview.stockout} × $1,200)</span><span className="t-rust">−${preview.linedown.toLocaleString()}</span></div>}
    </div>
    <div className="flex justify-between items-center pt-3 border-t-2 b-ink fd text-xl font-semibold tracking-tight">
      <span>Net this month</span><span className={pos?'t-moss':'t-rust'}>{pos?'+':''}${Math.round(preview.net).toLocaleString()}</span>
    </div>
    {preview.dualImmune&&<div className="mt-3 border-l-4 px-3 py-2 fm text-[11px] t-moss" style={{borderColor:'var(--moss)',background:'rgba(30,77,60,.06)'}}>↳ Other strategies lost replenishment here. Your secondary supplier covered it automatically.</div>}
    {preview.stockout>0&&<div className="mt-2 fm text-[11px] t-rust">↳ {stratKey==='lean'?`Lean's thin inventory (${preview.availableInventory} units) couldn't absorb ${preview.demand}-unit demand. Safety Stock starts with 70 units.`:stratKey==='buffered'?'Even Safety Stock could not cover this spike.':'Dual Source inventory was insufficient. Safety Stock would have absorbed this better.'}</div>}
    {insiderNote&&<div className="mt-4 border-2 b-ink p-3 fu" style={{background:'rgba(28,31,43,.04)'}}>
      <div className="fm text-[9px] uppercase tracking-widest t-rust mb-1">Industry Insider</div>
      <p className="text-sm leading-relaxed">{insiderNote}</p>
    </div>}
    {allPreviews&&<div className="mt-4 pt-4 border-t-2 b-tan">
      <div className="fm text-[9px] uppercase tracking-widest t-soft mb-2">Side-by-side: all strategies this month</div>
      <div className="overflow-x-auto"><table className="w-full fm text-xs">
        <thead><tr className="border-b b-tan"><th className="text-left pb-1 t-soft font-normal">Strategy</th><th className="text-right pb-1 t-soft font-normal">Avail.</th><th className="text-right pb-1 t-soft font-normal">Demand</th><th className="text-right pb-1 t-soft font-normal">Filled</th><th className="text-right pb-1 t-soft font-normal">Short</th><th className="text-right pb-1 t-soft font-normal">Net</th></tr></thead>
        <tbody>{Object.entries(allPreviews).map(([k,p])=>{
          const isPlayer=k===stratKey;
          const bestNet=Math.max(...Object.values(allPreviews).map(x=>x.net));
          const isBest=p.net===bestNet;
          return (<tr key={k} className="border-b b-tan last:border-0" style={isPlayer?{background:'rgba(212,87,26,.08)'}:{}}>
            <td className="py-1.5 font-medium">{STRATEGIES[k].name}{isPlayer?' ★':''}</td>
            <td className="text-right">{p.availableInventory}</td>
            <td className="text-right">{p.demand}</td>
            <td className="text-right t-moss">{p.fulfilled}</td>
            <td className={`text-right ${p.stockout>0?'t-rust':''}`}>{p.stockout>0?`-${p.stockout}`:'—'}</td>
            <td className={`text-right font-medium ${p.net>=0?'t-moss':'t-rust'} ${isBest?'font-bold':''}`}>{isBest?'Best ':''}${p.net>=0?'+':''}{Math.round(p.net).toLocaleString()}</td>
          </tr>);
        })}</tbody>
      </table></div>
    </div>}
  </div>);
}

// ── YEAR TAPE ──────────────────────────────────────────────────────────────
function YearTape({history,currentMonth}){
  const colors={calm:'bg-amb',opportunity:'bg-sage',slump:'bg-sky',crisis:'bg-rust',pending:'papd'};
  return (<div className="border-t-2 b-tan papd"><div className="max-w-6xl mx-auto px-6 py-3">
    <div className="fm text-[10px] uppercase tracking-widest t-soft mb-2">Year Tape</div>
    <div className="flex gap-1">{Array.from({length:12}).map((_,i)=>{
      const h=history[i];const isCurrent=i===currentMonth;const sev=h?.severity||'pending';
      return (<div key={i} className="flex-1"><div className={`h-2.5 ${colors[sev]||colors.pending} ${isCurrent?'ring-2 ring-ink ring-offset-2':''}`} title={h?`M${i+1}: ${h.event}`:`M${i+1}`}/><div className="fm text-[9px] t-soft text-center mt-1">{String(i+1).padStart(2,'0')}</div></div>);
    })}</div>
  </div></div>);
}

// ── INDUSTRY SELECTOR ──────────────────────────────────────────────────────
function IndustrySelector({onSelect}){
  const cols={fmcg:'t-rbr',pharma:'t-sky',fashion:'t-amb',auto:'t-moss'};
  return (<div className="min-h-screen paper-bg relative"><div className="grain"/>
    <div className="max-w-6xl mx-auto px-6 py-10 relative">
      <div className="fm text-[11px] uppercase tracking-[.3em] t-rust mb-3">The Disruption Game · Setup</div>
      <h1 className="fd text-7xl font-semibold t-ink leading-none mb-3 tracking-tight">Pick your <span className="fdi">industry</span></h1>
      <p className="t-soft text-lg mb-10 max-w-2xl leading-relaxed">Each industry has its own event deck, its own peril mechanic, and its own definition of disaster. The same disruption hits pharma very differently than fashion.</p>
      <div className="grid md:grid-cols-2 gap-5">
        {Object.values(INDUSTRIES).map((ind,i)=>(
          <button key={ind.key} onClick={()=>onSelect(ind.key)} className={`text-left papw border-2 b-ink p-6 lift shadow-ink fu fu${(i%3)+1}`}>
            <div className={`fm text-[10px] uppercase tracking-widest mb-2 ${cols[ind.key]}`}>{ind.short}</div>
            <div className="fd text-3xl font-semibold mb-1 tracking-tight">{ind.name}</div>
            <div className="fdi t-rust text-base mb-4">{ind.tagline}</div>
            <p className="t-soft text-sm leading-relaxed mb-5">{ind.description}</p>
            <div className="border-l-4 b-tan pl-3 mb-4" style={{background:'rgba(201,188,153,.18)'}}>
              <div className="fm text-[9px] uppercase tracking-widest t-rust mb-1">⚠ Industry Peril · {ind.perilName}</div>
              <p className="text-sm t-ink leading-snug">{ind.perilDesc}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-4 border-t b-tan fm text-xs">
              <div className="flex justify-between"><span className="t-soft">Unit price</span><span>${ind.unitPrice}</span></div>
              <div className="flex justify-between"><span className="t-soft">Stockout penalty</span><span>−{ind.stockoutPenalty} rep</span></div>
              <div className="flex justify-between"><span className="t-soft">Demand/month</span><span>{ind.demandBase[0]}–{ind.demandBase[1]} units</span></div>
              <div className="flex justify-between"><span className="t-soft">Seasonal range</span><span>{Math.round(Math.min(...ind.seasonal)*100)}–{Math.round(Math.max(...ind.seasonal)*100)}%</span></div>
            </div>
            <div className="mt-4 flex items-center gap-2 t-rust text-sm font-medium"><span>Select {ind.short}</span><ArrowRight className="w-4 h-4"/></div>
          </button>
        ))}
      </div>
    </div>
  </div>);
}

// ── STRATEGY SELECTOR ──────────────────────────────────────────────────────
function StrategySelector({onSelect,industryKey}){
  const ind=INDUSTRIES[industryKey]||INDUSTRIES.fmcg;
  return (<div className="min-h-screen paper-bg relative"><div className="grain"/>
    <div className="max-w-6xl mx-auto px-6 py-10 relative">
      <div className="fm text-[11px] uppercase tracking-[.3em] t-rust mb-3">The Disruption Game · {ind.name}</div>
      <h1 className="fd text-7xl font-semibold t-ink leading-none mb-3 tracking-tight">Lock in your <span className="fdi">strategy</span></h1>
      <p className="t-soft text-lg mb-10 max-w-2xl">You'll run this strategy for all 12 months. Each strategy has a unique <span className="fdi t-rust">signature move</span> you can deploy once or twice. Choose wisely — or don't, and learn from it.</p>
      <div className="grid md:grid-cols-3 gap-5">
        {Object.values(STRATEGIES).map((s,i)=>(
          <button key={s.key} onClick={()=>onSelect(s.key)} className={`text-left papw border-2 b-ink p-6 lift shadow-ink fu fu${i+1}`}>
            <div className="flex items-center gap-2 mb-4">
              {s.key==='lean'&&<Zap className="w-5 h-5 t-rbr"/>}
              {s.key==='buffered'&&<Package className="w-5 h-5 t-amb"/>}
              {s.key==='dual'&&<ShieldCheck className="w-5 h-5 t-moss"/>}
            </div>
            <div className="fd text-3xl font-semibold mb-1 tracking-tight">{s.name}</div>
            <div className="fdi t-rust text-base mb-4">{s.tagline}</div>
            <p className="t-soft text-sm leading-relaxed mb-5">{s.description}</p>
            <div className="space-y-1.5 pt-4 border-t b-tan fm text-xs">
              <div className="flex justify-between"><span className="t-soft">Start Inventory</span><span>{s.startInventory} units</span></div>
              <div className="flex justify-between"><span className="t-soft">Unit Cost</span><span>${s.unitCost}</span></div>
              <div className="flex justify-between"><span className="t-soft">Holding Cost</span><span>${s.holdingCost}/unit/mo</span></div>
              <div className="flex justify-between"><span className="t-soft">Dual Source</span><span>{s.supplierRedundancy?'Yes ✓':'No'}</span></div>
            </div>
            <div className="mt-4 pt-3 border-t-2 b-ink" style={{background:'rgba(212,87,26,.06)',marginLeft:'-1.5rem',marginRight:'-1.5rem',paddingLeft:'1.5rem',paddingRight:'1.5rem',paddingTop:'.75rem',paddingBottom:'.75rem'}}>
              <div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-3 h-3 t-rbr"/><span className="fm text-[9px] uppercase tracking-widest t-rbr">Signature Move · {s.signature.uses}× per year</span></div>
              <div className="fd text-base font-semibold mb-1">{s.signature.name}</div>
              <p className="text-xs t-soft leading-snug">{s.signature.tagline}</p>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex gap-2 items-baseline"><span className="fm text-[9px] uppercase tracking-widest t-moss">Wins</span><span className="text-sm">{s.bestFor}</span></div>
              <div className="flex gap-2 items-baseline"><span className="fm text-[9px] uppercase tracking-widest t-rust">Loses</span><span className="text-sm">{s.weakAgainst}</span></div>
            </div>
            <div className="mt-4 flex items-center gap-2 t-rust text-sm font-medium"><span>Choose this</span><ArrowRight className="w-4 h-4"/></div>
          </button>
        ))}
      </div>
      <div className="mt-8 fm text-[11px] t-soft">↳ At year-end you will see how the same twelve months played out under each strategy.</div>
    </div>
  </div>);
}

// ── BANKRUPTCY ─────────────────────────────────────────────────────────────
function BankruptcyScreen({month,strategy,industry,onReplay}){
  const strat=STRATEGIES[strategy];const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  return (<div className="min-h-screen paper-bg relative flex flex-col items-center justify-center px-6"><div className="grain"/>
    <div className="max-w-2xl w-full relative">
      <div className="bg-rust text-white border-2 b-ink p-10 shadow-ink slam text-center">
        <div className="fm text-[10px] uppercase tracking-[.3em] mb-4" style={{opacity:.8}}>Game Over</div>
        <div className="fd text-7xl font-semibold mb-2 tracking-tight">Bankrupt</div>
        <div className="fdi text-2xl mb-6" style={{opacity:.9}}>Month {month} · {strat.name} · {ind.short}</div>
        <p className="text-base mb-8 leading-relaxed" style={{opacity:.85}}>Cash went below $0 in Month {month}. In real supply chains this means missed payroll, unpaid suppliers, and an emergency board call. {strat.name} ran out of runway in {ind.short} — either from expensive emergency responses, excess unsold inventory, or insufficient revenue to cover replenishment.</p>
        <div className="papw t-ink p-5 mb-8 text-left">
          <div className="fm text-[10px] uppercase tracking-widest t-soft mb-3">The lesson</div>
          <p className="text-sm leading-relaxed">{strat.key==='lean'?'Lean strategies run thin on cash buffers. A single expensive emergency response can tip the balance. The lean in your inventory strategy also applies to your financial resilience.':strat.key==='buffered'?'Safety Stock is expensive. When demand drops AND you are paying for excess inventory, the P&L deteriorates quickly. Buffering inventory without a revenue floor is dangerous.':'Dual Source pays a cost premium on every unit. In a disruption-heavy year with cost shocks, the margin squeeze can be fatal. Resilience only works if unit economics remain viable.'}</p>
        </div>
        <button onClick={onReplay} className="papw t-ink border-2 b-ink px-8 py-4 flex items-center gap-3 mx-auto font-medium lift shadow-ink"><RotateCcw className="w-4 h-4"/><span>Try a different strategy</span></button>
      </div>
    </div>
  </div>);
}

// ── LEADERBOARD ────────────────────────────────────────────────────────────
function Leaderboard({onClose}){
  const[scores,setScores]=useState(null);
  useEffect(()=>{loadScores().then(setScores);},[]);
  const sc={lean:'t-moss',buffered:'t-amb',dual:'t-sky'};
  return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(28,31,43,.6)'}}>
    <div className="papw border-2 b-ink w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-ink">
      <div className="flex items-center justify-between px-6 py-4 border-b-2 b-ink">
        <div className="flex items-center gap-2"><Trophy className="w-5 h-5 t-amb"/><span className="fd text-2xl font-semibold">Global Leaderboard</span></div>
        <button onClick={onClose} className="p-1 hover:t-rust"><X className="w-5 h-5"/></button>
      </div>
      <div className="px-6 py-4">
        {scores===null&&<div className="fm text-sm t-soft text-center py-8 pulse">Loading scores…</div>}
        {scores!==null&&scores.length===0&&<div className="fm text-sm t-soft text-center py-8">No scores yet. Be the first to finish!</div>}
        {scores!==null&&scores.length>0&&<table className="w-full fm text-sm">
          <thead><tr className="border-b b-tan"><th className="text-left pb-2 t-soft font-normal">#</th><th className="text-left pb-2 t-soft font-normal">Strategy</th><th className="text-left pb-2 t-soft font-normal">Industry</th><th className="text-right pb-2 t-soft font-normal">Cash</th><th className="text-right pb-2 t-soft font-normal">Fill%</th><th className="text-right pb-2 t-soft font-normal">Rep</th><th className="text-right pb-2 t-soft font-normal">Date</th></tr></thead>
          <tbody>{scores.map((s,i)=><tr key={i} className={`border-b b-tan last:border-0 ${i===0?'papd':''}`}>
            <td className="py-2 font-semibold">{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td>
            <td className={`py-2 font-medium ${sc[s.strategy]||''}`}>{STRATEGIES[s.strategy]?.name||s.strategy}</td>
            <td className="py-2 t-soft">{INDUSTRIES[s.industry]?.short||s.industry||'—'}</td>
            <td className="py-2 text-right font-semibold t-moss">${(s.cash/1000).toFixed(1)}K</td>
            <td className="py-2 text-right">{s.fillRate?.toFixed(0)}%</td>
            <td className="py-2 text-right">{s.reputation}</td>
            <td className="py-2 text-right t-soft text-xs">{s.date}</td>
          </tr>)}</tbody>
        </table>}
      </div>
    </div>
  </div>);
}

// ── MONTH SCREEN ───────────────────────────────────────────────────────────
function MonthScreen({state,strategy,industry,currentEvent,onDecision,onContinue,allStates,signatureUsesLeft}){
  const strat=STRATEGIES[strategy];const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  const[decided,setDecided]=useState(false);
  const[chosenIdx,setChosenIdx]=useState(null);
  const[sliderValue,setSliderValue]=useState(currentEvent.slider?.min||0);
  const[preview,setPreview]=useState(null);
  const[allPreviews,setAllPreviews]=useState(null);
  const[revealKey,setRevealKey]=useState(0);
  const[insiderNote,setInsiderNote]=useState(null);
  const dualImmune=currentEvent.supplierEvent&&strat.supplierRedundancy;

  useEffect(()=>{
    setDecided(false);setChosenIdx(null);setPreview(null);setAllPreviews(null);setInsiderNote(null);
    setSliderValue(currentEvent.slider?.min||0);setRevealKey(k=>k+1);
  },[currentEvent.id,state.month]);

  const computeAll=(dec,note)=>{
    const p=computeMonthPreview(strategy,industry,state.inventory,currentEvent,dec,state.month);
    setPreview(p);
    setInsiderNote(note);
    const ap={};
    Object.keys(STRATEGIES).forEach(k=>{
      const kInv=allStates&&allStates[k]?allStates[k].inventory:STRATEGIES[k].startInventory;
      // Alternate strategies use heuristic, never signature
      ap[k]=computeMonthPreview(k,industry,kInv,currentEvent,k===strategy?(typeof dec==='string'?null:dec):null,state.month);
    });
    setAllPreviews(ap);
  };

  const makeDecision=(idx)=>{
    setChosenIdx(idx);setDecided(true);
    const note=currentEvent.choices?.[idx]?.insider||currentEvent.insider||null;
    computeAll(idx,note);
    onDecision(idx);
  };
  const commitSlider=()=>{
    setDecided(true);
    computeAll(sliderValue,currentEvent.insider||null);
    onDecision(sliderValue);
  };
  const skipDecision=()=>{
    setDecided(true);
    computeAll(-1,currentEvent.insider||null);
    onDecision(-1);
  };
  const useSignature=()=>{
    const sigDec='sig:'+strat.signature.effect.signature;
    setChosenIdx('signature');setDecided(true);
    computeAll(sigDec, `Signature move deployed: ${strat.signature.detail}`);
    onDecision(sigDec);
  };

  const canUseSignature = !decided && !dualImmune && signatureUsesLeft > 0 &&
    (strat.signature.effect.signature !== 'dual-arbitrage' || (currentEvent.severity === 'calm' || currentEvent.severity === 'opportunity')) &&
    (strat.signature.effect.signature !== 'buffered-sweep' || state.inventory >= 15);

  return (<div className="min-h-screen paper-bg relative">
    <div className="grain"/>
    <div className="bg-ink text-white border-b-2 b-ink px-6 py-2.5 flex items-center justify-between fm text-[11px] uppercase tracking-widest relative">
      <div className="flex items-center gap-3"><span className="t-rbr">●</span><span>Disruption Game</span><span style={{opacity:.4}}>/</span><span style={{opacity:.7}}>{strat.name} · {ind.short}</span></div>
      <div className="flex items-center gap-3">
        {signatureUsesLeft>0&&<span className="flex items-center gap-1 t-rbr"><Sparkles className="w-3 h-3"/><span>{signatureUsesLeft}× {strat.signature.name}</span></span>}
        <span style={{opacity:.3}}>/</span>
        <span>Month</span><span className="t-rbr font-semibold">{String(state.month+1).padStart(2,'0')}</span><span style={{opacity:.5}}>/ 12</span>
      </div>
    </div>
    <SupplyChainScene event={currentEvent} monthKey={revealKey}/>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-6 py-4 max-w-6xl mx-auto">
      <StatTile label="Cash" value={state.cash} format={v=>`$${(v/1000).toFixed(1)}K`} tone={state.cash>30000?'good':state.cash>5000?'warn':'bad'} icon={<span className="fd text-base t-soft leading-none">$</span>}/>
      <StatTile label="Inventory" value={state.inventory} tone={state.inventory>30?'good':state.inventory>10?'warn':'bad'} icon={<Package className="w-3 h-3 t-soft"/>}/>
      <StatTile label="Fill Rate" value={state.fillRate} format={v=>`${v.toFixed(0)}%`} tone={state.fillRate>95?'good':state.fillRate>85?'warn':'bad'} icon={<TrendingUp className="w-3 h-3 t-soft"/>}/>
      <StatTile label="Reputation" value={state.reputation} tone={state.reputation>85?'good':state.reputation>60?'warn':'bad'} icon={<ShieldCheck className="w-3 h-3 t-soft"/>}/>
    </div>
    <div className="max-w-4xl mx-auto px-6 pb-10 w-full">
      <div className="papw border-2 b-ink p-6 md:p-8 mb-5 slam shadow-ink" key={`card-${revealKey}`}>
        <div className="flex gap-5">
          <EventIllustration eventId={currentEvent.id} severity={currentEvent.severity}/>
          <div className="flex-1 min-w-0">
            <div className="fm text-[10px] uppercase tracking-[.2em] t-soft mb-2 flex gap-2 items-center">
              <span>Month {state.month+1} Report</span>
              {currentEvent.industries&&<span className="bg-ink text-white px-1.5 py-0.5">{ind.short}-specific</span>}
            </div>
            <h2 className="fd text-4xl md:text-5xl font-semibold leading-tight mb-3 tracking-tight">{currentEvent.title}</h2>
            <p className="text-base leading-relaxed mb-3">{currentEvent.flavor}</p>
            {currentEvent.realWorld&&<div className="border-l-4 b-tan px-3 py-2" style={{background:'rgba(201,188,153,.2)'}}><div className="fm text-[9px] uppercase tracking-widest t-soft mb-0.5">Real World</div><p className="text-sm t-soft leading-snug">{currentEvent.realWorld}</p></div>}
            {dualImmune&&<div className="mt-4 border-l-4 px-3 py-2 fu" style={{borderColor:'var(--moss)',background:'rgba(30,77,60,.06)'}}><div className="fm text-[9px] uppercase tracking-widest t-moss mb-1">Dual Source Activated</div><p className="text-sm">Your secondary supplier ramps up overnight. No action required. Competitors scramble; you do not.</p></div>}
          </div>
        </div>
      </div>

      {currentEvent.slider&&!dualImmune&&<div className="mb-4 fu fu1">
        <div className="fm text-[10px] uppercase tracking-[.25em] t-soft mb-2 flex items-center gap-2"><span className="bg-ink text-white px-1.5 py-0.5">Decision</span><span>Your Move</span></div>
        <SliderInput slider={currentEvent.slider} value={sliderValue} onChange={setSliderValue} disabled={decided}/>
        {!decided&&<button onClick={commitSlider} className="mt-3 w-full bg-ink text-white border-2 b-ink px-6 py-4 flex items-center justify-center gap-2 font-medium hover:bg-rbr transition-colors" style={{boxShadow:'4px 4px 0 0 var(--rust)'}}><span>Commit to this decision</span><ArrowRight className="w-4 h-4"/></button>}
      </div>}

      {currentEvent.choices&&!dualImmune&&<div className="space-y-3">
        <div className="fm text-[10px] uppercase tracking-[.25em] t-soft mb-2 flex items-center gap-2"><span className="bg-ink text-white px-1.5 py-0.5">Decision</span><span>Your Move · {currentEvent.choices.length} options</span></div>
        {currentEvent.choices.map((c,i)=><button key={i} disabled={decided} onClick={()=>makeDecision(i)}
          className={`choice-card w-full text-left p-5 border-2 fu fu${i+1} ${decided?chosenIdx===i?'bg-rbr text-white b-ink':'papw b-tan opacity-30':'papw b-ink shadow-sm'}`}>
          <div className="flex items-start gap-4">
            <div className={`fd text-3xl font-semibold leading-none w-8 ${decided&&chosenIdx===i?'text-white':'t-rust'}`}>{String.fromCharCode(65+i)}</div>
            <div className="flex-1"><div className={`text-base font-medium mb-1 ${decided&&chosenIdx===i?'text-white':''}`}>{c.label}</div><div className={`fm text-xs ${decided&&chosenIdx===i?'opacity-90':'t-soft'}`}>{c.detail}</div></div>
          </div>
        </button>)}
      </div>}

      {/* Signature move button — appears when conditions met */}
      {canUseSignature&&<button onClick={useSignature} className="mt-3 w-full border-2 b-ink p-4 sig-glow fu fu4 flex items-center gap-3 papw">
        <Sparkles className="w-5 h-5 t-rbr flex-shrink-0"/>
        <div className="flex-1 text-left">
          <div className="fm text-[9px] uppercase tracking-widest t-rbr mb-0.5">Signature Move · {signatureUsesLeft} use{signatureUsesLeft>1?'s':''} left</div>
          <div className="fd text-lg font-semibold">{strat.signature.name}</div>
          <div className="fm text-xs t-soft">{strat.signature.detail}</div>
        </div>
        <ArrowRight className="w-4 h-4 t-rust"/>
      </button>}

      {!currentEvent.choices&&!currentEvent.slider&&!dualImmune&&!decided&&<button onClick={skipDecision} className="w-full bg-ink text-white border-2 b-ink px-6 py-4 flex items-center justify-center gap-2 font-medium" style={{boxShadow:'4px 4px 0 0 var(--rust)'}}><span>Execute the month</span><ArrowRight className="w-4 h-4"/></button>}
      {dualImmune&&!decided&&<button onClick={skipDecision} className="w-full bg-moss text-white border-2 b-ink px-6 py-4 flex items-center justify-center gap-2 font-medium" style={{boxShadow:'4px 4px 0 0 var(--ink)'}}><span>Secondary supplier engaged — advance</span><ArrowRight className="w-4 h-4"/></button>}

      {preview&&<MonthResultPanel preview={preview} stratKey={strategy} event={currentEvent} allPreviews={allPreviews} industry={industry} insiderNote={insiderNote}/>}

      {decided&&<button onClick={onContinue} className="w-full mt-5 bg-rbr text-white border-2 b-ink px-6 py-5 flex items-center justify-center gap-3 fd text-xl tracking-tight st" style={{boxShadow:'6px 6px 0 0 var(--ink)'}}>
        <span>{state.month===11?'See year-end results':'Advance to next month'}</span><ArrowRight className="w-5 h-5"/>
      </button>}
    </div>
    <YearTape history={state.history} currentMonth={state.month}/>
  </div>);
}

// ── INDUSTRY-AWARE LEARNING OBJECTIVES ─────────────────────────────────────
function LearningObjectives({strategy,industry,playerResult,alternateResults}){
  const strat=STRATEGIES[strategy];
  const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  const all=[{key:strategy,...playerResult},...Object.entries(alternateResults).map(([k,v])=>({key:k,...v}))];
  const winner=all.reduce((b,x)=>x.cash>b.cash?x:b,all[0]);
  const playerWon=winner.key===strategy;
  const supplierEvents=playerResult.history.filter(h=>EVENTS.find(e=>e.id===h.eventId)?.supplierEvent).length;
  const industrySpecificEvents=playerResult.history.filter(h=>EVENTS.find(e=>e.id===h.eventId)?.industries?.includes(industry)).length;
  const allCash=all.map(x=>x.cash);
  const cashSpread=Math.max(...allCash)-Math.min(...allCash);
  const sigUsed=playerResult.history.some(h=>h.isSignature);
  const sigBonusCash=playerResult.signatureBonusCash||0;

  // Find the moment that hurt most
  let worstMonth=null,worstHit=0;
  playerResult.history.forEach((h,i)=>{
    if(i>0){const diff=playerResult.history[i-1].cash-h.cash;if(diff>worstHit){worstHit=diff;worstMonth=h;}}
  });

  const objs=[
    {n:'01',
      p:`${ind.short} has its own way of punishing mistakes — ${ind.perilName.toLowerCase()}`,
      e:playerResult.perilDetail
        ? `Your year ended with this: ${playerResult.perilDetail} The peril mechanic is what makes ${ind.short} different from other industries. ${strategy==='lean'?'Lean players especially need to plan around it from Month 1.':strategy==='buffered'?'Safety Stock helps with some perils but not others — the ones it doesn\'t fix are the ones that matter.':'Dual Source insulates you from supplier shocks but not from this — strategy and industry peril are independent.'}`
        : `You avoided the ${ind.perilName.toLowerCase()} mechanic this year. ${ind.perilDesc} Many players don't — and the peril cost can erase a full quarter's profit invisibly.`},

    {n:'02',
      p:`Strategy locks in your vulnerabilities before the year begins`,
      e:supplierEvents>=2&&strategy!=='dual'
        ? `You faced ${supplierEvents} supplier disruptions. Dual Source players were immune to those events — they paid a premium upfront so they wouldn't have to scramble mid-year. The decision was made in January, not during the crisis.`
        : industrySpecificEvents>=2
          ? `You faced ${industrySpecificEvents} ${ind.short}-specific events this year. Industry-native disruptions reward operators who picked a strategy aligned to the sector's failure modes — not generic best practices.`
          : `Your ${strat.name} choice determined which events would hurt you before Month 1 even started. The strategy decision is upstream of every tactical decision that followed.`},

    {n:'03',
      p:`The same year plays out very differently under each strategy`,
      e:`Same twelve months. Same disruptions. ${STRATEGIES[all.reduce((b,x)=>x.cash>b.cash?x:b,all[0]).key].name} ended at $${(Math.max(...allCash)/1000).toFixed(1)}K. ${STRATEGIES[all.reduce((b,x)=>x.cash<b.cash?x:b,all[0]).key].name} ended at $${(Math.min(...allCash)/1000).toFixed(1)}K. A $${(cashSpread/1000).toFixed(1)}K gap from identical events. The strategy doesn't change what happens — it changes what hurts.`},

    {n:'04',
      p:sigUsed?`Your signature move shifted ~$${(sigBonusCash/1000).toFixed(1)}K of cash`:`You never used your signature move`,
      e:sigUsed
        ? `${strat.signature.name} is what makes ${strat.name} more than a numerical preset. ${strat.signature.effect.signature==='lean-defer'?'Deferring replenishment in a calm month is the move every lean operator learns to time. Too early, you stockout. Too late, you miss the cash window.':strat.signature.effect.signature==='buffered-sweep'?'Promotional liquidation converts holding cost into immediate cash. It also signals to the market that you over-ordered — use it once or not at all.':'Spot arbitrage is the move that justifies dual sourcing. Without it, you\'re just paying a premium for insurance. With it, you claw back the cost.'}`
        : `${strat.signature.name} was available — ${strat.signature.tagline} You can complete the year without it, but most experienced operators use it. ${strat.signature.when}`},

    {n:'05',
      p:worstMonth?`Month ${worstMonth.month} (${worstMonth.event}) cost you the most`:`Resilience has a price — paid before you need it`,
      e:worstMonth
        ? `You lost $${(worstHit/1000).toFixed(1)}K in a single month. The event was a ${worstMonth.severity}, and the decision you made was: "${worstMonth.decision||'no action'}". In hindsight, ${playerWon?'this was a survivable cost — your strategy absorbed it.':'a different decision (or a different strategy) might have softened it. The receipts showed exactly how each option would have priced out.'}`
        : `Every strategy trades cost-now for safety-later. Safety Stock costs you holding fees on calm months. Lean costs you stockouts on volatile ones. Dual Source costs unit-margin every month, even when nothing goes wrong. No free option — only different timing.`},
  ];

  return (<div className="papw border-2 b-ink p-6 md:p-8 mb-8 shadow-ink">
    <div className="fm text-[10px] uppercase tracking-[.25em] t-soft mb-1">Learning Objectives</div>
    <h3 className="fd text-4xl font-semibold mb-2 tracking-tight">What this run taught</h3>
    <p className="t-soft text-base mb-8 max-w-xl">Five principles — each grounded in what actually happened to <span className="t-ink font-medium">your</span> {strat.name} run in {ind.name}.</p>
    <div className="space-y-0">{objs.map((o,i)=><div key={i} className="flex gap-6 py-6 border-b-2 b-tan last:border-0 fu" style={{animationDelay:`${i*.1}s`,opacity:0}}>
      <div className="fd text-6xl font-semibold leading-none flex-shrink-0 w-14 pt-1" style={{color:'var(--paper-dark)',WebkitTextStroke:'1.5px var(--tan)'}}>{o.n}</div>
      <div className="flex-1"><div className="fd text-xl font-semibold mb-2 tracking-tight leading-snug">{o.p}</div><div className="t-soft text-sm leading-relaxed">{o.e}</div></div>
    </div>)}</div>
  </div>);
}

const STRAT_COLORS={lean:'#1e4d3c',buffered:'#c8861a',dual:'#2b5470'};

// ── INDUSTRY-AWARE LESSON GENERATOR ────────────────────────────────────────
function generateLesson(strategy,industry,playerResult,alts){
  const all=[{key:strategy,...playerResult},...Object.entries(alts).map(([k,v])=>({key:k,...v}))];
  const winner=all.reduce((b,x)=>x.cash>b.cash?x:b,all[0]);
  const playerWon=winner.key===strategy;
  const strat=STRATEGIES[strategy];
  const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  const wk=STRATEGIES[winner.key];
  const evTypes=playerResult.history.reduce((a,h)=>{a[h.severity]=(a[h.severity]||0)+1;return a;},{});
  const supplierEvents=playerResult.history.filter(h=>EVENTS.find(e=>e.id===h.eventId)?.supplierEvent).length;
  const perilHit=playerResult.perilCost>0;

  if(playerWon){
    let body=`${strat.name} matched the disruption profile this year — ${evTypes.crisis||0} crises, ${evTypes.opportunity||0} spikes, ${evTypes.slump||0} slumps. `;
    if(perilHit)body+=`The ${ind.perilName.toLowerCase()} mechanic still cost you $${(playerResult.perilCost/1000).toFixed(1)}K — but you absorbed it.`;
    else body+=`You also dodged the ${ind.perilName.toLowerCase()} mechanic, which costs many ${ind.short} players a full quarter of profit. `;
    body+=` Shuffle the deck and the answer changes. The real lesson is not picking the "best" strategy — it is understanding what each buys you in this specific industry.`;
    return{headline:'You picked the right strategy for this event mix.',body};
  }

  let body='';
  if(winner.key==='dual'&&supplierEvents>=2)body=`This ${ind.short} year had ${supplierEvents} supplier-side disruptions. Dual Source paid its premium and earned it back many times over. In an industry like ${ind.name.toLowerCase()}, where ${ind.perilName.toLowerCase()} can compound, supplier resilience pays double.`;
  else if(winner.key==='buffered'&&(evTypes.opportunity||0)>=2)body=`Demand swung hard — ${evTypes.opportunity||0} upside spikes. Safety Stock captured them while ${strat.name} ran out of product. Holding inventory is a tax on calm years and insurance on volatile ones — and ${ind.short}'s seasonal swings reward whoever has stock when it counts.`;
  else if(winner.key==='lean'&&(evTypes.calm||0)>=3)body=`${evTypes.calm} months of calm meant Lean's lower costs compounded into a clear win. ${strat.name} paid for resilience it did not need this year. In ${ind.short}, where unit margins are ${ind.unitPrice>=500?'high enough to absorb costs':'thin enough that every dollar matters'}, that\'s a meaningful gap.`;
  else body=`${wk.name} edged ahead in ${ind.short} this run. Different event draws reward different strategies — and the ${ind.perilName.toLowerCase()} mechanic punishes some strategies harder than others.`;

  if(perilHit)body+=` Note: you also got hit by ${ind.perilName.toLowerCase()} for $${(playerResult.perilCost/1000).toFixed(1)}K. That's the industry tax for stockouts/excess in ${ind.short}.`;

  return{headline:`${wk.name} won this year in ${ind.short}. Here is why.`,body};
}

// ── DEBRIEF SCREEN ─────────────────────────────────────────────────────────
function DebriefScreen({playerResult,alternateResults,strategy,industry,onReplay}){
  const[showLeaderboard,setShowLeaderboard]=useState(false);
  const[saved,setSaved]=useState(false);
  const strat=STRATEGIES[strategy];const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  const lesson=generateLesson(strategy,industry,playerResult,alternateResults);

  useEffect(()=>{
    if(!saved){
      saveScore({strategy,industry,cash:playerResult.cash,fillRate:playerResult.fillRate,reputation:playerResult.reputation,stockoutMonths:playerResult.stockoutMonths,date:new Date().toLocaleDateString()});
      setSaved(true);
    }
  },[]);

  const sorted=[{key:strategy,isPlayer:true,...playerResult},...Object.entries(alternateResults).map(([k,v])=>({key:k,isPlayer:false,...v}))].sort((a,b)=>b.cash-a.cash);

  const chartData=playerResult.history.map((h,i)=>{
    const pt={month:`M${i+1}`};
    pt[strat.name]=Math.round(h.cash/1000);
    Object.entries(alternateResults).forEach(([k,r])=>{pt[STRATEGIES[k].name]=Math.round(r.history[i].cash/1000);});
    return pt;
  });

  return (<div className="min-h-screen paper-bg relative">
    {showLeaderboard&&<Leaderboard onClose={()=>setShowLeaderboard(false)}/>}
    <div className="grain"/>
    <div className="max-w-6xl mx-auto px-6 py-10 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="fm text-[11px] uppercase tracking-[.3em] t-rust">Fiscal Year Complete · {ind.name}</div>
        <button onClick={()=>setShowLeaderboard(true)} className="fm text-[10px] uppercase tracking-widest papw border-2 b-ink px-3 py-1.5 flex items-center gap-1.5 lift shadow-sm"><Trophy className="w-3 h-3"/><span>Leaderboard</span></button>
      </div>
      <h1 className="fd text-7xl font-semibold mb-3 tracking-tight">The <span className="fdi">Debrief</span></h1>
      <p className="t-soft text-lg mb-10 max-w-2xl">You ran <span className="font-medium t-ink">{strat.name}</span> in <span className="font-medium t-ink">{ind.name}</span> for twelve months. Score saved to global leaderboard.</p>

      {/* Industry peril callout */}
      {playerResult.perilDetail&&<div className="bg-rust text-white border-2 b-ink p-5 mb-8 shadow-ink fu">
        <div className="fm text-[10px] uppercase tracking-[.25em] mb-2" style={{opacity:.8}}>Industry Peril Triggered · {ind.perilName}</div>
        <p className="text-base leading-relaxed">{playerResult.perilDetail}</p>
      </div>}

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {sorted.map((r,i)=>{const s=STRATEGIES[r.key];return (<div key={r.key} className={`p-5 border-2 b-ink fu fu${i+1} ${r.isPlayer?'bg-rbr text-white':'papw'}`} style={{boxShadow:'5px 5px 0 0 var(--ink)'}}>
          <div className="flex items-center justify-between mb-3"><div className={`fm text-[10px] uppercase tracking-widest ${r.isPlayer?'opacity-80':'t-soft'}`}>{i===0?'🥇 Winner':i===1?'Runner-up':'3rd'}</div>{r.isPlayer&&<div className="fm text-[10px] bg-ink text-white px-1.5 py-0.5">You</div>}</div>
          <div className="fd text-3xl font-semibold mb-1 tracking-tight">{s.name}</div>
          <div className="fm text-3xl mb-3 font-medium" style={!r.isPlayer?{color:STRAT_COLORS[r.key]}:{}}>${(r.cash/1000).toFixed(1)}K</div>
          <div className={`fm text-xs space-y-1 ${r.isPlayer?'opacity-90':'t-soft'}`}>
            <div className="flex justify-between"><span>Fill Rate</span><span>{r.fillRate.toFixed(0)}%</span></div>
            <div className="flex justify-between"><span>Reputation</span><span>{r.reputation}</span></div>
            <div className="flex justify-between"><span>Stockout Months</span><span>{r.stockoutMonths}</span></div>
            {r.perilCost>0&&<div className="flex justify-between"><span>Peril Cost</span><span>${(r.perilCost/1000).toFixed(1)}K</span></div>}
          </div>
        </div>);})}
      </div>

      <div className="papw border-2 b-ink p-6 mb-8 shadow-ink">
        <div className="fm text-[10px] uppercase tracking-widest t-soft mb-1">Cash Trajectory</div>
        <h3 className="fd text-3xl font-semibold mb-6 tracking-tight">Twelve months, three timelines</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c9bc99"/>
            <XAxis dataKey="month" stroke="#5b6478" style={{fontSize:11,fontFamily:'JetBrains Mono,monospace'}}/>
            <YAxis stroke="#5b6478" style={{fontSize:11,fontFamily:'JetBrains Mono,monospace'}}/>
            <Tooltip contentStyle={{background:'#faf3df',border:'2px solid #1c1f2b',fontFamily:'JetBrains Mono,monospace',fontSize:12}}/>
            <Legend wrapperStyle={{fontSize:11,fontFamily:'DM Sans,sans-serif'}}/>
            {Object.keys(STRATEGIES).map(k=><Line key={k} type="monotone" dataKey={STRATEGIES[k].name} stroke={STRAT_COLORS[k]} strokeWidth={k===strategy?3.5:1.8} strokeDasharray={k===strategy?'0':'5 5'} dot={{r:k===strategy?4:0,fill:STRAT_COLORS[k]}}/>)}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="papw border-2 b-ink p-6 mb-8 shadow-ink">
        <div className="fm text-[10px] uppercase tracking-widest t-soft mb-1">Event Log</div>
        <h3 className="fd text-3xl font-semibold mb-6 tracking-tight">What you actually faced</h3>
        <div className="space-y-0">{playerResult.history.map((h,i)=>{
          const c={calm:'bg-amb',opportunity:'bg-sage',slump:'bg-sky',crisis:'bg-rust'};
          const isIndustrySpec=EVENTS.find(e=>e.id===h.eventId)?.industries?.includes(industry);
          return (<div key={i} className="flex items-center gap-3 py-2 border-b b-tan last:border-0">
            <div className="fm text-xs t-soft w-10">M{String(i+1).padStart(2,'0')}</div>
            <div className={`w-1.5 h-9 ${c[h.severity]}`}/>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate flex items-center gap-2">
                {h.event}
                {isIndustrySpec&&<span className="fm text-[8px] uppercase tracking-widest bg-ink text-white px-1 py-0.5">{ind.short}</span>}
              </div>
              {h.decision&&<div className={`fm text-[10px] mt-0.5 truncate ${h.isSignature?'t-rbr font-semibold':'t-soft'}`}>↳ {h.decision}</div>}
              {h.supplierImmune&&<div className="fm text-[10px] t-moss mt-0.5">↳ Dual source absorbed it</div>}
            </div>
            <div className="fm text-xs text-right hidden md:block"><div>D{h.demand} F{h.fulfilled}</div><div className={h.stockout>0?'t-rust':'t-soft'}>{h.stockout>0?`-${h.stockout}`:'✓'}</div></div>
            <div className="fm text-sm text-right w-20">${(h.cash/1000).toFixed(1)}K</div>
          </div>);
        })}</div>
      </div>

      <LearningObjectives strategy={strategy} industry={industry} playerResult={playerResult} alternateResults={alternateResults}/>

      <div className="bg-ink text-white border-2 b-ink p-8 mb-8" style={{boxShadow:'5px 5px 0 0 var(--rust)'}}>
        <div className="fm text-[10px] uppercase tracking-[.25em] t-rbr mb-3">The Lesson</div>
        <h3 className="fd text-4xl font-semibold mb-4 tracking-tight">{lesson.headline}</h3>
        <p className="text-base leading-relaxed" style={{opacity:.9}}>{lesson.body}</p>
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <button onClick={onReplay} className="bg-rbr text-white border-2 b-ink px-6 py-4 flex items-center gap-2 font-medium lift shadow-ink"><RotateCcw className="w-4 h-4"/><span>New Year · New Scenario</span></button>
        <button onClick={()=>setShowLeaderboard(true)} className="papw border-2 b-ink px-6 py-4 flex items-center gap-2 font-medium lift shadow-sm"><Trophy className="w-4 h-4"/><span>Leaderboard</span></button>
        <div className="fm text-xs t-soft">↳ Score saved globally</div>
      </div>
      <div className="mt-12 fm text-[11px] t-soft">Built as a teaching tool for supply chain resilience.</div>
    </div>
  </div>);
}

// ── INIT STATE HELPERS ─────────────────────────────────────────────────────
function initAllStates(industryKey){
  const ind=INDUSTRIES[industryKey]||INDUSTRIES.fmcg;
  const out={};
  Object.values(STRATEGIES).forEach(s=>{out[s.key]={inventory:s.startInventory,cash:ind.startCash};});
  return out;
}

// ── APP ROOT ───────────────────────────────────────────────────────────────
export default function App(){
  const[phase,setPhase]=useState('industry');
  const[industry,setIndustry]=useState(null);
  const[strategy,setStrategy]=useState(null);
  const[seed]=useState(()=>Date.now()%1000000);
  const[eventSeq,setEventSeq]=useState([]);
  const[decisions,setDecisions]=useState([]);
  const[state,setState]=useState(null);
  const[currentEvent,setCurrentEvent]=useState(null);
  const[allStates,setAllStates]=useState(null);
  const[results,setResults]=useState(null);
  const[bankruptMonth,setBankruptMonth]=useState(null);
  const[signatureUsesLeft,setSignatureUsesLeft]=useState(0);

  const selectIndustry=(ind)=>{setIndustry(ind);setPhase('strategy');};

  const startGame=(stratKey)=>{
    const seq=shuffleDeck(seed,industry);
    const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
    setStrategy(stratKey);setEventSeq(seq);setDecisions([]);setBankruptMonth(null);
    setSignatureUsesLeft(STRATEGIES[stratKey].signature.uses);
    setState({month:0,cash:ind.startCash,inventory:STRATEGIES[stratKey].startInventory,reputation:100,fillRate:100,history:[]});
    setAllStates(initAllStates(industry));
    setCurrentEvent(seq[0]);setPhase('playing');
  };

  const handleDecision=(dec)=>{
    const nd=[...decisions];nd[state.month]=dec;setDecisions(nd);
    // Decrement signature uses if used
    if(typeof dec==='string'&&dec.startsWith('sig:'))setSignatureUsesLeft(u=>Math.max(0,u-1));
  };

  const handleContinue=()=>{
    const nd=[...decisions];if(nd[state.month]===undefined)nd[state.month]=-1;
    const partial=simulateYear(strategy,industry,eventSeq.slice(0,state.month+1),nd,seed);
    const lastCash=partial.history[partial.history.length-1]?.cash||0;
    if(lastCash<0){setBankruptMonth(state.month+1);setPhase('bankrupt');return;}
    if(state.month===11){
      const playerResult=simulateYear(strategy,industry,eventSeq,nd,seed);
      const alts={};
      Object.keys(STRATEGIES).forEach(k=>{if(k!==strategy)alts[k]=simulateYear(k,industry,eventSeq,null,seed);});
      setResults({playerResult,alts});setPhase('end');
    }else{
      const nextMonth=state.month+1;
      const lastEntry=partial.history[partial.history.length-1];
      setState({month:nextMonth,cash:lastEntry.cash,inventory:lastEntry.inventory,reputation:lastEntry.reputation,fillRate:partial.fillRate,history:partial.history});
      setCurrentEvent(eventSeq[nextMonth]);setDecisions(nd);
      const newAllStates={};
      Object.keys(STRATEGIES).forEach(k=>{
        const sim=simulateYear(k,industry,eventSeq.slice(0,nextMonth),null,seed);
        const last=sim.history[sim.history.length-1];
        newAllStates[k]={inventory:last.inventory,cash:last.cash};
      });
      setAllStates(newAllStates);
    }
  };

  const replay=()=>{setPhase('industry');setStrategy(null);setIndustry(null);setResults(null);setSignatureUsesLeft(0);};

  return (<div className="gr">
    <style>{STYLES}</style>
    {phase==='industry'&&<IndustrySelector onSelect={selectIndustry}/>}
    {phase==='strategy'&&<StrategySelector onSelect={startGame} industryKey={industry}/>}
    {phase==='playing'&&state&&currentEvent&&<MonthScreen state={state} strategy={strategy} industry={industry} currentEvent={currentEvent} onDecision={handleDecision} onContinue={handleContinue} allStates={allStates} signatureUsesLeft={signatureUsesLeft}/>}
    {phase==='bankrupt'&&<BankruptcyScreen month={bankruptMonth} strategy={strategy} industry={industry} onReplay={replay}/>}
    {phase==='end'&&results&&<DebriefScreen playerResult={results.playerResult} alternateResults={results.alts} strategy={strategy} industry={industry} onReplay={replay}/>}
  </div>);
}