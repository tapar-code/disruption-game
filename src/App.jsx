import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Zap, Package, ShieldCheck, RotateCcw, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Trophy, X } from 'lucide-react';

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
  .smoke{animation:smoke 3s ease-out infinite;}.smoke2{animation:smoke 3s ease-out infinite;animation-delay:-1s;}.smoke3{animation:smoke 3s ease-out infinite;animation-delay:-2s;}
  .factory-dead .smoke,.factory-dead .smoke2,.factory-dead .smoke3{animation:none;opacity:0;}.factory-dead .fb{fill:var(--ink-soft);}
  .ship-bob{animation:bob 3s ease-in-out infinite;transform-origin:center;transform-box:fill-box;}.ship-stop{animation:none;}
  .wave-anim{animation:wave 4s linear infinite;}
  .pkg{animation:belt 14s linear infinite;}.scene-viral .pkg{animation-duration:7s;}.scene-slump .pkg{animation-duration:22s;opacity:.6;}
  .hearts{animation:heartsfloat 1.6s ease-out infinite;}.hearts2{animation:heartsfloat 1.6s ease-out infinite;animation-delay:-.5s;}.hearts3{animation:heartsfloat 1.6s ease-out infinite;animation-delay:-1s;}
  .pulse{animation:pulse 1.4s ease-in-out infinite;}.stamp{animation:stamp .6s cubic-bezier(.34,1.56,.64,1) forwards;transform-origin:center;transform-box:fill-box;}
  .shake{animation:shake .4s ease-in-out 3;}.slam{animation:slam .55s cubic-bezier(.34,1.56,.64,1) forwards;}
  .fu{animation:fadeup .45s ease-out forwards;opacity:0;}.fu1{animation-delay:.1s;}.fu2{animation-delay:.22s;}.fu3{animation-delay:.34s;}
  .fi{animation:fadein .5s ease-out forwards;}.st{animation:slidetop .5s ease-out forwards;}.ld{animation:linedown .6s ease-out forwards;}
  input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:0;background:var(--tan);outline:none;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;background:var(--ink);cursor:pointer;border:2px solid var(--paper-warm);}
  input[type=range]::-moz-range-thumb{width:18px;height:18px;background:var(--ink);cursor:pointer;border:2px solid var(--paper-warm);border-radius:0;}
