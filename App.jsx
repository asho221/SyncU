import React, { useState } from 'react';
import { 
  Activity, Watch, Brain, Zap, Shield, ChevronRight, 
  Droplets, Moon, Sun, ArrowRight, CheckCircle2, 
  TrendingUp, ActivitySquare, HeartPulse
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// --- MOCK DATA FOR VISUALS ---
const chartData = [
  { day: "Mon", readiness: 72, load: 80 }, { day: "Tue", readiness: 68, load: 65 },
  { day: "Wed", readiness: 85, load: 40 }, { day: "Thu", readiness: 92, load: 90 },
  { day: "Fri", readiness: 78, load: 50 }, { day: "Sat", readiness: 88, load: 95 },
  { day: "Sun", readiness: 65, load: 20 },
];

export default function App() {
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
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-xl">
            Get Your Protocol
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-br from-teal-100/40 via-violet-50/30 to-fuchsia-50/40 blur-3xl rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Copy */}
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
              <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/40 hover:-translate-y-0.5">
                Start Free Assessment <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold flex items-center justify-center transition-all shadow-sm">
                View Sample Protocol
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ athletes</p>
            </div>
          </div>

          {/* Hero UI Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-violet-500 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-white border border-slate-200/60 rounded-3xl shadow-2xl p-6 lg:p-8">
              {/* Mockup Header */}
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

              {/* Chart Mockup */}
              <div className="h-32 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
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

              {/* Supps Mockup */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-violet-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center"><Sun className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-slate-900">Vitamin D3 + K2</h4>
                      <p className="text-xs text-slate-500 font-medium">Bone density & recovery</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">4,000 IU</div>
                    <div className="text-xs text-violet-600 font-bold bg-violet-50 px-2 py-0.5 rounded-md inline-block mt-1">+1000 IU (Low Sun)</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-violet-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center"><Droplets className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold text-slate-900">Electrolyte Complex</h4>
                      <p className="text-xs text-slate-500 font-medium">During 90m session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">800 mg</div>
                    <div className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md inline-block mt-1">High Sweat Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS LOGOS */}
      <section className="py-10 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase mb-8">Works seamlessly with your data sources</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-60 grayscale">
            <div className="text-2xl font-black tracking-tighter flex items-center gap-2"><Watch className="w-8 h-8"/> GARMIN</div>
            <div className="text-2xl font-black tracking-widest">WHOOP</div>
            <div className="text-2xl font-black tracking-tight flex items-center gap-1"><span className="w-6 h-6 border-4 border-current rounded-full"></span> OURA</div>
            <div className="text-xl font-bold flex items-center gap-2"><HeartPulse className="w-6 h-6"/> Apple Health</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Static multivitamin? <br/>That's amateur hour.</h2>
            <p className="text-lg text-slate-600">Your body's needs change daily based on your sport, intensity, and recovery. Sync U calculates the exact dosages and timing required to bridge the gap.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-6 h-6 text-violet-600" />,
                title: "1. Ingest Biometrics",
                desc: "Connect your wearable or input your training manually. We analyze your sleep quality, resting HR, and daily strain."
              },
              {
                icon: <Brain className="w-6 h-6 text-teal-500" />,
                title: "2. Engine Calculation",
                desc: "Our algorithm cross-references your specific sport's impact (joints, sweat, endurance) with today's specific workload."
              },
              {
                icon: <Zap className="w-6 h-6 text-fuchsia-500" />,
                title: "3. Dynamic Protocol",
                desc: "Get an adjusted daily schedule. Did you run a 20k in the heat? We up your Magnesium and Electrolytes tonight."
              }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEEP DIVE: TIMING & DOSAGES */}
      <section id="features" className="py-24 px-6 bg-slate-900 text-white rounded-[3rem] mx-4 my-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Precision is everything.</h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Taking zinc and calcium together? They compete for absorption. Taking vitamin D at night? It suppresses melatonin. Sync U doesn't just tell you what to take, it builds a perfect schedule to maximize bioavailability.
            </p>

            <div className="space-y-6">
              {[
                { title: "Sport-Specific Baseline", desc: "A CrossFit athlete needs drastically different connective tissue support (Collagen/Vitamin C) than a cyclist." },
                { title: "Load-Adjusted Dosages", desc: "We scale your Vitamin C and Omega-3 based on the oxidative stress and inflammation markers of your weekly volume." },
                { title: "Circadian Optimization", desc: "Energy co-factors in the morning. Cortisol lowering and central nervous system relaxants before bed." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0"><CheckCircle2 className="w-6 h-6 text-teal-400" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Timing Preview */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-2 shadow-2xl">
            <div className="flex p-1 bg-slate-900 rounded-2xl mb-4">
              {['morning', 'post-workout', 'evening'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 text-sm font-bold capitalize py-3 rounded-xl transition-all ${activeTab === t ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-3 min-h-[300px]">
              {activeTab === 'morning' && (
                <>
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center"><Sun size={18} /></div>
                      <div><div className="font-bold">Vitamin D3</div><div className="text-xs text-slate-400">With fat-containing meal</div></div>
                    </div>
                    <div className="font-mono font-bold text-teal-300">5000 IU</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center"><Zap size={18} /></div>
                      <div><div className="font-bold">B-Complex</div><div className="text-xs text-slate-400">Energy metabolism</div></div>
                    </div>
                    <div className="font-mono font-bold text-teal-300">1x Dose</div>
                  </div>
                </>
              )}
              {activeTab === 'post-workout' && (
                <>
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center"><Activity size={18} /></div>
                      <div><div className="font-bold">Collagen Peptides</div><div className="text-xs text-slate-400">Joint & Tendon repair</div></div>
                    </div>
                    <div className="font-mono font-bold text-teal-300">15 g</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center"><Droplets size={18} /></div>
                      <div><div className="font-bold">Omega-3 (EPA/DHA)</div><div className="text-xs text-slate-400">Anti-inflammatory</div></div>
                    </div>
                    <div className="font-mono font-bold text-teal-300">2000 mg</div>
                  </div>
                </>
              )}
              {activeTab === 'evening' && (
                <>
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center"><Moon size={18} /></div>
                      <div><div className="font-bold">Magnesium Glycinate</div><div className="text-xs text-slate-400">30 min before bed</div></div>
                    </div>
                    <div className="font-mono font-bold text-teal-300">450 mg</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center"><Shield size={18} /></div>
                      <div><div className="font-bold">Ashwagandha KSM-66</div><div className="text-xs text-slate-400">Cortisol control</div></div>
                    </div>
                    <div className="font-mono font-bold text-teal-300">300 mg</div>
                  </div>
                </>
              )}
            </div>
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
          <p className="text-lg text-slate-600 mb-10">
            Take the 2-minute assessment to generate your baseline protocol. No account required.
          </p>
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-5 rounded-full text-lg font-bold flex items-center justify-center gap-2 mx-auto transition-all shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-1">
            Build My Protocol <ChevronRight className="w-5 h-5" />
          </button>
          <p className="mt-6 text-sm text-slate-400 font-medium">100% Free Analysis • Backed by Sports Science</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
              <Activity className="text-white w-3 h-3" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Sync U</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-violet-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-violet-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-violet-600 transition-colors">Science Methodology</a>
            <a href="#" className="hover:text-violet-600 transition-colors">Contact</a>
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} Sync U. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
