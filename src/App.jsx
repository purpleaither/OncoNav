import { useState } from 'react';
import { LayoutDashboard, UserCircle, Activity, Stethoscope, Bell, Type, Moon, ChevronLeft, Database, FileText, Clock, ShieldCheck, CalendarClock, Video, Repeat, TrendingDown, Home } from 'lucide-react';
import PatientView from './components/patient/PatientView';
import ManagerView from './components/manager/ManagerView';
import ProfessionalView from './components/professional/ProfessionalView';

function App() {
  const [persona, setPersona] = useState(null);
  const [fontSize, setFontSize] = useState('normal'); 
  const [highContrast, setHighContrast] = useState(false);

  const toggleFontSize = () => setFontSize(prev => prev === 'normal' ? 'large' : 'normal');

  if (!persona) {
    return (
      <div className={`min-h-screen flex flex-col p-6 transition-all duration-500 relative overflow-y-auto ${highContrast ? 'bg-black text-white' : 'bg-[#f1f5f9] text-[#1e293b]'}`}>
        
        <div className="absolute top-6 right-6 flex items-center gap-3 z-50 fixed">
          <button onClick={toggleFontSize} className="p-3 rounded-md hover:bg-gray-200/50 transition-colors border border-gray-300 bg-white"><Type className="w-4 h-4 text-[#475569]" /></button>
          <button onClick={() => setHighContrast(!highContrast)} className="p-3 rounded-md hover:bg-gray-200/50 transition-colors border border-gray-300 bg-white"><Moon className="w-4 h-4 text-[#475569]" /></button>
        </div>

        <div className="max-w-6xl mx-auto w-full pt-10 pb-20 relative z-10">
          
          <div className="text-center mb-16 animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-[#4c1d95] rounded-xl mx-auto mb-6 flex items-center justify-center shadow-md">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#0f172a]">OncoNav <span className="text-[#5b21b6]">Global</span></h1>
            <h2 className="text-xl font-medium text-[#475569] mb-4 italic">Because <span className="text-[#5b21b6] font-bold">time</span> matters.</h2>
            <div className="mt-4 text-xs font-bold text-[#64748b] uppercase tracking-widest bg-white px-4 py-2 rounded border border-gray-200 inline-block shadow-sm">
              Created by Team H (JLD)
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 mb-16 animate-in fade-in duration-700 delay-150">
            
            <div className="text-center mb-12">
              <h3 className="text-2xl font-semibold mb-4 text-[#0f172a] tracking-tight">
                The Sovereign <span className="text-[#4c1d95] font-bold">AI Engine</span>
              </h3>
              <p className="text-[#475569] text-[13px] max-w-xl mx-auto leading-loose">
                Importing only essential data from the Health Information Exchange (HIE) API and cross-referencing it to strategically eliminate care fragmentation.
              </p>
              <div className="w-12 h-0.5 bg-[#e2e8f0] mx-auto mt-8"></div>
            </div>

            <div className="mb-14 px-4 md:px-0 text-center">
              <h4 className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-8">AI Implementation Map</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                  <strong className="text-xs font-semibold text-[#0f172a] mb-2 border-b border-[#e2e8f0] pb-2 w-full">AI Network Manager</strong>
                  <span className="text-[11px] text-[#64748b] leading-relaxed mt-2">Analyzes the 60-Day Mandate and autonomously recommends patient remaps to prevent legal breaches.</span>
                </div>
                <div className="flex flex-col items-center">
                  <strong className="text-xs font-semibold text-[#0f172a] mb-2 border-b border-[#e2e8f0] pb-2 w-full">Smart Scheduling AI</strong>
                  <span className="text-[11px] text-[#64748b] leading-relaxed mt-2">Cross-references geolocation, deadlines, and specialist availability to squeeze-in urgent patients.</span>
                </div>
                <div className="flex flex-col items-center">
                  <strong className="text-xs font-semibold text-[#0f172a] mb-2 border-b border-[#e2e8f0] pb-2 w-full">Patient AI Assistant</strong>
                  <span className="text-[11px] text-[#64748b] leading-relaxed mt-2">NLP Chatbot that translates clinical jargon and acts as a retention barrier against exam cancellations.</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-200 text-center">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 text-[#4c1d95]"><FileText className="w-5 h-5"/></div>
                <h4 className="font-bold text-[#1e293b] mb-2 text-sm">Clinical Data</h4>
                <p className="text-xs text-[#64748b]">Biopsy and staging reports (The trigger for treatment).</p>
              </div>
              <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-200 text-center">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 text-[#5b21b6]"><Clock className="w-5 h-5"/></div>
                <h4 className="font-bold text-[#1e293b] mb-2 text-sm">Flow Data</h4>
                <p className="text-xs text-[#64748b]">Referral and scheduling dates (The 60-day legal thermometer).</p>
              </div>
              <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-200 text-center">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 text-[#7f1d1d]"><ShieldCheck className="w-5 h-5"/></div>
                <h4 className="font-bold text-[#1e293b] mb-2 text-sm">Control Data</h4>
                <p className="text-xs text-[#64748b]">High-Complexity vs Standard billing to prevent public fund waste.</p>
              </div>
            </div>

            <div className="text-center bg-[#f1f5f9] p-6 rounded-xl border border-gray-200">
              <h4 className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-6">Cross-referencing enables the 4 Core Pillars:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                  <CalendarClock className="w-5 h-5 text-[#4c1d95] mb-2" />
                  <span className="font-semibold text-xs text-[#334155]">Smart Scheduling</span>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                  <Video className="w-5 h-5 text-[#5b21b6] mb-2" />
                  <span className="font-semibold text-xs text-[#334155]">Tele-Consultations</span>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                  <Repeat className="w-5 h-5 text-[#d97706] mb-2" />
                  <span className="font-semibold text-xs text-[#334155]">Exam Flow (OCI)</span>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                  <TrendingDown className="w-5 h-5 text-[#7f1d1d] mb-2" />
                  <span className="font-semibold text-xs text-[#334155]">Cost Efficiency</span>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center mb-6">
            <h3 className="font-bold text-lg text-[#1e293b]">Explore the MVP Experiences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-300">
            <div onClick={() => setPersona('patient')} className={`cursor-pointer rounded-xl p-6 transition-all duration-200 hover:border-[#5b21b6] border ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] text-[#5b21b6] flex items-center justify-center border border-gray-200"><UserCircle className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-[#0f172a]">Patient Portal</h2>
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">Maria's Journey: AI Health Literacy and Flow Data tracking.</p>
            </div>
            <div onClick={() => setPersona('professional')} className={`cursor-pointer rounded-xl p-6 transition-all duration-200 hover:border-[#7f1d1d] border ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] text-[#7f1d1d] flex items-center justify-center border border-gray-200"><Stethoscope className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-[#0f172a]">Clinical Tasks</h2>
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">Smart Scheduling & Tele-Health via HIE integration.</p>
            </div>
            <div onClick={() => setPersona('manager')} className={`cursor-pointer rounded-xl p-6 transition-all duration-200 hover:border-[#4c1d95] border ${highContrast ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#f1f5f9] text-[#4c1d95] flex items-center justify-center border border-gray-200"><LayoutDashboard className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-[#0f172a]">Network Manager</h2>
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">Cost Efficiency & Control Data auditing.</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const getPersonaDetails = () => {
    switch(persona) {
      case 'patient': return { title: 'Patient Portal', icon: UserCircle, color: 'text-[#5b21b6]' };
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
            onClick={() => setPersona(null)} 
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

      <main className="flex-1 overflow-y-auto scroll-smooth py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          {persona === 'patient' && <PatientView highContrast={highContrast} />}
          {persona === 'manager' && <ManagerView highContrast={highContrast} />}
          {persona === 'professional' && <ProfessionalView highContrast={highContrast} />}
        </div>
      </main>

    </div>
  );
}

export default App;
