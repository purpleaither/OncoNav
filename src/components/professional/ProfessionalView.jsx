import { useState, useMemo } from 'react';
import { Bookmark, CheckCircle2, FileJson, Video, ClipboardCheck, X, Mic, Camera, MonitorUp, PhoneOff, User, CalendarPlus, ArrowRight, CalendarDays, AlertTriangle, Check, Filter, ArrowUpDown } from 'lucide-react';

export default function ProfessionalView({ highContrast }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showTeleSim, setShowTeleSim] = useState(false);
  const [showScheduleSim, setShowScheduleSim] = useState(false);
  const [aiSqueezeStatus, setAiSqueezeStatus] = useState('pending'); // pending, accepted, rejected
  const [calendarView, setCalendarView] = useState('week'); // day, week, month, year
  
  const [filterPathway, setFilterPathway] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');

  const [dragError, setDragError] = useState(null);

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
    result = result.sort((a, b) => sortOrder === 'asc' ? a.daysLeft - b.daysLeft : b.daysLeft - a.daysLeft);
    return result;
  }, [filterPathway, sortOrder]);

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

  const hcBg = highContrast ? 'bg-black text-white border-2 border-yellow-400' : 'bg-white border border-gray-200 text-[#0f172a]';
  const hcText = highContrast ? 'text-yellow-300' : 'text-[#64748b]';
  const hcMuted = highContrast ? 'bg-gray-900 border-2 border-yellow-400 text-white' : 'bg-[#f8fafc] border border-gray-200 text-[#334155]';

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
            <span className="font-bold text-[10px] tracking-widest text-gray-300">REC</span>
            <span className="ml-2 font-mono text-gray-300 text-xs">00:14:32</span>
          </div>
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="text-center">
              <User className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <h2 className="text-sm font-semibold text-gray-300">Dr. S. J. (Primary Care)</h2>
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
              <h3 className="font-bold text-sm">Patient Record (Anonymized)</h3>
              <p className={`text-[10px] ${hcText}`}>HIE Live Sync (FHIR)</p>
            </div>
            <button onClick={() => setShowTeleSim(false)} className="hover:opacity-70"><X className="w-4 h-4"/></button>
          </div>
          <div className={`flex-1 overflow-y-auto p-5 space-y-5 ${highContrast ? 'bg-black' : 'bg-white'}`}>
            <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${hcBg}`}>
              <div className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#f1f5f9] text-[#4c1d95] border border-gray-200'}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">M. S.</h4>
                <p className={`text-[10px] ${hcText}`}>ID: #84729 • 42 y.o</p>
              </div>
            </div>
            <textarea 
              className={`w-full h-32 p-3 text-xs rounded-lg resize-none shadow-sm focus:outline-none ${highContrast ? 'bg-gray-900 border-2 border-yellow-400 text-white focus:border-yellow-300' : 'bg-white border border-gray-200 text-[#0f172a] focus:border-[#4c1d95]'}`}
              defaultValue="Discussing biopsy results. Expediting procedures to meet Mandate deadline."
            ></textarea>
            <button onClick={() => setShowTeleSim(false)} className={`w-full py-3 rounded-lg text-xs font-bold shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}>
              Sign & Save to HIE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 relative">

      {/* DRAG ERROR TOAST */}
      {dragError && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] animate-in slide-in-from-top-4">
          <div className={`px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border-2 ${highContrast ? 'bg-black border-red-500 text-red-500' : 'bg-red-50 border-red-200 text-[#7f1d1d]'}`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs font-bold">{dragError}</span>
          </div>
        </div>
      )}
      
      {showScheduleSim && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-xl shadow-2xl flex flex-col overflow-hidden ${highContrast ? 'bg-black border-2 border-yellow-400' : 'bg-white border border-gray-200'}`}>
            <div className={`px-5 py-4 flex items-center justify-between ${highContrast ? 'bg-gray-900 border-b-2 border-yellow-400' : 'bg-[#4c1d95]'}`}>
              <div className="flex items-center gap-2 text-white">
                <CalendarDays className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-purple-200'}`} />
                <h3 className={`font-bold text-sm ${highContrast ? 'text-yellow-400' : 'text-white'}`}>Smart Scheduling AI</h3>
              </div>
              <button onClick={() => setShowScheduleSim(false)} className={`hover:opacity-70 p-1 ${highContrast ? 'text-yellow-400' : 'text-purple-200'}`}><X className="w-4 h-4" /></button>
            </div>
            <div className={`p-6 space-y-4 ${highContrast ? 'bg-black text-white' : 'bg-white'}`}>
              <div className={`p-5 rounded-xl shadow-sm space-y-4 ${hcMuted}`}>
                <p className={`text-sm font-bold border-b pb-2 ${highContrast ? 'text-white border-yellow-400/30' : 'text-[#0f172a] border-gray-200'}`}>AI Routing Analysis</p>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${highContrast ? 'bg-black border border-yellow-400' : 'bg-red-50'}`}><Clock className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#7f1d1d]'}`}/></div>
                  <div>
                    <p className={`text-xs font-bold ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Mandate Verification</p>
                    <p className={`text-[10px] mt-0.5 ${hcText}`}>Patient has 2 days left. Priority bumped to critical.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${highContrast ? 'bg-black border border-yellow-400' : 'bg-blue-50'}`}><MapPin className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-blue-700'}`}/></div>
                  <div>
                    <p className={`text-xs font-bold ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Geolocation Match</p>
                    <p className={`text-[10px] mt-0.5 ${hcText}`}>Found Central Hub (3km away) with available equipment.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${highContrast ? 'bg-black border border-yellow-400' : 'bg-purple-50'}`}><User className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}/></div>
                  <div>
                    <p className={`text-xs font-bold ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Specialist Availability</p>
                    <p className={`text-[10px] mt-0.5 ${hcText}`}>Dr. S. J. matched for Breast Oncology procedure.</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowScheduleSim(false)} className={`w-full py-3 rounded-lg font-bold text-sm shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}>
                Approve Suggested Slot (Tomorrow @ 11:00)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pill Navigation */}
      <div className={`flex shadow-sm rounded-lg p-1 mb-6 w-max ${hcBg}`}>
        {[
          { id: 'calendar', label: 'Clinical Calendar' },
          { id: 'pathways', label: 'My Patients (10)' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-md text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-[#f1f5f9] text-[#0f172a] shadow-sm border border-gray-200') 
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
                <h3 className={`font-bold flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                  <CalendarDays className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Schedule ({calendarView.charAt(0).toUpperCase() + calendarView.slice(1)})
                </h3>
                
                {/* View Toggles */}
                <div className={`flex p-1 rounded-lg shadow-sm ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-gray-100 border border-gray-200'}`}>
                  {['Day', 'Week', 'Month', 'Year'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setCalendarView(v.toLowerCase())}
                      className={`text-[10px] px-3 py-1.5 rounded-md font-bold transition-colors ${
                        calendarView === v.toLowerCase() 
                          ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-white text-[#4c1d95] shadow-sm border border-gray-200') 
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
                <div className={`h-[450px] flex flex-col rounded-lg overflow-hidden ${hcMuted}`}>
                  <div className={`border-b p-3 text-center font-bold text-xs ${highContrast ? 'bg-gray-900 border-yellow-400 text-yellow-400' : 'bg-[#f8fafc] border-gray-200 text-[#0f172a]'}`}>Today's Timeline (Monday)</div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {timeSlots.map(timeStr => {
                      const app = appointments.find(a => a.day === 0 && a.time === timeStr);
                      return (
                        <div key={timeStr} className="flex items-center gap-4">
                          <span className={`w-12 text-[10px] font-bold ${hcText}`}>{timeStr.split(' ')[0]}</span>
                          {app ? (
                            <div className={`flex-1 p-3 rounded-md shadow-sm border-l-4 ${getColorClasses(app.color, app.isOverbook)}`}>
                              <p className="text-xs font-bold">{app.title}</p>
                            </div>
                          ) : (
                            <div className={`flex-1 border p-3 rounded-md text-xs flex items-center justify-center ${highContrast ? 'border-yellow-400/50 bg-black/40 text-yellow-400/50' : 'border-gray-100 bg-[#f8fafc] text-gray-400'}`}>
                              Free Slot
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {calendarView === 'week' && (
                <div className="grid grid-cols-5 gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((dayName, dayIndex) => (
                    <div key={dayName} className="flex flex-col gap-2">
                      <div className={`text-center font-bold text-xs border-b pb-2 ${highContrast ? 'border-yellow-400/30 text-yellow-300' : 'border-gray-200 text-[#64748b]'}`}>{dayName}</div>
                      
                      <div className="space-y-2 h-[450px] overflow-y-auto pr-1 custom-scrollbar">
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
                                className={`p-2.5 rounded-md shadow-sm border-l-4 cursor-move hover:opacity-80 transition-opacity ${app.isOverbook ? 'shadow-md animate-in fade-in zoom-in' : ''} ${getColorClasses(app.color, app.isOverbook)}`}
                              >
                                <span className={`text-[9px] font-bold ${getTextColor(app.color, app.isOverbook)}`}>{app.time} {app.isOverbook && '(Overbook)'}</span>
                                <p className={`text-[10px] font-bold mt-0.5 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>{app.title}</p>
                              </div>
                            );
                          } else {
                            return (
                              <div 
                                key={timeStr}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, dayIndex, timeStr)}
                                className={`border p-2 rounded-md h-[60px] flex items-center justify-center transition-colors ${highContrast ? 'border-yellow-400/50 bg-black/40 hover:bg-yellow-400/10' : 'border-gray-100 bg-[#f8fafc] hover:bg-gray-50'}`}
                              >
                                <span className={`text-[9px] font-medium ${highContrast ? 'text-yellow-400/50' : 'text-gray-400'}`}>{timeStr.split(' ')[0]} (Free)</span>
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
                <div className={`h-[450px] rounded-lg overflow-hidden flex flex-col ${hcMuted}`}>
                  <div className={`grid grid-cols-7 border-b p-2 text-center text-[10px] font-bold ${highContrast ? 'bg-gray-900 border-yellow-400 text-yellow-400' : 'bg-[#f8fafc] border-gray-200 text-[#64748b]'}`}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 flex-1">
                    {Array.from({ length: 35 }).map((_, i) => {
                      // Assume current week is days 15 to 19 (Mon-Fri)
                      let dayAppointments = [];
                      if (i >= 15 && i <= 19) {
                        const weekDay = i - 15;
                        dayAppointments = appointments.filter(a => a.day === weekDay);
                      }

                      return (
                        <div key={i} className={`border-r border-b p-1 flex flex-col ${highContrast ? 'border-yellow-400/30' : 'border-gray-100'} ${i < 3 || i > 33 ? (highContrast ? 'bg-gray-900' : 'bg-gray-50') : (highContrast ? 'bg-black' : 'bg-white')}`}>
                          <div className={`text-[9px] font-bold mb-1 ${highContrast ? 'text-yellow-400/50' : 'text-gray-400'}`}>{i + 1}</div>
                          <div className="flex-1 space-y-0.5 overflow-hidden">
                            {dayAppointments.map(app => (
                              <div key={app.id} className={`w-full h-1 rounded-full ${app.color === 'purple' ? (highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]') : app.color === 'purple-dark' ? (highContrast ? 'bg-yellow-600' : 'bg-[#6b21a8]') : app.color === 'gray' ? (highContrast ? 'bg-yellow-400/50' : 'bg-[#94a3b8]') : (highContrast ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-[#d97706]')}`}></div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {calendarView === 'year' && (
                <div className="h-[450px] grid grid-cols-3 gap-4 overflow-y-auto pr-1">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <div key={month} className={`rounded-lg p-3 ${hcMuted}`}>
                      <div className={`font-bold text-xs mb-2 ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}>{month} 2026</div>
                      <div className="grid grid-cols-7 gap-0.5">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const hasApps = (i >= 10 && i <= 14); // Simulate 3rd week with apps
                          return (
                            <div key={i} className={`aspect-square rounded-sm ${hasApps ? (highContrast ? 'bg-yellow-400' : 'bg-[#4c1d95]') : (highContrast ? 'bg-yellow-400/20' : 'bg-gray-100')}`}></div>
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
                    <h4 className={`font-bold text-sm ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>AI Squeeze-in Request</h4>
                    <p className={`text-xs mt-2 leading-relaxed ${hcText}`}>
                      Patient <strong>P. G.</strong> is 1 day away from breaching the 60-Day Mandate. Can you overbook her Biopsy for tomorrow (Tue) at 11:00 AM?
                    </p>
                  </div>
                </div>
                <div className={`p-4 flex gap-3 ${highContrast ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
                  <button onClick={acceptSqueezeIn} className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400' : 'bg-white hover:bg-gray-50 text-[#0f172a] border border-gray-200'}`}>
                    <Check className={`w-4 h-4 ${highContrast ? 'text-black' : 'text-[#7f1d1d]'}`} /> Accept
                  </button>
                  <button onClick={() => setAiSqueezeStatus('rejected')} className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-black text-yellow-400 hover:bg-gray-800 border-2 border-yellow-400' : 'bg-white hover:bg-gray-50 text-[#64748b] border border-gray-200'}`}>
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            )}

            {aiSqueezeStatus === 'accepted' && (
              <div className={`rounded-xl shadow-sm overflow-hidden border-t-4 animate-in fade-in ${highContrast ? 'bg-black border-2 border-t-8 border-yellow-400 text-white' : 'bg-white border border-gray-200 border-t-[#5b21b6]'}`}>
                <div className="p-6 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className={`w-8 h-8 mb-3 ${highContrast ? 'text-yellow-400' : 'text-[#5b21b6]'}`} />
                  <h4 className={`font-bold text-sm ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}>Squeeze-in Confirmed</h4>
                  <p className={`text-xs mt-1 ${hcText}`}>Drag any slot to remap. Limits are enforced to prevent mandate breaches.</p>
                </div>
              </div>
            )}

            {aiSqueezeStatus === 'rejected' && (
              <div className={`rounded-xl shadow-sm overflow-hidden border-t-4 animate-in fade-in ${highContrast ? 'bg-black border-2 border-t-8 border-gray-600 text-white' : 'bg-white border border-gray-200 border-t-[#64748b]'}`}>
                <div className="p-6 flex flex-col items-center justify-center text-center">
                  <X className={`w-8 h-8 mb-3 ${highContrast ? 'text-gray-400' : 'text-[#64748b]'}`} />
                  <h4 className={`font-bold text-sm ${highContrast ? 'text-gray-400' : 'text-[#0f172a]'}`}>Squeeze-in Rejected</h4>
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
          <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
            <div>
              <h3 className={`font-bold text-sm ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>My Active Patients (Anonymized)</h3>
              <p className={`text-[11px] mt-1 ${hcText}`}>Showing {filteredPatients.length} records</p>
            </div>
            
            {/* FILTERS AND SORT */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center px-3 py-2 rounded-md text-xs font-bold border shadow-sm ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
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

              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className={`flex items-center px-3 py-2 rounded-md text-xs font-bold border shadow-sm transition-colors ${highContrast ? 'bg-black border-yellow-400 hover:bg-gray-900 text-yellow-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-[#0f172a]'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
                Days Left ({sortOrder === 'asc' ? 'Min first' : 'Max first'})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`border-b ${highContrast ? 'bg-black border-yellow-400/30' : 'bg-white border-gray-200'}`}>
                <tr>
                  <th className={`p-5 text-xs font-bold uppercase tracking-wider ${hcText}`}>Patient</th>
                  <th className={`p-5 text-xs font-bold uppercase tracking-wider ${hcText}`}>Pathway</th>
                  <th className={`p-5 text-xs font-bold uppercase tracking-wider ${hcText}`}>Status</th>
                  <th className={`p-5 text-xs font-bold uppercase tracking-wider ${hcText}`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${highContrast ? 'divide-yellow-400/20' : 'divide-gray-100'}`}>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <p className={`text-xs font-bold ${highContrast ? 'text-white' : 'text-[#64748b]'}`}>No patients found for '{filterPathway}'.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p, i) => (
                    <tr key={i} className={`transition-colors ${p.highlight ? (highContrast ? 'bg-yellow-400/10' : 'bg-purple-50/20') : ''} ${highContrast ? 'hover:bg-gray-900' : 'hover:bg-[#f8fafc]'}`}>
                      <td className="p-5">
                        <p className={`font-bold text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>{p.name}</p>
                        <p className={`text-[10px] font-mono mt-0.5 ${hcText}`}>{p.id}</p>
                      </td>
                      <td className={`p-5 text-xs font-medium ${highContrast ? 'text-white' : 'text-[#334155]'}`}>{p.pathway}</td>
                      <td className="p-5">
                        {/* FLAT BACKGROUND, NO BORDER, NO SHADOW */}
                        <span className={`text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider w-max ${highContrast ? 'text-white' : 'text-[#334155]'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Critical Risk' ? 'bg-[#7f1d1d]' : p.status === 'Elevated Risk' ? 'bg-[#d97706]' : 'bg-[#5b21b6]'}`}></div>
                          {p.daysLeft} Days
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          {p.highlight ? (
                            <>
                              <button onClick={() => setShowScheduleSim(true)} className={`p-2 rounded-md transition-colors shadow-sm ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'bg-white border border-gray-300 hover:border-[#4c1d95] hover:text-[#4c1d95]'}`}><CalendarPlus className="w-4 h-4" /></button>
                              <button onClick={() => setShowTeleSim(true)} className={`p-2 rounded-md transition-colors shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500 border border-yellow-400' : 'bg-white text-[#4c1d95] border border-gray-300 hover:border-[#4c1d95]'}`}><Video className="w-4 h-4" /></button>
                            </>
                          ) : (
                            <button className={`text-[11px] font-bold hover:underline px-2 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}>View</button>
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

    </div>
  );
}
