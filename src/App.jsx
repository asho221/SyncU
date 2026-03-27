import React, { useState, useEffect } from 'react';
import { 
  Activity, Watch, Brain, Zap, Shield, ChevronRight, 
  Droplets, Moon, Sun, ArrowRight, CheckCircle2, 
  TrendingUp, ActivitySquare, HeartPulse, AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ═══════════════════════════════════════════════════════════
// NUTRITION ENGINE DATA & LOGIC
// ═══════════════════════════════════════════════════════════
const SPORTS = {
  running: { label: "Running", category: "endurance", impact: "high", joints: "medium", sweat: "high" },
  cycling: { label: "Cycling", category: "endurance", impact: "low", joints: "medium", sweat: "high" },
  swimming: { label: "Swimming", category: "endurance", impact: "low", joints: "low", sweat: "medium" },
  triathlon: { label: "Triathlon", category: "endurance", impact: "high", joints: "high", sweat: "very_high" },
  crossfit: { label: "CrossFit", category: "hybrid", impact: "very_high", joints: "high", sweat: "very_high" },
  weightlifting: { label: "Weightlifting", category: "strength", impact: "medium", joints: "high", sweat: "medium" },
  football: { label: "American Football", category: "team", impact: "very_high", joints: "high", sweat: "high" },
  basketball: { label: "Basketball", category: "team", impact: "high", joints: "high", sweat: "high" },
  tennis: { label: "Tennis", category: "racket", impact: "medium", joints: "high", sweat: "high" },
  soccer: { label: "Soccer", category: "team", impact: "high", joints: "medium", sweat: "very_high" },
  boxing: { label: "Boxing", category: "combat", impact: "very_high", joints: "medium", sweat: "very_high" },
  mma: { label: "MMA", category: "combat", impact: "very_high", joints: "very_high", sweat: "very_high" },
  yoga: { label: "Yoga", category: "flexibility", impact: "low", joints: "low", sweat: "low" },
  climbing: { label: "Climbing", category: "strength", impact: "medium", joints: "high", sweat: "medium" },
  rugby: { label: "Rugby", category: "team", impact: "very_high", joints: "very_high", sweat: "very_high" },
  rowing: { label: "Rowing", category: "endurance", impact: "low", joints: "medium", sweat: "high" },
  martial_arts: { label: "Martial Arts", category: "combat", impact: "high", joints: "high", sweat: "high" },
  track_field: { label: "Track & Field", category: "endurance", impact: "very_high", joints: "high", sweat: "high" },
};

const IMPACT = { low: 0.5, medium: 1, high: 1.5, very_high: 2 };
const LEVEL_MULT = { amateur: 0.7, semi_pro: 1.0, professional: 1.3 };

// Updated colors to match the new light theme
const SUPPS = {
  magnesium: { name: "Magnesium Glycinate", unit: "mg", icon: "🌙", color: "#7c3aed", cat: "Mineral", timing: "Evening, 30 min before bed", benefits: ["Muscle recovery", "Sleep quality", "Nerve function", "Reduces cramps"], desc: "Essential mineral for 300+ enzymatic reactions. Glycinate form offers superior bioavailability.", foods: ["Pumpkin seeds", "Dark chocolate", "Spinach", "Almonds"] },
  collagen: { name: "Collagen Peptides", unit: "g", icon: "🦴", color: "#d946ef", cat: "Protein", timing: "Morning or post-workout with Vitamin C", benefits: ["Joint health", "Tendon repair", "Skin elasticity", "Gut lining"], desc: "Type I & III hydrolyzed collagen for connective tissue repair. Critical for athletes with high joint impact.", foods: ["Bone broth", "Sardines", "Egg whites", "Citrus fruits"] },
  vitamin_d3: { name: "Vitamin D3", unit: "IU", icon: "☀️", color: "#f59e0b", cat: "Vitamin", timing: "Morning with a fat-containing meal", benefits: ["Bone density", "Immune function", "Testosterone support", "Mood regulation"], desc: "Fat-soluble vitamin critical for calcium absorption and immune defense. Most athletes are deficient.", foods: ["Fatty fish", "Egg yolks", "Mushrooms", "Fortified foods"] },
  vitamin_c: { name: "Vitamin C", unit: "mg", icon: "🍊", color: "#f97316", cat: "Vitamin", timing: "Split dose: morning & post-workout", benefits: ["Collagen synthesis", "Antioxidant", "Iron absorption", "Immune defense"], desc: "Powerful antioxidant that supports collagen synthesis and protects against exercise-induced oxidative stress.", foods: ["Bell peppers", "Kiwi", "Broccoli", "Strawberries"] },
  zinc: { name: "Zinc Picolinate", unit: "mg", icon: "🛡️", color: "#3b82f6", cat: "Mineral", timing: "With dinner, away from calcium", benefits: ["Immune support", "Hormone production", "Protein synthesis", "Wound healing"], desc: "Picolinate form for optimal absorption. Essential for testosterone and growth hormone production.", foods: ["Oysters", "Beef", "Pumpkin seeds", "Chickpeas"] },
  omega3: { name: "Omega-3 (EPA/DHA)", unit: "mg", icon: "🐟", color: "#06b6d4", cat: "Fatty Acid", timing: "With meals, split across the day", benefits: ["Anti-inflammatory", "Heart health", "Brain function", "Joint mobility"], desc: "High-potency fish oil concentrate. EPA reduces inflammation; DHA supports neural function and reaction time.", foods: ["Salmon", "Mackerel", "Sardines", "Walnuts"] },
  electrolytes: { name: "Electrolyte Complex", unit: "mg", icon: "💧", color: "#14b8a6", cat: "Mineral Complex", timing: "During and after training", benefits: ["Hydration", "Muscle contractions", "Nerve signaling", "Cramp prevention"], desc: "Balanced sodium, potassium, and magnesium formula. Critical for sessions over 60 minutes.", foods: ["Coconut water", "Bananas", "Pickles", "Sea salt"] },
  coq10: { name: "CoQ10 (Ubiquinol)", unit: "mg", icon: "❤️", color: "#f43f5e", cat: "Antioxidant", timing: "Morning with fat-containing meal", benefits: ["Cellular energy", "Heart function", "Exercise capacity", "Anti-aging"], desc: "Ubiquinol form for maximum bioavailability. Supports mitochondrial energy production.", foods: ["Organ meats", "Sardines", "Broccoli", "Cauliflower"] },
  ashwagandha: { name: "Ashwagandha KSM-66", unit: "mg", icon: "🌿", color: "#10b981", cat: "Adaptogen", timing: "Evening with dinner", benefits: ["Stress reduction", "Cortisol control", "Recovery", "Sleep support"], desc: "Clinically studied adaptogen shown to lower cortisol by 28%. Enhances recovery during high-volume blocks.", foods: ["Supplement only"] },
  vitamin_k2: { name: "Vitamin K2 (MK-7)", unit: "mcg", icon: "🦴", color: "#84cc16", cat: "Vitamin", timing: "With Vitamin D3 in the morning", benefits: ["Calcium routing", "Bone strength", "Arterial health", "D3 synergy"], desc: "Directs calcium to bones instead of arteries. Essential companion to Vitamin D3.", foods: ["Natto", "Hard cheeses", "Egg yolks", "Sauerkraut"] },
  creatine: { name: "Creatine Monohydrate", unit: "g", icon: "⚡", color: "#6366f1", cat: "Performance", timing: "Post-workout or with any meal", benefits: ["Power output", "Muscle volume", "Recovery speed", "Cognitive function"], desc: "Most researched sports supplement in existence. 5g daily for strength, power, and cognitive benefits.", foods: ["Red meat", "Fish"] },
  b_complex: { name: "B-Complex (Methylated)", unit: "x daily", icon: "⚙️", color: "#eab308", cat: "Vitamin", timing: "Morning with breakfast", benefits: ["Energy metabolism", "Nervous system", "Red blood cells", "Mental clarity"], desc: "Methylated B vitamins for optimal absorption. Supports energy pathways critical for performance.", foods: ["Whole grains", "Eggs", "Legumes"] },
};

function calcProtocol(p) {
  const sp = SPORTS[p.sport] || SPORTS.running;
  const imp = IMPACT[sp.impact] || 1;
  const swt = IMPACT[sp.sweat] || 1;
  const jnt = IMPACT[sp.joints] || 1;
  const lv = LEVEL_MULT[p.level] || 1;
  const wl = p.trainingHours * p.intensity * lv;
  const isEnd = ["endurance", "hybrid"].includes(sp.category);
  const isStr = ["strength", "hybrid", "combat"].includes(sp.category);
  const isFem = p.gender === "female";
  const over35 = p.age > 35;
  const r = {};

  let mg = p.weight * 5 * (1 + p.trainingHours / 20 * 0.3) * lv;
  if (p.goals.includes("recovery")) mg *= 1.15;
  r.magnesium = { dose: Math.round(mg / 50) * 50, pri: "essential", reason: `Based on ${p.trainingHours}h weekly training in ${sp.label}. Magnesium depletes through sweat — critical for 300+ enzymatic reactions and deep sleep.` };

  let col = 10 + jnt * 3 + imp * 2 + (over35 ? 3 : 0);
  if (p.goals.includes("recovery")) col += 2;
  r.collagen = { dose: Math.round(col * lv), pri: jnt >= 1.5 ? "essential" : "recommended", reason: `Your sport involves ${jnt >= 1.5 ? "significant" : "moderate"} joint stress.${over35 ? ` At ${p.age}, collagen production has declined ~1% per year since 25.` : ""} Peptides support tendon and ligament repair.` };

  let d3 = 2000 + p.trainingHours * 50 + (over35 ? 500 : 0);
  r.vitamin_d3 = { dose: Math.round(d3 * lv / 500) * 500, pri: "essential", reason: "Essential for bone mineralization, immune function, and hormonal balance. Take with a fat source for optimal absorption." };

  let vc = 500 + wl * 5 + imp * 100;
  if (p.stressLevel > 6) vc += 250;
  r.vitamin_c = { dose: Math.min(Math.round(vc / 250) * 250, 2000), pri: "essential", reason: `Weekly load score of ${Math.round(wl)} increases oxidative stress. Also essential for collagen synthesis — pair with your collagen dose.` };

  let zn = (isFem ? 12 : 15) + swt * 3 + p.trainingHours / 10 * 5;
  if (isStr) zn += 5;
  r.zinc = { dose: Math.min(Math.round(zn), 40), pri: swt >= 1.5 ? "essential" : "recommended", reason: `Athletes lose significant zinc through sweat.${swt >= 1.5 ? " Your sport's high sweat rate increases loss." : ""} Critical for testosterone and immune function.` };

  let o3 = 1000 + imp * 500 + p.stressLevel / 10 * 500;
  if (imp >= 1.5) o3 += 500;
  if (p.goals.includes("recovery")) o3 += 500;
  r.omega3 = { dose: Math.round(o3 / 250) * 250, pri: "essential", reason: `Anti-inflammatory support for exercise-induced tissue damage.${imp >= 1.5 ? " High-impact sport creates elevated inflammatory markers." : ""} Aim for 2:1 EPA:DHA ratio.` };

  let el = 500 + swt * 300 + p.trainingHours * 40 + p.intensity * 30;
  r.electrolytes = { dose: Math.round(el / 100) * 100, pri: swt >= 1 ? "essential" : "recommended", reason: `With ${p.trainingHours}h weekly training${swt >= 1.5 ? " and a high-sweat sport" : ""}, electrolyte replacement prevents cramping and maintains performance.` };

  let cq = 100 + (over35 ? 50 : 0) + (isEnd ? 50 : 0);
  r.coq10 = { dose: Math.round(cq / 50) * 50, pri: over35 || isEnd ? "recommended" : "optional", reason: `Supports mitochondrial energy production.${over35 ? " Natural CoQ10 declines with age." : ""}${isEnd ? " Endurance athletes benefit from enhanced cellular energy." : ""}` };

  let ash = 300;
  if (p.stressLevel > 5) ash += 300;
  r.ashwagandha = { dose: Math.min(Math.round(ash / 100) * 100, 600), pri: p.stressLevel > 6 ? "essential" : "recommended", reason: `Stress level ${p.stressLevel}/10 ${p.stressLevel > 6 ? "indicates elevated cortisol impairing recovery" : "suggests cortisol management would help"}. KSM-66 clinically shown to reduce cortisol and improve VO2 max.` };

  r.vitamin_k2 = { dose: Math.round(r.vitamin_d3.dose / 20 / 25) * 25, pri: "essential", reason: "Paired with D3 to ensure proper calcium metabolism and direct calcium to bones." };

  let cr = isStr ? 5 : isEnd ? 3 : 5;
  r.creatine = { dose: cr, pri: isStr ? "essential" : "recommended", reason: `Most researched sports supplement.${isStr ? " Directly supports phosphocreatine for power output." : ""} Also supports cognitive function.` };

  let bc = isEnd ? 1.5 : p.trainingHours > 10 ? 2 : 1;
  r.b_complex = { dose: bc, pri: isEnd || p.trainingHours > 10 ? "recommended" : "optional", reason: `B vitamins are co-factors in energy metabolism.${isEnd ? " Endurance athletes deplete B vitamins faster during prolonged effort." : ""}` };

  return r;
}

function calcReadiness(p) {
  const sl = Math.min((p.sleepHours / 8) * 30, 30) * (p.sleepQuality / 10);
  const st = ((10 - p.stressLevel) / 10) * 25;
  const hr = p.restingHR < 55 ? 25 : p.restingHR < 65 ? 20 : p.restingHR < 75 ? 15 : 10;
  const ld = Math.max(20 - (p.trainingHours * p.intensity / 100) * 20, 5);
  const total = Math.min(Math.round(sl + st + hr + ld), 100);
  if (total >= 80) return { score: total, status: "Peak", color: "#14b8a6" }; // Teal
  if (total >= 65) return { score: total, status: "Good", color: "#f59e0b" }; // Amber
  if (total >= 45) return { score: total, status: "Moderate", color: "#f97316" }; // Orange
  return { score: total, status: "Recovery Needed", color: "#ef4444" }; // Red
}

function calcTraining(p) {
  const sp = SPORTS[p.sport] || SPORTS.running;
  const recScore = Math.round(((p.sleepQuality / 10) * 40 + ((10 - p.stressLevel) / 10) * 30 + 30) * 10) / 10;
  const needsRest = recScore < 60 || p.stressLevel > 7;
  const baseWater = p.weight * 0.033;
  const actWater = (p.trainingHours / 7) * 0.5;
  const insights = [];
  if (p.sleepQuality < 6) insights.push({ type: "warn", title: "Sleep Deficit", text: `Sleep quality ${p.sleepQuality}/10 is limiting recovery. Aim for 7-9h quality sleep. Magnesium before bed may help.` });
  if (p.stressLevel > 7) insights.push({ type: "warn", title: "Elevated Stress", text: "High stress increases cortisol and impairs recovery. Consider breathwork or meditation." });
  if (p.intensity > 7 && p.trainingHours > 10) insights.push({ type: "caution", title: "Overtraining Risk", text: "High intensity + high volume puts you at risk. Monitor resting heart rate." });
  if (recScore >= 75) insights.push({ type: "good", title: "Strong Recovery", text: "Recovery metrics look solid. You can sustain or slightly increase load." });
  return {
    recScore, needsRest, insights,
    hydration: Math.round((baseWater + actWater) * 10) / 10,
    sleepTarget: p.level === "professional" ? "8-10 hours" : "7-9 hours",
    recHours: needsRest ? Math.round(p.trainingHours * 0.8) : p.trainingHours,
    structure: needsRest
      ? { train: 4, rest: 2, active: 1, note: "Reduce volume 15-20%. Recovery markers suggest accumulated fatigue." }
      : p.level === "professional"
      ? { train: 5, rest: 1, active: 1, note: "Maintain volume with periodization. Deload every 4th week." }
      : { train: 4, rest: 2, active: 1, note: "Focus on consistency over intensity. Build aerobic base first." },
  };
}

function buildSchedule(proto) {
  const s = { morning: [], preworkout: [], postworkout: [], evening: [] };
  if (proto.vitamin_d3) s.morning.push({ ...SUPPS.vitamin_d3, dose: `${proto.vitamin_d3.dose} IU` });
  if (proto.vitamin_k2) s.morning.push({ ...SUPPS.vitamin_k2, dose: `${proto.vitamin_k2.dose} mcg` });
  if (proto.b_complex) s.morning.push({ ...SUPPS.b_complex, dose: `${proto.b_complex.dose}x` });
  if (proto.coq10?.pri !== "optional") s.morning.push({ ...SUPPS.coq10, dose: `${proto.coq10.dose} mg` });
  if (proto.vitamin_c) s.preworkout.push({ ...SUPPS.vitamin_c, dose: `${Math.round(proto.vitamin_c.dose / 2)} mg` });
  if (proto.electrolytes) s.preworkout.push({ ...SUPPS.electrolytes, dose: `${proto.electrolytes.dose} mg` });
  if (proto.collagen) s.postworkout.push({ ...SUPPS.collagen, dose: `${proto.collagen.dose} g` });
  if (proto.creatine) s.postworkout.push({ ...SUPPS.creatine, dose: `${proto.creatine.dose} g` });
  if (proto.omega3) s.postworkout.push({ ...SUPPS.omega3, dose: `${proto.omega3.dose} mg` });
  if (proto.magnesium) s.evening.push({ ...SUPPS.magnesium, dose: `${proto.magnesium.dose} mg` });
  if (proto.zinc) s.evening.push({ ...SUPPS.zinc, dose: `${proto.zinc.dose} mg` });
  if (proto.ashwagandha) s.evening.push({ ...SUPPS.ashwagandha, dose: `${proto.ashwagandha.dose} mg` });
  return s;
}

// ═══════════════════════════════════════════════════════════
// LIGHT THEME CONSTANTS FOR ENGINE
// ═══════════════════════════════════════════════════════════
const T = {
  bg: "#f8fafc", bg2: "#ffffff", card: "#ffffff", cardH: "#f1f5f9", elev: "#f1f5f9", input: "#f8fafc",
  text: "#0f172a", text2: "#475569", text3: "#94a3b8",
  primary: "#7c3aed", primaryDim: "rgba(124,58,237,0.1)", // Violet
  secondary: "#14b8a6", secondaryDim: "rgba(20,184,166,0.1)", // Teal
  accent: "#f43f5e", // Rose
  border: "#e2e8f0", borderM: "#cbd5e1",
};

// ═══════════════════════════════════════════════════════════
// SHARED UI FOR ENGINE
// ═══════════════════════════════════════════════════════════
const Badge = ({ text, color = T.primary, small }) => (
  <span style={{ display: "inline-block", padding: small ? "2px 8px" : "4px 12px", borderRadius: 999, fontSize: small ? 10 : 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: `${color}15`, color, border: `1px solid ${color}30` }}>{text}</span>
);

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden", cursor: onClick ? "pointer" : "default", transition: "all 0.2s", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)", ...style }}>{children}</div>
);