`;

const INDUSTRIES = {
  fmcg:{key:'fmcg',name:'FMCG / Consumer Goods',short:'FMCG',tagline:'High volume, thin margins, promotional spikes.',description:'You sell everyday consumer products through major retailers. Promotions drive volume swings. A stockout means a competitor takes your shelf slot — permanently.',unitPrice:200,stockoutPenalty:5,startCash:50000,demandBase:[28,35],seasonal:[.75,.78,.88,.92,.98,1.02,.95,.92,1.05,1.1,1.35,1.45]},
  pharma:{key:'pharma',name:'Pharmaceuticals',short:'Pharma',tagline:'Regulated, life-critical, zero tolerance for stockouts.',description:"You supply hospitals and pharmacies. Lead times are long due to regulatory controls. A stockout doesn't just cost revenue — it costs lives and license risk.",unitPrice:800,stockoutPenalty:12,startCash:50000,demandBase:[18,25],seasonal:[.95,.95,.98,1.0,1.0,.95,.92,.92,1.0,1.02,1.1,1.05]},
  fashion:{key:'fashion',name:'Fast Fashion',short:'Fashion',tagline:'Seasonal peaks, obsolescence risk, trend-driven.',description:'You produce seasonal collections. Inventory unsold at end of season must be marked down 60%+. Demand is highly seasonal and trend-sensitive.',unitPrice:150,stockoutPenalty:6,startCash:50000,demandBase:[22,35],seasonal:[.5,.55,1.2,1.35,1.1,.75,.7,1.3,1.4,1.1,.8,.6]},
  auto:{key:'auto',name:'Automotive / Industrial',short:'Auto',tagline:'JIT-dependent, supplier-concentrated, high unit value.',description:'You supply parts to assembly lines. A single missing component halts an entire line. Supplier concentration is high and lead times are 8–12 weeks.',unitPrice:600,stockoutPenalty:15,startCash:50000,demandBase:[15,22],seasonal:[.8,.85,1.0,1.1,1.15,1.05,.7,.8,1.1,1.1,1.0,.8]},
};

const STRATEGIES = {
  lean:{key:'lean',name:'Lean / JIT',tagline:'Minimize inventory. Maximize cash velocity.',startInventory:25,baseReplenish:30,holdingCost:2,unitCost:80,supplierRedundancy:false,description:'You hold almost nothing. Capital is free. But when the world hiccups, you bleed.',bestFor:'Calm, predictable years',weakAgainst:'Demand spikes, supplier failures'},
  buffered:{key:'buffered',name:'Safety Stock',tagline:'Hold inventory. Sleep at night.',startInventory:70,baseReplenish:30,holdingCost:5,unitCost:80,supplierRedundancy:false,description:'You carry weeks of cover. It costs you, but you can absorb almost any demand shock.',bestFor:'Volatile demand',weakAgainst:'Long supplier outages, recessions'},
  dual:{key:'dual',name:'Dual Source',tagline:'Pay a premium. Sleep through supplier crises.',startInventory:35,baseReplenish:30,holdingCost:4,unitCost:92,supplierRedundancy:true,description:'Two qualified suppliers, geographically split. If one falls, the other rises.',bestFor:'Supply-side shocks',weakAgainst:'Margin-thin calm years'},
};

const EVENTS = [
  {id:'calm-1',severity:'calm',title:'Steady State',flavor:'Operations are quiet. Forecasts are on target.',realWorld:'Supply chain disruptions now occur every 3.7 years on average per company — calm months are always temporary.',demand:[28,35],choices:null},
  {id:'calm-2',severity:'calm',title:'Forecast On Target',flavor:'Sales matches plan. The S&OP team is, briefly, smug.',realWorld:'Most companies achieve only 60–70% forecast accuracy. A month at 95%+ is genuinely rare.',demand:[27,33],choices:null},
  {id:'calm-3',severity:'calm',title:'Quiet Month',flavor:'Nothing to report. Enjoy it.',realWorld:'The 2017 consumer goods landscape: stable, predictable growth. Rare by 2020 standards.',demand:[29,34],choices:null},
  {id:'viral',severity:'opportunity',title:'Viral Moment',flavor:'A creator with 4M followers posted a glowing review. Demand has nearly doubled overnight.',realWorld:'Stanley cup went viral on TikTok in 2023 — demand spiked 3,000%, causing months of stockouts and $750M in lost sales for competitors who could not react.',demand:[55,70],choices:[{label:'Air-freight an emergency lot',detail:'+25 units · costs $4,000',preview:'inv-up',effect:{extraInventory:25,cashCost:4000}},{label:'Ride the wave; accept stockouts',detail:'Save cash · lose sales',preview:'stockout',effect:{}}]},
  {id:'holiday',severity:'opportunity',title:'Holiday Surge',flavor:'Seasonal demand is up ~50%. Did you order enough 12 weeks ago?',realWorld:'Amazon Prime Day 2023 drove 2–3× normal demand for partner brands who had placed inventory orders 3 months prior.',demand:[42,52],choices:[{label:'Run an extra production shift',detail:'+15 units · costs $2,000',preview:'inv-up',effect:{extraInventory:15,cashCost:2000}},{label:'Hold the line on costs',detail:'No extra spend',preview:'flat',effect:{}}]},
  {id:'growth',severity:'opportunity',title:'New Distribution Deal',flavor:'A major retailer just added you to their national planogram. Volume jumps 30% immediately.',realWorld:"When Costco added a new beverage brand in 2019, the supplier's demand jumped 35% in 4 weeks — before they had time to ramp production.",demand:[38,48],choices:[{label:'Pre-build inventory buffer',detail:'+20 units · costs $2,400',preview:'inv-up',effect:{extraInventory:20,cashCost:2400}},{label:'Fill from existing stock',detail:'No extra cost',preview:'flat',effect:{}}]},
  {id:'supplier-fail',severity:'crisis',title:'Supplier Bankruptcy',flavor:'Your primary supplier filed Chapter 11. Two months of inbound shipments are frozen.',realWorld:'Hanjin Shipping bankruptcy in 2016 stranded $14B of cargo at sea, affecting 8,000 containers and hundreds of suppliers with no backup plan.',demand:[28,35],supplierEvent:true,choices:[{label:'Source from the spot market',detail:'+$60/unit for 2 months',preview:'cash-down',effect:{unitCostBump:60,costBumpDuration:2}},{label:'Wait it out — no replenishment for 2 months',detail:'Save cash · inventory at risk',preview:'inv-down',effect:{skipReplenish:2}}]},
  {id:'climate',severity:'crisis',title:'Climate Disaster',flavor:'Severe flooding has shut down your primary supplier region. No output for 6–8 weeks.',realWorld:'2011 Thailand floods destroyed 14,000 factories, disrupting global hard drive supply for 18 months — affecting Apple, Dell, and HP simultaneously.',demand:[28,35],supplierEvent:true,choices:[{label:'Qualify emergency backup supplier',detail:'Costs $8,000 · limited supply next month',preview:'cash-down',effect:{cashCost:8000,extraInventory:12,skipReplenish:1}},{label:'Ration remaining inventory',detail:'Fulfill only 70% of orders',preview:'inv-down',effect:{skipReplenish:2}}]},
  {id:'esg-audit',severity:'crisis',title:'ESG Supplier Suspension',flavor:'Your primary supplier suspended pending a labor practices audit. Shipments halted.',realWorld:'Following the Rana Plaza collapse in 2013, H&M suspended 14 suppliers, causing 6–8 week supply gaps that companies with diversified sourcing absorbed without disruption.',demand:[26,34],supplierEvent:true,choices:[{label:'Accelerate dual-source qualification',detail:'Costs $5,000 · partial supply in 3 weeks',preview:'cash-down',effect:{cashCost:5000,skipReplenish:1}},{label:'Wait for audit clearance',detail:'No replenishment this month',preview:'inv-down',effect:{skipReplenish:1}}]},
  {id:'port-strike',severity:'crisis',title:'Port Strike',flavor:"Longshoremen walked off the job. This month's replenishment is sitting offshore.",realWorld:'The 2021 LA/Long Beach port backlog saw 100+ ships anchored offshore for weeks, adding 6–8 weeks to lead times and costing importers an estimated $1B/day.',demand:[28,35],slider:{label:'Units to air-freight',unit:'units',min:0,max:40,step:5,costPerUnit:180,heuristicValue:15,note:'$180/unit extra · 0 = skip this month entirely'}},
  {id:'container-shortage',severity:'crisis',title:'Container Shortage',flavor:'Global container imbalance — 60% of containers are in wrong locations. Lead times just doubled.',realWorld:'The 2021 global container crisis pushed spot rates from $2,000 to $14,000 per 40ft container — a 600% increase that persisted 18 months.',demand:[27,34],slider:{label:'Units to air-freight',unit:'units',min:0,max:50,step:5,costPerUnit:160,heuristicValue:20,note:'$160/unit extra · 0 = replenishment delayed 1 month'}},
  {id:'tariff',severity:'crisis',title:'Tariff Shock',flavor:'A surprise 25% tariff hit your import category. Every unit now costs $20 more to land.',realWorld:'US-China tariffs in 2018 pushed steel prices up 25% within 90 days and forced GM to take a $1B earnings hit.',demand:[27,33],slider:{label:'Pre-buy inventory before tariff hits',unit:'units',min:0,max:60,step:10,costPerUnit:80,heuristicValue:30,note:'Buy now at old price · 0 = absorb $20/unit cost for 3 months',tariffAlternative:true}},
  {id:'currency',severity:'crisis',title:'Currency Devaluation',flavor:"The currency in your sourcing country devalued 30% overnight. Import costs spike immediately.",realWorld:"Argentina's peso devalued 50% in 2018, making imported components 50% more expensive overnight — many companies had no hedging in place.",demand:[26,33],choices:[{label:'Lock in a forward contract',detail:'Costs $4,500 · protected for 3 months',preview:'cash-down',effect:{cashCost:4500}},{label:'Absorb the spot rate increase',detail:'+$25/unit for 2 months',preview:'cash-down',effect:{unitCostBump:25,costBumpDuration:2}}]},
  {id:'recall',severity:'crisis',title:'Quality Recall',flavor:'QA found a defect. A third of your inventory must be quarantined immediately.',realWorld:"Toyota's 2009–2010 recall of 9M vehicles cost $2B and required immediate inventory quarantine across the entire distribution chain.",demand:[28,35],choices:[{label:'Quarantine — write off 33%',detail:'Clean break · no further risk',preview:'inv-down',effect:{inventoryLossPct:.33}},{label:'Rework over 2 months — 15% loss',detail:'Costs $3,000 in rework labor',preview:'cash-down',effect:{inventoryLossPct:.15,cashCost:3000}}]},
  {id:'cyberattack',severity:'crisis',title:'Cyberattack on ERP',flavor:"Ransomware encrypted your ERP. You've lost visibility into inventory and open orders.",realWorld:"The 2017 NotPetya attack hit Maersk's entire global network — wiping 45,000 PCs, halting 76 port terminals, and costing $300M.",demand:[28,35],choices:[{label:'Pay for emergency IT recovery',detail:'Costs $6,000 · visibility restored',preview:'cash-down',effect:{cashCost:6000}},{label:'Operate on manual counts — fly blind',detail:'No extra cost · higher risk',preview:'stockout',effect:{inventoryLossPct:.1}}]},
  {id:'labor-strike',severity:'crisis',title:'DC Labor Strike',flavor:"Workers at your distribution center walked out. You can only fulfill 60% of orders.",realWorld:'UK Amazon warehouse strikes in 2022 disrupted 40% of orders during peak holiday season — over 1,000 workers in Coventry walked out for 3 weeks.',demand:[28,35],choices:[{label:'Bring in temporary staffing',detail:'Costs $5,000 · fulfill 90%',preview:'cash-down',effect:{cashCost:5000}},{label:'Operate at reduced fulfillment',detail:'Fulfill ~60% of demand',preview:'stockout',effect:{fulfillCapPct:.6}}]},
  {id:'recession',severity:'slump',title:'Recession Headlines',flavor:'Consumer confidence hit a 5-year low. Channel partners are pulling back orders.',realWorld:'In March 2020 the first weeks of COVID-19 caused demand for many categories to drop 40–60% within days, leaving supply chains massively over-inventoried.',demand:[16,22],lingering:{months:2,demandMultiplier:.65},choices:[{label:'Cut replenishment 50% for 2 months',detail:'Right-size with demand',preview:'flat',effect:{replenishCut:.5,replenishCutDuration:2}},{label:'Hold the line — bet on rebound',detail:'Keep inventory flowing',preview:'inv-up',effect:{}}]},
  {id:'competitor',severity:'slump',title:'New Competitor',flavor:'A well-funded entrant launched at 20% below your price. Distributors are reshuffling.',realWorld:'When Amazon entered categories, incumbents saw 10–15% demand erosion within 6 months — often permanent as customer habits shifted.',demand:[18,24],lingering:{months:3,demandMultiplier:.7},choices:[{label:'Launch a counter-promotion',detail:'$3,500 spend · partially restores demand',preview:'cash-down',effect:{cashCost:3500,demandRestore:.85}},{label:'Hold price and ride it out',detail:'No spend · accept lower volume',preview:'flat',effect:{}}]},
  {id:'demand-collapse',severity:'slump',title:'Major Customer Bankruptcy',flavor:'Your largest customer — 30% of volume — filed Chapter 11. Orders cancelled immediately.',realWorld:"Sears' 2018 bankruptcy caused cascading demand drops for thousands of suppliers overnight. Some lost 25–40% of total revenue in a single day.",demand:[14,20],lingering:{months:2,demandMultiplier:.7},choices:[{label:'Aggressively find new channels',detail:'$4,000 marketing · recover 50% of lost volume',preview:'cash-down',effect:{cashCost:4000,demandRestore:.8}},{label:'Accept the volume loss',detail:'No spend · protect cash',preview:'flat',effect:{}}]},
  {id:'trade-war',severity:'slump',title:'Trade War Escalation',flavor:'New tariffs AND extended lead times across multiple categories simultaneously.',realWorld:'The 2018–2020 US-China trade war affected $550B of annual trade, forcing 400+ multinationals to restructure supply chains — median response time was 18 months.',demand:[22,30],choices:[{label:'Accelerate near-shoring',detail:'$7,000 one-time · +$15/unit ongoing',preview:'cash-down',effect:{cashCost:7000,unitCostBump:15,costBumpDuration:3}},{label:'Absorb both impacts',detail:'+$30/unit · longer lead times',preview:'cash-down',effect:{unitCostBump:30,costBumpDuration:2,skipReplenish:1}}]},
];

function seedRng(seed){let s=seed;return()=>{s=(s*1664525+1013904223)%4294967296;return s/4294967296;};}
function randInt(rng,[lo,hi]){return Math.floor(rng()*(hi-lo+1))+lo;}

function shuffleDeck(seed){
  const calms=EVENTS.filter(e=>e.severity==='calm');
  const disruptions=EVENTS.filter(e=>e.severity!=='calm');
  let rng=seedRng(seed);
  const shuffle=arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const chosen=[...shuffle(calms).slice(0,3),...shuffle(disruptions).slice(0,9)];
  const final=shuffle(chosen);
  const ci=final.findIndex(e=>e.severity==='calm');
  if(ci>0)[final[0],final[ci]]=[final[ci],final[0]];
  return final.slice(0,12);
}

function getSliderEffect(event,val){
  const s=event.slider;
  if(!s)return{};
  if(s.tariffAlternative){if(val===0)return{unitCostBump:20,costBumpDuration:3};return{extraInventory:val,cashCost:val*s.costPerUnit};}
  if(val===0)return{skipReplenish:1};
  return{extraInventory:val,cashCost:val*s.costPerUnit};
}

function simulateYear(stratKey,industryKey,eventSeq,playerDecisions=null,seed=1){
  const strat=STRATEGIES[stratKey];
  const industry=INDUSTRIES[industryKey]||INDUSTRIES.fmcg;
  const rng=seedRng(seed+stratKey.length*1000);
  let cash=industry.startCash,inventory=strat.startInventory,reputation=100;
  let unitCostBump=0,unitCostBumpRemaining=0,skipReplenishRemaining=0;
  let replenishCutPct=0,replenishCutRemaining=0,lingeringDemandMult=1,lingeringRemaining=0;
  const history=[];let totalDemand=0,totalFulfilled=0,stockoutMonths=0;

  for(let m=0;m<eventSeq.length;m++){
    const event=eventSeq[m];
    const seasonMult=industry.seasonal[m]||1;
    let demand=Math.round(randInt(rng,industry.demandBase)*seasonMult);
    if(lingeringRemaining>0){demand=Math.round(demand*lingeringDemandMult);lingeringRemaining--;}

    let dec=playerDecisions?playerDecisions[m]:null;
    if(dec===undefined)dec=null;

    let eff={};
    if(event.slider){
      const val=(dec!==null&&dec!==undefined)?dec:event.slider.heuristicValue;
      eff=getSliderEffect(event,val);
    }else if(event.choices&&dec!==null&&dec>=0&&event.choices[dec]){
      eff=event.choices[dec].effect;
    }else if(event.choices&&playerDecisions===null){
      const hi=strat.key==='lean'?1:0;
      eff=event.choices[Math.min(hi,event.choices.length-1)].effect;
    }

    const dualImmune=event.supplierEvent&&strat.supplierRedundancy;
    if(dualImmune)eff={};

    const extraInventory=eff.extraInventory||0;
    const cashCost=eff.cashCost||0;
    const inventoryLossPct=eff.inventoryLossPct||0;
    const demandRestoreMult=eff.demandRestore||1;
    const capPct=eff.fulfillCapPct||1;
    if(eff.unitCostBump&&!dualImmune){unitCostBump=eff.unitCostBump;unitCostBumpRemaining=eff.costBumpDuration||1;}
    if(eff.skipReplenish&&!dualImmune)skipReplenishRemaining=eff.skipReplenish;
    if(eff.replenishCut){replenishCutPct=eff.replenishCut;replenishCutRemaining=eff.replenishCutDuration||1;}
    if(inventoryLossPct>0)inventory=Math.floor(inventory*(1-inventoryLossPct));

    let replenish=0;
    if(skipReplenishRemaining>0){skipReplenishRemaining--;}
    else{
      replenish=strat.baseReplenish;
      if(replenishCutRemaining>0){replenish=Math.floor(replenish*(1-replenishCutPct));replenishCutRemaining--;}
      cash-=replenish*(strat.unitCost+unitCostBump);inventory+=replenish;
    }
    inventory+=extraInventory;cash-=cashCost;
    demand=Math.round(demand*demandRestoreMult);
    if(event.lingering&&lingeringRemaining===0){lingeringDemandMult=event.lingering.demandMultiplier;lingeringRemaining=event.lingering.months;}

    const maxFulfill=Math.floor(inventory*capPct);
    const fulfilled=Math.min(maxFulfill,demand);
    const stockout=demand-fulfilled;
    inventory-=fulfilled;
    cash+=fulfilled*(industry.unitPrice||200);
    cash-=inventory*strat.holdingCost;
    if(stockout>0){reputation-=(industry.stockoutPenalty||5);stockoutMonths++;}
    reputation=Math.max(0,Math.min(100,reputation));
    if(unitCostBumpRemaining>0){unitCostBumpRemaining--;if(unitCostBumpRemaining===0)unitCostBump=0;}
    totalDemand+=demand;totalFulfilled+=fulfilled;

    history.push({month:m+1,event:event.title,eventId:event.id,severity:event.severity,
      demand,fulfilled,stockout,inventory:Math.max(0,inventory),cash:Math.round(cash),reputation,replenish,
      supplierImmune:dualImmune,
      decision:event.slider?`${(dec!==null?dec:event.slider.heuristicValue)} units air-freighted`:(dec!==null&&dec>=0&&event.choices)?event.choices[dec].label:null});
  }
  const fillRate=totalDemand>0?(totalFulfilled/totalDemand)*100:100;
  return{history,cash:Math.round(cash),reputation,fillRate,stockoutMonths,totalDemand,totalFulfilled};
}

function computeMonthPreview(stratKey,industryKey,inventory,event,decision,monthIndex){
  const strat=STRATEGIES[stratKey];
  const industry=INDUSTRIES[industryKey]||INDUSTRIES.fmcg;
  const dualImmune=event.supplierEvent&&strat.supplierRedundancy;
  const seasonMult=industry.seasonal[monthIndex]||1;
  const demand=Math.round(((industry.demandBase[0]+industry.demandBase[1])/2)*seasonMult);
  let eff={};
  if(event.slider&&!dualImmune){const val=(decision!==null&&decision!==undefined)?decision:event.slider.heuristicValue;eff=getSliderEffect(event,val);}
  else if(event.choices&&!dualImmune&&decision!==null&&decision>=0&&event.choices[decision]){eff=event.choices[decision].effect;}
  if(dualImmune)eff={};
  const skipReplenish=!dualImmune&&eff.skipReplenish>0;
  const replenish=skipReplenish?0:strat.baseReplenish;
  const unitCostBump=dualImmune?0:(eff.unitCostBump||0);
  const replenishCost=replenish*(strat.unitCost+unitCostBump);
  const extraInventory=dualImmune?0:(eff.extraInventory||0);
  const extraCashCost=eff.cashCost||0;
  const inventoryLossPct=dualImmune?0:(eff.inventoryLossPct||0);
  let inv=Math.floor(inventory*(1-inventoryLossPct));
  const openingInventory=inv;
  inv+=replenish+extraInventory;
  const capPct=eff.fulfillCapPct||1;
  const maxFulfill=Math.floor(inv*capPct);
  const fulfilled=Math.min(maxFulfill,demand);
  const stockout=demand-fulfilled;
  const endInventory=Math.max(0,inv-fulfilled);
  const revenue=fulfilled*(industry.unitPrice||200);
  const holdingCost=endInventory*strat.holdingCost;
  const net=revenue-replenishCost-holdingCost-extraCashCost;
  return{openingInventory,replenish,replenishCost,extraInventory,extraCashCost,inventoryLossPct,demand,availableInventory:inv,fulfilled,stockout,endInventory,revenue,holdingCost,net,dualImmune,skipReplenish,unitPrice:industry.unitPrice||200};
}

async function saveScore(entry){try{await window.storage.set('score:'+Date.now(),JSON.stringify(entry),true);}catch(e){}}
async function loadScores(){
  try{
    const list=await window.storage.list('score:',true);
    if(!list||!list.keys||!list.keys.length)return[];
    const results=await Promise.all(list.keys.map(async k=>{try{const r=await window.storage.get(k,true);return r?JSON.parse(r.value):null;}catch{return null;}}));
    return results.filter(Boolean).sort((a,b)=>b.cash-a.cash).slice(0,15);
  }catch{return[];}
}

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

function SupplyChainScene({event,monthKey}){
  const eid=event?.id||'',sev=event?.severity||'calm';
  const supplierFail=['supplier-fail','climate','esg-audit'].includes(eid);
  const portStrike=['port-strike','container-shortage'].includes(eid);
  const tariff=['tariff','trade-war','currency'].includes(eid);
  const recall=['recall','cyberattack','labor-strike'].includes(eid);
  const viral=['viral','holiday','growth'].includes(eid);
  const slump=sev==='slump';
  const sevColors={calm:'papd b-tan t-soft',opportunity:'bg-sage text-white',slump:'bg-sky text-white',crisis:'bg-rust text-white'};
  const sevLabels={calm:'— Steady',opportunity:'↑ Spike',slump:'↓ Headwind',crisis:'⚠ Disruption'};
  return(
    <div className="relative w-full h-44 overflow-hidden border-y-2 b-ink" key={monthKey} style={{background:'linear-gradient(to bottom,#f9e9b8,#f4ecd8)'}}>
      <svg viewBox="0 0 1400 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <circle cx="700" cy="32" r="18" fill="#f5c11e" opacity={slump?.4:.9}/>
        {!slump&&[0,1,2,3,4,5,6,7].map(i=><line key={i} x1="700" y1="32" x2={700+Math.cos(i*Math.PI/4)*34} y2={32+Math.sin(i*Math.PI/4)*34} stroke="#f5c11e" strokeWidth="2" opacity=".5"/>)}
        <line x1="0" y1="150" x2="1400" y2="150" stroke="#7a6f4f" strokeWidth="2"/>
        <rect x="0" y="150" width="1400" height="30" fill="#d8c89b" opacity=".4"/>
        <g className={supplierFail?'factory-dead':''}>
          <rect x="78" y="58" width="14" height="45" fill="#3a3027"/>
          <rect x="74" y="55" width="22" height="6" fill="#2a221b"/>
          <circle cx="85" cy="50" r="7" fill="#cdc3a8" className="smoke"/>
          <circle cx="85" cy="48" r="9" fill="#bdb398" className="smoke2"/>
          <circle cx="85" cy="48" r="6" fill="#cdc3a8" className="smoke3"/>
          <rect x="30" y="90" width="100" height="60" fill="#1e4d3c" className="fb"/>
          <polygon points="30,90 80,68 130,90" fill="#15392c"/>
          <rect x="44" y="106" width="14" height="16" fill="#f9e9b8" stroke="#1c1f2b" strokeWidth="1"/>
          <rect x="72" y="106" width="14" height="16" fill="#f9e9b8" stroke="#1c1f2b" strokeWidth="1"/>
          <rect x="100" y="106" width="14" height="16" fill="#f9e9b8" stroke="#1c1f2b" strokeWidth="1"/>
          <rect x="68" y="128" width="22" height="22" fill="#3a3027"/>
          {supplierFail&&<g className="stamp" transform="translate(80,110)"><rect x="-32" y="-12" width="64" height="24" fill="#b8412b" opacity=".92"/><text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="DM Sans">CLOSED</text></g>}
        </g>
        <line x1="130" y1="150" x2="480" y2="150" stroke="#7a6f4f" strokeDasharray="14,10" strokeWidth="2" opacity=".5"/>
        <g className={`${viral?'scene-viral':''} ${slump?'scene-slump':''}`}>
          {[0,1,2,3].map(i=><g key={i} className="pkg" style={{animationDelay:`${i*-3.5}s`}}><rect x="0" y="138" width="22" height="14" fill={i%2===0?'#d4571a':'#b8412b'} stroke="#2a221b" strokeWidth="1" rx="1"/>{recall&&<text x="11" y="149" fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle">!</text>}</g>)}
        </g>
        <g className={portStrike?'shake':''}>
          <rect x="450" y="80" width="6" height="70" fill="#3a3027"/><rect x="488" y="80" width="6" height="70" fill="#3a3027"/>
          <line x1="472" y1="78" x2="472" y2="48" stroke="#3a3027" strokeWidth="4"/>
          <rect x="448" y="44" width="100" height="8" fill="#3a3027"/>
          <line x1="540" y1="52" x2="540" y2="86" stroke="#3a3027" strokeWidth="2"/>
          <rect x="532" y="86" width="16" height="12" fill="#d4571a" stroke="#2a221b" strokeWidth="1"/>
          <rect x="440" y="148" width="120" height="6" fill="#3a3027"/>
        </g>
        <rect x="560" y="148" width="280" height="14" fill="#6ba0a8"/>
        <g className="wave-anim">{Array.from({length:12}).map((_,i)=><path key={i} d={`M${560+i*40} 152 Q${570+i*40} 148,${580+i*40} 152 T${600+i*40} 152`} fill="none" stroke="#8db8c0" strokeWidth="1.5"/>)}</g>
        <g className={portStrike?'ship-stop shake':''} transform="translate(600,110)">
          <g className={portStrike?'':'ship-bob'}>
            <polygon points="0,30 180,30 168,52 12,52" fill="#b8412b" stroke="#2a221b" strokeWidth="1.5"/>
            <rect x="60" y="6" width="70" height="24" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1"/>
            <rect x="72" y="14" width="9" height="10" fill="#5b6478"/><rect x="89" y="14" width="9" height="10" fill="#5b6478"/>
            <rect x="135" y="-4" width="8" height="14" fill="#3a3027"/>
            <line x1="95" y1="6" x2="95" y2="-12" stroke="#3a3027" strokeWidth="1.5"/>
            <polygon points="95,-12 110,-9 95,-6" fill="#d4571a"/>
            {portStrike&&<g className="stamp" transform="translate(90,25)"><rect x="-36" y="-10" width="72" height="20" fill="#b8412b"/><text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="DM Sans">ANCHORED</text></g>}
          </g>
        </g>
        <line x1="840" y1="150" x2="1180" y2="150" stroke="#7a6f4f" strokeDasharray="14,10" strokeWidth="2" opacity=".5"/>
        {tariff&&<g className="ld"><rect x="900" y="100" width="6" height="50" fill="#b8412b"/><rect x="980" y="100" width="6" height="50" fill="#b8412b"/><rect x="900" y="100" width="86" height="10" fill="#d4571a"/><g className="pulse"><circle cx="943" cy="130" r="14" fill="#f4ecd8" stroke="#b8412b" strokeWidth="2"/><text x="943" y="135" fontSize="16" fontWeight="800" fill="#b8412b" textAnchor="middle" fontFamily="DM Sans">$</text></g></g>}
        <g transform="translate(1000,123)">
          <rect x="22" y="0" width="34" height="22" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1.5"/>
          <rect x="0" y="6" width="26" height="16" fill="#d4571a" stroke="#2a221b" strokeWidth="1.5"/>
          <rect x="4" y="9" width="10" height="8" fill="#9bb8c0"/>
          <circle cx="9" cy="26" r="5" fill="#2a221b"/><circle cx="32" cy="26" r="5" fill="#2a221b"/><circle cx="48" cy="26" r="5" fill="#2a221b"/>
        </g>
        <g transform="translate(1195,78)">
          <rect x="0" y="20" width="120" height="52" fill="#d4571a" stroke="#2a221b" strokeWidth="1.5"/>
          <polygon points="0,20 60,0 120,20" fill="#b8412b" stroke="#2a221b" strokeWidth="1.5"/>
          <rect x="14" y="40" width="22" height="32" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1"/>
          <rect x="84" y="40" width="22" height="32" fill="#f9e9b8" stroke="#2a221b" strokeWidth="1"/>
        </g>
        {viral&&[0,1,2].map(i=><g key={i} className={['hearts','hearts2','hearts3'][i]} transform={`translate(${1240+i*22},120)`}><path d="M 0,4 C-3,-1-8,-1-8,4 C-8,8 0,14 0,14 C 0,14 8,8 8,4 C 8,-1 3,-1 0,4 Z" fill="#d4571a" stroke="#2a221b" strokeWidth="1"/></g>)}
        {slump&&<g className="fi" transform="translate(680,55)"><path d="M 0,0 L 40,30 L 80,15 L 120,45" fill="none" stroke="#b8412b" strokeWidth="3"/><polygon points="115,40 125,48 118,52" fill="#b8412b"/></g>}
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
  if(['supplier-fail','climate','esg-audit'].includes(eventId))shape=<g><rect x="20" y="40" width="60" height="40" fill={c.p} stroke="#1c1f2b" strokeWidth="2"/><polygon points="20,40 50,22 80,40" fill={c.s} stroke="#1c1f2b" strokeWidth="2"/><line x1="15" y1="20" x2="85" y2="90" stroke="#b8412b" strokeWidth="5"/><line x1="85" y1="20" x2="15" y2="90" stroke="#b8412b" strokeWidth="5"/></g>;
  else if(['port-strike','container-shortage'].includes(eventId))shape=<g><polygon points="15,55 85,55 78,72 22,72" fill={c.p} stroke="#1c1f2b" strokeWidth="2"/><rect x="35" y="42" width="30" height="13" fill="#f4ecd8" stroke="#1c1f2b" strokeWidth="1.5"/><line x1="50" y1="80" x2="50" y2="92" stroke="#1c1f2b" strokeWidth="2"/></g>;
  else if(['tariff','currency','trade-war'].includes(eventId))shape=<g><rect x="22" y="40" width="6" height="40" fill={c.p}/><rect x="72" y="40" width="6" height="40" fill={c.p}/><rect x="22" y="40" width="56" height="10" fill={c.s}/><circle cx="50" cy="65" r="10" fill="#f4ecd8" stroke={c.p} strokeWidth="2"/><text x="50" y="70" fontSize="14" fontWeight="800" fill={c.p} textAnchor="middle" fontFamily="DM Sans">$</text></g>;
  else if(['recall','cyberattack','labor-strike'].includes(eventId))shape=<g><polygon points="50,22 80,75 20,75" fill={c.s} stroke="#1c1f2b" strokeWidth="2"/><line x1="50" y1="40" x2="50" y2="58" stroke="#1c1f2b" strokeWidth="3"/><circle cx="50" cy="66" r="2.5" fill="#1c1f2b"/></g>;
  else if(['viral','holiday','growth'].includes(eventId))shape=<g><rect x="32" y="22" width="36" height="60" fill="#1c1f2b" rx="4"/><rect x="35" y="28" width="30" height="44" fill="#f4ecd8"/><circle cx="50" cy="78" r="2" fill="#f4ecd8"/><path d="M 0,4 C-4,-2-10,-2-10,5 C-10,11 0,18 0,18 C 0,18 10,11 10,5 C 10,-2 4,-2 0,4 Z" transform="translate(50,48)" fill={c.p} stroke="#1c1f2b" strokeWidth="1.5"/></g>;
  else if(['recession','competitor','demand-collapse'].includes(eventId))shape=<g><line x1="15" y1="35" x2="85" y2="35" stroke="#1c1f2b" strokeWidth="1" opacity=".3"/><line x1="15" y1="55" x2="85" y2="55" stroke="#1c1f2b" strokeWidth="1" opacity=".3"/><line x1="15" y1="75" x2="85" y2="75" stroke="#1c1f2b" strokeWidth="1" opacity=".3"/><polyline points="15,30 30,42 45,55 60,70 80,82" fill="none" stroke={c.p} strokeWidth="3"/><polygon points="78,76 86,84 78,88" fill={c.p}/></g>;
  else shape=<g><circle cx="50" cy="50" r="20" fill={c.s} stroke="#1c1f2b" strokeWidth="2"/>{[0,1,2,3,4,5,6,7].map(i=><line key={i} x1="50" y1="50" x2={50+Math.cos(i*Math.PI/4)*35} y2={50+Math.sin(i*Math.PI/4)*35} stroke={c.p} strokeWidth="3" opacity=".7"/>)}<circle cx="50" cy="50" r="14" fill={c.p}/></g>;
  return (<div className="w-28 h-28 flex-shrink-0"><svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" fill={c.bg} stroke="#1c1f2b" strokeWidth="2"/>{shape}</svg></div>);
}

function StatTile({label,value,format,tone='neutral',icon}){
  const anim=useAnimatedNumber(value);
  const display=format?format(anim):Math.round(anim).toString();
  const tc={neutral:'t-ink',good:'t-moss',warn:'t-amb',bad:'t-rust'}[tone];
  return (<div className="papw border-2 b-ink px-3 py-2.5"><div className="flex items-center gap-1.5 mb-1">{icon}<div className="fm text-[9px] uppercase tracking-widest t-soft">{label}</div></div><div className={`fd text-2xl font-semibold ${tc} tracking-tight leading-none`}>{display}</div></div>);
}

function SliderInput({slider,value,onChange,disabled}){
  const cost=value*(slider.costPerUnit||0);
  const preview=slider.tariffAlternative?(value===0?'Absorb $20/unit cost for 3 months':`Pre-buy ${value} units at old price — $${cost.toLocaleString()} now`):(value===0?'No air-freight — replenishment delayed 1 month':`Air-freight ${value} units · extra $${cost.toLocaleString()}`);
  return (<div className="papd border-2 b-ink p-5 shadow-sm"><div className="fd text-xl font-semibold mb-1">{slider.label}</div><div className="fm text-[10px] t-soft uppercase tracking-widest mb-4">{slider.note}</div><input type="range" min={slider.min} max={slider.max} step={slider.step} value={value} onChange={e=>onChange(Number(e.target.value))} disabled={disabled}/><div className="flex justify-between fm text-[10px] t-soft mt-1"><span>{slider.min} (do nothing)</span><span>{slider.max} {slider.unit}</span></div><div className={`mt-3 fm text-sm font-medium ${value>0?'t-rust':'t-moss'}`}>{preview}</div></div>);
}

function MonthResultPanel({preview,stratKey,event,allPreviews}){
  const strat=STRATEGIES[stratKey];const pos=preview.net>=0;
  return (<div className="papd border-2 b-ink mt-4 p-5 fi shadow-sm">
    <div className="fm text-[10px] uppercase tracking-widest t-soft mb-4 flex items-center gap-2"><span className="bg-ink text-white px-1.5 py-0.5">Receipt</span><span>This month · {strat.name}</span></div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4 text-sm fm">
      <div className="col-span-2 fm text-[9px] uppercase tracking-widest t-soft mb-1 border-b b-tan pb-1">Supply</div>
      <div className="flex justify-between"><span className="t-soft">Opening inventory</span><span>{preview.openingInventory} units</span></div>
      {preview.replenish>0&&<div className="flex justify-between"><span className="t-soft">Replenishment</span><span className="t-moss">+{preview.replenish} units</span></div>}
      {preview.skipReplenish&&<div className="flex justify-between"><span className="t-soft">Replenishment</span><span className="t-rust">+0 (blocked)</span></div>}
      {preview.extraInventory>0&&<div className="flex justify-between"><span className="t-soft">Emergency stock</span><span className="t-moss">+{preview.extraInventory} units</span></div>}
      {preview.inventoryLossPct>0&&<div className="flex justify-between"><span className="t-soft">Recalled / lost</span><span className="t-rust">−{Math.round(preview.inventoryLossPct*100)}%</span></div>}
      <div className="flex justify-between font-semibold"><span className="t-soft">Available to sell</span><span>{preview.availableInventory} units</span></div>
      <div className="col-span-2 fm text-[9px] uppercase tracking-widest t-soft mb-1 border-b b-tan pb-1 mt-3">Demand</div>
      <div className="flex justify-between"><span className="t-soft">Est. demand (seasonal)</span><span>{preview.demand} units</span></div>
      <div className="flex justify-between"><span className="t-soft">Fulfilled</span><span className="t-moss">{preview.fulfilled} units</span></div>
      {preview.stockout>0?<div className="col-span-2 flex justify-between px-2 py-1 -mx-2" style={{background:'rgba(184,65,43,.1)'}}><span className="t-rust">⚠ Stockout</span><span className="t-rust font-semibold">−{preview.stockout} lost</span></div>:<div className="flex justify-between"><span className="t-soft">Stockout</span><span className="t-moss">None ✓</span></div>}
      <div className="col-span-2 fm text-[9px] uppercase tracking-widest t-soft mb-1 border-b b-tan pb-1 mt-3">Cash</div>
      <div className="flex justify-between"><span className="t-soft">Revenue ({preview.fulfilled} × ${preview.unitPrice})</span><span className="t-moss">+${preview.revenue.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="t-soft">Replenishment cost</span><span className="t-rust">−${preview.replenishCost.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="t-soft">Holding ({preview.endInventory} × ${strat.holdingCost})</span><span className="t-rust">−${preview.holdingCost.toLocaleString()}</span></div>
      {preview.extraCashCost>0&&<div className="flex justify-between"><span className="t-soft">Decision cost</span><span className="t-rust">−${preview.extraCashCost.toLocaleString()}</span></div>}
    </div>
    <div className="flex justify-between items-center pt-3 border-t-2 b-ink fd text-xl font-semibold tracking-tight">
      <span>Net this month</span><span className={pos?'t-moss':'t-rust'}>{pos?'+':''}${preview.net.toLocaleString()}</span>
    </div>
    {preview.dualImmune&&<div className="mt-3 border-l-4 px-3 py-2 fm text-[11px] t-moss" style={{borderColor:'var(--moss)',background:'rgba(30,77,60,.06)'}}>↳ Other strategies lost replenishment here. Your secondary supplier covered it automatically.</div>}
    {preview.stockout>0&&<div className="mt-2 fm text-[11px] t-rust">↳ {stratKey==='lean'?`Lean's thin inventory (${preview.availableInventory} units) couldn't absorb ${preview.demand}-unit demand. Safety Stock starts with 70 units.`:stratKey==='buffered'?'Even Safety Stock could not cover this spike.':'Dual Source inventory was insufficient. Safety Stock would have absorbed this better.'}</div>}
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
            <td className={`text-right font-medium ${p.net>=0?'t-moss':'t-rust'} ${isBest?'font-bold':''}`}>{isBest?'Best ':''}${p.net>=0?'+':''}{p.net.toLocaleString()}</td>
          </tr>);
        })}</tbody>
      </table></div>
    </div>}
  </div>);
}

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

function IndustrySelector({onSelect}){
  const cols={fmcg:'t-rbr',pharma:'t-sky',fashion:'t-amb',auto:'t-moss'};
  return (<div className="min-h-screen paper-bg relative"><div className="grain"/>
    <div className="max-w-6xl mx-auto px-6 py-10 relative">
      <div className="fm text-[11px] uppercase tracking-[.3em] t-rust mb-3">The Disruption Game · Setup</div>
      <h1 className="fd text-7xl font-semibold t-ink leading-none mb-3 tracking-tight">Pick your <span className="fdi">industry</span></h1>
      <p className="t-soft text-lg mb-10 max-w-2xl leading-relaxed">Your sector determines unit value, stockout penalties, and seasonal demand patterns. The same disruption hits pharma very differently than fashion.</p>
      <div className="grid md:grid-cols-2 gap-5">
        {Object.values(INDUSTRIES).map((ind,i)=>(
          <button key={ind.key} onClick={()=>onSelect(ind.key)} className={`text-left papw border-2 b-ink p-6 lift shadow-ink fu fu${(i%3)+1}`}>
            <div className={`fm text-[10px] uppercase tracking-widest mb-2 ${cols[ind.key]}`}>{ind.short}</div>
            <div className="fd text-3xl font-semibold mb-1 tracking-tight">{ind.name}</div>
            <div className="fdi t-rust text-base mb-4">{ind.tagline}</div>
            <p className="t-soft text-sm leading-relaxed mb-5">{ind.description}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-4 border-t b-tan fm text-xs">
              <div className="flex justify-between"><span className="t-soft">Unit price</span><span>${ind.unitPrice}</span></div>
              <div className="flex justify-between"><span className="t-soft">Stockout penalty</span><span>−{ind.stockoutPenalty} rep</span></div>
              <div className="flex justify-between"><span className="t-soft">Demand/month</span><span>{ind.demandBase[0]}–{ind.demandBase[1]} units</span></div>
              <div className="flex justify-between"><span className="t-soft">Peak month</span><span>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][ind.seasonal.indexOf(Math.max(...ind.seasonal))]}</span></div>
            </div>
            <div className="mt-4 flex items-center gap-2 t-rust text-sm font-medium"><span>Select {ind.short}</span><ArrowRight className="w-4 h-4"/></div>
          </button>
        ))}
      </div>
    </div>
  </div>);
}

function StrategySelector({onSelect,industryKey}){
  const ind=INDUSTRIES[industryKey]||INDUSTRIES.fmcg;
  return (<div className="min-h-screen paper-bg relative"><div className="grain"/>
    <div className="max-w-6xl mx-auto px-6 py-10 relative">
      <div className="fm text-[11px] uppercase tracking-[.3em] t-rust mb-3">The Disruption Game · {ind.name}</div>
      <h1 className="fd text-7xl font-semibold t-ink leading-none mb-3 tracking-tight">Lock in your <span className="fdi">strategy</span></h1>
      <p className="t-soft text-lg mb-10 max-w-2xl">You'll run this strategy for all 12 months. No switching. Choose wisely — or don't, and learn from it.</p>
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
            <div className="mt-4 pt-3 border-t b-tan space-y-1.5">
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

function BankruptcyScreen({month,strategy,industry,onReplay}){
  const strat=STRATEGIES[strategy];const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  return (<div className="min-h-screen paper-bg relative flex flex-col items-center justify-center px-6"><div className="grain"/>
    <div className="max-w-2xl w-full relative">
      <div className="bg-rust text-white border-2 b-ink p-10 shadow-ink slam text-center">
        <div className="fm text-[10px] uppercase tracking-[.3em] mb-4" style={{opacity:.8}}>Game Over</div>
        <div className="fd text-7xl font-semibold mb-2 tracking-tight">Bankrupt</div>
        <div className="fdi text-2xl mb-6" style={{opacity:.9}}>Month {month} · {strat.name} · {ind.short}</div>
        <p className="text-base mb-8 leading-relaxed" style={{opacity:.85}}>Cash went below $0 in Month {month}. In real supply chains this means missed payroll, unpaid suppliers, and an emergency board call. {strat.name} ran out of runway — either from expensive emergency responses, excess unsold inventory, or insufficient revenue to cover replenishment.</p>
        <div className="papw t-ink p-5 mb-8 text-left">
          <div className="fm text-[10px] uppercase tracking-widest t-soft mb-3">The lesson</div>
          <p className="text-sm leading-relaxed">{strat.key==='lean'?'Lean strategies run thin on cash buffers. A single expensive emergency response can tip the balance. The lean in your inventory strategy also applies to your financial resilience.':strat.key==='buffered'?'Safety Stock is expensive. When demand drops AND you are paying for excess inventory, the P&L deteriorates quickly. Buffering inventory without a revenue floor is dangerous.':'Dual Source pays a cost premium on every unit. In a disruption-heavy year with cost shocks, the margin squeeze can be fatal. Resilience only works if unit economics remain viable.'}</p>
        </div>
        <button onClick={onReplay} className="papw t-ink border-2 b-ink px-8 py-4 flex items-center gap-3 mx-auto font-medium lift shadow-ink"><RotateCcw className="w-4 h-4"/><span>Try a different strategy</span></button>
      </div>
    </div>
  </div>);
}

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

function MonthScreen({state,strategy,industry,currentEvent,onDecision,onContinue,allStates}){
  const strat=STRATEGIES[strategy];const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  const[decided,setDecided]=useState(false);
  const[chosenIdx,setChosenIdx]=useState(-1);
  const[sliderValue,setSliderValue]=useState(currentEvent.slider?.min||0);
  const[preview,setPreview]=useState(null);
  const[allPreviews,setAllPreviews]=useState(null);
  const[revealKey,setRevealKey]=useState(0);
  const dualImmune=currentEvent.supplierEvent&&strat.supplierRedundancy;

  useEffect(()=>{
    setDecided(false);setChosenIdx(-1);setPreview(null);setAllPreviews(null);
    setSliderValue(currentEvent.slider?.min||0);setRevealKey(k=>k+1);
  },[currentEvent.id,state.month]);

  const computeAll=(dec)=>{
    const p=computeMonthPreview(strategy,industry,state.inventory,currentEvent,dec,state.month);
    setPreview(p);
    const ap={};
    Object.keys(STRATEGIES).forEach(k=>{
      const kInv=allStates&&allStates[k]?allStates[k].inventory:STRATEGIES[k].startInventory;
      ap[k]=computeMonthPreview(k,industry,kInv,currentEvent,k===strategy?dec:null,state.month);
    });
    setAllPreviews(ap);
  };

  const makeDecision=(idx)=>{setChosenIdx(idx);setDecided(true);computeAll(idx);onDecision(idx);};
  const commitSlider=()=>{setDecided(true);computeAll(sliderValue);onDecision(sliderValue);};
  const skipDecision=()=>{setDecided(true);computeAll(-1);onDecision(-1);};

  return (<div className="min-h-screen paper-bg relative">
    <div className="grain"/>
    <div className="bg-ink text-white border-b-2 b-ink px-6 py-2.5 flex items-center justify-between fm text-[11px] uppercase tracking-widest relative">
      <div className="flex items-center gap-3"><span className="t-rbr">●</span><span>Disruption Game</span><span style={{opacity:.4}}>/</span><span style={{opacity:.7}}>{strat.name} · {ind.short}</span></div>
      <div className="flex items-center gap-3"><span>Month</span><span className="t-rbr font-semibold">{String(state.month+1).padStart(2,'0')}</span><span style={{opacity:.5}}>/ 12</span></div>
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
            <div className="fm text-[10px] uppercase tracking-[.2em] t-soft mb-2">Month {state.month+1} Report</div>
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
        <div className="fm text-[10px] uppercase tracking-[.25em] t-soft mb-2 flex items-center gap-2"><span className="bg-ink text-white px-1.5 py-0.5">Decision</span><span>Your Move</span></div>
        {currentEvent.choices.map((c,i)=><button key={i} disabled={decided} onClick={()=>makeDecision(i)}
          className={`choice-card w-full text-left p-5 border-2 fu fu${i+1} ${decided?chosenIdx===i?'bg-rbr text-white b-ink':'papw b-tan opacity-30':'papw b-ink shadow-sm'}`}>
          <div className="flex items-start gap-4">
            <div className={`fd text-3xl font-semibold leading-none w-8 ${decided&&chosenIdx===i?'text-white':'t-rust'}`}>{String.fromCharCode(65+i)}</div>
            <div className="flex-1"><div className={`text-base font-medium mb-1 ${decided&&chosenIdx===i?'text-white':''}`}>{c.label}</div><div className={`fm text-xs ${decided&&chosenIdx===i?'opacity-90':'t-soft'}`}>{c.detail}</div></div>
          </div>
        </button>)}
      </div>}

      {!currentEvent.choices&&!currentEvent.slider&&!dualImmune&&!decided&&<button onClick={skipDecision} className="w-full bg-ink text-white border-2 b-ink px-6 py-4 flex items-center justify-center gap-2 font-medium" style={{boxShadow:'4px 4px 0 0 var(--rust)'}}><span>Execute the month</span><ArrowRight className="w-4 h-4"/></button>}
      {dualImmune&&!decided&&<button onClick={skipDecision} className="w-full bg-moss text-white border-2 b-ink px-6 py-4 flex items-center justify-center gap-2 font-medium" style={{boxShadow:'4px 4px 0 0 var(--ink)'}}><span>Secondary supplier engaged — advance</span><ArrowRight className="w-4 h-4"/></button>}

      {preview&&<MonthResultPanel preview={preview} stratKey={strategy} event={currentEvent} allPreviews={allPreviews}/>}

      {decided&&<button onClick={onContinue} className="w-full mt-5 bg-rbr text-white border-2 b-ink px-6 py-5 flex items-center justify-center gap-3 fd text-xl tracking-tight st" style={{boxShadow:'6px 6px 0 0 var(--ink)'}}>
        <span>{state.month===11?'See year-end results':'Advance to next month'}</span><ArrowRight className="w-5 h-5"/>
      </button>}
    </div>
    <YearTape history={state.history} currentMonth={state.month}/>
  </div>);
}

function LearningObjectives({strategy,playerResult,alternateResults}){
  const strat=STRATEGIES[strategy];
  const all=[{key:strategy,...playerResult},...Object.entries(alternateResults).map(([k,v])=>({key:k,...v}))];
  const winner=all.reduce((b,x)=>x.cash>b.cash?x:b,all[0]);
  const playerWon=winner.key===strategy;
  const supplierEvents=playerResult.history.filter(h=>EVENTS.find(e=>e.id===h.eventId)?.supplierEvent).length;
  const allCash=all.map(x=>x.cash);
  const cashSpread=Math.max(...allCash)-Math.min(...allCash);

  const objs=[
    {n:'01',p:'Strategy locks in your vulnerability before the year starts',e:supplierEvents>=2&&strategy!=='dual'?`You faced ${supplierEvents} supplier disruptions. Dual Source players were immune — they paid a premium upfront so they did not have to scramble mid-year. The decision was made in January, not during the crisis.`:`Your ${strat.name} choice determined which events would hurt you before Month 1 even started.`},
    {n:'02',p:'The same disruptions hit every strategy very differently',e:`Same twelve months. Same disruptions. ${STRATEGIES[all.reduce((b,x)=>x.cash>b.cash?x:b,all[0]).key].name} ended at $${(Math.max(...allCash)/1000).toFixed(1)}K. ${STRATEGIES[all.reduce((b,x)=>x.cash<b.cash?x:b,all[0]).key].name} ended at $${(Math.min(...allCash)/1000).toFixed(1)}K. A $${(cashSpread/1000).toFixed(1)}K gap from identical events.`},
    {n:'03',p:'Resilience has a real price — and so does the absence of it',e:playerResult.stockoutMonths>=3?`${playerResult.stockoutMonths} months of stockouts cost you reputation and sales. Safety Stock or Dual Source would have absorbed those spikes — at a higher holding cost paid every single month, including the calm ones.`:`Every strategy trades cost-now for safety-later. Safety Stock costs you holding fees on calm months. Lean costs you stockouts on volatile ones. No free option — only different timing.`},
    {n:'04',p:'Tactical decisions matter inside any strategy',e:`Even a well-chosen strategy can be undone by costly responses. The receipts showed exactly how each decision flowed through to cash. Choosing when to expedite, ration, or pre-buy is judgment under pressure — separate from strategy selection.`},
    {n:'05',p:'Hindsight is not foresight',e:playerWon?`You won — but you chose before seeing any events. The right question is not "did I pick the right strategy?" It is "was my reasoning sound enough to trust in future years with a different disruption mix?"`:`It is obvious now that ${STRATEGIES[winner.key].name} was the call for this event mix. It was not obvious before Month 1. Real decisions happen under the same uncertainty you just experienced.`},
  ];
  return (<div className="papw border-2 b-ink p-6 md:p-8 mb-8 shadow-ink">
    <div className="fm text-[10px] uppercase tracking-[.25em] t-soft mb-1">Learning Objectives</div>
    <h3 className="fd text-4xl font-semibold mb-2 tracking-tight">What this game teaches</h3>
    <p className="t-soft text-base mb-8 max-w-xl">Five principles — each illustrated by what actually happened in your run.</p>
    <div className="space-y-0">{objs.map((o,i)=><div key={i} className="flex gap-6 py-6 border-b-2 b-tan last:border-0 fu" style={{animationDelay:`${i*.1}s`,opacity:0}}>
      <div className="fd text-6xl font-semibold leading-none flex-shrink-0 w-14 pt-1" style={{color:'var(--paper-dark)',WebkitTextStroke:'1.5px var(--tan)'}}>{o.n}</div>
      <div className="flex-1"><div className="fd text-xl font-semibold mb-2 tracking-tight leading-snug">{o.p}</div><div className="t-soft text-sm leading-relaxed">{o.e}</div></div>
    </div>)}</div>
  </div>);
}

const STRAT_COLORS={lean:'#1e4d3c',buffered:'#c8861a',dual:'#2b5470'};

function generateLesson(strategy,playerResult,alts){
  const all=[{key:strategy,...playerResult},...Object.entries(alts).map(([k,v])=>({key:k,...v}))];
  const winner=all.reduce((b,x)=>x.cash>b.cash?x:b,all[0]);
  const playerWon=winner.key===strategy;
  const strat=STRATEGIES[strategy];
  const wk=STRATEGIES[winner.key];
  const evTypes=playerResult.history.reduce((a,h)=>{a[h.severity]=(a[h.severity]||0)+1;return a;},{});
  const supplierEvents=playerResult.history.filter(h=>EVENTS.find(e=>e.id===h.eventId)?.supplierEvent).length;
  if(playerWon)return{headline:'You picked the right strategy for this event mix.',body:`${strat.name} matched the disruption profile — ${evTypes.crisis||0} crises, ${evTypes.opportunity||0} spikes, ${evTypes.slump||0} slumps. Shuffle the deck and the answer changes. The real lesson is not picking the "best" strategy — it is understanding what each buys you and what it costs.`};
  let body='';
  if(winner.key==='dual'&&supplierEvents>=2)body=`This year had ${supplierEvents} supplier-side disruptions. Dual Source paid its premium and earned it back many times over. Paying for resilience feels expensive — until you need it.`;
  else if(winner.key==='buffered'&&(evTypes.opportunity||0)>=2)body=`Demand swung hard — ${evTypes.opportunity||0} upside spikes. Safety Stock captured them while ${strat.name} ran out of product. Holding inventory is a tax on calm years and insurance on volatile ones.`;
  else if(winner.key==='lean'&&(evTypes.calm||0)>=3)body=`${evTypes.calm} months of calm meant Lean's lower costs compounded into a clear win. ${strat.name} paid for resilience it did not need. Would you have known in advance?`;
  else body=`${wk.name} edged ahead this run. Different event draws reward different strategies. Run it again and watch the leaderboard shift.`;
  return{headline:`${wk.name} won this year. Here is why.`,body};
}

