import { useState, useEffect } from 'react';
import { LayoutDashboard, UserCircle, Activity, Stethoscope, Bell, Type, Moon, ChevronLeft, Database, FileText, Clock, ShieldCheck, CalendarClock, Video, Repeat, TrendingDown, Home, Heart, ArrowDown, ChevronDown } from 'lucide-react';
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
      <div className={`min-h-screen flex flex-col p-6 transition-all duration-500 relative overflow-y-auto ${highContrast ? 'bg-black text-white' : 'bg-[#f1f5f9] text-[#1e293b]'}`}>
        
        {isLoading && (
          <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className={`premium-loader ${highContrast ? 'text-black' : 'text-[#4c1d95]'}`}>
              <Activity className="w-8 h-8" />
            </div>
            <p className="mt-8 font-bold text-sm tracking-widest uppercase text-gray-500 animate-pulse">Initializing Sovereign AI...</p>
          </div>
        )}

        <div className="absolute top-6 right-6 flex items-center gap-3 z-50 fixed">
          <button onClick={toggleFontSize} className="p-3 rounded-md hover:bg-gray-200/50 transition-colors border border-gray-300 bg-white"><Type className="w-4 h-4 text-[#475569]" /></button>
          <button onClick={() => setHighContrast(!highContrast)} className="p-3 rounded-md hover:bg-gray-200/50 transition-colors border border-gray-300 bg-white"><Moon className="w-4 h-4 text-[#475569]" /></button>
        </div>

        <div className="max-w-7xl mx-auto w-full pt-16 pb-24 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 animate-in fade-in duration-700">
            {/* Left Column: Title and Summary */}
            <div className="text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 shadow-sm shrink-0">
                  <Activity className="w-8 h-8 text-[#4c1d95]" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-5xl font-light tracking-wide text-[#0f172a] uppercase">
                    OncoNav <span className="text-[#4c1d95] font-normal">Global</span>
                  </h1>
                  <h2 className="text-lg text-[#64748b] mt-1 tracking-wide italic">
                    Because time matters.
                  </h2>
                </div>
              </div>
              <p className="text-base text-[#475569] max-w-xl mb-8 leading-relaxed mt-4">
                A comprehensive <span className="text-[#4c1d95] italic">enterprise orchestration platform</span> designed to eliminate care fragmentation, optimize clinical logistics, and ensure compliance with oncology mandates.
              </p>
              <div className="text-[10px] font-medium text-[#64748b] uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-200 inline-block shadow-sm">
                Created by Team H (JLD) • Harvard HSIL 2026
              </div>
            </div>

            {/* Right Column: MVP Portals */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium text-[#64748b] mb-1 px-1">
                Explore our 4 interconnected MVPs:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div onClick={() => handlePersonaSelect('patient')} className={`cursor-pointer rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5b21b6] flex items-center justify-center border border-purple-100"><UserCircle className="w-5 h-5" /></div>
                  <h2 className="text-sm font-medium text-[#0f172a]">Patient Portal</h2>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed">Maria's Journey: AI Health Literacy and Flow Data tracking.</p>
              </div>
              
              <div onClick={() => handlePersonaSelect('caregiver')} className={`cursor-pointer rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 hover:border-pink-200 shadow-sm hover:shadow-md'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#db2777] flex items-center justify-center border border-pink-100"><Heart className="w-5 h-5" /></div>
                  <h2 className="text-sm font-medium text-[#0f172a]">Caregiver Portal</h2>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed">Family Support: Logistics, Medications & AI Assistant.</p>
              </div>
              
              <div onClick={() => handlePersonaSelect('professional')} className={`cursor-pointer rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 hover:border-teal-200 shadow-sm hover:shadow-md'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center border border-teal-100"><Stethoscope className="w-5 h-5" /></div>
                  <h2 className="text-sm font-medium text-[#0f172a]">Clinical Tasks</h2>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed">Smart Scheduling & Tele-Health via HIE integration.</p>
              </div>
              
              <div onClick={() => handlePersonaSelect('manager')} className={`cursor-pointer rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-md'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4c1d95] flex items-center justify-center border border-indigo-100"><LayoutDashboard className="w-5 h-5" /></div>
                  <h2 className="text-sm font-medium text-[#0f172a]">Network Manager</h2>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed">Cost Efficiency & Control Data auditing.</p>
              </div>
            </div>
          </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-gray-200 mb-20 animate-in fade-in duration-700 delay-150">
            {/* Infographic Container */}
            <div className="flex flex-col items-center">
              
              {/* STEP 1: Inputs */}
              <div className="text-center w-full mb-2">
                <button onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)} className="flex flex-col items-center mb-6 mx-auto group cursor-pointer outline-none">
                  <span className="text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 shadow-sm mb-2 flex items-center gap-2 group-hover:bg-blue-100 transition-colors">
                    Step 1: Data Aggregation
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedStep === 1 ? 'rotate-180' : ''}`} />
                  </span>
                  <p className="text-xs text-[#64748b] italic group-hover:text-blue-700 transition-colors">Capturing raw inputs from the healthcare network.</p>
                </button>
                {expandedStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-100 flex items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#4c1d95] flex items-center justify-center border border-purple-100">
                      <FileText className="w-4 h-4"/>
                    </div>
                    <span className="font-medium text-sm text-[#0f172a]">Clinical Data</span>
                  </div>
                  <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-100 flex items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5b21b6] flex items-center justify-center border border-indigo-100">
                      <Clock className="w-4 h-4"/>
                    </div>
                    <span className="font-medium text-sm text-[#0f172a]">Flow Data</span>
                  </div>
                  <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-100 flex items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f766e] flex items-center justify-center border border-teal-100">
                      <ShieldCheck className="w-4 h-4"/>
                    </div>
                    <span className="font-medium text-sm text-[#0f172a]">Control Data</span>
                  </div>
                </div>
                )}
              </div>

              {/* Arrow */}
              <div className="w-px h-10 bg-gradient-to-b from-gray-200 to-[#4c1d95] my-2"></div>
              <ArrowDown className="w-4 h-4 text-[#4c1d95] mb-4 opacity-50" />

              {/* STEP 2: Engine */}
              <div className="text-center w-full max-w-2xl mx-auto mb-2">
                <div className="bg-gradient-to-r from-[#4c1d95]/5 to-[#db2777]/5 p-8 rounded-3xl border border-[#4c1d95]/10 relative mt-4">
                  <button onClick={() => setExpandedStep(expandedStep === 2 ? null : 2)} className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center w-max group cursor-pointer outline-none">
                    <span className="bg-purple-50 px-4 py-1.5 rounded-full border border-purple-200 text-[10px] text-purple-700 uppercase tracking-widest shadow-sm mb-1 flex items-center gap-2 group-hover:bg-purple-100 transition-colors">
                      Step 2: Processing
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedStep === 2 ? 'rotate-180' : ''}`} />
                    </span>
                    <p className="text-[10px] text-[#64748b] italic bg-white px-2 rounded-full border border-gray-100 group-hover:text-purple-700 transition-colors">Cross-referencing to eliminate care gaps.</p>
                  </button>
                  {expandedStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300 mt-4">
                    <div className="w-12 h-12 rounded-xl bg-white text-[#db2777] flex items-center justify-center border border-pink-100 mx-auto mb-4 shadow-sm">
                      <Database className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-medium text-[#0f172a] mb-3 mt-4">Health Information Exchange (HIE)</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">Cross-referencing datasets to strategically eliminate <span className="text-[#4c1d95] italic">care fragmentation</span> and maintain compliance with <span className="text-[#4c1d95] italic">legal mandates</span>.</p>
                  </div>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="w-px h-10 bg-gradient-to-b from-[#db2777]/20 to-pink-200 my-2"></div>
              <ArrowDown className="w-4 h-4 text-pink-300 mb-4 opacity-50" />

              {/* STEP 3: AI Agents */}
              <div className="text-center w-full mb-2">
                <button onClick={() => setExpandedStep(expandedStep === 3 ? null : 3)} className="flex flex-col items-center mb-6 mx-auto group cursor-pointer outline-none">
                  <span className="text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border bg-pink-50 text-pink-700 border-pink-200 shadow-sm mb-2 flex items-center gap-2 group-hover:bg-pink-100 transition-colors">
                    Step 3: AI Orchestration
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedStep === 3 ? 'rotate-180' : ''}`} />
                  </span>
                  <p className="text-xs text-[#64748b] italic group-hover:text-pink-700 transition-colors">Intelligent agents taking autonomous actions.</p>
                </button>
                {expandedStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left flex flex-col items-start">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5b21b6] flex items-center justify-center border border-indigo-100 mb-3"><LayoutDashboard className="w-4 h-4"/></div>
                    <span className="text-sm font-medium text-[#0f172a] block mb-2">Network Manager</span>
                    <p className="text-xs text-[#64748b] leading-relaxed">Autonomously recommends <span className="text-[#5b21b6] italic">patient remaps</span> to prevent <span className="text-[#5b21b6] italic">60-Day Mandate</span> breaches.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left flex flex-col items-start">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#4c1d95] flex items-center justify-center border border-purple-100 mb-3"><CalendarClock className="w-4 h-4"/></div>
                    <span className="text-sm font-medium text-[#0f172a] block mb-2">Smart Scheduling</span>
                    <p className="text-xs text-[#64748b] leading-relaxed">Cross-references geolocation to squeeze-in <span className="text-[#4c1d95] italic">urgent patients</span>.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left flex flex-col items-start">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f766e] flex items-center justify-center border border-teal-100 mb-3"><Bell className="w-4 h-4"/></div>
                    <span className="text-sm font-medium text-[#0f172a] block mb-2">Patient Assistant</span>
                    <p className="text-xs text-[#64748b] leading-relaxed">NLP Chatbot acting as a <span className="text-[#0f766e] italic">retention barrier</span> against exam cancellations.</p>
                  </div>
                </div>
                )}
              </div>

              {/* Arrow */}
              <div className="w-px h-10 bg-gradient-to-b from-gray-100 to-gray-200 my-2"></div>
              <ArrowDown className="w-4 h-4 text-gray-300 mb-4 opacity-50" />

              {/* STEP 4: Results */}
              <div className="text-center w-full">
                <button onClick={() => setExpandedStep(expandedStep === 4 ? null : 4)} className="flex flex-col items-center mb-6 mx-auto group cursor-pointer outline-none">
                  <span className="text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm mb-2 flex items-center gap-2 group-hover:bg-emerald-100 transition-colors">
                    Step 4: Output
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedStep === 4 ? 'rotate-180' : ''}`} />
                  </span>
                  <p className="text-xs text-[#64748b] italic group-hover:text-emerald-700 transition-colors">Delivering the 4 Core Pillars to the network.</p>
                </button>
                {expandedStep === 4 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-[#f8fafc] p-6 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4c1d95] flex items-center justify-center border border-purple-100 mb-3">
                      <CalendarClock className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-xs text-[#334155]">Smart Scheduling</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5b21b6] flex items-center justify-center border border-indigo-100 mb-3">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-xs text-[#334155]">Tele-Consultations</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center border border-amber-100 mb-3">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-xs text-[#334155]">Exam Flow (OCI)</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center border border-teal-100 mb-3">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-xs text-[#334155]">Cost Efficiency</span>
                  </div>
                </div>
                )}
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
    <div className={`min-h-screen flex flex-col font-sans relative transition-all duration-300 ${
      highContrast ? 'bg-black text-white' : 'bg-[#f1f5f9] text-[#0f172a]'
    } ${fontSize === 'large' ? 'text-lg' : 'text-sm'}`}>
      
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
