import { useState } from 'react';
import { 
  Compass, TrendingUp, DollarSign, AppWindow, Cpu, Database, TableProperties, 
  Webhook, Globe, Palette, Smartphone, HeartHandshake, Megaphone, ShieldAlert, 
  Workflow, FileCheck, Gem, CalendarRange, PlaneTakeoff, CheckSquare, Sparkles, 
  ArrowUpRight, Landmark, ExternalLink, RefreshCw, Layers, ShieldCheck, ChevronRight, FileText,
  Sun, Moon, Languages
} from 'lucide-react';

import { StartupPhase } from './types';
import { COMPLETED_PHASES, BLUEPRINT_DETAILS } from './data/blueprintData';
import AgentControlCenter from './components/AgentControlCenter';
import EnterpriseModal from './components/EnterpriseModal';
import { languages, translations } from './utils/translations';

export default function App() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('p1');
  const [activeTab, setActiveTab] = useState<'blueprint' | 'simulator'>('blueprint');
  const [useMode, setUseMode] = useState<'free' | 'premium'>('free');
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [language, setLanguage] = useState<string>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const t = translations[language] || translations['en'];
  const isLight = theme === 'light';

  const selectedPhase = COMPLETED_PHASES.find(p => p.id === selectedPhaseId) || COMPLETED_PHASES[0];
  const phaseDetail = BLUEPRINT_DETAILS[selectedPhase.id] || BLUEPRINT_DETAILS['p1'];

  // Map icon names dynamically to React component elements
  const getIcon = (name: string, className = 'w-4 h-4') => {
    switch (name) {
      case 'Compass': return <Compass className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'DollarSign': return <DollarSign className={className} />;
      case 'AppWindow': return <AppWindow className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Database': return <Database className={className} />;
      case 'TableProperties': return <TableProperties className={className} />;
      case 'Webhook': return <Webhook className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'Megaphone': return <Megaphone className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Workflow': return <Workflow className={className} />;
      case 'FileCheck': return <FileCheck className={className} />;
      case 'Gem': return <Gem className={className} />;
      case 'CalendarRange': return <CalendarRange className={className} />;
      case 'PlaneTakeoff': return <PlaneTakeoff className={className} />;
      case 'CheckSquare': return <CheckSquare className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans flex flex-col antialiased ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#050505] text-[#e2e8f0]'}`}>
      {/* Top Main Navigation */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-200 px-4 py-2.5 lg:px-8 flex items-center justify-between ${isLight ? 'bg-white/95 border-slate-200 shadow-sm text-slate-800' : 'bg-[#0c0c0e]/95 border-[#1e293b]'}`} id="header-bar">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/20">
            <Cpu className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="text-base font-bold font-sans tracking-tight flex items-center gap-1.5">
              <span className={isLight ? 'text-slate-900' : 'text-white'}>{t.osTitle}</span> <span className="text-[9px] bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider font-bold">INDIA DECACORN</span>
            </div>
            <div className={`text-[10px] font-mono tracking-wide ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t.osSub}</div>
          </div>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className={`flex rounded-lg p-0.5 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/2 border-[#1e293b]'}`} id="main-navigation-tabs">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-gray-400 hover:text-gray-200'}`}`}
          >
            <Layers className="w-3.5 h-3.5 text-[#f97316]" /> {t.strategicPlaybook}
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-2 ${activeTab === 'simulator' ? 'bg-[#1e1b16] text-[#f97316] border border-[#f97316]/30' : `${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-gray-400 hover:text-gray-200'}`}`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#f97316] animate-pulse" /> {t.liveSimulator}
          </button>
        </div>

        {/* Global Selectors & Buttons */}
        <div className="flex items-center gap-3">
          {/* Language Selection */}
          <div className={`flex items-center gap-1.5 border rounded-md px-2 py-1 text-xs ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-gray-800'}`}>
            <Languages className="w-3.5 h-3.5 text-[#f97316]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`bg-transparent text-xs font-mono font-bold focus:outline-none cursor-pointer ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className={isLight ? 'bg-white text-slate-800' : 'bg-zinc-950 text-slate-100'}>
                  {lang.native}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-1.5 rounded-md border transition ${isLight ? 'bg-slate-100 border-slate-200 text-[#ea580c] hover:bg-slate-200' : 'bg-black/40 border-gray-800 text-[#f97316] hover:bg-zinc-900'}`}
            title="Toggle Theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="hidden xl:flex items-center gap-3">
            <div className="text-[10px] text-right font-mono leading-tight">
              <div className={isLight ? 'text-slate-500' : 'text-gray-400'}>INVESTOR DECK APPROVED</div>
              <div className="text-[#f97316] flex items-center justify-end gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse shadow-md shadow-[#f97316]/50"></span> {t.seedFunded}
              </div>
            </div>
            <button
              onClick={() => setShowEnterpriseModal(true)}
              className="px-3.5 py-1.5 bg-[#f97316]/10 border border-[#f97316]/30 hover:bg-[#f97316]/20 text-[#f97316] rounded-md text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-md shadow-[#f97316]/5"
            >
              <Webhook className="w-3.5 h-3.5" /> {t.erpConnect}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      {activeTab === 'blueprint' ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" id="playbook-layout">
          {/* Sidebar - 20 Phases Selection */}
          <aside className={`w-full lg:w-80 border-r overflow-y-auto p-4 flex flex-col transition-all duration-200 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0c0c0e] border-[#1e293b]'}`} id="phase-sidebar">
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#f97316] uppercase tracking-wider">{t.operatingManual}</span>
                <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse">
                  {t.freeUseOnly}
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>20 comprehensive phases mapped directly to industrial value targets.</p>
              
              {/* Access Mode Selector */}
              <div className={`p-1 rounded-lg border flex text-[10px] font-mono ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-[#1e293b]'}`}>
                <button
                  onClick={() => setUseMode('free')}
                  className={`flex-1 py-1 text-center rounded transition font-bold ${useMode === 'free' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {t.freeUse}
                </button>
                <button
                  onClick={() => setUseMode('premium')}
                  className={`flex-1 py-1 text-center rounded transition font-bold ${useMode === 'premium' ? 'bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {t.premium}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 flex-1" id="phases-list">
              {COMPLETED_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all border flex items-start gap-3 group relative ${
                    selectedPhaseId === phase.id 
                      ? (isLight ? 'bg-amber-50 border-[#f97316]/40 border-l-2 border-l-[#f97316] text-[#ea580c] shadow-sm' : 'bg-[#1e1b16] border-[#f97316]/30 border-l-2 border-l-[#f97316] text-[#f97316] shadow-sm')
                      : `border-transparent ${isLight ? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900' : 'hover:bg-white/2 text-gray-400 hover:text-gray-200'}`
                  }`}
                >
                  <div className={`p-1.5 rounded-md mt-0.5 ${
                    selectedPhaseId === phase.id ? 'bg-[#f97316]/10 text-[#f97316]' : `${isLight ? 'bg-slate-200 text-slate-500' : 'bg-gray-800/40 text-gray-500'} group-hover:text-gray-300`
                  }`}>
                    {getIcon(phase.iconName, 'w-4 h-4')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold font-sans tracking-tight truncate flex items-center justify-between gap-1.5 ${selectedPhaseId === phase.id ? 'text-[#f97316]' : `${isLight ? 'text-slate-800 group-hover:text-slate-950' : 'text-gray-300 group-hover:text-white'}`}`}>
                      <span className="truncate">{phase.title}</span>
                      {useMode === 'free' ? (
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-500 px-1 py-0.2 rounded border border-emerald-500/20 font-semibold shrink-0">
                          FREE
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono bg-[#f97316]/10 text-[#f97316] px-1 py-0.2 rounded border border-[#f97316]/20 font-semibold shrink-0">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] line-clamp-1 mt-0.5 font-normal ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      {phase.shortDesc}
                    </div>
                  </div>
                  {selectedPhaseId === phase.id && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#f97316] shadow shadow-[#f97316]"></span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Core Phase Document Reader */}
          <main className={`flex-1 overflow-y-auto p-6 lg:p-10 immersive-grid-dots transition-all duration-200 ${isLight ? 'bg-slate-100' : 'bg-gradient-to-b from-[#111111] to-[#050505]'}`} id="document-reader">
            <div className="max-w-4xl mx-auto space-y-8" id="document-content">
              {/* Document Header Banner */}
              <div className={`border-b pb-6 ${isLight ? 'border-slate-200' : 'border-[#1e293b]'}`}>
                <div className="flex items-center gap-2 text-xs font-mono text-[#f97316] mb-2 flex-wrap">
                  <span>{selectedPhase.category.toUpperCase()} SEGMENT</span>
                  <span>•</span>
                  <span>{t.confidentialBlueprint}</span>
                  <span>•</span>
                  {useMode === 'free' ? (
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[9px] border border-emerald-500/20 uppercase tracking-wide">
                      {t.freeUse} ACCESS
                    </span>
                  ) : (
                    <span className="text-[#f97316] font-bold bg-[#f97316]/10 px-1.5 py-0.5 rounded text-[9px] border border-[#f97316]/20 uppercase tracking-wide animate-pulse">
                      {t.premiumUnlocked}
                    </span>
                  )}
                </div>
                <h1 className={`text-3xl font-sans font-bold tracking-tight flex items-center gap-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedPhase.title}
                </h1>
                <p className={`text-base mt-3 font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  {phaseDetail.visionWhy}
                </p>
              </div>

              {/* Main Analysis Body */}
              <div className={`prose prose-invert max-w-none font-sans space-y-6 leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                {/* Custom Markdown Parser Representation */}
                <div className={`p-6 rounded-xl border space-y-6 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/2 border-[#1e293b]'}`}>
                  {phaseDetail.deepAnalysis.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={idx} className={`text-lg font-sans font-bold mt-4 border-l-2 border-[#f97316] pl-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('#### ')) {
                      return <h4 key={idx} className="text-sm font-mono font-bold text-[#f97316] uppercase mt-3">{paragraph.replace('#### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('* **')) {
                      return (
                        <div key={idx} className={`pl-4 border-l py-1 my-2 ${isLight ? 'border-slate-300' : 'border-[#374151]/60'}`}>
                          <p className={`text-xs font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{paragraph}</p>
                        </div>
                      );
                    }
                    if (paragraph.startsWith('|')) {
                      // Parse table row representation
                      const rows = paragraph.split('\n').filter(r => r.trim());
                      return (
                        <div key={idx} className={`overflow-x-auto rounded-lg border my-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-gray-800 bg-black/30'}`}>
                          <table className="w-full text-xs font-mono text-left">
                            <tbody>
                              {rows.map((row, rIdx) => {
                                const cols = row.split('|').filter(c => c.trim());
                                if (row.includes('---')) return null;
                                return (
                                  <tr key={rIdx} className={rIdx === 0 ? `${isLight ? 'bg-slate-200/80 text-[#ea580c]' : 'bg-zinc-950 text-[#f97316]'} border-b border-gray-800 font-bold` : `border-b ${isLight ? 'border-slate-100 text-slate-700' : 'border-gray-800/40 text-gray-300'}`}>
                                    {cols.map((col, cIdx) => (
                                      <td key={cIdx} className="p-2.5 font-sans">{col.trim()}</td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    return <p key={idx} className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>{paragraph}</p>;
                  })}
                </div>
              </div>

              {/* Risks & Mitigation Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="risks-bestpractices-grid">
                <div className={`border p-5 rounded-xl space-y-3 ${isLight ? 'bg-rose-50 border-rose-100' : 'bg-rose-950/10 border-rose-500/20'}`}>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-rose-500 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-500" /> {t.keyRisks}
                  </h4>
                  <ul className={`space-y-2.5 text-xs ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    {phaseDetail.risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-rose-500 font-bold font-mono mt-0.5">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`border p-5 rounded-xl space-y-3 ${isLight ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-950/10 border-emerald-500/20'}`}>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-emerald-600 uppercase flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" /> {t.bestPractices}
                  </h4>
                  <ul className={`space-y-2.5 text-xs ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    {phaseDetail.bestPractices.map((bp, index) => (
                      <li key={index} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-500 font-bold font-mono mt-0.5">✔</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alternatives & Mistakes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="alt-mistakes-grid">
                <div className={`border p-5 rounded-xl space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/2 border-gray-800/60'}`}>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-[#f97316] uppercase">{t.strategicAlts}</h4>
                  <ul className={`space-y-2.5 text-xs ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    {phaseDetail.alternatives.map((alt, index) => (
                      <li key={index} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#f97316] font-bold font-mono mt-0.5">⌥</span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`border p-5 rounded-xl space-y-3 ${isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-950/10 border-amber-500/20'}`}>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-amber-600 uppercase">{t.industryMistakes}</h4>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    {phaseDetail.commonMistakes[0] || 'Underestimating traditional broker operational lock-in and trying to bypass regional transport unions without establishing mutually beneficial digital payouts.'}
                  </p>
                </div>
              </div>

              {/* Success Metrics & Key Targets */}
              <div className={`border p-5 rounded-xl space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/2 border-[#1e293b]'}`} id="success-metrics-panel">
                <h4 className={`text-xs font-mono font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{t.successMetrics}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {phaseDetail.successMetrics.map((metric, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/40 border-gray-800/80'}`}>
                      <div className={`text-[10px] font-mono mb-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{metric.name}</div>
                      <div className="text-base font-sans font-bold text-emerald-500">{metric.target}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps Footer Actions */}
              <div className={`border p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isLight ? 'bg-orange-50/80 border-orange-200 text-slate-800 shadow-sm' : 'bg-gradient-to-r from-[#f97316]/5 to-[#ea580c]/5 border-gray-800'}`} id="next-steps-footer">
                <div>
                  <h4 className={`text-xs font-mono font-bold tracking-wider uppercase mb-1 ${isLight ? 'text-[#ea580c]' : 'text-white'}`}>{t.immediateStep}</h4>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{phaseDetail.nextSteps[0] || 'Formally initiate pilot data schema matching within local Pune steel yards.'}</p>
                </div>
                <button
                  onClick={() => {
                    const nextPhaseIdx = COMPLETED_PHASES.findIndex(p => p.id === selectedPhaseId) + 1;
                    if (nextPhaseIdx < COMPLETED_PHASES.length) {
                      setSelectedPhaseId(COMPLETED_PHASES[nextPhaseIdx].id);
                    } else {
                      setSelectedPhaseId(COMPLETED_PHASES[0].id);
                    }
                  }}
                  className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-xs font-bold font-mono transition flex items-center gap-1 self-stretch md:self-auto justify-center shadow-lg shadow-[#f97316]/20"
                >
                  {t.nextPhaseBtn} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <AgentControlCenter language={language} theme={theme} />
        </div>
      )}

      {/* Footer System Parameters */}
      <footer className={`border-t px-4 py-2 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono transition-all duration-200 ${isLight ? 'bg-white border-slate-200 text-slate-500 shadow-inner' : 'bg-[#0c0c0e] border-[#1e293b] text-gray-500'}`} id="footer-bar">
        <div>KINETIX.AI INDUSTRIAL OS • SECURE ENCRYPTED CLIENT NODES v1.0.2</div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <span>GCP Region: Mumbai (asia-south1)</span>
          <span>•</span>
          <span>ONDC Protocol Version: v1.2.0</span>
          <span>•</span>
          <span>SECURE TLS 1.3 ENABLED</span>
        </div>
      </footer>

      <EnterpriseModal isOpen={showEnterpriseModal} onClose={() => setShowEnterpriseModal(false)} />
    </div>
  );
}
