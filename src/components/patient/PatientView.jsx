import { useState, useRef, useEffect } from 'react';
import { Clock, Check, MessageSquare, X, ShieldCheck, Fingerprint, FileText, ChevronRight, Activity, MapPin, AlertCircle, QrCode, CalendarDays, Send } from 'lucide-react';
import { ResponsiveContainer, Tooltip, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function PatientView({ highContrast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('pathway');
  const [showExamSim, setShowExamSim] = useState(false);

  // CHATBOT STATE
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hello Maria. I noticed you just received your Mammography Report. It mentions a "nodule", which is simply the medical term for a small lump. \n\nTo ensure your safety and comply with the 60-Day Legal Mandate, our Smart Scheduler has already expedited a Core Needle Biopsy for tomorrow. Would you like me to explain what happens during a biopsy?'
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

    // Add User Message
    const newMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setInputText('');

    // AI Decision Tree Logic (Simulated delay for realism)
    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      let aiResponse = '';

      if (lowerText.includes('hurt') || lowerText.includes('pain') || lowerText.includes('fast') || lowerText.includes('eat') || lowerText.includes('anesthesia')) {
        aiResponse = "A Core Needle Biopsy is a quick procedure. The doctor will use local anesthesia to numb the area, so you will only feel a small pinch initially, but no sharp pain during the exam.\n\nAlso, **fasting is not required**. You can eat a light meal before you go.";
      } 
      else if (lowerText.includes('result') || lowerText.includes('after') || lowerText.includes('long')) {
        aiResponse = "The biopsy results usually take 3 to 5 business days. Once they are ready, they will be automatically sent to your Oncologist via the Health Information Exchange (HIE), and I will notify you here to schedule your follow-up immediately.";
      }
      else if (lowerText.includes('cancel') || lowerText.includes('reschedule') || lowerText.includes('don\'t want')) {
        aiResponse = "⚠️ **I strongly advise against canceling or rescheduling.** We are coordinating your Care Pathway strictly within the **60-Day Legal Mandate** for cancer diagnosis. Delays can compromise your treatment timeline.\n\nHowever, if it's an absolute emergency, I can connect you to a Human Care Navigator to discuss your options. Shall I?";
      }
      else {
        aiResponse = "I am specialized in navigating your clinical exams and keeping your care pathway safely within the legal timeframe. For other complex questions, would you like me to connect you directly to your Care Navigator?";
      }

      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
    }, 600);
  };

  const labData = [
    { date: 'Jan', leukocytes: 6.5, hemoglobin: 13.2 },
    { date: 'Feb', leukocytes: 7.2, hemoglobin: 12.8 },
    { date: 'Mar', leukocytes: 8.5, hemoglobin: 12.5 },
  ];

  const markerData = [
    { month: 'Jan', level: 5.2 },
    { month: 'Feb', level: 4.8 },
    { month: 'Mar', level: 2.1 },
  ];

  const hcBg = highContrast ? 'bg-black text-white border-2 border-yellow-400' : 'bg-white border border-gray-200 text-[#0f172a]';
  const hcText = highContrast ? 'text-yellow-300' : 'text-[#64748b]';
  const hcMuted = highContrast ? 'bg-gray-900 border-2 border-yellow-400 text-white' : 'bg-[#f8fafc] border border-gray-200 text-[#334155]';

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className={`rounded-xl p-10 max-w-sm w-full text-center shadow-sm ${hcBg}`}>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400' : 'bg-[#f1f5f9] border border-gray-200'}`}>
            <Fingerprint className={`w-8 h-8 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
          </div>

          <p className={`mb-8 text-xs ${hcText}`}>Securely access your Clinical Pathway and Unified Health Records.</p>
          
          <button 
            onClick={() => setIsAuthenticated(true)}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 text-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] hover:bg-[#3b0764] text-white'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Login & Authorize (GDPR)
          </button>
          <p className={`text-[10px] px-2 ${hcText}`}>
            By proceeding, you consent to the secure exchange of your Clinical Data via Health Information Exchange (HIE) / FHIR interoperability standards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 relative pb-20 md:pb-0">
      
      {/* SIMULATOR OVERLAY: Exam Preparation */}
      {showExamSim && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-xl shadow-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${highContrast ? 'bg-black border-2 border-yellow-400' : 'bg-white border border-gray-200'}`}>
            <div className={`p-5 flex justify-between items-center ${highContrast ? 'bg-gray-900 border-b-2 border-yellow-400 text-yellow-400' : 'bg-[#4c1d95] text-white'}`}>
              <div>
                <h3 className={`font-bold text-lg ${highContrast ? 'text-yellow-400' : 'text-white'}`}>Core Needle Biopsy</h3>
                <p className={`text-xs ${highContrast ? 'text-yellow-200' : 'text-gray-400'}`}>Tomorrow @ 14:00</p>
              </div>
              <button onClick={() => setShowExamSim(false)} className={`p-2 rounded-md transition-colors ${highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-800'}`}><X className="w-4 h-4" /></button>
            </div>
            
            <div className={`p-6 space-y-6 overflow-y-auto max-h-[70vh] ${highContrast ? 'bg-black text-white' : 'bg-white'}`}>
              {/* Check-in QR */}
              <div className={`flex flex-col items-center justify-center p-6 rounded-lg ${hcMuted}`}>
                <QrCode className={`w-20 h-20 mb-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`} />
                <p className={`text-xs font-bold ${highContrast ? 'text-yellow-400' : 'text-[#475569]'}`}>Show this code at reception</p>
                <p className={`text-[10px] font-mono mt-1 ${hcText}`}>ID: #993-2026</p>
              </div>

              {/* Instructions */}
              <div>
                <h4 className={`font-bold text-sm flex items-center gap-2 mb-3 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                  <AlertCircle className={`w-4 h-4 ${highContrast ? 'text-red-500' : 'text-[#7f1d1d]'}`} /> Preparation Instructions
                </h4>
                <ul className={`space-y-2 text-xs p-4 rounded-lg shadow-sm ${hcBg}`}>
                  <li className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${highContrast ? 'bg-yellow-400' : 'bg-[#475569]'}`}></div>
                    <span>Fasting is <strong>not required</strong> for this procedure. You may eat a light meal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${highContrast ? 'bg-yellow-400' : 'bg-[#475569]'}`}></div>
                    <span>Do not use deodorant, powder, or lotion under your arms on the day of the exam.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${highContrast ? 'bg-yellow-400' : 'bg-[#475569]'}`}></div>
                    <span>Bring a comfortable sports bra to wear after the procedure.</span>
                  </li>
                </ul>
              </div>

              {/* GPS Simulation */}
              <div>
                <h4 className={`font-bold text-sm flex items-center gap-2 mb-3 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                  <MapPin className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Live Navigation
                </h4>
                <div className={`h-40 rounded-lg w-full relative overflow-hidden ${highContrast ? 'bg-black border border-yellow-400' : 'bg-[#e2e8f0]'}`}>
                  {/* Fake Roads */}
                  <div className={`absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 ${highContrast ? 'bg-gray-900' : 'bg-white'}`}></div>
                  <div className={`absolute top-0 left-1/3 w-8 h-full ${highContrast ? 'bg-gray-900' : 'bg-white'}`}></div>
                  
                  {/* Route Line */}
                  <div className={`absolute top-1/2 left-1/4 w-[33%] h-1 border-t-4 border-dashed ${highContrast ? 'border-yellow-400' : 'border-[#4c1d95]'}`}></div>
                  
                  {/* User Dot */}
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2">
                    <div className="relative flex items-center justify-center">
                      <div className={`absolute w-6 h-6 rounded-full animate-ping opacity-75 ${highContrast ? 'bg-white' : 'bg-blue-500'}`}></div>
                      <div className={`relative w-3 h-3 rounded-full border-2 ${highContrast ? 'bg-white border-black' : 'bg-blue-600 border-white'}`}></div>
                    </div>
                  </div>

                  {/* Destination Marker */}
                  <div className="absolute top-1/2 left-[58%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <MapPin className={`w-8 h-8 drop-shadow-md ${highContrast ? 'text-yellow-400' : 'text-[#7f1d1d]'}`} fill={highContrast ? '#000' : 'currentColor'} />
                    <span className={`font-bold px-2 py-0.5 rounded shadow-lg absolute top-8 text-[9px] whitespace-nowrap z-10 ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-[#0f172a] text-white'}`}>Central Hospital</span>
                  </div>
                  
                  {/* ETA Banner */}
                  <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full shadow-md text-[10px] font-bold flex items-center gap-1.5 ${highContrast ? 'bg-yellow-400 text-black' : 'bg-white text-[#0f172a]'}`}>
                    <Clock className="w-3 h-3" /> ETA 14 mins
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="xl:grid xl:grid-cols-12 gap-6">
        
        {/* Top/Left Section: Progress and Education */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Main Progress Card */}
          <div className={`rounded-xl p-6 shadow-sm flex flex-col items-center justify-center ${hcBg}`}>
            <h3 className={`font-bold text-sm mb-6 text-center leading-tight ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Legal Deadline Thermometer<br/><span className={`text-[10px] uppercase tracking-widest ${hcText}`}>Flow Data (60-Day Limit)</span></h3>
            
            <div className="relative w-32 h-32 mb-5">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke={highContrast ? '#333' : '#f1f5f9'} strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={highContrast ? '#facc15' : '#4c1d95'} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 42/60)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}>42</span>
                <span className={`text-[9px] font-bold uppercase mt-1 ${hcText}`}>Days Left</span>
              </div>
            </div>
            
            <div className={`w-full rounded-lg p-3 text-center shadow-sm ${hcMuted}`}>
              <p className={`font-bold text-xs flex items-center justify-center gap-1.5 ${highContrast ? 'text-yellow-400' : 'text-[#1e293b]'}`}>
                <Check className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Compliant & On Track
              </p>
              <p className={`text-[10px] mt-1 font-medium ${hcText}`}>Your pathway is secure and within limits.</p>
            </div>
          </div>

          <div className={`rounded-xl p-5 shadow-sm ${hcBg}`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 mb-4 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
              <CalendarDays className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> My Agenda
            </h3>
            <div className={`grid grid-cols-7 gap-1 text-center mb-2 text-[10px] font-bold ${hcText}`}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className={`grid grid-cols-7 gap-1 text-center text-xs ${highContrast ? 'text-white' : 'text-[#334155]'}`}>
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isHighlight = day === 15; 
                return (
                  <div key={i} className={`p-1.5 rounded-md ${isHighlight ? (highContrast ? 'bg-yellow-400 text-black font-bold shadow-md' : 'bg-[#4c1d95] text-white font-bold shadow-md') : (highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-100')}`}>
                    {day}
                  </div>
                );
              })}
            </div>
            <div className={`mt-4 rounded-lg p-2 flex items-center gap-2 shadow-sm ${hcBg}`}>
              <div className={`w-2 h-2 rounded-full ${highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]'}`}></div>
              <p className={`text-[10px] font-semibold ${highContrast ? 'text-white' : 'text-[#334155]'}`}>1 Appointment this week</p>
            </div>
          </div>

        </div>

        {/* Right Section: Timeline and Unified Clinical History */}
        <div className="xl:col-span-8 space-y-6 mt-6 xl:mt-0">
          
          {/* Navigation Pills for Patient */}
          <div className={`flex rounded-lg p-1 shadow-sm mb-6 flex-wrap md:flex-nowrap ${hcBg}`}>
            <button 
              onClick={() => setActiveTab('pathway')}
              className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'pathway' 
                  ? (highContrast ? 'bg-yellow-400 text-black shadow-sm' : 'bg-[#f1f5f9] text-[#0f172a] shadow-sm border border-gray-200') 
                  : (highContrast ? 'text-white hover:text-yellow-300' : 'text-[#64748b] hover:text-[#0f172a]')
              }`}
            >
              Integrated Care Pathway
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'history' 
                  ? (highContrast ? 'bg-yellow-400 text-black shadow-sm' : 'bg-[#f1f5f9] text-[#0f172a] shadow-sm border border-gray-200') 
                  : (highContrast ? 'text-white hover:text-yellow-300' : 'text-[#64748b] hover:text-[#0f172a]')
              }`}
            >
              Clinical Records
            </button>
            <button 
              onClick={() => setActiveTab('care')}
              className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'care' 
                  ? (highContrast ? 'bg-yellow-400 text-black shadow-sm' : 'bg-[#f1f5f9] text-[#0f172a] shadow-sm border border-gray-200') 
                  : (highContrast ? 'text-white hover:text-yellow-300' : 'text-[#64748b] hover:text-[#0f172a]')
              }`}
            >
              Care & Support
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 px-4 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'ai' 
                  ? (highContrast ? 'bg-yellow-400 text-black shadow-sm' : 'bg-[#4c1d95] text-white shadow-sm border border-[#4c1d95]') 
                  : (highContrast ? 'text-yellow-400 border border-yellow-400 hover:bg-gray-900' : 'text-[#4c1d95] hover:bg-gray-100')
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> AI Health Assistant
            </button>
          </div>

          {activeTab === 'pathway' && (
            <div className={`rounded-xl p-6 shadow-sm animate-in fade-in ${hcBg}`}>
              <h3 className={`font-bold text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Exam Flow Organization</h3>
              <p className={`text-[11px] mb-6 ${hcText}`}>Mandatory procedures sequence for Breast Cancer</p>
              
              <div className="space-y-3">
                <div className={`flex items-center gap-4 p-3 rounded-lg ${hcMuted}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-white border border-gray-200 text-[#4c1d95]'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Bilateral Mammography</h4>
                    <p className={`text-[10px] ${hcText}`}>Completed on Mar 10</p>
                  </div>
                </div>

                <div onClick={() => setShowExamSim(true)} className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors shadow-sm ${highContrast ? 'bg-black border-2 border-yellow-400 hover:bg-gray-900' : 'bg-white border border-gray-200 hover:border-[#4c1d95]'}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-gray-900 border border-yellow-400 text-yellow-400' : 'bg-[#f8fafc] border border-gray-200 text-[#4c1d95]'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-[9px] font-bold uppercase flex items-center gap-1 mb-1 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]'}`}></div> Smart Scheduling Confirmed
                    </span>
                    <h4 className={`font-semibold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Core Needle Biopsy</h4>
                    <p className={`text-[10px] mt-0.5 ${hcText}`}>Tomorrow @ 14:00 • Central Hospital</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${hcText}`} />
                </div>
                
                <div className={`flex items-center gap-4 p-3 rounded-lg border border-dashed opacity-70 ${highContrast ? 'border-yellow-400/50 bg-black' : 'border-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-gray-900 border border-yellow-400/50 text-yellow-400/50' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${highContrast ? 'bg-yellow-400/50' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-xs ${hcText}`}>Oncologist Follow-up</h4>
                    <p className={`text-[10px] ${highContrast ? 'text-yellow-400/50' : 'text-gray-500'}`}>Awaiting pathology results</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className={`rounded-xl p-6 shadow-sm animate-in fade-in ${hcBg}`}>
              <h3 className={`font-bold text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Clinical Data History</h3>
              <p className={`text-[11px] mb-6 ${hcText}`}>Biopsy and staging reports imported via Health Information Exchange (HIE)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                
                {/* CHART 1: LINE CHART */}
                <div className={`rounded-lg p-4 shadow-sm ${highContrast ? 'bg-gray-900 border-2 border-yellow-400' : 'bg-white border border-gray-200'}`}>
                  <h4 className={`font-semibold text-xs mb-4 flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                    <Activity className={`w-3 h-3 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Biomarker Evolution
                  </h4>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={labData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={highContrast ? '#333' : '#e2e8f0'} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : '#64748b'}} />
                        <Tooltip contentStyle={highContrast ? {backgroundColor: '#000', color: '#fff', border: '1px solid #facc15'} : {borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px'}} />
                        <Line type="monotone" dataKey="leukocytes" name="Leukocytes" stroke={highContrast ? '#facc15' : '#5b21b6'} strokeWidth={2} dot={{r: 3}} />
                        <Line type="monotone" dataKey="hemoglobin" name="Hemoglobin" stroke={highContrast ? '#fff' : '#4c1d95'} strokeWidth={2} dot={{r: 3}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* CHART 2: BAR CHART (NEW) */}
                <div className={`rounded-lg p-4 shadow-sm ${highContrast ? 'bg-gray-900 border-2 border-yellow-400' : 'bg-white border border-gray-200'}`}>
                  <h4 className={`font-semibold text-xs mb-4 flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                    <Activity className={`w-3 h-3 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Tumor Marker (CEA)
                  </h4>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={markerData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={highContrast ? '#333' : '#e2e8f0'} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : '#64748b'}} />
                        <Tooltip cursor={{fill: highContrast ? '#222' : '#f1f5f9'}} contentStyle={highContrast ? {backgroundColor: '#000', color: '#fff', border: '1px solid #facc15'} : {borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px'}} />
                        <Bar dataKey="level" name="CEA (ng/mL)" fill={highContrast ? '#facc15' : '#64748b'} radius={[4, 4, 0, 0]} />
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
                        <h4 className={`font-semibold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Mammography Report</h4>
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

          {activeTab === 'care' && (
            <div className={`rounded-xl p-6 shadow-sm animate-in fade-in ${hcBg}`}>
              <h3 className={`font-bold text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Daily Care & Contacts</h3>
              <p className={`text-[11px] mb-6 ${hcText}`}>Manage your medications and emergency network</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className={`font-semibold text-xs mb-3 flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                    <Activity className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Medication Tracking
                  </h4>
                  <div className={`space-y-3`}>
                    <div className={`flex items-center gap-4 p-3 rounded-lg ${hcMuted}`}>
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-white border border-gray-200 text-[#4c1d95]'}`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Tamoxifen 20mg</h4>
                        <p className={`text-[10px] ${hcText}`}>1 pill daily • Taken at 08:00 AM</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-4 p-3 rounded-lg border border-dashed ${highContrast ? 'border-yellow-400/50 bg-black' : 'border-gray-300 bg-white'}`}>
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${highContrast ? 'bg-gray-900 border border-yellow-400/50 text-yellow-400/50' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Vitamin D3 2000 UI</h4>
                        <p className={`text-[10px] ${hcText}`}>1 pill daily • Scheduled for 20:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold text-xs mb-3 flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                    <ShieldCheck className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Emergency Contacts
                  </h4>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-3`}>
                    <div className={`p-3 rounded-lg ${hcMuted}`}>
                      <h4 className={`font-semibold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Dr. Sarah Jenkins</h4>
                      <p className={`text-[10px] ${hcText}`}>Primary Oncologist</p>
                      <p className={`text-[11px] font-mono mt-1 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}>+55 11 9999-8888</p>
                    </div>
                    <div className={`p-3 rounded-lg ${hcMuted}`}>
                      <h4 className={`font-semibold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Central Hospital</h4>
                      <p className={`text-[10px] ${hcText}`}>Emergency Room 24/7</p>
                      <p className={`text-[11px] font-mono mt-1 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}>+55 11 3333-0000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className={`rounded-xl shadow-sm flex flex-col h-[600px] animate-in fade-in overflow-hidden ${hcBg}`}>
              <div className={`p-4 flex items-center justify-between border-b ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
                <div>
                  <h3 className={`font-bold text-sm flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}><MessageSquare className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> AI Health Assistant</h3>
                  <p className={`text-[11px] mt-0.5 ${hcText}`}>Translating clinical jargon to plain language</p>
                </div>
              </div>
              
              <div className={`flex-1 p-6 overflow-y-auto space-y-4 ${highContrast ? 'bg-black' : 'bg-white'}`}>
                
                {messages.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-xl shadow-sm max-w-[85%] animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'ai' ? `rounded-tl-none ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-[#f1f5f9] border border-gray-200'}` : `rounded-tr-none ml-auto ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#4c1d95] text-white'}`}`}>
                    {msg.text.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className={`text-xs leading-relaxed ${idx > 0 ? 'mt-2' : ''} ${msg.role === 'ai' ? (highContrast ? 'text-white' : 'text-[#0f172a]') : 'font-bold'}`}>
                        {/* Simple bold parser for AI messages */}
                        {paragraph.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Pills */}
              <div className={`px-4 pt-3 flex gap-2 overflow-x-auto border-t custom-scrollbar pb-1 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
                {['Does it hurt?', 'What happens after?', 'I want to cancel it'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'bg-white border border-[#4c1d95] text-[#4c1d95] hover:bg-[#4c1d95] hover:text-white'}`}
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
                    className={`flex-1 rounded-md px-3 py-2 text-xs focus:outline-none ${highContrast ? 'bg-black border border-yellow-400 text-white focus:border-yellow-300' : 'bg-white border border-gray-300 text-[#0f172a] focus:border-[#4c1d95]'}`} 
                  />
                  <button onClick={() => handleSendMessage()} className={`px-4 py-2 rounded-md text-xs font-bold transition-colors shadow-sm flex items-center justify-center ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] hover:bg-[#3b0764] text-white'}`}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