const Btn = ({ children, primary, disabled, onClick, style }) => (
  <button disabled={disabled} onClick={onClick} style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 28px",
    borderRadius: 999, border: primary ? "none" : `1px solid ${T.borderM}`, cursor: disabled ? "default" : "pointer",
    fontWeight: 600, fontSize: 15, transition: "all 0.2s", opacity: disabled ? 0.4 : 1,
    background: primary ? `linear-gradient(135deg, ${T.primary}, #6d28d9)` : T.card,
    color: primary ? "#ffffff" : T.text, boxShadow: primary ? `0 10px 15px -3px ${T.primaryDim}` : "0 1px 2px 0 rgb(0 0 0 / 0.05)", ...style,
  }}>{children}</button>
);

const Slider = ({ label, value, onChange, min, max, step = 1, left, right, color = T.primary }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.text3 }}>{label}</span>
        <span style={{ fontWeight: 800, fontSize: 18, color }}>{value}</span>
      </div>
      <div style={{ position: "relative", height: 8, borderRadius: 4, background: T.border }}>
        <div style={{ position: "absolute", top: 0, left: 0, height: 8, borderRadius: 4, width: `${pct}%`, background: color }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: -6, left: 0, width: "100%", height: 20, opacity: 0, cursor: "pointer" }} />
      </div>
      {(left || right) && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, fontWeight: 500, color: T.text3 }}><span>{left}</span><span>{right}</span></div>}
    </div>
  );
};

