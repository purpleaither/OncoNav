import { useState, useRef, useEffect } from 'react';
import { Clock, Check, MessageSquare, X, ShieldCheck, Heart, FileText, ChevronRight, Activity, MapPin, AlertCircle, QrCode, CalendarDays, Send, CheckCircle2, Bell, ClipboardCheck } from 'lucide-react';
import { ResponsiveContainer, Tooltip, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function CaregiverView({ highContrast, darkMode, isAuthenticated, setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('pathway');
  const [medsTaken, setMedsTaken] = useState({ '08:00 AM': true, '20:00 PM': false });
  const [medsAlarm, setMedsAlarm] = useState({ '08:00 AM': false, '20:00 PM': true });
  const [showAlarmPopup, setShowAlarmPopup] = useState(false);
  const [selectedMedForAlarm, setSelectedMedForAlarm] = useState(null);
  const [showExamSim, setShowExamSim] = useState(false);

  // OBSERVATION LOG STATE
  const [obsInput, setObsInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [observations, setObservations] = useState([
    { id: 1, date: 'Today, 10:20 AM', symptoms: ['Extreme Fatigue'], note: 'Patient seems more tired than usual after the morning walk.', urgent: false },
    { id: 2, date: 'Yesterday, 14:00 PM', symptoms: ['Loss of Appetite'], note: 'Skipped lunch, only drank some water.', urgent: false }
  ]);

  // CHATBOT STATE FOR CAREGIVER
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hello. I am the Caregiver Assistant for the patient. A Core Needle Biopsy has been scheduled for tomorrow at 14:00 to keep their care pathway safely within the 60-Day Legal Mandate. \n\nHow can I help you support the patient in preparing for this procedure?'
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'ai') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  const handleSendMessage = (textOverride = null) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setInputText('');

    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      let aiResponse = '';

      if (lowerText.includes('drive') || lowerText.includes('transport') || lowerText.includes('escort') || lowerText.includes('pick up')) {
        aiResponse = "Yes, it is highly recommended that you accompany the patient. While a biopsy uses local anesthesia, they may feel sore or emotional afterward. Having you there will provide comfort, and you can safely drive them home.";
      } 
      else if (lowerText.includes('eat') || lowerText.includes('food') || lowerText.includes('fasting')) {
        aiResponse = "**Fasting is not required.** Please ensure the patient eats a light, comfortable meal before her appointment to keep her blood sugar stable and reduce anxiety.";
      }
      else if (lowerText.includes('monitor') || lowerText.includes('after') || lowerText.includes('home')) {
        aiResponse = "Once you get home, monitor the biopsy site for any excessive bleeding or severe swelling. The patient should avoid heavy lifting for 24 hours. The results will take 3 to 5 business days and will be sent automatically to Dr. Jenkins.";
      }
      else {
        aiResponse = "I am here to guide you in supporting the patient's care pathway. For medical emergencies or complex questions, please contact the care team or Dr. Jenkins directly. Shall I show you the emergency contacts?";
      }

      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
    }, 600);
  };

  const labData = [
    { date: 'Jan', leukocytes: 6.5, hemoglobin: 13.2 },
    { date: 'Feb', leukocytes: 7.2, hemoglobin: 12.8 },
    { date: 'Mar', leukocytes: 8.5, hemoglobin: 12.5 },
  ];

  const hcBg = highContrast 
    ? 'bg-black text-white border-2 border-yellow-400' 
    : darkMode 
      ? 'bg-gray-900 border border-gray-800 text-gray-100' 
      : 'bg-white border border-gray-200 text-[#2d0a4d]';

  const hcText = highContrast 
    ? 'text-yellow-300' 
    : darkMode 
      ? 'text-gray-100' 
      : 'text-[#64748b]';

  const hcMuted = highContrast 
    ? 'bg-gray-800 border-2 border-yellow-400 text-white' 
    : darkMode 
      ? 'bg-gray-800 border border-gray-700 text-white' 
      : 'bg-[#f8fafc] border border-gray-200 text-[#334155]';
  
  const themeColor = highContrast ? 'yellow-400' : '[#db2777]';
  const themeBg = highContrast ? 'bg-yellow-400' : 'bg-[#db2777]';
  const themeText = highContrast ? 'text-yellow-400' : 'text-[#db2777]';
  const themeBorder = highContrast ? 'border-yellow-400' : 'border-[#db2777]';

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className={`rounded-xl p-10 max-w-sm w-full text-center shadow-sm ${hcBg}`}>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400' : 'bg-[#fdf2f8] border border-pink-200'}`}>
            <Heart className={`w-8 h-8 ${themeText}`} />
          </div>
          <h2 className="text-xl font-medium mb-2">Caregiver Access</h2>
          <p className={`mb-8 text-xs ${hcText}`}>Support the patient's care pathway and monitor legal deadlines.</p>
          <button
            onClick={() => setIsAuthenticated(true)}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 text-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#db2777] hover:bg-[#be185d] text-white'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Authenticate as Caregiver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 relative pb-20 md:pb-0">
      
      {/* FIXED MOBILE NAVIGATION */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex border-t ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'}`}>
        <button
          onClick={() => setActiveTab('pathway')}
          className={`flex-1 py-3 px-1 text-[10px] font-medium transition-all border-b-2 flex flex-col items-center gap-1 ${activeTab === 'pathway'
              ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#db2777] text-[#db2777] bg-pink-50/50')
              : (highContrast ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500 hover:text-[#db2777]')
            }`}
        >
          <Activity className="w-4 h-4" />
          Pathway
        </button>
        <button
          onClick={() => setActiveTab('care')}
          className={`flex-1 py-3 px-1 text-[10px] font-medium transition-all border-b-2 flex flex-col items-center gap-1 ${activeTab === 'care'
              ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#db2777] text-[#db2777] bg-pink-50/50')
              : (highContrast ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500 hover:text-[#db2777]')
            }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Care
        </button>
        <button
          onClick={() => setActiveTab('observations')}
          className={`flex-1 py-3 px-1 text-[10px] font-medium transition-all border-b-2 flex flex-col items-center gap-1 ${activeTab === 'observations'
              ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#db2777] text-[#db2777] bg-pink-50/50')
              : (highContrast ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500 hover:text-[#db2777]')
            }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          Log
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 px-1 text-[10px] font-medium transition-all border-b-2 flex flex-col items-center gap-1 ${activeTab === 'ai'
              ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#db2777] text-[#db2777] bg-pink-50/50')
              : (highContrast ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500 hover:text-[#db2777]')
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className={highContrast && activeTab === 'ai' ? 'text-yellow-400' : ''}>AI</span>
        </button>
      </nav>
      
      <div className="xl:grid xl:grid-cols-12 gap-6">
        
        {/* Left Column: Progress & Agenda */}
        <div className="xl:col-span-4 space-y-6">
          <div className={`rounded-xl p-6 shadow-sm flex flex-col items-center justify-center ${hcBg}`}>
            <h3 className={`font-medium text-sm mb-6 text-center leading-tight ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Patient Timeline Monitor<br/><span className={`text-[10px] uppercase tracking-widest ${hcText}`}>Flow Data (60-Day Limit)</span></h3>
            <div className="relative w-32 h-32 mb-5">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke={highContrast ? 'rgba(255,255,255,0.1)' : '#f1f5f9'} strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={highContrast ? '#facc15' : '#db2777'} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 42/60)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-medium ${themeText}`}>42</span>
                <span className={`text-[9px] font-medium uppercase mt-1 ${hcText}`}>Days Left</span>
              </div>
            </div>
            <div className={`w-full rounded-lg p-3 text-center shadow-sm ${hcMuted}`}>
              <p className={`font-medium text-xs flex items-center justify-center gap-1.5 ${themeText}`}>
                <Check className={`w-4 h-4 ${themeText}`} /> Patient is Compliant
              </p>
              <p className={`text-[10px] mt-1 font-medium ${hcText}`}>The patient's care is safely within limits.</p>
            </div>
          </div>

          <div className={`rounded-xl p-5 shadow-sm ${hcBg}`}>
            <h3 className={`font-medium text-sm flex items-center gap-2 mb-4 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
              <CalendarDays className={`w-4 h-4 ${themeText}`} /> Patient Agenda
            </h3>
            <div className={`grid grid-cols-7 gap-1 text-center mb-2 text-[10px] font-medium ${hcText}`}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className={`grid grid-cols-7 gap-1 text-center text-xs ${highContrast ? 'text-white' : 'text-[#334155]'}`}>
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isHighlight = day === 15; 
                return (
                  <div key={i} className={`p-1.5 rounded-md ${isHighlight ? (highContrast ? 'bg-yellow-400 text-black font-medium shadow-md' : 'bg-[#db2777] text-white font-medium shadow-md') : (highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-100')}`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Content Tabs */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Navigation */}
          <div className={`flex rounded-lg p-1 shadow-sm mb-6 flex-wrap md:flex-nowrap ${hcBg}`}>
            {[
              { id: 'pathway', label: 'Patient Pathway' },
              { id: 'history', label: 'Health Records' },
              { id: 'care', label: 'Care & Support' },
              { id: 'observations', label: 'Observation Log' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id 
                    ? (highContrast ? 'bg-yellow-400 text-black shadow-sm' : (darkMode ? 'bg-[#db2777] text-white shadow-sm border border-pink-400' : 'bg-[#fdf2f8] text-[#db2777] shadow-sm border border-pink-200')) 
                    : (highContrast ? 'text-white hover:text-yellow-300' : 'text-gray-500 hover:text-[#2d0a4d] dark:text-gray-300')
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'ai'
                  ? (highContrast ? 'bg-yellow-400 text-black shadow-sm' : (darkMode ? 'bg-[#db2777] text-white shadow-sm border border-pink-400' : 'bg-[#db2777] text-white shadow-sm border border-[#db2777]'))
                  : (highContrast ? 'text-yellow-400 border border-yellow-400 hover:bg-gray-900' : 'text-[#db2777] hover:bg-gray-100')
                }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> AI Health Assistant
            </button>
          </div>

          {activeTab === 'pathway' && (
            <div className={`rounded-xl p-6 shadow-sm animate-in fade-in ${hcBg}`}>
              <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Patient Flow Organization</h3>
              <p className={`text-[11px] mb-6 ${hcText}`}>Mandatory procedures sequence for the patient</p>
              
              <div className="space-y-3">
                <div className={`flex items-center gap-4 p-3 rounded-lg ${hcMuted}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-white border border-gray-200 text-[#db2777]'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Bilateral Mammography</h4>
                    <p className={`text-[10px] ${hcText}`}>Completed on Mar 10</p>
                  </div>
                </div>

                <div onClick={() => setShowExamSim(true)} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors shadow-sm ${highContrast ? 'bg-black border-2 border-yellow-400 hover:bg-gray-900' : (darkMode ? 'bg-[#db2777] text-white border border-pink-400' : 'bg-[#fdf2f8] border border-pink-200 hover:border-[#db2777]')}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-gray-900 border border-yellow-400 text-yellow-400' : (darkMode ? 'bg-pink-900/50 text-white' : 'bg-white border border-pink-200 text-[#db2777]')}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-[9px] font-medium uppercase flex items-center gap-1 mb-1 ${darkMode ? 'text-white' : themeText}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white' : themeBg}`}></div> Action Required: Escort Patient
                    </span>
                    <h4 className={`font-medium text-xs ${highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}>Core Needle Biopsy</h4>
                    <p className={`text-[10px] mt-0.5 ${hcText}`}>Tomorrow @ 14:00 • Central Hospital</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${hcText}`} />
                </div>
                
                <div className={`flex items-center gap-4 p-3 rounded-lg border border-dashed opacity-70 ${highContrast ? 'border-yellow-400/50 bg-black' : 'border-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-gray-900 border border-yellow-400/50 text-yellow-400/50' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${highContrast ? 'bg-yellow-400/50' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium text-xs ${hcText}`}>Oncologist Follow-up</h4>
                    <p className={`text-[10px] ${highContrast ? 'text-yellow-400/50' : 'text-gray-500'}`}>Awaiting pathology results</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className={`rounded-xl p-6 shadow-sm animate-in fade-in ${hcBg}`}>
              <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Daily Care & Contacts</h3>
              <p className={`text-[11px] mb-6 ${hcText}`}>Manage the patient's medications and emergency network</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className={`font-medium text-xs mb-3 flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
                    <Activity className={`w-4 h-4 ${themeText}`} /> Medication Tracking
                  </h4>
                  <div className={`space-y-4`}>
                    {[
                      { name: 'Tamoxifen 20mg', time: '08:00 AM', desc: '1 pill daily' },
                      { name: 'Vitamin D3 2000 UI', time: '20:00 PM', desc: '1 pill daily' }
                    ].map((med) => (
                      <div 
                        key={med.time}
                        className={`flex flex-col gap-3 p-4 rounded-xl transition-all border ${
                          highContrast ? 'border-yellow-400 bg-black' : darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center shrink-0 ${
                            medsTaken[med.time]
                              ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-[#4c1d95] text-white')
                              : (highContrast ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500')
                          }`}>
                            <Clock className="w-3.5 h-3.5 mb-0.5" />
                            <span className="text-[7px] font-medium leading-none">{med.time.split(' ')[0]}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>{med.name}</h4>
                            <p className={`text-[10px] ${hcText}`}>{med.desc} • Scheduled for {med.time}</p>
                          </div>
                          {medsTaken[med.time] && <CheckCircle2 className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-emerald-400' : 'text-[#4c1d95]'}`} />}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => setMedsTaken(prev => ({ ...prev, [med.time]: !prev[med.time] }))}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                              medsTaken[med.time]
                                ? (highContrast ? 'bg-yellow-400 text-black' : (darkMode ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 'bg-green-100 text-black border border-green-200'))
                                : (highContrast ? 'border border-yellow-400 text-yellow-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50')
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{medsTaken[med.time] ? 'Already Taken' : 'Mark as Taken'}</span>
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedMedForAlarm(med);
                              setShowAlarmPopup(true);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                              medsAlarm[med.time]
                                ? (highContrast ? 'bg-yellow-400 text-black' : (darkMode ? 'bg-purple-900/50 text-purple-400 border border-purple-500/30' : 'bg-purple-100 text-black border border-purple-200'))
                                : (highContrast ? 'border border-gray-700 text-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100')
                            }`}
                          >
                            <Bell className="w-3 h-3" />
                            <span>{medsAlarm[med.time] ? 'Alarm Active' : 'Set Alarm'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium text-xs mb-3 flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
                    <ShieldCheck className={`w-4 h-4 ${themeText}`} /> Emergency Contacts
                  </h4>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-3`}>
                    <div className={`p-3 rounded-lg ${hcMuted}`}>
                      <h4 className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Dr. Sarah Jenkins</h4>
                      <p className={`text-[10px] ${hcText}`}>Primary Oncologist</p>
                      <p className={`text-[11px] font-mono mt-1 ${themeText}`}>+55 11 9999-8888</p>
                    </div>
                    <div className={`p-3 rounded-lg ${hcMuted}`}>
                      <h4 className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Central Hospital</h4>
                      <p className={`text-[10px] ${hcText}`}>Emergency Room 24/7</p>
                      <p className={`text-[11px] font-mono mt-1 ${themeText}`}>+55 11 3333-0000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className={`rounded-xl p-6 shadow-sm animate-in fade-in ${hcBg}`}>
              <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Clinical Data History</h3>
              <p className={`text-[11px] mb-6 ${hcText}`}>Biopsy and staging reports imported via Health Information Exchange (HIE)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`rounded-lg p-4 shadow-sm ${highContrast ? 'bg-gray-900 border-2 border-yellow-400' : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <h4 className={`font-medium text-xs mb-4 flex items-center gap-2 ${highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}>
                    <Activity className={`w-3 h-3 ${highContrast ? 'text-yellow-400' : themeText}`} /> Biomarker Evolution
                  </h4>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={labData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={highContrast ? '#333' : darkMode ? '#475569' : '#e2e8f0'} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : darkMode ? '#e2e8f0' : '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : darkMode ? '#e2e8f0' : '#64748b'}} />
                        <Tooltip contentStyle={highContrast ? {backgroundColor: '#000', color: '#fff', border: '1px solid #facc15'} : darkMode ? { backgroundColor: '#1f2937', color: '#fff', border: '1px solid #4b5563' } : {borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px'}} />
                        <Line type="monotone" dataKey="leukocytes" name="Leukocytes" stroke={highContrast ? '#facc15' : darkMode ? '#fb7185' : '#db2777'} strokeWidth={2} dot={{r: 3}} />
                        <Line type="monotone" dataKey="hemoglobin" name="Hemoglobin" stroke={highContrast ? '#fff' : darkMode ? '#ffffff' : '#be185d'} strokeWidth={2} dot={{r: 3}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`rounded-lg p-4 shadow-sm ${highContrast ? 'bg-gray-900 border-2 border-yellow-400' : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <h4 className={`font-medium text-xs mb-4 flex items-center gap-2 ${highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}>
                    <Activity className={`w-3 h-3 ${highContrast ? 'text-yellow-400' : themeText}`} /> Tumor Marker (CEA)
                  </h4>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { month: 'Jan', level: 2.1 },
                        { month: 'Feb', level: 2.8 },
                        { month: 'Mar', level: 4.2 }
                      ]} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={highContrast ? '#333' : darkMode ? '#475569' : '#e2e8f0'} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: highContrast ? '#facc15' : darkMode ? '#e2e8f0' : '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: highContrast ? '#facc15' : darkMode ? '#e2e8f0' : '#64748b' }} />
                        <Tooltip cursor={{ fill: highContrast ? '#222' : darkMode ? '#374151' : '#f1f5f9' }} contentStyle={highContrast ? { backgroundColor: '#000', color: '#fff', border: '1px solid #facc15' } : darkMode ? { backgroundColor: '#1f2937', color: '#fff', border: '1px solid #4b5563' } : { borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                        <Bar dataKey="level" name="CEA (ng/mL)" fill={highContrast ? '#facc15' : darkMode ? '#fb7185' : '#db2777'} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-lg ${hcMuted}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 ${hcText}`} />
                      <div>
                        <h4 className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Mammography Report</h4>
                        <p className={`text-[10px] ${hcText}`}>Dr. S. J. • Diagnostic Center</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded shadow-sm ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-white border border-gray-200 text-[#475569]'}`}>Mar 10, 2026</span>
                  </div>
                  <p className={`text-[11px] p-3 rounded mt-2 shadow-sm leading-relaxed ${highContrast ? 'bg-black border border-yellow-400 text-white' : 'bg-white border border-gray-200 text-[#334155]'}`}>
                    Findings: Dense breast tissue. Small nodule detected in the upper outer quadrant of the right breast. Biopsy recommended.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'observations' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className={`rounded-xl p-8 shadow-sm ${hcBg}`}>
                <div className="flex items-center gap-3 mb-6">
                  <ClipboardCheck className={`w-6 h-6 text-indigo-500`} />
                  <div>
                    <h3 className="text-lg font-medium">Caregiver Observation Log</h3>
                    <p className={`text-xs ${hcText}`}>Report symptoms to help AI generate proactive medical alerts.</p>
                  </div>
                </div>

                {/* Symptom Selection */}
                <div className="mb-8">
                  <p className="text-[11px] font-medium uppercase tracking-wider mb-4 text-gray-500">Subjective Symptoms Identified:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Mental Confusion', 'Extreme Fatigue', 'Loss of Appetite', 'Persistent Pain', 'Nausea', 'Difficulty Breathing'].map(symptom => {
                      const isSelected = selectedSymptoms.includes(symptom);
                      return (
                        <button
                          key={symptom}
                          onClick={() => {
                            setSelectedSymptoms(prev => 
                              isSelected ? prev.filter(s => s !== symptom) : [...prev, symptom]
                            );
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                            isSelected 
                              ? (highContrast ? 'bg-yellow-400 text-black border-yellow-400 shadow-md' : 'bg-[#db2777] text-white border-[#db2777] shadow-md scale-105') 
                              : (highContrast ? 'bg-black border-yellow-400 text-yellow-400' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#db2777]')
                          }`}
                        >
                          {symptom}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={obsInput}
                    onChange={(e) => setObsInput(e.target.value)}
                    placeholder="Add additional clinical notes or observations..."
                    className={`w-full h-24 p-4 rounded-xl text-xs focus:outline-none transition-all ${
                      highContrast ? 'bg-black border-2 border-yellow-400 text-white' : 'bg-gray-50 border border-gray-200 focus:border-[#db2777] focus:bg-white'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <p className={`text-[10px] ${hcText}`}>* Observations are analyzed by AI and forwarded to the clinical team if critical patterns emerge.</p>
                    <button 
                      onClick={() => {
                        if (selectedSymptoms.length === 0 && !obsInput.trim()) return;
                        const newObs = {
                          id: Date.now(),
                          date: 'Just now',
                          symptoms: selectedSymptoms,
                          note: obsInput,
                          urgent: selectedSymptoms.includes('Difficulty Breathing') || selectedSymptoms.includes('Mental Confusion')
                        };
                        setObservations([newObs, ...observations]);
                        setObsInput('');
                        setSelectedSymptoms([]);
                      }}
                      className={`px-8 py-3 rounded-xl text-sm font-medium transition-all shadow-md active:scale-95 ${
                        highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#db2777] text-white hover:bg-[#be185d]'
                      }`}
                    >
                      Log Observation & Sync
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-medium uppercase tracking-widest text-gray-500 ml-2">Recent Reports</h4>
                {observations.map(obs => (
                  <div key={obs.id} className={`p-6 rounded-xl shadow-sm border-l-4 transition-all hover:translate-x-1 ${obs.urgent ? 'border-red-500' : themeBorder} ${hcBg}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-wrap gap-2">
                        {obs.symptoms.map(s => (
                          <span key={s} className={`px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-tighter ${
                            obs.urgent ? 'bg-red-100 text-red-700' : 'bg-pink-50 text-[#db2777]'
                          }`}>
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className={`text-[10px] font-mono ${hcText}`}>{obs.date}</span>
                    </div>
                    <p className={`text-xs italic leading-relaxed ${highContrast ? 'text-white' : 'text-[#334155]'}`}>"{obs.note}"</p>
                    {obs.urgent && (
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-red-600">
                        <AlertCircle className="w-3.5 h-3.5" /> High Priority Alert generated for Doctor
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className={`rounded-xl shadow-sm flex flex-col h-[600px] animate-in fade-in overflow-hidden ${hcBg}`}>
              <div className={`p-4 flex items-center justify-between border-b ${highContrast ? 'bg-gray-900 border-yellow-400' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#fdf2f8] border-pink-100'}`}>
                <div>
                  <h3 className={`font-medium text-sm flex items-center gap-2 ${highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}><MessageSquare className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : darkMode ? 'text-pink-300' : 'text-[#db2777]'}`} /> AI Health Assistant</h3>
                  <p className={`text-[11px] mt-0.5 ${hcText}`}>Helping you support the patient's journey</p>
                </div>
              </div>
              
              <div className={`flex-1 p-6 overflow-y-auto space-y-4 ${highContrast ? 'bg-black' : darkMode ? 'bg-[#2d0a4d]' : 'bg-white'}`}>
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl shadow-sm max-w-[85%] animate-in fade-in slide-in-from-bottom-2 border ${
                      msg.role === 'ai' 
                        ? `rounded-tl-none ${highContrast ? 'bg-gray-900 border-yellow-400' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f8fafc] border-gray-200'}` 
                        : `rounded-tr-none ml-auto ${highContrast ? 'bg-yellow-400 text-black border-yellow-500' : darkMode ? 'bg-[#9d174d] text-white border-pink-700' : 'bg-[#db2777] text-white border-pink-700'}`
                    }`}
                  >
                    {msg.text.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className={`text-xs leading-relaxed ${idx > 0 ? 'mt-2' : ''} ${msg.role === 'ai' ? (highContrast ? 'text-white' : 'text-[#2d0a4d]') : 'font-medium'}`}>
                        {paragraph.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className={`px-4 pt-3 flex gap-2 overflow-x-auto border-t custom-scrollbar pb-1 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
                {['Do I need to drive her?', 'Can she eat beforehand?', 'What should I monitor?'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-medium transition-colors ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'bg-white border border-[#db2777] text-[#db2777] hover:bg-[#db2777] hover:text-white'}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className={`p-4 ${highContrast ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your question..." 
                    className={`flex-1 rounded-md px-3 py-2 text-xs focus:outline-none ${highContrast ? 'bg-black border border-yellow-400 text-white focus:border-yellow-300' : 'bg-white border border-gray-300 text-[#2d0a4d] focus:border-[#db2777]'}`} 
                  />
                  <button onClick={() => handleSendMessage()} className={`px-4 py-2 rounded-md text-xs font-medium transition-colors shadow-sm flex items-center justify-center ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#db2777] hover:bg-[#be185d] text-white'}`}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ALARM CONFIG POPUP */}
      {showAlarmPopup && selectedMedForAlarm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${hcBg} animate-in zoom-in-95 duration-300`}>
            <div className={`p-6 border-b ${highContrast ? 'border-yellow-400 bg-gray-900' : 'bg-[#2d0a4d] border-white/10'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-medium text-sm ${highContrast ? 'text-yellow-400' : 'text-white'}`}>Configure Support Alarm</h3>
                <button onClick={() => setShowAlarmPopup(false)} className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${hcText}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                <Clock className="w-5 h-5 text-[#4c1d95]" />
                <div>
                  <p className="text-[10px] font-medium text-[#4c1d95] uppercase">Target Task</p>
                  <p className={`text-xs font-medium ${highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}>{selectedMedForAlarm?.name}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-[10px] font-medium uppercase mb-2 ${hcText}`}>Reminder Date</label>
                  <input type="date" defaultValue="2026-04-26" className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${highContrast ? 'bg-black border-yellow-400 text-white' : 'bg-white border-gray-200'}`} />
                </div>
                <div>
                  <label className={`block text-[10px] font-medium uppercase mb-2 ${hcText}`}>Reminder Time</label>
                  <input type="time" defaultValue="08:00" className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${highContrast ? 'bg-black border-yellow-400 text-white' : 'bg-white border-gray-200'}`} />
                </div>
              </div>

              <button 
                onClick={() => { setMedsAlarm(prev => ({ ...prev, [selectedMedForAlarm.time]: true })); setShowAlarmPopup(false); }}
                className={`w-full py-3 rounded-xl text-xs font-medium transition-all ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#db2777] text-white shadow-lg shadow-pink-100'}`}
              >
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXAM SIMULATOR POPUP */}
      {showExamSim && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${hcBg}`}>
            <div className={`p-6 border-b flex items-center justify-between ${highContrast ? 'bg-gray-900' : 'bg-[#2d0a4d] text-white border-b border-white/10'}`}>
              <h3 className="font-medium text-white">Procedure Details</h3>
              <button onClick={() => setShowExamSim(false)}><X className="w-5 h-5 text-white" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center"><Activity className="text-[#db2777]" /></div>
                <div>
                  <h4 className="font-medium">Core Needle Biopsy</h4>
                  <p className="text-xs opacity-70">Scheduled via AI Optimization Hub</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 space-y-4">
                <div className="flex justify-between text-xs"><span>Hospital:</span><span className="font-medium">Central Cancer Institute</span></div>
                <div className="flex justify-between text-xs"><span>Time:</span><span className="font-medium">Tomorrow, 14:00 PM</span></div>
                <div className="flex justify-between text-xs"><span>Instructions:</span><span className="font-medium text-[#db2777]">Wear comfortable clothes</span></div>
              </div>
              <button onClick={() => setShowExamSim(false)} className="w-full py-3 rounded-xl bg-[#db2777] text-white font-medium">Understood</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
