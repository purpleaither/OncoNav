import { useState, useMemo } from 'react';
import { Bookmark, CheckCircle2, FileJson, Video, ClipboardCheck, X, Mic, Camera, MonitorUp, PhoneOff, User, CalendarPlus, ArrowRight, CalendarDays, AlertTriangle, Check, Filter, ArrowUpDown, Stethoscope, ShieldCheck, Activity, Clock } from 'lucide-react';

export default function ProfessionalView({ highContrast, darkMode, isAuthenticated, setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showTeleSim, setShowTeleSim] = useState(false);
  const [showScheduleSim, setShowScheduleSim] = useState(false);
  const [aiChatView, setAiChatView] = useState(false);

  const [aiSqueezeStatus, setAiSqueezeStatus] = useState('pending'); // pending, accepted, rejected
  const [calendarView, setCalendarView] = useState('week'); // day, week, month, year
  
  const [filterPathway, setFilterPathway] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showPatientSim, setShowPatientSim] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [dragError, setDragError] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'ai',
      content: (
        <>
          Doctor, I've analyzed M. S.'s pathway and your current workload. Since there are only <strong>2 days left</strong> until the 60-day mandate breach, I have identified the following viable slots that maintain safety and compliance.
          <br /><br />
          Which option works best for you?
        </>
      ),
      text: 'initial'
    }
  ]);

  const aiResponses = [
    {
      keywords: ['tuesday', 'tue', '11', 'confirm', 'book', 'first'],
      reply: (<>Perfect. I am scheduling <strong>Biopsy #84729</strong> for <strong>Tuesday at 11:00 AM</strong>. The patient will receive an automated notification via the Health Information Exchange. The slot has been flagged as mandate-critical. Do you need me to also alert the biopsy suite coordinator?</>)
    },
    {
      keywords: ['wednesday', 'wed', '8', '08', 'morning'],
      reply: (<>Wednesday at <strong>08:00 AM</strong> is viable but note that it requires rescheduling the Admin / Logs slot currently in that position. Shall I proceed and move it to a later time the same day?</>)
    },
    {
      keywords: ['wednesday', 'wed', '15', 'afternoon', 'backup'],
      reply: (<>The <strong>Wednesday 15:00 PM</strong> slot is an emergency backup. The biopsy suite will be shared with another procedure. I recommend this only if neither of the first two options are possible. Shall I lock it in anyway?</>)
    },
    {
      keywords: ['yes', 'ok', 'proceed', 'go ahead', 'alert', 'coordinator', 'notify'],
      reply: (<>Done. The biopsy suite coordinator has been notified. The HIE record for <strong>M. S. (ID: #84729)</strong> has been updated. A compliance timestamp has been logged. You are now within the <strong>60-Day Mandate</strong> safety window. Is there anything else you need?</>)
    },
    {
      keywords: ['risk', 'safe', 'mandate', 'compliance', 'legal'],
      reply: (<>Patient M. S. currently has <strong>2 days left</strong> on the 60-Day Oncology Legal Mandate. Failure to schedule within this window would trigger an automatic breach flag and regulatory review. All three suggested slots fall within the safe compliance zone.</>)
    },
    {
      keywords: ['patient', 'who', 'ms', 'm.s', 'profile'],
      reply: (<>M. S. is a <strong>42-year-old</strong> female with a confirmed Breast Cancer pathway (ID: #84729). She is flagged as <strong>Critical Risk</strong>. Her primary diagnostic was completed on 12 March. The current bottleneck is the Core Needle Biopsy which remains unscheduled.</>)
    },
    {
      keywords: ['cancel', 'no', 'skip', 'ignore'],
      reply: (<>Understood. I have paused the scheduling request. Please note that not scheduling within the next <strong>2 days</strong> will trigger a mandatory breach notification to the compliance office. I can re-initiate this request at any time.</>)
    }
  ];

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput, text: chatInput };
    const lower = chatInput.toLowerCase();
    const match = aiResponses.find(r => r.keywords.some(k => lower.includes(k)));
    const aiReply = {
      role: 'ai',
      content: match?.reply || (<>I understand. As the AI Clinical Assistant, I can help with scheduling, mandate compliance, patient profiles, and slot availability. Could you rephrase your question?</>),
      text: 'response'
    };
    setChatMessages(prev => [...prev, userMsg, aiReply]);
    setChatInput('');
  };

  const timeSlots = ['08:00 AM', '09:30 AM', '11:00 AM', '13:30 PM', '15:00 PM'];

  // UNIFIED CALENDAR STATE
  const [appointments, setAppointments] = useState([
    { id: '1', title: 'Primary Consult', day: 0, time: '08:00 AM', color: 'purple', limit: 4 },
    { id: '2', title: 'Biopsy #54321', day: 0, time: '09:30 AM', color: 'purple', limit: 4 },
    { id: '3', title: 'Admin / Logs', day: 0, time: '13:30 PM', color: 'gray', limit: 4 },
    { id: '4', title: 'Post-op Review', day: 0, time: '15:00 PM', color: 'purple', limit: 4 },
    
    { id: '5', title: 'Biopsy #84729', day: 1, time: '09:30 AM', color: 'purple', limit: 4 },
    { id: '6', title: 'Oncology Meeting', day: 1, time: '13:30 PM', color: 'gray', limit: 4 },

    { id: '7', title: 'Tele-Consult', day: 2, time: '08:00 AM', color: 'purple-dark', limit: 4 },
    { id: '8', title: 'Tele-Consult', day: 2, time: '09:30 AM', color: 'purple-dark', limit: 4 },
    { id: '9', title: 'Biopsy #11223', day: 2, time: '13:30 PM', color: 'purple', limit: 4 },
    { id: '10', title: 'Biopsy #67890', day: 2, time: '15:00 PM', color: 'purple', limit: 4 },

    { id: '11', title: 'Clinical Board', day: 3, time: '09:30 AM', color: 'gray', limit: 4 },
    { id: '12', title: 'Exam Reviews', day: 3, time: '13:30 PM', color: 'gray', limit: 4 },

    { id: '13', title: 'Biopsy #10293', day: 4, time: '09:30 AM', color: 'purple', limit: 4 },
    { id: '14', title: 'Consult Follow-up', day: 4, time: '15:00 PM', color: 'purple', limit: 4 },
  ]);

  const patientsList = [
    { id: '#84729', name: 'M. S.', pathway: 'Breast Cancer', status: 'Critical Risk', mandate: '2 Days Left', daysLeft: 2, highlight: true },
    { id: '#10293', name: 'N. R.', pathway: 'Breast Cancer', status: 'Elevated Risk', mandate: '12 Days Left', daysLeft: 12, highlight: false },
    { id: '#93847', name: 'E. F.', pathway: 'Lung Cancer', status: 'On Track', mandate: '45 Days Left', daysLeft: 45, highlight: false },
    { id: '#54321', name: 'C. M.', pathway: 'Prostate Cancer', status: 'Elevated Risk', mandate: '18 Days Left', daysLeft: 18, highlight: false },
    { id: '#67890', name: 'A. S.', pathway: 'Cervical Cancer', status: 'Critical Risk', mandate: '5 Days Left', daysLeft: 5, highlight: false },
    { id: '#24680', name: 'R. L.', pathway: 'Colon Cancer', status: 'On Track', mandate: '30 Days Left', daysLeft: 30, highlight: false },
    { id: '#13579', name: 'F. C.', pathway: 'Breast Cancer', status: 'On Track', mandate: '50 Days Left', daysLeft: 50, highlight: false },
    { id: '#11223', name: 'J. C.', pathway: 'Lung Cancer', status: 'Elevated Risk', mandate: '14 Days Left', daysLeft: 14, highlight: false },
    { id: '#44556', name: 'P. G.', pathway: 'Thyroid Cancer', status: 'Critical Risk', mandate: '1 Day Left', daysLeft: 1, highlight: false },
    { id: '#77889', name: 'R. A.', pathway: 'Prostate Cancer', status: 'On Track', mandate: '40 Days Left', daysLeft: 40, highlight: false }
  ];

  const filteredPatients = useMemo(() => {
    let result = patientsList;
    if (filterPathway !== 'All') result = result.filter(p => p.pathway === filterPathway);
    if (filterRisk !== 'All') {
      if (filterRisk === 'Critical') result = result.filter(p => p.daysLeft <= 5);
      if (filterRisk === 'Elevated') result = result.filter(p => p.daysLeft > 5 && p.daysLeft <= 20);
      if (filterRisk === 'On Track') result = result.filter(p => p.daysLeft > 20);
    }
    result = result.sort((a, b) => sortOrder === 'asc' ? a.daysLeft - b.daysLeft : b.daysLeft - a.daysLeft);
    return result;
  }, [filterPathway, filterRisk, sortOrder]);

  const handleOpenPatientSim = (p) => {
    // Map ProfessionalView patient structure to Simulator structure
    const mappedPatient = {
      ...p,
      type: p.status === 'Critical Risk' ? 'red' : p.status === 'Elevated Risk' ? 'yellow' : 'green'
    };
    setSelectedPatient(mappedPatient);
    setShowPatientSim(true);
  };

  const acceptSqueezeIn = () => {
    setAiSqueezeStatus('accepted');
    setAppointments(prev => [...prev, {
      id: 'sq1', title: 'Biopsy #44556', day: 1, time: '11:00 AM', color: 'yellow', limit: 2, isOverbook: true
    }]);
  };

  const handleDrop = (e, targetDay, targetTime) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('id');
    const draggedApp = appointments.find(a => a.id === draggedId);
    
    if (!draggedApp) return;

    // Check Legal Mandate limit
    if (targetDay > draggedApp.limit) {
      setDragError(`Cannot move "${draggedApp.title}" to this date. It exceeds the 60-Day Legal Mandate deadline.`);
      setTimeout(() => setDragError(null), 3500);
      return;
    }

    setAppointments(prev => prev.map(a => 
      a.id === draggedId ? { ...a, day: targetDay, time: targetTime } : a
    ));
  };

  const hcBg = highContrast 
    ? 'bg-black text-white border-2 border-yellow-400' 
    : darkMode 
      ? 'bg-gray-900 border border-gray-800 text-gray-100' 
      : 'bg-white border border-gray-200 text-[#0f172a]';

  const hcText = highContrast 
    ? 'text-yellow-300' 
    : darkMode 
      ? 'text-gray-400' 
      : 'text-[#64748b]';

  const hcMuted = highContrast 
    ? 'bg-gray-800 border-2 border-yellow-400 text-white' 
    : darkMode 
      ? 'bg-gray-800 border border-gray-700 text-gray-200' 
      : 'bg-[#f8fafc] border border-gray-200 text-[#334155]';

  const getColorClasses = (color, isOverbook) => {
    if (isOverbook) return highContrast ? 'bg-yellow-400/20 border-yellow-400 text-white' : 'bg-[#f8fafc] border border-[#4c1d95] border-l-[#4c1d95]';
    if (color === 'purple') return highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-[#f8fafc] border border-gray-200 border-l-[#4c1d95]';
    if (color === 'purple-dark') return highContrast ? 'bg-gray-900 border-yellow-400 text-white' : 'bg-[#f8fafc] border border-gray-200 border-l-[#6b21a8]';
    if (color === 'gray') return highContrast ? 'bg-gray-900 border-yellow-400 text-white opacity-60' : 'bg-[#f8fafc] border border-gray-200 border-l-[#94a3b8]';
    if (color === 'yellow') return highContrast ? 'bg-yellow-400/20 border-yellow-400 text-white' : 'bg-[#f8fafc] border border-[#d97706] border-l-[#d97706]';
    return '';
  };

  const getTextColor = (color, isOverbook) => {
    if (isOverbook) return highContrast ? 'text-yellow-400' : 'text-[#4c1d95]';
    if (color === 'purple') return highContrast ? 'text-yellow-400' : 'text-[#4c1d95]';
    if (color === 'purple-dark') return highContrast ? 'text-yellow-400' : 'text-[#6b21a8]';
    if (color === 'gray') return highContrast ? 'text-yellow-400' : 'text-[#64748b]';
    if (color === 'yellow') return highContrast ? 'text-yellow-400' : 'text-[#d97706]';
    return '';
  };

  if (showTeleSim) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col md:flex-row">
        <div className="flex-1 relative flex flex-col items-center justify-center bg-[#0f172a] border-r border-gray-800">
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-md border border-gray-800">
            <div className="w-2 h-2 bg-[#7f1d1d] rounded-full animate-pulse"></div>
            <span className="font-medium text-[10px] tracking-widest text-gray-300">REC</span>
            <span className="ml-2 font-mono text-gray-300 text-xs">00:14:32</span>
          </div>
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="text-center">
              <User className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <h2 className="text-sm font-medium text-gray-300">Dr. S. J. (Primary Care)</h2>
            </div>
          </div>
          <div className="absolute bottom-0 w-full bg-[#0f172a] p-4 flex justify-center gap-3 border-t border-gray-800">
            <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-md"><Mic className="w-5 h-5 text-gray-300" /></button>
            <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-md"><Camera className="w-5 h-5 text-gray-300" /></button>
            <button onClick={() => setShowTeleSim(false)} className="p-3 bg-[#7f1d1d] hover:bg-red-900 rounded-md"><PhoneOff className="w-5 h-5 text-white" /></button>
          </div>
        </div>

        <div className={`w-full md:w-[400px] flex flex-col h-full ${highContrast ? 'bg-black border-l-2 border-yellow-400 text-white' : 'bg-white text-[#0f172a]'}`}>
          <div className={`p-5 flex items-center justify-between border-b ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
            <div>
              <h3 className="font-medium text-sm">Unified Patient Record</h3>
              <p className={`text-[10px] ${hcText}`}>HIE Live Sync (FHIR)</p>
            </div>
            <button onClick={() => setShowTeleSim(false)} className="hover:opacity-70"><X className="w-4 h-4"/></button>
          </div>
          <div className={`flex-1 overflow-y-auto p-5 space-y-5 ${highContrast ? 'bg-black' : 'bg-white'}`}>
            <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${hcBg}`}>
              <div className={`w-10 h-10 rounded-md flex items-center justify-center font-medium text-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#f1f5f9] text-[#4c1d95] border border-gray-200'}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">M. S.</h4>
                <p className={`text-[10px] ${hcText}`}>ID: #84729 • 42 y.o</p>
              </div>
            </div>
            <textarea 
              className={`w-full h-32 p-3 text-xs rounded-lg resize-none shadow-sm focus:outline-none ${highContrast ? 'bg-gray-900 border-2 border-yellow-400 text-white focus:border-yellow-300' : 'bg-white border border-gray-200 text-[#0f172a] focus:border-[#4c1d95]'}`}
              defaultValue="Discussing biopsy results. Expediting procedures to meet Mandate deadline."
            ></textarea>
            <button onClick={() => setShowTeleSim(false)} className={`w-full py-3 rounded-lg text-xs font-medium shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}>
              Sign & Save to HIE
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className={`rounded-xl p-10 max-w-sm w-full text-center shadow-sm ${hcBg}`}>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400' : 'bg-red-50 border border-red-100'}`}>
            <Stethoscope className={`w-8 h-8 ${highContrast ? 'text-yellow-400' : 'text-[#7f1d1d]'}`} />
          </div>

          <h2 className="text-xl font-medium mb-2">Clinical Access</h2>
          <p className={`mb-8 text-xs ${hcText}`}>Clinical Staff Authentication Required. Accessing Patient Pathways via HIE.</p>

          <button
            onClick={() => setIsAuthenticated(true)}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 text-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#7f1d1d] hover:bg-[#450a0a] text-white shadow-md shadow-red-100'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Clinical Login & Authorize
          </button>
          <p className={`text-[10px] px-2 ${hcText}`}>
            By proceeding, you verify your credentials for health record access under HIPAA/HITECH auditing rules.
          </p>
        </div>
      </div>
    );
  }

  const handleOpenSchedule = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setAiChatView(false); // Reset to main view
    setShowScheduleSim(true);
  };

  return (
    <div className="animate-in fade-in duration-500 relative pb-20 md:pb-0">

      {/* PATIENT SIMULATOR */}
      {showPatientSim && selectedPatient && (
        <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm flex justify-end">
          <div className={`${highContrast ? 'bg-black border-l-2 border-yellow-400 text-white' : darkMode ? 'bg-gray-900 border-l border-gray-800 text-gray-100' : 'bg-[#f8fafc] border-l border-gray-200 text-[#0f172a]'} w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300`}>
            <div className={`px-6 py-5 flex items-center justify-between border-b sticky top-0 z-10 shadow-sm ${highContrast ? 'bg-gray-900 border-yellow-400' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div>
                <h3 className="font-medium text-lg">Patient 360º View</h3>
                <p className={`text-xs ${hcText}`}>Flow Data Trace & Legal Deadlines</p>
              </div>
              <button onClick={() => setShowPatientSim(false)} className="hover:opacity-70 p-2 rounded-md"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className={`flex items-center gap-4 p-5 rounded-xl shadow-sm ${hcBg}`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-medium text-lg ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-[#f1f5f9] text-[#475569] border border-gray-200'}`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-medium">{selectedPatient.name}</h4>
                  <p className={`text-xs ${hcText}`}>ID: {selectedPatient.id} • Pathway: {selectedPatient.pathway}</p>
                  
                  <div className={`mt-2 flex items-center gap-1.5`}>
                    <div className={`w-2 h-2 rounded-full ${selectedPatient.type === 'red' ? 'bg-[#7f1d1d]' : selectedPatient.type === 'yellow' ? 'bg-[#d97706]' : 'bg-[#5b21b6]'}`}></div>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${highContrast ? 'text-white' : 'text-[#334155]'}`}>
                      {selectedPatient.type === 'red' ? `Critical Risk (${selectedPatient.daysLeft} Days)` : selectedPatient.type === 'yellow' ? `Elevated Risk (${selectedPatient.daysLeft} Days)` : 'On Track'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-6 shadow-sm ${hcBg}`}>
                <h4 className="font-medium text-sm mb-5">Flow Data Sequence</h4>
                <div className={`space-y-4 relative before:absolute before:inset-0 before:ml-4 before:h-full before:w-px ${highContrast ? 'before:bg-yellow-400/30' : 'before:bg-gray-200'}`}>
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 shrink-0 z-10 shadow-sm ${highContrast ? 'border-black bg-yellow-400 text-black' : 'border-white bg-gray-100 text-[#4c1d95]'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className={`p-4 rounded-lg flex-1 ${hcMuted}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-xs">Primary Diagnostics</div>
                        <div className={`text-[10px] font-medium px-2 py-0.5 rounded shadow-sm ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-white border border-gray-100 text-[#64748b]'}`}>12 Mar</div>
                      </div>
                      <div className={`text-[11px] mt-2 ${hcText}`}>Clinical Data imported via Basic Health Unit API. Result: Positive.</div>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 shrink-0 z-10 shadow-sm ${highContrast ? 'border-black bg-black border-2 border-yellow-400 text-yellow-400' : 'border-white bg-white border-2 border-gray-200 text-[#5b21b6]'}`}>
                      {selectedPatient.type === 'green' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 text-[#7f1d1d]" />}
                    </div>
                    <div className={`p-4 rounded-lg flex-1 ${hcMuted}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-xs">Secondary Biopsy</div>
                        <div className={`text-[9px] font-medium uppercase tracking-widest ${selectedPatient.type === 'green' ? (highContrast ? 'text-yellow-400' : 'text-[#5b21b6]') : 'text-[#7f1d1d]'}`}>{selectedPatient.type === 'green' ? 'COMPLETED' : 'PENDING'}</div>
                      </div>
                      <div className={`text-[11px] mt-2 ${hcText}`}>
                        {selectedPatient.type === 'green' ? 'Procedure performed within legal limits.' : 'Flow Data shows procedure is holding up the Care Pathway causing potential 60-Day Mandate breach.'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED MOBILE NAVIGATION */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden flex border-t ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'}`}>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-3 px-1 text-[10px] font-medium transition-all border-b-2 flex flex-col items-center gap-1 ${activeTab === 'calendar'
              ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#4c1d95] text-[#4c1d95] bg-purple-50/50')
              : (highContrast ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500 hover:text-[#4c1d95]')
            }`}
        >
          <CalendarDays className="w-4 h-4" />
          Agenda
        </button>
        <button
          onClick={() => setActiveTab('pathways')}
          className={`flex-1 py-3 px-1 text-[10px] font-medium transition-all border-b-2 flex flex-col items-center gap-1 ${activeTab === 'pathways'
              ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#4c1d95] text-[#4c1d95] bg-purple-50/50')
              : (highContrast ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500 hover:text-[#4c1d95]')
            }`}
        >
          <User className="w-4 h-4" />
          Patients
        </button>
      </nav>

      {/* DRAG ERROR TOAST */}
      {dragError && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] animate-in slide-in-from-top-4">
          <div className={`px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border-2 ${highContrast ? 'bg-black border-red-500 text-red-500' : 'bg-red-50 border-red-200 text-[#7f1d1d]'}`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs font-medium">{dragError}</span>
          </div>
        </div>
      )}

      {/* Pill Navigation */}
      <div className={`flex shadow-sm rounded-lg p-1 mb-6 w-fit max-w-full overflow-x-auto ${hcBg}`}>
        {[
          { id: 'calendar', label: 'Clinical Agenda (Calendar)' },
          { id: 'pathways', label: 'My Patients (10)' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.id 
                ? (highContrast ? 'bg-yellow-400 text-black' : (darkMode ? 'bg-[#4c1d95] text-white shadow-sm border border-purple-400' : 'bg-[#f1f5f9] text-[#0f172a] shadow-sm border border-gray-200')) 
                : (highContrast ? 'text-white hover:text-yellow-300' : 'text-[#64748b] hover:text-[#0f172a]')
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <div className={`rounded-xl p-6 shadow-sm overflow-hidden ${hcBg}`}>
              <div className={`flex justify-between items-center mb-6 border-b pb-4 ${highContrast ? 'border-yellow-400/30' : 'border-gray-100'}`}>
                <h3 className={`font-medium flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                  <CalendarDays className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Schedule ({calendarView.charAt(0).toUpperCase() + calendarView.slice(1)})
                </h3>
                
                {/* View Toggles */}
                <div className={`flex p-1 rounded-lg shadow-sm ${highContrast ? 'bg-gray-900 border border-yellow-400' : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'}`}>
                  {['Day', 'Week', 'Month', 'Year'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setCalendarView(v.toLowerCase())}
                      className={`text-[10px] px-3 py-1.5 rounded-md font-medium transition-colors ${
                        calendarView === v.toLowerCase() 
                          ? (highContrast ? 'bg-yellow-400 text-black' : (darkMode ? 'bg-[#4c1d95] text-white shadow-sm border border-purple-400' : 'bg-white text-[#4c1d95] shadow-sm border border-gray-200')) 
                          : (highContrast ? 'text-white hover:text-yellow-300' : 'text-[#64748b] hover:text-[#0f172a]')
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Conditional Calendar Renders */}
              {calendarView === 'day' && (
                <div className={`h-[500px] flex flex-col rounded-xl overflow-hidden ${hcMuted}`}>
                  <div className={`border-b p-4 text-center font-medium text-sm ${highContrast ? 'bg-gray-900 border-yellow-400 text-yellow-400' : 'bg-[#f8fafc] border-gray-200 text-[#0f172a]'}`}>Today's Timeline (Monday)</div>
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {timeSlots.map(timeStr => {
                      const app = appointments.find(a => a.day === 0 && a.time === timeStr);
                      return (
                        <div key={timeStr} className="flex items-center gap-6">
                          <span className={`w-16 text-[12px] font-medium uppercase tracking-tighter ${hcText}`}>{timeStr.split(' ')[0]}</span>
                          {app ? (
                            <div className={`flex-1 p-4 rounded-xl shadow-md border-l-4 transition-all hover:scale-[1.01] ${getColorClasses(app.color, app.isOverbook)}`}>
                              <p className="text-sm font-medium leading-tight">{app.title}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className={`text-[10px] font-medium opacity-80 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Patient Visit • ID #{80000 + Math.floor(Math.random()*9000)}</span>
                                {app.isOverbook && <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium animate-pulse">OVERBOOK</span>}
                              </div>
                            </div>
                          ) : (
                            <div className={`flex-1 border p-4 rounded-xl text-[11px] font-medium flex items-center justify-center transition-colors ${highContrast ? 'border-yellow-400/20 bg-black/40 text-yellow-400/20' : 'border-gray-100 bg-[#f8fafc] text-gray-300'}`}>
                              Available Slot
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {calendarView === 'week' && (
                <div className="grid grid-cols-5 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((dayName, dayIndex) => (
                    <div key={dayName} className="flex flex-col gap-3">
                      <div className={`text-center font-medium text-xs border-b pb-3 uppercase tracking-widest ${highContrast ? 'border-yellow-400/30 text-yellow-300' : 'border-gray-200 text-[#64748b]'}`}>{dayName}</div>
                      
                      <div className="space-y-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {timeSlots.map(timeStr => {
                          const app = appointments.find(a => a.day === dayIndex && a.time === timeStr);
                          
                          if (app) {
                            return (
                              <div 
                                key={app.id}
                                draggable 
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('id', app.id);
                                  e.dataTransfer.effectAllowed = 'move';
                                }}
                                className={`p-4 rounded-xl shadow-md border-l-4 cursor-move hover:opacity-90 transition-all hover:scale-[1.02] ${app.isOverbook ? 'shadow-lg animate-in fade-in zoom-in ring-2 ring-red-500 ring-offset-2 ring-offset-transparent' : ''} ${getColorClasses(app.color, app.isOverbook)}`}
                              >
                                <span className={`text-[11px] font-medium block mb-1 ${getTextColor(app.color, app.isOverbook)}`}>{app.time} {app.isOverbook && '(!) OVERBOOK'}</span>
                                <p className={`text-[12px] font-medium leading-tight ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>{app.title}</p>
                              </div>
                            );
                          } else {
                            return (
                              <div 
                                key={timeStr}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, dayIndex, timeStr)}
                                className={`border p-4 rounded-xl h-[80px] flex items-center justify-center transition-all ${highContrast ? 'border-yellow-400/20 bg-black/40 hover:bg-yellow-400/10' : 'border-gray-100 bg-[#f8fafc] hover:bg-gray-50'}`}
                              >
                                <span className={`text-[11px] font-medium uppercase tracking-tighter ${highContrast ? 'text-yellow-400/20' : 'text-gray-300'}`}>{timeStr.split(' ')[0]}</span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {calendarView === 'month' && (
                <div className={`h-[500px] rounded-xl overflow-hidden flex flex-col ${hcMuted}`}>
                  <div className={`grid grid-cols-7 border-b p-3 text-center text-[11px] font-medium uppercase tracking-widest ${highContrast ? 'bg-gray-900 border-yellow-400 text-yellow-400' : 'bg-[#f8fafc] border-gray-200 text-[#64748b]'}`}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 flex-1">
                    {Array.from({ length: 35 }).map((_, i) => {
                      let dayAppointments = [];
                      if (i >= 15 && i <= 19) {
                        const weekDay = i - 15;
                        dayAppointments = appointments.filter(a => a.day === weekDay);
                      }

                      return (
                        <div key={i} className={`border-r border-b p-2 flex flex-col transition-colors hover:bg-gray-50/50 ${highContrast ? 'border-yellow-400/30' : 'border-gray-100'} ${i < 3 || i > 33 ? (highContrast ? 'bg-gray-900' : 'bg-gray-50') : (highContrast ? 'bg-black' : 'bg-white')}`}>
                          <div className={`text-[11px] font-medium mb-2 ${highContrast ? 'text-yellow-400/50' : 'text-gray-400'}`}>{i + 1}</div>
                          <div className="flex-1 space-y-1 overflow-hidden">
                            {dayAppointments.map(app => (
                              <div key={app.id} className={`w-full h-1.5 rounded-full shadow-sm ${app.color === 'purple' ? (highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]') : app.color === 'purple-dark' ? (highContrast ? 'bg-yellow-600' : 'bg-[#6b21a8]') : app.color === 'gray' ? (highContrast ? 'bg-yellow-400/50' : 'bg-[#94a3b8]') : (highContrast ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-[#d97706]')}`}></div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {calendarView === 'year' && (
                <div className="h-[500px] grid grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <div key={month} className={`rounded-xl p-4 transition-all hover:shadow-md ${hcMuted}`}>
                      <div className={`font-medium text-xs mb-3 uppercase tracking-tighter ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}>{month} 2026</div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const hasApps = (i >= 10 && i <= 14); // Simulate 3rd week with apps
                          return (
                            <div key={i} className={`aspect-square rounded-sm ${hasApps ? (highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]') : (highContrast ? 'bg-yellow-400/10' : 'bg-gray-100')}`}></div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          <div className="xl:col-span-4">
            {aiSqueezeStatus === 'pending' && (
              <div className={`rounded-xl shadow-sm overflow-hidden border-t-4 animate-in slide-in-from-right-4 ${highContrast ? 'bg-black border-2 border-t-8 border-red-500 text-white' : 'bg-white border border-gray-200 border-t-[#7f1d1d]'}`}>
                <div className={`p-5 border-b flex items-start gap-3 ${highContrast ? 'border-red-500/30' : 'border-gray-100'}`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${highContrast ? 'text-red-500' : 'text-[#7f1d1d]'}`} />
                  <div>
                    <h4 className={`font-medium text-sm ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>AI Squeeze-in Request</h4>
                    <p className={`text-xs mt-2 leading-relaxed ${hcText}`}>
                      Patient <strong>P. G.</strong> is 1 day away from breaching the 60-Day Mandate. Can you overbook her Biopsy for tomorrow (Tue) at 11:00 AM?
                    </p>
                  </div>
                </div>
                <div className={`p-4 flex gap-3 ${highContrast ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
                  <button onClick={acceptSqueezeIn} className={`flex-1 text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400' : 'bg-white hover:bg-gray-50 text-[#0f172a] border border-gray-200'}`}>
                    <Check className={`w-4 h-4 ${highContrast ? 'text-black' : 'text-[#7f1d1d]'}`} /> Accept
                  </button>
                  <button onClick={() => setAiSqueezeStatus('rejected')} className={`flex-1 text-xs font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-black text-yellow-400 hover:bg-gray-800 border-2 border-yellow-400' : 'bg-white hover:bg-gray-50 text-[#64748b] border border-gray-200'}`}>
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            )}

            {aiSqueezeStatus === 'accepted' && (
              <div className={`rounded-xl shadow-sm overflow-hidden border-t-4 animate-in fade-in ${highContrast ? 'bg-black border-2 border-t-8 border-yellow-400 text-white' : 'bg-white border border-gray-200 border-t-[#5b21b6]'}`}>
                <div className="p-6 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className={`w-8 h-8 mb-3 ${highContrast ? 'text-yellow-400' : 'text-[#5b21b6]'}`} />
                  <h4 className={`font-medium text-sm ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}>Squeeze-in Confirmed</h4>
                  <p className={`text-xs mt-1 ${hcText}`}>Drag any slot to remap. Limits are enforced to prevent mandate breaches.</p>
                </div>
              </div>
            )}

            {aiSqueezeStatus === 'rejected' && (
              <div className={`rounded-xl shadow-sm overflow-hidden border-t-4 animate-in fade-in ${highContrast ? 'bg-black border-2 border-t-8 border-gray-600 text-white' : 'bg-white border border-gray-200 border-t-[#64748b]'}`}>
                <div className="p-6 flex flex-col items-center justify-center text-center">
                  <X className={`w-8 h-8 mb-3 ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`} />
                  <h4 className={`font-medium text-sm ${highContrast ? 'text-gray-400' : 'text-[#0f172a]'}`}>Squeeze-in Rejected</h4>
                  <p className={`text-xs mt-1 ${hcText}`}>AI will route the request to the next available specialist in the network.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PATHWAYS (PATIENTS LIST) */}
      {activeTab === 'pathways' && (
        <div className={`rounded-xl shadow-sm overflow-hidden ${hcBg}`}>
          <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${highContrast ? 'bg-gray-900 border-yellow-400' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f8fafc] border-gray-200'}`}>
            <div>
              <h3 className={`font-medium text-sm ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>My Active Clinical Pathways</h3>
              <p className={`text-[11px] mt-1 ${hcText}`}>Showing {filteredPatients.length} records</p>
            </div>
            
            {/* FILTERS AND SORT */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                <Filter className={`w-3.5 h-3.5 mr-2 ${highContrast ? 'text-yellow-400' : 'text-[#475569]'}`} />
                <select 
                  value={filterPathway}
                  onChange={(e) => setFilterPathway(e.target.value)}
                  className={`bg-transparent focus:outline-none cursor-pointer max-w-[120px] ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}
                >
                  <option value="All">All Pathways</option>
                  <option value="Breast Cancer">Breast Cancer</option>
                  <option value="Lung Cancer">Lung Cancer</option>
                  <option value="Prostate Cancer">Prostate Cancer</option>
                  <option value="Cervical Cancer">Cervical Cancer</option>
                  <option value="Colon Cancer">Colon Cancer</option>
                  <option value="Thyroid Cancer">Thyroid Cancer</option>
                </select>
              </div>

              <div className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                <AlertTriangle className={`w-3.5 h-3.5 mr-2 ${highContrast ? 'text-yellow-400' : 'text-[#475569]'}`} />
                <select 
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className={`bg-transparent focus:outline-none cursor-pointer max-w-[120px] ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Critical">Critical (≤ 5 Days)</option>
                  <option value="Elevated">Elevated (6-20 Days)</option>
                  <option value="On Track">On Track (&gt; 20 Days)</option>
                </select>
              </div>

              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm transition-colors ${highContrast ? 'bg-black border-yellow-400 hover:bg-gray-900 text-yellow-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-[#0f172a]'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
                Deadline ({sortOrder === 'asc' ? 'Urgent first' : 'Later first'})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`border-b ${highContrast ? 'bg-black border-yellow-400/30' : 'bg-white border-gray-200'}`}>
                <tr>
                  <th className={`p-5 text-xs font-medium uppercase tracking-wider ${hcText}`}>Patient</th>
                  <th className={`p-5 text-xs font-medium uppercase tracking-wider ${hcText}`}>Pathway</th>
                  <th className={`p-5 text-xs font-medium uppercase tracking-wider ${hcText}`}>Status</th>
                  <th className={`p-5 text-xs font-medium uppercase tracking-wider ${hcText}`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${highContrast ? 'divide-yellow-400/20' : 'divide-gray-100'}`}>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <p className={`text-xs font-medium ${highContrast ? 'text-white' : 'text-[#64748b]'}`}>No patients found for '{filterPathway}'.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p, i) => (
                    <tr key={i} className={`transition-colors ${p.highlight ? (highContrast ? 'bg-yellow-400/10' : 'bg-purple-50/20') : ''} ${highContrast ? 'hover:bg-gray-900' : 'hover:bg-[#f8fafc]'}`}>
                      <td className="p-5">
                        <button 
                          onClick={() => handleOpenPatientSim(p)}
                          className={`text-left hover:underline group`}
                        >
                          <p className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>{p.name}</p>
                          <p className={`text-[10px] font-mono mt-0.5 ${hcText}`}>{p.id}</p>
                        </button>
                      </td>
                      <td className={`p-5 text-xs font-medium ${highContrast ? 'text-white' : 'text-[#334155]'}`}>{p.pathway}</td>
                      <td className="p-5">
                        <span className={`text-[10px] font-medium flex items-center gap-1.5 uppercase tracking-wider w-max ${highContrast ? 'text-white' : 'text-[#334155]'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Critical Risk' ? 'bg-[#7f1d1d]' : p.status === 'Elevated Risk' ? 'bg-[#d97706]' : 'bg-[#5b21b6]'}`}></div>
                          {p.daysLeft} Days
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          {p.highlight ? (
                            <>
                              <button 
                                onClick={handleOpenSchedule} 
                                className={`px-4 py-2 rounded-lg font-medium text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-sm ${highContrast ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764] ring-2 ring-purple-100'}`}
                                title="Open Smart Schedule"
                              >
                                <CalendarPlus className="w-3.5 h-3.5 pointer-events-none" />
                                Smart Schedule
                              </button>
                              <button onClick={() => setShowTeleSim(true)} className={`p-2 rounded-md transition-colors shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500 border border-yellow-400' : 'bg-white text-[#4c1d95] border border-gray-300 hover:border-[#4c1d95]'}`}><Video className="w-4 h-4" /></button>
                              <button 
                                onClick={() => handleOpenPatientSim(p)}
                                className={`text-[11px] font-medium hover:underline px-2 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}
                              >
                                View
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleOpenPatientSim(p)}
                              className={`text-[11px] font-medium hover:underline px-2 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}
                            >
                              View
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SMART SCHEDULE AI POPUP */}
      {showScheduleSim && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowScheduleSim(false)}></div>
          <div className={`relative w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ${highContrast ? 'bg-black border-2 border-yellow-400' : darkMode ? 'bg-[#0f172a] border border-gray-800' : 'bg-white border border-gray-200'}`}>
            <div className={`px-8 py-6 flex items-center justify-between ${highContrast ? 'bg-gray-900 border-b-2 border-yellow-400' : 'bg-[#4c1d95]'}`}>
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <CalendarPlus className={`w-6 h-6 ${highContrast ? 'text-yellow-400' : 'text-purple-200'}`} />
                </div>
                <div>
                  <h3 className={`font-medium text-xl ${highContrast ? 'text-yellow-400' : 'text-white'}`}>Smart Schedule Suite</h3>
                  <p className={`text-xs ${highContrast ? 'text-yellow-200' : 'text-purple-200/70'} font-medium`}>AI Workload Optimization & Mandate Compliance</p>
                </div>
              </div>
              <button onClick={() => setShowScheduleSim(false)} className={`hover:bg-white/10 p-2 rounded-full transition-colors ${highContrast ? 'text-yellow-400' : 'text-purple-200'}`}><X className="w-6 h-6" /></button>
            </div>

            <div className="p-10 flex flex-col lg:flex-row gap-10 overflow-y-auto max-h-[85vh]">
              {/* Left Column: AI Logic */}
              <div className="lg:w-1/4 space-y-8">
                <div className={`p-6 rounded-xl shadow-sm ${hcMuted}`}>
                  <h4 className="font-medium text-sm mb-4 flex items-center gap-3">
                    <User className="w-5 h-5" /> Selected Patient
                  </h4>
                  <p className="font-medium text-lg">M. S. (ID: #84729)</p>
                  <p className={`text-xs mt-2 ${hcText}`}>Breast Oncology • 2 Days to Mandate Breach</p>
                </div>

                <div className={`p-6 rounded-xl border-2 ${highContrast ? 'border-yellow-400 bg-gray-900' : darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-100'}`}>
                  <h4 className={`font-medium text-sm mb-5 flex items-center gap-3 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}>
                    <Activity className="w-5 h-5" /> AI Recommendations
                  </h4>
                  <div className="space-y-5 text-xs leading-relaxed">
                    <div className="flex gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]'}`}></div>
                      <p><strong className={highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}>Target:</strong> Core Biopsy (Expedited)</p>
                    </div>
                    <div className="flex gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]'}`}></div>
                      <p><strong className={highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}>Optimization:</strong> Tue 11:00 AM (AI RECOMMENDED)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button 
                    onClick={() => {
                      setAppointments(prev => [...prev, {
                        id: 'smart_sched_' + Date.now(),
                        title: 'Biopsy #84729 (AI)',
                        day: 1,
                        time: '11:00 AM',
                        color: 'purple',
                        limit: 4,
                        isOverbook: true
                      }]);
                      setShowScheduleSim(false);
                    }}
                    className={`w-full py-5 rounded-xl font-medium text-sm shadow-lg transition-all active:scale-[0.98] ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764] shadow-purple-200'}`}
                  >
                    Confirm AI Choice
                  </button>

                  <button 
                    onClick={() => setAiChatView(true)}
                    className={`w-full py-4 border-2 rounded-xl text-xs font-medium transition-all active:scale-[0.98] ${highContrast ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/10' : 'border-[#4c1d95]/30 text-[#4c1d95] hover:bg-purple-50'}`}
                  >
                    Verify mandate-compliant dates
                  </button>
                </div>
              </div>

              {/* Right Column: Calendar View (Simulated Agenda) OR AI CHAT */}
              <div className="flex-1 space-y-6">
                {aiChatView ? (
                  <div className={`h-[600px] flex flex-col rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ${highContrast ? 'bg-gray-900 border-2 border-yellow-400' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`p-5 border-b flex items-center gap-3 ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                      <Activity className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
                      <span className="font-medium text-sm uppercase tracking-wider">AI Clinical Assistant</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user'
                              ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-[#4c1d95] text-white')
                              : (highContrast ? 'bg-black border border-yellow-400 text-yellow-100' : 'bg-white border border-gray-100 text-[#334155]')
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}

                      {/* Suggested Slots — shown only after initial message */}
                      {chatMessages.length === 1 && (
                        <div className="space-y-3 pl-4 border-l-4 border-purple-200">
                          {[
                            { day: 'Tuesday', time: '11:00 AM', reason: 'Best Fit — Minimal clinical impact' },
                            { day: 'Wednesday', time: '08:00 AM', reason: 'High Impact — Requires rescheduling admin slot' },
                            { day: 'Wednesday', time: '15:00 PM', reason: 'Emergency Backup — Biopsy suite shared' }
                          ].map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => { setChatInput(opt.day + ' ' + opt.time); }}
                              className={`w-full p-4 rounded-xl flex items-center justify-between text-left group transition-all ${
                                highContrast ? 'hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400' : 'hover:bg-purple-50 border border-gray-100 bg-white'
                              }`}
                            >
                              <div>
                                <p className={`font-medium text-sm ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}>{opt.day} at {opt.time}</p>
                                <p className={`text-xs mt-1 ${hcText}`}>{opt.reason}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className={`p-4 border-t flex gap-3 ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                        placeholder="Ask the AI... e.g. 'Book Tuesday' or 'What is the patient risk?'"
                        className={`flex-1 px-4 py-2.5 rounded-lg text-xs focus:outline-none ${
                          highContrast ? 'bg-gray-900 border border-yellow-400 text-white placeholder-yellow-400/40' : 'bg-[#f8fafc] border border-gray-200 text-[#0f172a] placeholder-gray-400'
                        }`}
                      />
                      <button
                        onClick={handleChatSend}
                        className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                          highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'
                        }`}
                      >
                        Send
                      </button>
                    </div>

                    <div className={`px-4 pb-3 flex justify-between items-center ${highContrast ? 'bg-black' : 'bg-white'}`}>
                      <button onClick={() => setAiChatView(false)} className={`text-[11px] font-medium ${hcText} hover:underline`}>← Back to Agenda View</button>
                      <button onClick={() => setChatMessages([chatMessages[0]])} className={`text-[10px] ${hcText} hover:underline`}>Clear chat</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-medium text-sm flex items-center gap-3 mb-4">
                      <CalendarDays className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Professional Weekly Agenda
                    </h4>
                    
                    <div className="grid grid-cols-5 gap-3 h-[550px]">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, dayIdx) => (
                        <div key={day} className={`flex flex-col rounded-xl overflow-hidden border ${highContrast ? 'border-yellow-400/30' : 'border-gray-100 shadow-sm'}`}>
                          <div className={`text-center py-3 text-xs font-medium uppercase tracking-tighter ${highContrast ? 'bg-gray-900 text-yellow-300' : 'bg-gray-50 text-gray-500'}`}>{day}</div>
                          <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                            {timeSlots.map(timeStr => {
                              const app = appointments.find(a => a.day === dayIdx && a.time === timeStr);
                              const isSuggested = dayIdx === 1 && timeStr === '11:00 AM'; // Tue 11 AM

                              if (isSuggested) {
                                return (
                                  <div key={timeStr} className={`p-3 rounded-lg text-[11px] font-medium ring-2 ${highContrast ? 'bg-yellow-400 text-black ring-white' : 'bg-[#4c1d95] text-white ring-purple-200 shadow-lg shadow-purple-200'}`}>
                                    {timeStr.split(' ')[0]}
                                    <div className="mt-2 flex items-center gap-1.5 uppercase text-[8px] font-medium"><Activity className="w-3 h-3" /> choosed by AI</div>
                                  </div>
                                );
                              }

                              if (app) {
                                return (
                                  <div key={app.id} className={`p-3 rounded-lg border-l-4 text-[11px] font-medium shadow-sm ${getColorClasses(app.color, app.isOverbook)}`}>
                                    <span className={`block mb-1 ${getTextColor(app.color, app.isOverbook)}`}>{timeStr.split(' ')[0]}</span>
                                    <div className={`text-[10px] font-medium leading-tight truncate ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>{app.title}</div>
                                  </div>
                                );
                              }

                              return (
                                <div key={timeStr} className={`p-3 rounded-lg text-[11px] font-medium border border-transparent transition-colors ${highContrast ? 'text-yellow-400/20 hover:bg-yellow-400/5' : 'text-gray-300 hover:bg-gray-50'}`}>
                                  {timeStr.split(' ')[0]}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
