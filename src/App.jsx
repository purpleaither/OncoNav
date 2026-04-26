import { useState, useEffect } from 'react';
import { LayoutDashboard, UserCircle, Activity, Stethoscope, Bell, Type, Moon, Sun, ChevronLeft, Database, FileText, Clock, ShieldCheck, CalendarClock, Video, Repeat, TrendingDown, TrendingUp, Home, Heart, ChevronRight, ChevronDown } from 'lucide-react';
import PatientView from './components/patient/PatientView';
import ManagerView from './components/manager/ManagerView';
import ProfessionalView from './components/professional/ProfessionalView';
import CaregiverView from './components/caregiver/CaregiverView';

function App() {
  const [persona, setPersona] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); 
  const [highContrast, setHighContrast] = useState(false);
  const [expandedStep, setExpandedStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'auto' });
  }, [persona]);

  const toggleFontSize = () => setFontSize(prev => prev === 'normal' ? 'large' : 'normal');

  const handlePersonaSelect = (newPersona) => {
    setIsLoading(true);
    setTimeout(() => {
      setPersona(newPersona);
      setIsLoading(false);
    }, 800);
  };

  if (!persona) {
    return (
      <div className={`min-h-screen flex flex-col p-6 transition-all duration-500 relative overflow-y-auto
        ${highContrast ? 'high-contrast' : darkMode ? 'dark-mode' : 'bg-[#f1f5f9] text-[#1e293b]'}
        ${fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
        
        {isLoading && (
          <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className={`premium-loader ${highContrast ? 'text-black' : 'text-[#4c1d95]'}`}>
              <Activity className="w-8 h-8" />
            </div>
            <p className="mt-8 font-bold text-sm tracking-widest uppercase text-gray-500 animate-pulse">Initializing Sovereign AI...</p>
          </div>
        )}

        <div className="absolute top-6 right-6 flex items-center gap-2 z-50 fixed">
          <button
            onClick={toggleFontSize}
            title={fontSize === 'large' ? 'Diminuir fonte' : 'Aumentar fonte'}
            className={`p-2.5 rounded-lg transition-colors border shadow-sm ${
              fontSize === 'large'
                ? (highContrast ? 'bg-yellow-400 text-black border-yellow-500' : 'bg-[#4c1d95] text-white border-[#4c1d95]')
                : (highContrast ? 'bg-gray-900 text-yellow-400 border-gray-700 hover:bg-gray-800' : darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-[#475569] border-gray-300 hover:bg-gray-100')
            }`}
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Modo claro' : 'Modo escuro'}
            className={`p-2.5 rounded-lg transition-colors border shadow-sm ${
              highContrast ? 'bg-gray-900 text-yellow-400 border-gray-700 hover:bg-gray-800'
              : darkMode ? 'bg-yellow-400 text-gray-900 border-yellow-500 hover:bg-yellow-300'
              : 'bg-white text-[#475569] border-gray-300 hover:bg-gray-100'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setHighContrast(!highContrast)}
            title={highContrast ? 'Desativar alto contraste' : 'Alto contraste'}
            className={`p-2.5 rounded-lg transition-colors border shadow-sm text-[9px] font-bold uppercase tracking-wide ${
              highContrast ? 'bg-yellow-400 text-black border-yellow-500' : darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-[#475569] border-gray-300 hover:bg-gray-100'
            }`}
          >
            HC
          </button>
        </div>

        <div className="max-w-7xl mx-auto w-full pt-16 pb-24 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16 animate-in fade-in duration-700">
            {/* Left Column: Title and Badge */}
            <div className="text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-purple-50 border-purple-100'}`}>
                  <Activity className="w-8 h-8 text-[#4c1d95]" />
                </div>
                <div className="flex flex-col">
                  <h1 className={`text-5xl font-light tracking-wide uppercase ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                    OncoNav <span className="text-[#4c1d95] font-normal">Global</span>
                  </h1>
                  <h2 className={`text-lg mt-1 tracking-wide italic ${highContrast ? 'text-yellow-300' : 'text-[#64748b]'}`}>
                    Because time matters.
                  </h2>
                </div>
              </div>
              <div className={`text-[10px] font-medium uppercase tracking-widest px-4 py-2 rounded-full border inline-block shadow-sm ${highContrast ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-[#64748b]'}`}>
                Created by Team H (JLD) • Harvard HSIL 2026
              </div>
            </div>

            {/* Right Column: Platform Description */}
            <div className="flex flex-col justify-center">
              <p className={`text-2xl font-light leading-relaxed ${highContrast ? 'text-gray-200' : 'text-[#475569]'}`}>
                A comprehensive <span className="text-[#4c1d95] italic font-normal">enterprise orchestration platform</span> designed to eliminate care fragmentation, optimize clinical logistics, and ensure compliance with oncology mandates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-20 animate-in fade-in duration-700 delay-150">

            {/* LEFT: 4-Step Workflow */}
            <div className={`rounded-3xl p-6 shadow-sm border ${highContrast ? 'bg-gray-900 border-gray-800' : darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <p className={`text-[10px] uppercase tracking-widest mb-4 text-center ${highContrast ? 'text-gray-500' : darkMode ? 'text-gray-500' : 'text-[#94a3b8]'}`}>Platform Workflow — Click a step to expand</p>

            {/* Horizontal Stepper Row — no min-width to avoid scroll */}
            <div className="flex items-start w-full">

              {/* STEP 1 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)}
                  className={`w-full flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 group ${
                    expandedStep === 1
                      ? 'bg-blue-600 border-blue-600 shadow-md'
                      : 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${expandedStep === 1 ? 'text-white' : 'text-blue-600'}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wide text-center leading-none ${
                    expandedStep === 1 ? 'text-white' : 'text-blue-700'
                  }`}>Step 1</span>
                  <span className={`text-[8px] text-center leading-tight hidden sm:block ${
                    expandedStep === 1 ? 'text-blue-100' : 'text-blue-500'
                  }`}>Data</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                    expandedStep === 1 ? 'rotate-180 text-white' : 'text-blue-400'
                  }`} />
                </button>
                {expandedStep === 1 && (
                  <div className="mt-3 w-full space-y-2 animate-in fade-in slide-in-from-top-3 duration-300">
                    <p className="text-[10px] text-[#64748b] italic text-center mb-2">Capturing raw inputs from the healthcare network.</p>
                    {[{icon: FileText, label: 'Clinical Data', color: 'text-[#4c1d95]'},
                      {icon: Clock, label: 'Flow Data', color: 'text-[#5b21b6]'},
                      {icon: ShieldCheck, label: 'Control Data', color: 'text-[#0f766e]'}].map(({icon: Icon, label, color}) => (
                      <div key={label} className="bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`}/>
                        <span className="text-[11px] font-medium text-[#0f172a]">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-start pt-4 px-1 shrink-0">
                <ChevronRight className="w-4 h-4 text-[#4c1d95] opacity-40" />
              </div>

              {/* STEP 2 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  onClick={() => setExpandedStep(expandedStep === 2 ? null : 2)}
                  className={`w-full flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                    expandedStep === 2
                      ? 'bg-[#4c1d95] border-[#4c1d95] shadow-md'
                      : 'bg-purple-50 border-purple-200 hover:border-[#4c1d95] hover:bg-purple-100'
                  }`}
                >
                  <Database className={`w-4 h-4 ${expandedStep === 2 ? 'text-white' : 'text-[#4c1d95]'}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wide text-center leading-none ${
                    expandedStep === 2 ? 'text-white' : 'text-purple-700'
                  }`}>Step 2</span>
                  <span className={`text-[8px] text-center leading-tight hidden sm:block ${
                    expandedStep === 2 ? 'text-purple-200' : 'text-purple-500'
                  }`}>HIE</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                    expandedStep === 2 ? 'rotate-180 text-white' : 'text-purple-400'
                  }`} />
                </button>
                {expandedStep === 2 && (
                  <div className="mt-3 w-full animate-in fade-in slide-in-from-top-3 duration-300 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <p className="text-[10px] text-[#64748b] italic text-center mb-2">Cross-referencing to eliminate care gaps.</p>
                    <div className="w-10 h-10 rounded-xl bg-white text-[#db2777] flex items-center justify-center border border-pink-100 mx-auto mb-3 shadow-sm">
                      <Database className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-medium text-[#0f172a] text-center mb-1">Health Information Exchange (HIE)</p>
                    <p className="text-[10px] text-[#64748b] text-center leading-relaxed">Cross-referencing datasets to eliminate <span className="text-[#4c1d95] italic">care fragmentation</span> and maintain <span className="text-[#4c1d95] italic">legal compliance</span>.</p>
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-start pt-4 px-1 shrink-0">
                <ChevronRight className="w-4 h-4 text-[#4c1d95] opacity-40" />
              </div>

              {/* STEP 3 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  onClick={() => setExpandedStep(expandedStep === 3 ? null : 3)}
                  className={`w-full flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                    expandedStep === 3
                      ? 'bg-[#db2777] border-[#db2777] shadow-md'
                      : 'bg-pink-50 border-pink-200 hover:border-[#db2777] hover:bg-pink-100'
                  }`}
                >
                  <Activity className={`w-4 h-4 ${expandedStep === 3 ? 'text-white' : 'text-[#db2777]'}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wide text-center leading-none ${
                    expandedStep === 3 ? 'text-white' : 'text-pink-700'
                  }`}>Step 3</span>
                  <span className={`text-[8px] text-center leading-tight hidden sm:block ${
                    expandedStep === 3 ? 'text-pink-100' : 'text-pink-500'
                  }`}>AI Agent</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                    expandedStep === 3 ? 'rotate-180 text-white' : 'text-pink-400'
                  }`} />
                </button>
                {expandedStep === 3 && (
                  <div className="mt-3 w-full space-y-2 animate-in fade-in slide-in-from-top-3 duration-300">
                    <p className="text-[10px] text-[#64748b] italic text-center mb-2">Intelligent agents taking autonomous actions.</p>
                    {[{icon: LayoutDashboard, label: 'Network Manager', color: 'text-[#5b21b6]'},
                      {icon: CalendarClock, label: 'Smart Scheduling', color: 'text-[#4c1d95]'},
                      {icon: Bell, label: 'Patient Assistant', color: 'text-[#0f766e]'}].map(({icon: Icon, label, color}) => (
                      <div key={label} className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`}/>
                        <span className="text-[11px] font-medium text-[#0f172a]">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-start pt-4 px-1 shrink-0">
                <ChevronRight className="w-4 h-4 text-emerald-400 opacity-60" />
              </div>

              {/* STEP 4 */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  onClick={() => setExpandedStep(expandedStep === 4 ? null : 4)}
                  className={`w-full flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${
                    expandedStep === 4
                      ? 'bg-emerald-600 border-emerald-600 shadow-md'
                      : 'bg-emerald-50 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100'
                  }`}
                >
                  <TrendingUp className={`w-4 h-4 ${expandedStep === 4 ? 'text-white' : 'text-emerald-600'}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wide text-center leading-none ${
                    expandedStep === 4 ? 'text-white' : 'text-emerald-700'
                  }`}>Step 4</span>
                  <span className={`text-[8px] text-center leading-tight hidden sm:block ${
                    expandedStep === 4 ? 'text-emerald-100' : 'text-emerald-500'
                  }`}>Output</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                    expandedStep === 4 ? 'rotate-180 text-white' : 'text-emerald-400'
                  }`} />
                </button>
                {expandedStep === 4 && (
                  <div className="mt-3 w-full space-y-2 animate-in fade-in slide-in-from-top-3 duration-300">
                    <p className="text-[10px] text-[#64748b] italic text-center mb-2">Delivering the 4 Core Pillars to the network.</p>
                    {[{icon: CalendarClock, label: 'Smart Scheduling', color: 'text-[#4c1d95]'},
                      {icon: Video, label: 'Tele-Consultations', color: 'text-[#5b21b6]'},
                      {icon: Repeat, label: 'Exam Flow (OCI)', color: 'text-[#d97706]'},
                      {icon: TrendingDown, label: 'Cost Efficiency', color: 'text-[#0f766e]'}].map(({icon: Icon, label, color}) => (
                      <div key={label} className="bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`}/>
                        <span className="text-[11px] font-medium text-[#0f172a]">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

            {/* RIGHT: 4 MVP Portals — same card as left */}
            <div className={`rounded-3xl p-6 shadow-sm border flex flex-col ${highContrast ? 'bg-gray-900 border-gray-800' : darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <p className={`text-[10px] uppercase tracking-widest mb-4 text-center ${highContrast ? 'text-gray-500' : darkMode ? 'text-gray-500' : 'text-[#94a3b8]'}`}>Explore our 4 interconnected MVPs</p>
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div onClick={() => handlePersonaSelect('patient')} className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md'}`}>
                  <UserCircle className="w-6 h-6 text-[#5b21b6] mb-3" />
                  <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Patient Portal</h2>
                  <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>Maria's Journey: AI Health Literacy and Flow Data tracking.</p>
                </div>
                <div onClick={() => handlePersonaSelect('caregiver')} className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-pink-300 shadow-sm hover:shadow-md'}`}>
                  <Heart className="w-6 h-6 text-[#db2777] mb-3" />
                  <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Caregiver Portal</h2>
                  <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>Family Support: Logistics, Medications & AI Assistant.</p>
                </div>
                <div onClick={() => handlePersonaSelect('professional')} className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-teal-300 shadow-sm hover:shadow-md'}`}>
                  <Stethoscope className="w-6 h-6 text-[#0f766e] mb-3" />
                  <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Clinical Tasks</h2>
                  <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>Smart Scheduling & Tele-Health via HIE integration.</p>
                </div>
                <div onClick={() => handlePersonaSelect('manager')} className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md'}`}>
                  <LayoutDashboard className="w-6 h-6 text-[#4c1d95] mb-3" />
                  <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Network Manager</h2>
                  <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>Cost Efficiency & Control Data auditing.</p>
                </div>
              </div>
            </div>

          </div>



        </div>
      </div>
    );
  }

  const getPersonaDetails = () => {
    switch(persona) {
      case 'patient': return { title: 'Patient Portal', icon: UserCircle, color: 'text-[#5b21b6]' };
      case 'caregiver': return { title: 'Caregiver Portal', icon: Heart, color: 'text-[#db2777]' };
      case 'manager': return { title: 'Network Manager', icon: LayoutDashboard, color: 'text-[#4c1d95]' };
      case 'professional': return { title: 'Clinical Professional', icon: Stethoscope, color: 'text-[#7f1d1d]' };
      default: return { title: '', icon: Activity, color: '' };
    }
  };

  const { title: PersonaTitle, icon: PersonaIcon, color: PersonaColor } = getPersonaDetails();

  return (
    <div className={`min-h-screen flex flex-col font-sans relative transition-all duration-300
      ${highContrast ? 'high-contrast' : darkMode ? 'dark-mode' : 'bg-[#f1f5f9] text-[#0f172a]'}
      ${fontSize === 'large' ? 'text-lg' : 'text-sm'}`}>
      
      <header className={`sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handlePersonaSelect(null)} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-xs transition-all border ${highContrast ? 'text-white bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-[#f8fafc] text-[#0f172a] hover:bg-gray-100 border-gray-200 shadow-sm'}`}
          >
            <Home className="w-4 h-4" /> Return to Menu
          </button>
          
          <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
            <PersonaIcon className={`w-5 h-5 ${PersonaColor}`} />
            <h1 className="text-sm font-bold tracking-tight">{PersonaTitle}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
            <button onClick={toggleFontSize} className="p-2 rounded hover:bg-gray-100 text-[#475569]">
              <Type className="w-4 h-4" />
            </button>
            <button onClick={() => setHighContrast(!highContrast)} className="p-2 rounded hover:bg-gray-100 text-[#475569]">
              <Moon className="w-4 h-4" />
            </button>
          </div>
          <button className={`w-8 h-8 rounded-full flex items-center justify-center border text-[#475569] hover:bg-gray-50 ${highContrast ? 'border-gray-700' : 'border-gray-200 bg-white'}`}>
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-smooth py-10 px-6 md:px-12 relative">
        {isLoading && (
          <div className="absolute inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className={`premium-loader ${highContrast ? 'text-black' : 'text-[#4c1d95]'}`}>
              <Activity className="w-8 h-8" />
            </div>
            <p className="mt-8 font-bold text-sm tracking-widest uppercase text-gray-500 animate-pulse">Loading Workspace...</p>
          </div>
        )}
        <div className={`max-w-7xl mx-auto animate-in fade-in duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {persona === 'patient' && <PatientView highContrast={highContrast} />}
          {persona === 'caregiver' && <CaregiverView highContrast={highContrast} />}
          {persona === 'manager' && <ManagerView highContrast={highContrast} />}
          {persona === 'professional' && <ProfessionalView highContrast={highContrast} />}
        </div>
      </main>

    </div>
  );
}

export default App;
