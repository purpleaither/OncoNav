import { useState, useEffect } from 'react';
import { LayoutDashboard, UserCircle, Activity, Stethoscope, Bell, Type, Moon, Sun, ChevronLeft, Database, FileText, Clock, ShieldCheck, CalendarClock, Video, Repeat, TrendingDown, TrendingUp, Home, Heart, ChevronRight, ChevronDown, Contrast } from 'lucide-react';
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const getContextualNotifications = () => {
    switch (persona) {
      case 'patient': return [
        { id: 1, text: "Reminder: Take medication in 15 minutes.", time: "Now" },
        { id: 2, text: "Your biopsy results are ready for review.", time: "2h ago" }
      ];
      case 'caregiver': return [
        { id: 1, text: "Alert: Patient hasn't logged breakfast medication.", time: "30m ago" },
        { id: 2, text: "Appointment confirmed: Tomorrow at 14:00.", time: "1d ago" }
      ];
      case 'professional': return [
        { id: 1, text: "Squeeze-in request: Critical risk biopsy #44556.", time: "10m ago" },
        { id: 2, text: "Pathology report uploaded for Patient #10293.", time: "3h ago" }
      ];
      case 'manager': return [
        { id: 1, text: "Resource Alert: North Zone MRI capacity at 0%.", time: "5m ago" },
        { id: 2, text: "Load Balancing: 15 slots shifted to South Zone.", time: "1h ago" }
      ];
      default: return [
        { id: 1, text: "Welcome to OncoNav GLOBAL. Please select a portal.", time: "Just now" }
      ];
    }
  };
  const notifications = getContextualNotifications();

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'auto' });
  }, [persona]);

  const toggleFontSize = () => setFontSize(prev => prev === 'normal' ? 'large' : 'normal');

  const handlePersonaSelect = (newPersona) => {
    if (newPersona === null) {
      setPersona(null);
      setIsAuthenticated(false);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setPersona(newPersona);
      setIsAuthenticated(newPersona === 'manager' || newPersona === 'professional' ? false : false); // All start unauthenticated now
      setIsLoading(false);
    }, 800);
  };

  if (!persona) {
    return (
      <div 
        style={{ zoom: fontSize === 'large' ? 1.15 : 1 }}
        className={`min-h-screen flex flex-col p-6 transition-all duration-500 relative overflow-y-auto
        ${highContrast ? 'high-contrast' : darkMode ? 'dark-mode' : 'bg-[#f1f5f9] text-[#1e293b]'}`}>

        {(isLoading || isInitialLoad) && (
          <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className={`premium-loader ${highContrast ? 'text-black' : 'text-[#4c1d95]'}`}>
              <Activity className="w-8 h-8" />
            </div>
            <p className="mt-8 font-medium text-sm tracking-widest uppercase text-gray-500 animate-pulse">
              {isInitialLoad ? 'Welcome to OncoNav GLOBAL' : 'Loading Workspace...'}
            </p>
          </div>
        )}

        <div className="absolute top-6 right-6 flex items-center gap-2 z-50 fixed">
          <button
            onClick={toggleFontSize}
            title={fontSize === 'large' ? 'Diminuir fonte' : 'Aumentar fonte'}
            className={`p-2.5 rounded-lg transition-colors border shadow-sm ${fontSize === 'large'
              ? (highContrast ? 'bg-yellow-400 text-black border-yellow-500' : 'bg-[#4c1d95] text-white border-[#4c1d95]')
              : (highContrast ? 'bg-gray-900 text-yellow-400 border-gray-700 hover:bg-gray-800' : darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-[#475569] border-gray-300 hover:bg-gray-100')
              }`}
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Modo claro' : 'Modo escuro'}
            className={`p-2.5 rounded-lg transition-colors border shadow-sm ${darkMode 
              ? (highContrast ? 'bg-yellow-400 text-black border-yellow-500' : 'bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700')
              : (highContrast ? 'bg-gray-900 text-yellow-400 border-gray-700 hover:bg-gray-800' : 'bg-white text-[#475569] border-gray-300 hover:bg-gray-100')
              }`}
          >
            {darkMode ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setHighContrast(!highContrast)}
            title={highContrast ? 'Modo normal' : 'Alto contraste'}
            className={`p-2.5 rounded-lg transition-colors border shadow-sm ${highContrast 
              ? 'bg-yellow-400 text-black border-yellow-500' 
              : darkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-[#475569] border-gray-300 hover:bg-gray-100'
              }`}
          >
            <Contrast className={`w-4 h-4 ${highContrast ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="max-w-7xl mx-auto w-full pt-16 pb-24 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16 animate-in fade-in duration-700">
            {/* Left Column: Title and Badge */}
            <div className="text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-[17px]">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${highContrast ? 'bg-gray-900 border-gray-700' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-50 border-purple-100'}`}>
                  <Activity className={`w-8 h-8 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                </div>
                <div className="flex flex-col mt-[30px]">
                  <h1
                    className={`text-5xl font-light ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}
                  >
                    <span className={highContrast ? 'text-yellow-300' : ''}>OncoNav</span>{' '}
                    <span className={`${highContrast ? 'text-white' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'} uppercase`}>Global</span>
                  </h1>
                  <h2
                    style={{ fontFamily: "'Julius Sans One', sans-serif" }}
                    className={`text-[9px] mt-2 tracking-[0.3em] ${highContrast ? 'text-yellow-300' : 'text-[#64748b]'}`}
                  >
                    Because <span className="font-medium">time</span> matters.
                  </h2>
                </div>
              </div>
              <div className={`text-[10px] font-medium uppercase tracking-widest px-4 py-2 rounded-full border inline-block shadow-sm ${highContrast ? 'bg-gray-900 border-gray-700 text-gray-400' : darkMode ? 'bg-gray-800 border-gray-700 text-[#cbd5e1]' : 'bg-white border-gray-200 text-[#94a3b8]'}`}>
                Created by Team H (JLD) • Harvard HSIL 2026
              </div>
            </div>

            {/* Right Column: Platform Description */}
            <div className="flex flex-col justify-center">
              <p className={`text-2xl font-light leading-relaxed ${highContrast ? 'text-gray-200' : darkMode ? 'text-white' : 'text-[#475569]'}`}>
                A comprehensive <span className={`${highContrast ? 'text-yellow-400' : darkMode ? 'text-hero-glow' : 'text-[#4c1d95]'} italic font-normal`}>enterprise orchestration platform</span> designed to eliminate care fragmentation, optimize clinical logistics, and ensure compliance with oncology mandates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-20 animate-in fade-in duration-700 delay-150">

            {/* LEFT: 4-Step Workflow */}
            <div className={`rounded-3xl p-6 shadow-sm border ${highContrast ? 'bg-gray-900 border-gray-800' : darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <p style={{ fontFamily: "'Julius Sans One', sans-serif" }} className={`text-[10px] uppercase tracking-widest mb-4 text-center ${highContrast ? 'text-gray-500' : darkMode ? 'text-gray-500' : 'text-[#94a3b8]'}`}>Platform Workflow — Click a step to expand</p>

              {/* Horizontal Stepper Row — no min-width to avoid scroll */}
              <div className="flex items-start w-full">

                {/* STEP 1 */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <button
                    onClick={() => setExpandedStep(expandedStep === 1 ? null : 1)}
                    className={`w-full flex flex-col items-center gap-1.5 p-2 transition-all duration-200 group`}
                  >
                    <FileText className={`w-5 h-5 group-hover:scale-110 transition-transform ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                    <span className={`text-xs font-medium uppercase tracking-wide text-center leading-none ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Step 1</span>
                    <span className={`text-[11px] text-center leading-tight hidden sm:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data Trace</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 text-gray-400 ${expandedStep === 1 ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedStep === 1 && (
                    <div className="mt-3 w-full space-y-2 animate-in fade-in slide-in-from-top-3 duration-300">
                      <p className="text-[10px] text-[#64748b] italic text-center mb-2">Capturing raw inputs from the healthcare network.</p>
                      {[{ icon: FileText, label: 'Clinical Data', color: darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]' },
                      { icon: Clock, label: 'Flow Data', color: darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]' },
                      { icon: ShieldCheck, label: 'Control Data', color: darkMode ? 'text-[#e9d5ff]' : 'text-[#5b21b6]' }].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                          <span className="text-[11px] font-medium text-[#0f172a]">{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex items-start pt-4 px-1 shrink-0">
                  <ChevronRight className={`w-4 h-4 opacity-40 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                </div>

                {/* STEP 2 */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <button
                    onClick={() => setExpandedStep(expandedStep === 2 ? null : 2)}
                    className={`w-full flex flex-col items-center gap-1.5 p-2 transition-all duration-200 group`}
                  >
                    <Database className={`w-5 h-5 group-hover:scale-110 transition-transform ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#fb7185]' : 'text-[#db2777]'}`} />
                    <span className={`text-xs font-medium uppercase tracking-wide text-center leading-none ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Step 2</span>
                    <span className={`text-[11px] text-center leading-tight hidden sm:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>HIE</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 text-gray-400 ${expandedStep === 2 ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedStep === 2 && (
                    <div className="mt-3 w-full animate-in fade-in slide-in-from-top-3 duration-300 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                      <p className="text-[10px] text-[#64748b] italic text-center mb-2">Cross-referencing to eliminate care gaps.</p>
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-pink-100 mx-auto mb-3 shadow-sm ${darkMode ? 'text-[#fb7185]' : 'text-[#db2777]'}`}>
                        <Database className="w-5 h-5" />
                      </div>
                      <p className="text-[11px] font-medium text-[#0f172a] text-center mb-1">Health Information Exchange (HIE)</p>
                      <p className="text-[10px] text-[#64748b] text-center leading-relaxed">Cross-referencing datasets to eliminate <span className={`${darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'} italic`}>care fragmentation</span> and maintain <span className={`${darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'} italic`}>legal compliance</span>.</p>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex items-start pt-4 px-1 shrink-0">
                  <ChevronRight className={`w-4 h-4 opacity-40 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                </div>

                {/* STEP 3 */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <button
                    onClick={() => setExpandedStep(expandedStep === 3 ? null : 3)}
                    className={`w-full flex flex-col items-center gap-1.5 p-2 transition-all duration-200 group`}
                  >
                    <Activity className={`w-5 h-5 group-hover:scale-110 transition-transform ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                    <span className={`text-xs font-medium uppercase tracking-wide text-center leading-none ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Step 3</span>
                    <span className={`text-[11px] text-center leading-tight hidden sm:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI Agent</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 text-gray-400 ${expandedStep === 3 ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedStep === 3 && (
                    <div className="mt-3 w-full space-y-2 animate-in fade-in slide-in-from-top-3 duration-300">
                      <p className="text-[10px] text-[#64748b] italic text-center mb-2">Intelligent agents taking autonomous actions.</p>
                      {[{ icon: LayoutDashboard, label: 'Network Manager', color: darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]' },
                      { icon: CalendarClock, label: 'Smart Scheduling', color: darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]' },
                      { icon: Bell, label: 'Patient Assistant', color: darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]' }].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                          <span className="text-[11px] font-medium text-[#0f172a]">{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex items-start pt-4 px-1 shrink-0">
                  <ChevronRight className={`w-4 h-4 opacity-40 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                </div>

                {/* STEP 4 */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <button
                    onClick={() => setExpandedStep(expandedStep === 4 ? null : 4)}
                    className={`w-full flex flex-col items-center gap-1.5 p-2 transition-all duration-200 group`}
                  >
                    <TrendingUp className={`w-5 h-5 group-hover:scale-110 transition-transform ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                    <span className={`text-xs font-medium uppercase tracking-wide text-center leading-none ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Step 4</span>
                    <span className={`text-[11px] text-center leading-tight hidden sm:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Output</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 text-gray-400 ${expandedStep === 4 ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedStep === 4 && (
                    <div className="mt-3 w-full space-y-2 animate-in fade-in slide-in-from-top-3 duration-300">
                      <p className="text-[10px] text-[#64748b] italic text-center mb-2">Delivering the 4 Core Pillars to the network.</p>
                      {[{ icon: CalendarClock, label: 'Smart Scheduling', color: 'text-[#4c1d95]' },
                      { icon: Video, label: 'Tele-Consultations', color: 'text-[#5b21b6]' },
                      { icon: Repeat, label: 'Exam Flow (OCI)', color: 'text-[#d97706]' },
                      { icon: TrendingDown, label: 'Cost Efficiency', color: 'text-[#5b21b6]' }].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
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
              <p style={{ fontFamily: "'Julius Sans One', sans-serif" }} className={`text-[10px] uppercase tracking-widest mb-4 text-center ${highContrast ? 'text-gray-500' : darkMode ? 'text-gray-500' : 'text-[#94a3b8]'}`}>Explore our 4 interconnected MVPs</p>
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div onClick={() => handlePersonaSelect('patient')} className={`flex items-start gap-3 cursor-pointer rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md'}`}>
                  <UserCircle className={`w-6 h-6 shrink-0 mt-0.5 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                  <div>
                    <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Patient Portal</h2>
                    <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>The Patient's Journey: AI Health Literacy and Flow Data tracking.</p>
                  </div>
                </div>
                <div onClick={() => handlePersonaSelect('caregiver')} className={`flex items-start gap-3 cursor-pointer rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-pink-300 shadow-sm hover:shadow-md'}`}>
                  <Heart className={`w-6 h-6 shrink-0 mt-0.5 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#fb7185]' : 'text-[#db2777]'}`} />
                  <div>
                    <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Caregiver Portal</h2>
                    <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>Family Support: Logistics, Medications & AI Assistant.</p>
                  </div>
                </div>
                <div onClick={() => handlePersonaSelect('professional')} className={`flex items-start gap-3 cursor-pointer rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-red-200 shadow-sm hover:shadow-md'}`}>
                  <Stethoscope className={`w-6 h-6 shrink-0 mt-0.5 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#fca5a5]' : 'text-[#7f1d1d]'}`} />
                  <div>
                    <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Professional Portal</h2>
                    <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>Smart Scheduling & Tele-Health via HIE integration.</p>
                  </div>
                </div>
                <div onClick={() => handlePersonaSelect('manager')} className={`flex items-start gap-3 cursor-pointer rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] border ${highContrast ? 'bg-gray-900 border-gray-700 hover:border-yellow-400' : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md'}`}>
                  <LayoutDashboard className={`w-6 h-6 shrink-0 mt-0.5 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-[#e9d5ff]' : 'text-[#4c1d95]'}`} />
                  <div>
                    <h2 className={`text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Manager Portal</h2>
                    <p className={`text-xs leading-relaxed ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`}>Cost Efficiency & Control Data auditing.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>



        </div>
      </div>
    );
  }

  const getPersonaDetails = () => {
    switch (persona) {
      case 'patient': return { title: 'Patient Portal', icon: UserCircle, color: 'text-[#5b21b6]' };
      case 'caregiver': return { title: 'Caregiver Portal', icon: Heart, color: 'text-[#db2777]' };
      case 'manager': return { title: 'Manager Portal', icon: LayoutDashboard, color: 'text-[#4c1d95]' };
      case 'professional': return { title: 'Professional Portal', icon: Stethoscope, color: 'text-[#7f1d1d]' };
      default: return { title: '', icon: Activity, color: '' };
    }
  };

  const { title: PersonaTitle, icon: PersonaIcon, color: PersonaColor } = getPersonaDetails();

  return (
    <div 
      style={{ zoom: fontSize === 'large' ? 1.15 : 1 }}
      className={`min-h-screen flex flex-col font-sans relative transition-all duration-300
      ${highContrast ? 'high-contrast' : darkMode ? 'dark-mode' : 'bg-[#f1f5f9] text-[#0f172a]'}`}>

      <header className={`sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePersonaSelect(null)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-xs transition-all border ${highContrast ? 'text-white bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-[#f8fafc] text-[#0f172a] hover:bg-gray-100 border-gray-200 shadow-sm'}`}
          >
            <Home className="w-4 h-4" /> Return to Menu
          </button>

          <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-medium text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">OncoNav GLOBAL</span>
              <div className="flex items-center gap-2">
                <PersonaIcon className={`w-3.5 h-3.5 ${PersonaColor}`} />
                <h1 className="text-sm font-medium tracking-tight leading-none">{PersonaTitle}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
            <button onClick={toggleFontSize} title="Font Size" className={`p-2 rounded hover:bg-gray-100 ${fontSize === 'large' ? 'text-[#4c1d95] bg-purple-50' : 'text-[#475569]'}`}>
              <Type className="w-4 h-4" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} title="Toggle Theme" className={`p-2 rounded hover:bg-gray-100 ${darkMode ? 'text-yellow-400 bg-gray-800' : 'text-[#475569]'}`}>
              {darkMode ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4" />}
            </button>
            <button onClick={() => setHighContrast(!highContrast)} title="High Contrast" className={`p-2 rounded hover:bg-gray-100 ${highContrast ? 'text-yellow-400 bg-black' : 'text-[#475569]'}`}>
              <Contrast className={`w-4 h-4 ${highContrast ? 'fill-current' : ''}`} />
            </button>
          </div>
          {persona && isAuthenticated && (
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-8 h-8 rounded-full flex items-center justify-center border text-[#475569] hover:bg-gray-50 ${highContrast ? 'border-gray-700' : 'border-gray-200 bg-white'}`}
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] p-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">Notifications</h3>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="text-[11px] leading-relaxed">
                        <p className="text-gray-900 font-medium">{n.text}</p>
                        <span className="text-gray-400 text-[9px]">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-smooth py-10 px-6 md:px-12 relative">
        {isLoading && (
          <div className="absolute inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className={`premium-loader ${highContrast ? 'text-black' : 'text-[#4c1d95]'}`}>
              <Activity className="w-8 h-8" />
            </div>
            <p className="mt-8 font-medium text-sm tracking-widest uppercase text-gray-500 animate-pulse">Loading Workspace...</p>
          </div>
        )}
        <div className={`max-w-7xl mx-auto animate-in fade-in duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {persona === 'patient' && <PatientView highContrast={highContrast} darkMode={darkMode} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
          {persona === 'caregiver' && <CaregiverView highContrast={highContrast} darkMode={darkMode} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
          {persona === 'manager' && <ManagerView highContrast={highContrast} darkMode={darkMode} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
          {persona === 'professional' && <ProfessionalView highContrast={highContrast} darkMode={darkMode} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
        </div>
      </main>

    </div>
  );
}

export default App;