function DebriefScreen({playerResult,alternateResults,strategy,industry,onReplay}){
  const[showLeaderboard,setShowLeaderboard]=useState(false);
  const[saved,setSaved]=useState(false);
  const strat=STRATEGIES[strategy];const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
  const lesson=generateLesson(strategy,playerResult,alternateResults);

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

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {sorted.map((r,i)=>{const s=STRATEGIES[r.key];return (<div key={r.key} className={`p-5 border-2 b-ink fu fu${i+1} ${r.isPlayer?'bg-rbr text-white':'papw'}`} style={{boxShadow:'5px 5px 0 0 var(--ink)'}}>
          <div className="flex items-center justify-between mb-3"><div className={`fm text-[10px] uppercase tracking-widest ${r.isPlayer?'opacity-80':'t-soft'}`}>{i===0?'🥇 Winner':i===1?'Runner-up':'3rd'}</div>{r.isPlayer&&<div className="fm text-[10px] bg-ink text-white px-1.5 py-0.5">You</div>}</div>
          <div className="fd text-3xl font-semibold mb-1 tracking-tight">{s.name}</div>
          <div className="fm text-3xl mb-3 font-medium" style={!r.isPlayer?{color:STRAT_COLORS[r.key]}:{}}>${(r.cash/1000).toFixed(1)}K</div>
          <div className={`fm text-xs space-y-1 ${r.isPlayer?'opacity-90':'t-soft'}`}>
            <div className="flex justify-between"><span>Fill Rate</span><span>{r.fillRate.toFixed(0)}%</span></div>
            <div className="flex justify-between"><span>Reputation</span><span>{r.reputation}</span></div>
            <div className="flex justify-between"><span>Stockout Months</span><span>{r.stockoutMonths}</span></div>
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
          return (<div key={i} className="flex items-center gap-3 py-2 border-b b-tan last:border-0">
            <div className="fm text-xs t-soft w-10">M{String(i+1).padStart(2,'0')}</div>
            <div className={`w-1.5 h-9 ${c[h.severity]}`}/>
            <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{h.event}</div>{h.decision&&<div className="fm text-[10px] t-soft mt-0.5 truncate">↳ {h.decision}</div>}{h.supplierImmune&&<div className="fm text-[10px] t-moss mt-0.5">↳ Dual source absorbed it</div>}</div>
            <div className="fm text-xs text-right hidden md:block"><div>D{h.demand} F{h.fulfilled}</div><div className={h.stockout>0?'t-rust':'t-soft'}>{h.stockout>0?`-${h.stockout}`:'✓'}</div></div>
            <div className="fm text-sm text-right w-20">${(h.cash/1000).toFixed(1)}K</div>
          </div>);
        })}</div>
      </div>

      <LearningObjectives strategy={strategy} playerResult={playerResult} alternateResults={alternateResults}/>

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

function initAllStates(industryKey){
  const ind=INDUSTRIES[industryKey]||INDUSTRIES.fmcg;
  const out={};
  Object.values(STRATEGIES).forEach(s=>{out[s.key]={inventory:s.startInventory,cash:ind.startCash};});
  return out;
}

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

  const selectIndustry=(ind)=>{setIndustry(ind);setPhase('strategy');};

  const startGame=(stratKey)=>{
    const seq=shuffleDeck(seed);
    const ind=INDUSTRIES[industry]||INDUSTRIES.fmcg;
    setStrategy(stratKey);setEventSeq(seq);setDecisions([]);setBankruptMonth(null);
    setState({month:0,cash:ind.startCash,inventory:STRATEGIES[stratKey].startInventory,reputation:100,fillRate:100,history:[]});
    setAllStates(initAllStates(industry));
    setCurrentEvent(seq[0]);setPhase('playing');
  };

  const handleDecision=(dec)=>{const nd=[...decisions];nd[state.month]=dec;setDecisions(nd);};

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

  const replay=()=>{setPhase('industry');setStrategy(null);setIndustry(null);setResults(null);};

  return (<div className="gr">
    <style>{STYLES}</style>
    {phase==='industry'&&<IndustrySelector onSelect={selectIndustry}/>}
    {phase==='strategy'&&<StrategySelector onSelect={startGame} industryKey={industry}/>}
    {phase==='playing'&&state&&currentEvent&&<MonthScreen state={state} strategy={strategy} industry={industry} currentEvent={currentEvent} onDecision={handleDecision} onContinue={handleContinue} allStates={allStates}/>}
    {phase==='bankrupt'&&<BankruptcyScreen month={bankruptMonth} strategy={strategy} industry={industry} onReplay={replay}/>}
    {phase==='end'&&results&&<DebriefScreen playerResult={results.playerResult} alternateResults={results.alts} strategy={strategy} industry={industry} onReplay={replay}/>}
  </div>);
}