const ProgressDots = ({ current, total }) => (
  <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: "16px 0" }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? T.primary : i < current ? T.secondary : T.borderM, transition: "all 0.3s" }} />
    ))}
  </div>
);

const Logo = ({ size = 18 }) => (
  <div style={{ display: "flex", itemsCenter: "center", gap: 6 }}>
    <div style={{ width: size, height: size, borderRadius: "20%", background: `linear-gradient(135deg, ${T.primary}, ${T.secondary})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Activity color="white" size={size * 0.6} />
    </div>
    <span style={{ fontWeight: 800, fontSize: size, color: T.text, letterSpacing: "-0.02em" }}>Sync U</span>
  </div>
);

// ═══════════════════════════════════════════════════════════
// DISCLAIMER SCREEN (TRANSITION)
// ═══════════════════════════════════════════════════════════
const Disclaimer = ({ onProceed, onBack }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px", background: T.bg }}>
    <div style={{ maxWidth: 500, background: T.card, padding: 40, borderRadius: 24, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", border: `1px solid ${T.border}` }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <AlertTriangle size={32} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: T.text }}>Beta Testing Sample</h2>
      <p style={{ fontSize: 15, color: T.text2, lineHeight: 1.6, marginBottom: 24 }}>
        A true, highly precise Sync U protocol requires continuous wearable data (HRV, sleep stages, exact cardiovascular strain). 
        <br/><br/>
        This manual assessment is a <strong>sandbox environment</strong> to demonstrate how the Sync U engine adapts dosages based on basic sport and lifestyle inputs.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Btn primary onClick={onProceed} style={{ width: "100%" }}>Proceed to Manual Input</Btn>
        <button onClick={onBack} style={{ fontSize: 14, fontWeight: 600, color: T.text3, padding: 12 }}>Return to Home</button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// ONBOARDING SCREEN
// ═══════════════════════════════════════════════════════════
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [p, setP] = useState({
    name: "", age: 28, gender: "male", weight: 78, height: 178, sport: "running",
    level: "amateur", trainingHours: 8, intensity: 6, sleepHours: 7, sleepQuality: 6,
    stressLevel: 5, restingHR: 65, goals: ["performance"],
  });
  const u = (k, v) => setP(x => ({ ...x, [k]: v }));
  const total = 5;
  const next = () => step < total - 1 ? setStep(step + 1) : onComplete(p);
  const prev = () => step > 0 && setStep(step - 1);

  const ChipGrid = ({ options, value, onChange, multi, cols = 2 }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
      {options.map(o => {
        const active = multi ? value.includes(o.v) : value === o.v;
        return (
          <div key={o.v} onClick={() => multi ? onChange(value.includes(o.v) ? value.filter(x => x !== o.v) : [...value, o.v]) : onChange(o.v)}
            style={{ padding: "14px 16px", borderRadius: 12, border: `2px solid ${active ? T.primary : T.border}`, background: active ? T.primaryDim : T.card, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {o.icon && <span style={{ fontSize: 20 }}>{o.icon}</span>}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: active ? T.primary : T.text }}>{o.label}</div>
                {o.sub && <div style={{ fontSize: 11, fontWeight: 500, color: T.text3, marginTop: 2 }}>{o.sub}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const NumInput = ({ value, onChange, min, max, step: st = 1, unit }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button onClick={() => onChange(Math.max(min, value - st))} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${T.borderM}`, background: T.card, color: T.text, cursor: "pointer", fontSize: 20, fontWeight: 500, boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>−</button>
      <div style={{ flex: 1, textAlign: "center", fontWeight: 800, fontSize: 28, color: T.primary }}>{value}<span style={{ fontSize: 13, fontWeight: 600, color: T.text3, marginLeft: 4 }}>{unit}</span></div>
      <button onClick={() => onChange(Math.min(max, value + st))} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${T.borderM}`, background: T.card, color: T.text, cursor: "pointer", fontSize: 20, fontWeight: 500, boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>+</button>
    </div>
  );

  const Label = ({ children }) => <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.text3, marginBottom: 8 }}>{children}</div>;

  const steps = [
    // 0: Profile
    <div key="s0">
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>Let's get to know you</h2>
      <p style={{ color: T.text2, fontSize: 15, marginBottom: 28 }}>Basic info to calibrate your protocol</p>
      <Label>Your Name</Label>
      <input type="text" placeholder="Enter your name" value={p.name} onChange={e => u("name", e.target.value)}
        style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `2px solid ${T.border}`, background: T.card, color: T.text, fontSize: 16, fontWeight: 500, outline: "none", marginBottom: 24, boxSizing: "border-box", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }} />
      <Label>Gender</Label>
      <ChipGrid options={[{ v: "male", label: "Male", icon: "♂" }, { v: "female", label: "Female", icon: "♀" }]} value={p.gender} onChange={v => u("gender", v)} />
      <div style={{ marginTop: 28 }}><Slider label="Age" value={p.age} onChange={v => u("age", v)} min={16} max={65} left="16" right="65" /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
        <div><Label>Weight</Label><NumInput value={p.weight} onChange={v => u("weight", v)} min={40} max={180} unit="kg" /></div>
        <div><Label>Height</Label><NumInput value={p.height} onChange={v => u("height", v)} min={140} max={220} unit="cm" /></div>
      </div>
    </div>,
    // 1: Sport
    <div key="s1">
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>Your Sport</h2>
      <p style={{ color: T.text2, fontSize: 15, marginBottom: 24 }}>Different sports create different nutritional demands</p>
      <Label>Primary Sport</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, maxHeight: 240, overflowY: "auto", marginBottom: 24, padding: "2px" }}>
        {Object.entries(SPORTS).map(([k, v]) => (
          <div key={k} onClick={() => u("sport", k)} style={{ padding: "12px 14px", borderRadius: 10, border: `2px solid ${p.sport === k ? T.primary : T.border}`, background: p.sport === k ? T.primaryDim : T.card, cursor: "pointer", fontSize: 13, fontWeight: p.sport === k ? 700 : 500, color: p.sport === k ? T.primary : T.text2, transition: "all 0.2s" }}>{v.label}</div>
        ))}
      </div>
      <Label>Competition Level</Label>
      <ChipGrid cols={1} options={[
        { v: "amateur", label: "Amateur", sub: "Recreational / Fitness", icon: "🏃" },
        { v: "semi_pro", label: "Semi-Pro", sub: "Competitive / Club", icon: "🏅" },
        { v: "professional", label: "Professional", sub: "Elite / Paid", icon: "🏆" },
      ]} value={p.level} onChange={v => u("level", v)} />
    </div>,
    // 2: Training
    <div key="s2">
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>Training & Recovery</h2>
      <p style={{ color: T.text2, fontSize: 15, marginBottom: 8 }}>In the future, your wearable syncs this automatically</p>
      <Badge text="Manual Input — Beta" color={T.primary} />
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 24 }}>
        <Slider label="Training Hours / Week" value={p.trainingHours} onChange={v => u("trainingHours", v)} min={2} max={25} left="2h" right="25h" color={T.secondary} />
        <Slider label="Avg Intensity" value={p.intensity} onChange={v => u("intensity", v)} min={1} max={10} left="Light" right="Max" color={T.accent} />
        <div style={{ height: 1, background: T.border }} />
        <Slider label="Resting Heart Rate" value={p.restingHR} onChange={v => u("restingHR", v)} min={40} max={100} left="40 bpm" right="100 bpm" color={T.accent} />
        <Slider label="Sleep Hours" value={p.sleepHours} onChange={v => u("sleepHours", v)} min={4} max={10} step={0.5} left="4h" right="10h" color={T.primary} />
        <Slider label="Sleep Quality" value={p.sleepQuality} onChange={v => u("sleepQuality", v)} min={1} max={10} left="Poor" right="Excellent" color={T.primary} />
      </div>
    </div>,
    // 3: Goals
    <div key="s3">
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>Your Goals</h2>
      <p style={{ color: T.text2, fontSize: 15, marginBottom: 24 }}>Select all that apply — shapes your protocol</p>
      <ChipGrid multi cols={1} options={[
        { v: "performance", label: "Peak Performance", sub: "Maximize output and edge", icon: "⚡" },
        { v: "recovery", label: "Recovery & Longevity", sub: "Faster recovery, injury prevention", icon: "🔄" },
        { v: "endurance", label: "Endurance", sub: "Sustained energy and stamina", icon: "🏔️" },
        { v: "muscle", label: "Muscle & Strength", sub: "Lean mass and power", icon: "💪" },
        { v: "weight", label: "Body Composition", sub: "Optimize body fat %", icon: "⚖️" },
        { v: "mental", label: "Mental Clarity", sub: "Focus, reaction time", icon: "🧠" },
      ]} value={p.goals} onChange={v => u("goals", v)} />
    </div>,
    // 4: Stress + Summary
    <div key="s4">
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.02em" }}>Stress & Lifestyle</h2>
      <p style={{ color: T.text2, fontSize: 15, marginBottom: 24 }}>These significantly impact your nutritional needs</p>
      <Slider label="Overall Stress Level" value={p.stressLevel} onChange={v => u("stressLevel", v)} min={1} max={10} left="Calm" right="Very stressed" color={T.accent} />
      <Card style={{ marginTop: 24, background: T.primaryDim, borderColor: `${T.primary}30`, boxShadow: "none" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Watch className="text-violet-600 mt-1" size={24} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: T.primary, marginBottom: 4 }}>Wearable Integration Coming Soon</div>
            <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.6, margin: 0 }}>In production, Sync U syncs with Garmin, Whoop, Oura Ring, and Apple Health — eliminating manual input entirely.</p>
          </div>
        </div>
      </Card>
      <Card style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, color: T.text }}>Profile Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["Sport", SPORTS[p.sport]?.label], ["Level", p.level.replace("_", " ")],
            ["Training", `${p.trainingHours}h/wk`], ["Intensity", `${p.intensity}/10`],
            ["Sleep", `${p.sleepHours}h · Q${p.sleepQuality}`], ["Stress", `${p.stressLevel}/10`],
          ].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase" }}>{l}</div><div style={{ fontWeight: 700, fontSize: 14, textTransform: "capitalize", color: T.text }}>{v}</div></div>
          ))}
        </div>
      </Card>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, padding: "24px 0 120px", position: "relative" }}>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><Logo /><span style={{ fontSize: 13, fontWeight: 600, color: T.text3 }}>Step {step + 1} of {total}</span></div>
        <ProgressDots current={step} total={total} />
        <div style={{ marginTop: 24 }}>{steps[step]}</div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px 24px 32px", background: `linear-gradient(to top, ${T.bg} 70%, transparent)`, display: "flex", gap: 12, justifyContent: "center", zIndex: 10 }}>
        {step > 0 && <Btn onClick={prev} style={{ flex: 1, maxWidth: 140 }}>← Back</Btn>}
        <Btn primary onClick={next} disabled={step === 0 && !p.name.trim()} style={{ flex: 1, maxWidth: step === 0 ? 320 : 240 }}>
          {step === total - 1 ? "Generate Protocol →" : "Continue →"}
        </Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ANALYZING SCREEN
// ═══════════════════════════════════════════════════════════
const Analyzing = ({ profile, onDone }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    "Analyzing biometric profile...",
    `Mapping ${SPORTS[profile.sport]?.label || "sport"} demands...`,
    "Calculating micronutrient gaps...",
    "Building supplement protocol...",
    "Optimizing timing & dosages...",
    "Generating training insights...",
  ];
  useEffect(() => {
    const iv = setInterval(() => setStage(s => { if (s >= stages.length - 1) { clearInterval(iv); setTimeout(onDone, 600); return s; } return s + 1; }), 750);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: T.primaryDim, border: `2px solid ${T.primary}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, boxShadow: `0 0 60px ${T.primaryDim}` }}>
        <Brain size={40} className="text-violet-600 animate-pulse" />
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 32, color: T.text }}>Building Your Protocol</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320, width: "100%", textAlign: "left" }}>
        {stages.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: i === stage ? 700 : 500, color: i <= stage ? T.text : T.text3, opacity: i <= stage ? 1 : 0.4, transition: "all 0.4s" }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i < stage ? T.secondary : i === stage ? T.primary : T.border, color: "white", fontSize: 12 }}>
              {i < stage ? "✓" : i === stage ? "◉" : ""}
            </span>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
const Dashboard = ({ profile, onReset }) => {
  const [tab, setTab] = useState("protocol");
  const [detail, setDetail] = useState(null);
  const proto = calcProtocol(profile);
  const readiness = calcReadiness(profile);
  const training = calcTraining(profile);
  const schedule = buildSchedule(proto);
  const ess = Object.entries(proto).filter(([_, v]) => v.pri === "essential");
  const rec = Object.entries(proto).filter(([_, v]) => v.pri === "recommended");
  const opt = Object.entries(proto).filter(([_, v]) => v.pri === "optional");
  const weekData = [
    { d: "Mon", readiness: 72, load: 80 }, { d: "Tue", readiness: 68, load: 65 },
    { d: "Wed", readiness: 75, load: 70 }, { d: "Thu", readiness: 65, load: 85 },
    { d: "Fri", readiness: 78, load: 40 }, { d: "Sat", readiness: 82, load: 90 },
    { d: "Sun", readiness: 85, load: 20 },
  ];

  const SuppCard = ({ id, data }) => {
    const s = SUPPS[id];
    if (!s) return null;
    const doseStr = s.unit === "x daily" ? `${data.dose}x` : `${data.dose} ${s.unit}`;
    return (
      <Card onClick={() => setDetail(id)} style={{ cursor: "pointer", border: `1px solid ${s.color}20` }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${s.color}15, transparent)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 24, background: `${s.color}15`, padding: 8, borderRadius: 12 }}>{s.icon}</span>
            <div><div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2, color: T.text }}>{s.name}</div><div style={{ fontSize: 10, fontWeight: 700, color: T.text3, textTransform: "uppercase", marginTop: 2 }}>{s.cat}</div></div>
          </div>
          <Badge text={data.pri} color={data.pri === "essential" ? T.secondary : data.pri === "recommended" ? T.primary : T.text3} small />
        </div>
        <div style={{ fontWeight: 800, fontSize: 28, color: s.color, mb: 4 }}>{doseStr}</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.text2 }}>⏱ {s.timing}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          {s.benefits.slice(0, 3).map(b => <span key={b} style={{ fontSize: 10, fontWeight: 600, padding: "4px 8px", borderRadius: 6, background: T.bg, color: T.text2, border: `1px solid ${T.border}` }}>{b}</span>)}
        </div>
      </Card>
    );
  };

  const DetailOverlay = () => {
    if (!detail) return null;
    const s = SUPPS[detail];
    const d = proto[detail];
    if (!s || !d) return null;
    const doseStr = s.unit === "x daily" ? `${d.dose}x` : `${d.dose} ${s.unit}`;
    return (
      <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto", background: T.bg2, borderRadius: "24px 24px 0 0", padding: "12px 24px 40px", boxShadow: "0 -10px 40px rgba(0,0,0,0.1)" }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: T.borderM, margin: "8px auto 20px" }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{s.icon}</div>
            <div><h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: "0 0 4px" }}>{s.name}</h2><Badge text={d.pri} color={d.pri === "essential" ? T.secondary : T.primary} /></div>
          </div>
          <Card style={{ marginBottom: 16, background: `${s.color}08`, borderColor: `${s.color}25`, boxShadow: "none" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Your Daily Dose</div>
            <div style={{ fontWeight: 800, fontSize: 36, color: s.color }}>{doseStr}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text2, marginTop: 4 }}>⏱ {s.timing}</div>
          </Card>
          <div style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.text3, marginBottom: 8 }}>About</div><p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, margin: 0 }}>{s.desc}</p></div>
          <div style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.text3, marginBottom: 8 }}>Why This Dose</div><p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, margin: 0, padding: 12, background: T.bg, borderRadius: 12, border: `1px solid ${T.border}` }}>{d.reason}</p></div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.text3, marginBottom: 10 }}>Key Benefits</div>
            {s.benefits.map(b => <div key={b} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, fontSize: 14, fontWeight: 500, color: T.text }}><CheckCircle2 size={16} color={s.color} />{b}</div>)}
          </div>
          <div><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.text3, marginBottom: 10 }}>Food Sources</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{s.foods.map(f => <span key={f} style={{ padding: "6px 12px", borderRadius: 8, background: T.bg, fontSize: 13, fontWeight: 500, color: T.text2, border: `1px solid ${T.border}` }}>{f}</span>)}</div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "protocol", label: "Protocol", icon: <Zap size={16}/> },
    { id: "schedule", label: "Schedule", icon: <Watch size={16}/> },
    { id: "training", label: "Training", icon: <Activity size={16}/> },
    { id: "insights", label: "Insights", icon: <TrendingUp size={16}/> },
  ];

  const scheduleBlocks = [
    { key: "morning", label: "Morning Protocol", time: "7:00 AM", icon: <Sun size={20}/>, col: T.primary, items: schedule.morning },
    { key: "preworkout", label: "Pre-Workout", time: "30 min pre", icon: <Zap size={20}/>, col: T.accent, items: schedule.preworkout },
    { key: "postworkout", label: "Post-Workout", time: "Within 30 min", icon: <Activity size={20}/>, col: T.secondary, items: schedule.postworkout },
    { key: "evening", label: "Evening Protocol", time: "8:00 PM", icon: <Moon size={20}/>, col: "#6366f1", items: schedule.evening },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 60, background: T.bg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: `linear-gradient(to bottom, ${T.bg} 85%, transparent)`, padding: "16px 0 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div><Logo size={20} /><div style={{ fontSize: 12, fontWeight: 600, color: T.text3, marginTop: 4 }}>{profile.name} • <span style={{ textTransform: "capitalize" }}>{profile.level.replace("_", " ")}</span> {SPORTS[profile.sport]?.label}</div></div>
            <button onClick={onReset} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, background: T.card, color: T.text2, border: `1px solid ${T.border}`, borderRadius: 999, cursor: "pointer", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>Exit</button>
          </div>
          <div style={{ display: "flex", gap: 4, background: T.border, borderRadius: 12, padding: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 600, background: tab === t.id ? T.card : "transparent", color: tab === t.id ? T.primary : T.text3, boxShadow: tab === t.id ? "0 1px 3px 0 rgb(0 0 0 / 0.1)" : "none", transition: "all 0.2s" }}>
                {t.icon} <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
        {/* PROTOCOL TAB */}
        {tab === "protocol" && (
          <div>
            <Card style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 20, background: `linear-gradient(to right, ${T.card}, ${readiness.color}0A)` }}>
              <div style={{ position: "relative", width: 76, height: 76, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: 76, height: 76 }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={T.border} strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={readiness.color} strokeWidth="3" strokeDasharray={`${readiness.score} ${100 - readiness.score}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: readiness.color }}>{readiness.score}</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: T.text, marginBottom: 2 }}>Readiness: <span style={{ color: readiness.color }}>{readiness.status}</span></div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text2 }}>Sleep {profile.sleepQuality}/10 • Stress {profile.stressLevel}/10 • Training {profile.trainingHours}h/wk</div>
              </div>
            </Card>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Essential Protocol</h3>
              <Badge text={`${ess.length} supps`} color={T.secondary} small />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
              {ess.map(([k, d]) => <SuppCard key={k} id={k} data={d} />)}
            </div>

            {rec.length > 0 && <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><h3 style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Recommended</h3><Badge text={`${rec.length}`} color={T.primary} small /></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
                {rec.map(([k, d]) => <SuppCard key={k} id={k} data={d} />)}
              </div>
            </>}

            {opt.length > 0 && <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><h3 style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Optional</h3></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {opt.map(([k, d]) => <SuppCard key={k} id={k} data={d} />)}
              </div>
            </>}
          </div>
        )}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: T.text }}>Daily Timing Protocol</h3>
            <p style={{ fontSize: 14, color: T.text2, marginBottom: 24 }}>Optimal timing maximizes absorption and minimizes interactions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {scheduleBlocks.map(bl => (
                <Card key={bl.key}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${bl.col}15`, color: bl.col, display: "flex", alignItems: "center", justifyContent: "center" }}>{bl.icon}</div>
                    <div><div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>{bl.label}</div><div style={{ fontSize: 12, fontWeight: 600, color: T.text3 }}>{bl.time}</div></div>
                  </div>
                  {bl.items.map((it, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: i < bl.items.length - 1 ? 8 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{it.icon}</span><span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{it.name}</span></div>
                      <span style={{ fontWeight: 800, fontSize: 14, color: bl.col }}>{it.dose}</span>
                    </div>
                  ))}
                  {bl.items.length === 0 && <div style={{ fontSize: 13, fontWeight: 500, color: T.text3, textAlign: "center", padding: 12, background: T.bg, borderRadius: 12, border: `1px dashed ${T.borderM}` }}>No supplements at this time</div>}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TRAINING TAB */}
        {tab === "training" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <Card><div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", marginBottom: 8 }}>Recovery Score</div><div style={{ fontWeight: 800, fontSize: 36, color: training.recScore >= 70 ? T.secondary : training.recScore >= 50 ? T.primary : T.accent }}>{training.recScore}<span style={{ fontSize: 16, fontWeight: 600 }}>%</span></div></Card>
              <Card><div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", marginBottom: 8 }}>Hydration Target</div><div style={{ fontWeight: 800, fontSize: 36, color: "#3b82f6" }}>{training.hydration}<span style={{ fontSize: 16, fontWeight: 600 }}>L</span></div></Card>
            </div>
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 6 }}>Weekly Structure</div>
              <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.6, marginBottom: 16 }}>{training.structure.note}</p>
              <div style={{ display: "flex", gap: 8 }}>
                {days.map((day, i) => {
                  const isTr = i < training.structure.train;
                  const isAc = i === training.structure.train;
                  return (
                    <div key={day} style={{ flex: 1, textAlign: "center", padding: "12px 4px", borderRadius: 12, background: isTr ? T.secondaryDim : isAc ? T.primaryDim : T.bg, border: `1px solid ${isTr ? `${T.secondary}30` : isAc ? `${T.primary}30` : T.border}` }}>
                      <div style={{ fontSize: 10, color: isTr ? T.secondary : isAc ? T.primary : T.text3, fontWeight: 700, textTransform: "uppercase" }}>{day}</div>
                      <div style={{ fontSize: 20, margin: "6px 0" }}>{isTr ? "🏋️" : isAc ? "🧘" : "😴"}</div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: T.text3 }}>{isTr ? "Train" : isAc ? "Active" : "Rest"}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 12 }}>Training Volume</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, background: T.bg, padding: 16, borderRadius: 12, border: `1px solid ${T.border}` }}>
                <div><div style={{ fontSize: 11, fontWeight: 600, color: T.text3 }}>Current Load</div><div style={{ fontWeight: 800, fontSize: 28, color: T.text }}>{profile.trainingHours}<span style={{ fontSize: 14, fontWeight: 600, color: T.text3 }}>h/wk</span></div></div>
                <ArrowRight className="text-slate-300" />
                <div><div style={{ fontSize: 11, fontWeight: 600, color: T.text3 }}>Recommended</div><div style={{ fontWeight: 800, fontSize: 28, color: T.secondary }}>{training.recHours}<span style={{ fontSize: 14, fontWeight: 600, color: T.secondary }}>h/wk</span></div></div>
              </div>
            </Card>
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><Moon className="text-violet-600"/><span style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Sleep Target</span></div>
              <div style={{ fontWeight: 800, fontSize: 28, color: T.primary, marginBottom: 8 }}>{training.sleepTarget}</div>
              <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, margin: 0 }}>Quality sleep is the #1 recovery tool. Your current {profile.sleepHours}h with quality {profile.sleepQuality}/10 {profile.sleepQuality < 7 ? "has room for improvement." : "is solid."}</p>
            </Card>
            {training.insights.length > 0 && <>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 12, marginTop: 8 }}>Recovery Insights</h3>
              {training.insights.map((ins, i) => (
                <Card key={i} style={{ marginBottom: 12, borderLeft: `4px solid ${ins.type === "warn" ? T.accent : ins.type === "caution" ? "#f59e0b" : T.secondary}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    {ins.type === "good" ? <CheckCircle2 size={18} color={T.secondary}/> : <AlertTriangle size={18} color={ins.type === "warn" ? T.accent : "#f59e0b"}/>}
                    <span style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{ins.title}</span>
                  </div>
                  <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.6, margin: 0, paddingLeft: 26 }}>{ins.text}</p>
                </Card>
              ))}
            </>}
          </div>
        )}

        {/* INSIGHTS TAB */}
        {tab === "insights" && (
          <div>
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 4 }}>Weekly Trends</div>
              <p style={{ fontSize: 12, fontWeight: 500, color: T.text3, marginBottom: 16 }}>Projected readiness vs training load</p>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weekData}>
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.secondary} stopOpacity={0.3} /><stop offset="95%" stopColor={T.secondary} stopOpacity={0} /></linearGradient>
                      <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.primary} stopOpacity={0.3} /><stop offset="95%" stopColor={T.primary} stopOpacity={0} /></linearGradient>
                    </defs>
                    <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: T.text3, fontSize: 11, fontWeight: 600 }} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, fontSize: 12, fontWeight: 600, color: T.text, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Area type="monotone" dataKey="readiness" stroke={T.secondary} strokeWidth={3} fill="url(#rg)" name="Readiness" />
                    <Area type="monotone" dataKey="load" stroke={T.primary} strokeWidth={3} fill="url(#lg)" name="Load" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: T.text2 }}><span style={{ width: 12, height: 4, background: T.secondary, borderRadius: 2 }} />Readiness</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: T.text2 }}><span style={{ width: 12, height: 4, background: T.primary, borderRadius: 2 }} />Load</span>
              </div>
            </Card>
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 16 }}>Protocol Composition</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { l: "Minerals", c: Object.keys(proto).filter(k => ["Mineral", "Mineral Complex"].includes(SUPPS[k]?.cat)).length, col: T.secondary },
                  { l: "Vitamins", c: Object.keys(proto).filter(k => SUPPS[k]?.cat === "Vitamin").length, col: "#f59e0b" },
                  { l: "Performance", c: Object.keys(proto).filter(k => ["Protein", "Performance", "Fatty Acid"].includes(SUPPS[k]?.cat)).length, col: T.primary },
                  { l: "Recovery", c: Object.keys(proto).filter(k => ["Adaptogen", "Antioxidant"].includes(SUPPS[k]?.cat)).length, col: T.accent },
                ].map(x => (
                  <div key={x.l} style={{ padding: 16, background: T.bg, borderRadius: 12, border: `1px solid ${T.border}`, textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 32, color: x.col }}>{x.c}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: "uppercase", marginTop: 4 }}>{x.l}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 16 }}>Athlete Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  ["Age", profile.age, "yrs"], ["Weight", profile.weight, "kg"], ["Height", profile.height, "cm"],
                  ["RHR", profile.restingHR, "bpm"], ["Load", Math.round(profile.trainingHours * profile.intensity), "AU"],
                  ["BMI", Math.round(profile.weight / Math.pow(profile.height / 100, 2) * 10) / 10, ""],
                ].map(([l, v, u]) => (
                  <div key={l} style={{ textAlign: "center", background: T.bg, padding: "12px 8px", borderRadius: 12, border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.text3, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: T.text }}>{v}<span style={{ fontSize: 11, fontWeight: 600, color: T.text3, marginLeft: 2 }}>{u}</span></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <DetailOverlay />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// LANDING PAGE SCREEN
// ═══════════════════════════════════════════════════════════
const LandingPage = ({ onStart }) => {
  const [activeTab, setActiveTab] = useState('morning');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* NAVIGATION */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-teal-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Sync U</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-violet-600 transition-colors">How it Works</a>
            <a href="#science" className="hover:text-violet-600 transition-colors">The Science</a>
            <a href="#features" className="hover:text-violet-600 transition-colors">Integrations</a>
          </div>
          <button onClick={onStart} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-xl">
            Get Your Protocol
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-br from-teal-100/40 via-violet-50/30 to-fuchsia-50/40 blur-3xl rounded-full -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Wearable Beta Now Live
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Don't guess your supplements. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500">Sync them.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Sync U connects to your wearable to analyze your daily strain, sport impact, and sleep. We generate a dynamic, hyper-personalized nutrition protocol that tells you exactly what to take, and when to take it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onStart} className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/40 hover:-translate-y-0.5">
                Start Free Assessment <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-violet-500 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-white border border-slate-200/60 rounded-3xl shadow-2xl p-6 lg:p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Your Daily Protocol</h3>
                  <p className="text-sm text-slate-500 font-medium">High Impact (Running) • 90m Load</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Readiness</span>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold border border-emerald-100 flex items-center gap-1">
                    <ActivitySquare className="w-4 h-4" /> 88 Peak
                  </div>
                </div>
              </div>
              <div className="h-32 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ day: "Mon", readiness: 72 }, { day: "Tue", readiness: 68 }, { day: "Wed", readiness: 85 }, { day: "Thu", readiness: 92 }, { day: "Fri", readiness: 78 }, { day: "Sat", readiness: 88 }, { day: "Sun", readiness: 65 }]}>
                    <defs>
                      <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="readiness" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorReadiness)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center"><Sun className="w-5 h-5" /></div>
                    <div><h4 className="font-bold text-slate-900">Vitamin D3 + K2</h4><p className="text-xs text-slate-500 font-medium">Bone density & recovery</p></div>
                  </div>
                  <div className="text-right"><div className="font-bold text-slate-900">4,000 IU</div><div className="text-xs text-violet-600 font-bold bg-violet-50 px-2 py-0.5 rounded-md inline-block mt-1">+1000 IU (Low Sun)</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Static multivitamin? <br/>That's amateur hour.</h2>
            <p className="text-lg text-slate-600">Your body's needs change daily based on your sport, intensity, and recovery. Sync U calculates the exact dosages and timing required to bridge the gap.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Activity className="w-6 h-6 text-violet-600" />, title: "1. Ingest Biometrics", desc: "Connect your wearable or input your training manually. We analyze your sleep quality, resting HR, and daily strain." },
              { icon: <Brain className="w-6 h-6 text-teal-500" />, title: "2. Engine Calculation", desc: "Our algorithm cross-references your specific sport's impact (joints, sweat, endurance) with today's specific workload." },
              { icon: <Zap className="w-6 h-6 text-fuchsia-500" />, title: "3. Dynamic Protocol", desc: "Get an adjusted daily schedule. Did you run a 20k in the heat? We up your Magnesium and Electrolytes tonight." }
            ].map((step, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm">{step.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg border border-violet-200">
            <TrendingUp size={36} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Stop guessing. Start adapting.</h2>
          <button onClick={onStart} className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-5 rounded-full text-lg font-bold flex items-center justify-center gap-2 mx-auto transition-all shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-1">
            Build My Protocol <ChevronRight className="w-5 h-5" />
          </button>
          <p className="mt-6 text-sm text-slate-400 font-medium">100% Free Analysis • Backed by Sports Science</p>
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// APP ROOT STATE MANAGER
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("landing");
  const [profile, setProfile] = useState(null);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", WebkitFontSmoothing: "antialiased" }}>
      {view === "landing" && <LandingPage onStart={() => setView("disclaimer")} />}
      {view === "disclaimer" && <Disclaimer onProceed={() => setView("onboard")} onBack={() => setView("landing")} />}
      {view === "onboard" && <Onboarding onComplete={p => { setProfile(p); setView("analyze"); }} />}
      {view === "analyze" && profile && <Analyzing profile={profile} onDone={() => setView("dash")} />}
      {view === "dash" && profile && <Dashboard profile={profile} onReset={() => { setProfile(null); setView("landing"); }} />}
    </div>
  );
}
