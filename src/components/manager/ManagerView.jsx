import { useState, useMemo, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend, Cell, PieChart, Pie } from 'recharts';
import { AlertTriangle, Clock, CheckCircle, Video, X, Check, ShieldCheck, MapPin, User, Activity, TrendingDown, RefreshCw, ArrowRightLeft, Filter, ArrowUpDown, LayoutDashboard, Send, MessageSquare, ChevronRight, CheckCircle2, Search, FileText, ArrowRight, Network } from 'lucide-react';

export default function ManagerView({ highContrast, darkMode, isAuthenticated, setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('pathways');
  const [showPatientSim, setShowPatientSim] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [filterPathway, setFilterPathway] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const [networkRegion, setNetworkRegion] = useState('Global View');

  // DISPATCH TOAST STATE
  const [showDispatchToast, setShowDispatchToast] = useState(false);
  const [lastDispatched, setLastDispatched] = useState('');

  // NETWORK DATA STATE (TO ALLOW ACTUAL ROUTING CHANGES)
  const [networkDataByRegion, setNetworkDataByRegion] = useState({
    'Global View': [
      { name: 'Blood Tests', demand: 1200, capacity: 1500 },
      { name: 'MRI & CT', demand: 850, capacity: 800 },
      { name: 'PET-CT', demand: 420, capacity: 300 },
      { name: 'Core Biopsies', demand: 550, capacity: 480 },
      { name: 'Surgical Slots', demand: 320, capacity: 310 },
      { name: 'Chemo & Radio', demand: 980, capacity: 1100 }
    ],
    'Central Hub': [
      { name: 'Blood Tests', demand: 400, capacity: 600 },
      { name: 'MRI & CT', demand: 300, capacity: 400 },
      { name: 'PET-CT', demand: 150, capacity: 200 },
      { name: 'Core Biopsies', demand: 200, capacity: 250 },
      { name: 'Surgical Slots', demand: 120, capacity: 150 },
      { name: 'Chemo & Radio', demand: 350, capacity: 500 }
    ],
    'South Zone': [
      { name: 'Blood Tests', demand: 350, capacity: 400 },
      { name: 'MRI & CT', demand: 250, capacity: 250 },
      { name: 'PET-CT', demand: 120, capacity: 100 },
      { name: 'Core Biopsies', demand: 150, capacity: 130 },
      { name: 'Surgical Slots', demand: 100, capacity: 90 },
      { name: 'Chemo & Radio', demand: 300, capacity: 320 }
    ],
    'North Zone': [
      { name: 'Blood Tests', demand: 250, capacity: 250 },
      { name: 'MRI & CT', demand: 180, capacity: 100 },
      { name: 'PET-CT', demand: 90, capacity: 0 },
      { name: 'Core Biopsies', demand: 120, capacity: 80 },
      { name: 'Surgical Slots', demand: 60, capacity: 50 },
      { name: 'Chemo & Radio', demand: 230, capacity: 230 }
    ],
    'Rural Area': [
      { name: 'Blood Tests', demand: 200, capacity: 250 },
      { name: 'MRI & CT', demand: 120, capacity: 50 },
      { name: 'PET-CT', demand: 60, capacity: 0 },
      { name: 'Core Biopsies', demand: 80, capacity: 20 },
      { name: 'Surgical Slots', demand: 40, capacity: 20 },
      { name: 'Chemo & Radio', demand: 100, capacity: 50 }
    ]
  });

  // ROUTING ACTIONS STATE
  const [routingActions, setRoutingActions] = useState([
    { id: 1, title: 'Load Balancing: North Zone', desc: 'PET-CT capacity at 0%. AI suggests shifting 12 non-critical scans to South Zone Hub.', impact: 'Reduces wait by 4 days', type: 'high', status: 'pending' },
    { id: 2, title: 'Workload Shift: Dr. Jenkins', desc: 'Surgery backlog identified. Suggest routing biopsy reviews to Dr. Miller (Rural Cluster).', impact: 'Prevents mandate breach for 5 patients', type: 'critical', status: 'pending' }
  ]);

  // AI CHAT STATE
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hello, Manager. I have analyzed the Federated HIE data. There is a potential PET-CT bottleneck developing in the North Zone, while the Central Hub has 20% idle capacity. \n\nShould I suggest a resource reallocation strategy?'
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

      if (lowerText.includes('reallocate') || lowerText.includes('shift') || lowerText.includes('resource')) {
        aiResponse = "Strategic reallocation plan generated: \n\n1. Move 2 mobile MRI units from Central to North Zone.\n2. Open 5 additional biopsy slots in South Zone via Dr. Miller's cluster.\n3. Implement Tele-Triaging for all Rural Area referrals to reduce ER load by 15%. \n\nShall I send these for Multidisciplinary Collaboration Portal approval?";
      }
      else if (lowerText.includes('bottleneck') || lowerText.includes('delay') || lowerText.includes('risk')) {
        aiResponse = "Current Network Bottlenecks: \n- **North Zone PET-CT**: 0% availability. \n- **Rural Area Imaging**: 12-day wait for MRI. \n- **Breast Cancer Pathway**: 4 patients at critical 2-day limit for biopsy.";
      }
      else if (lowerText.includes('compliance') || lowerText.includes('legal') || lowerText.includes('mandate')) {
        aiResponse = "Network Compliance: **94.2%**. \n\nThere are 12 patients currently at risk of breaching the 60-Day Legal Mandate across the federation. I recommend immediate prioritization of these cases in the AI Actions Queue.";
      }
      else {
        aiResponse = "I am monitoring the entire HIE network. I can assist with workload balancing, cross-region optimization, and predictive analytics for patient flow. What strategic metric shall we analyze?";
      }

      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
    }, 600);
  };

  const [aiApprovals, setAiApprovals] = useState([
    { id: 'REQ-102', patient: 'N. R. (ID: #10293)', action: 'Expedite Core Needle Biopsy', reason: 'Critical Delay: 2 Days left on 60-Day Mandate', status: 'pending' },
    { id: 'REQ-103', patient: 'A. S. (ID: #67890)', action: 'Block Secondary Order (Duplicates)', reason: 'Identical pathology exam requested by two different physicians', status: 'pending' },
    { id: 'REQ-104', patient: 'R. A. (ID: #77889)', action: 'Suggest Tele-Consultation', reason: 'Rural region patient. Avoids unnecessary ER travel', status: 'pending' }
  ]);

  const managerPatients = [
    { id: '#84729', name: 'M. S.', pathway: 'Breast Cancer', type: 'red', desc: 'Secondary procedures delayed', daysLeft: 2, status: 'Critical Risk' },
    { id: '#10293', name: 'N. R.', pathway: 'Breast Cancer', type: 'yellow', desc: 'Awaiting specialist consult', daysLeft: 12, status: 'Elevated Risk' },
    { id: '#93847', name: 'E. F.', pathway: 'Lung Cancer', type: 'green', desc: 'Treatment initiated', daysLeft: 45, status: 'On Track' },
    { id: '#54321', name: 'C. M.', pathway: 'Prostate Cancer', type: 'yellow', desc: 'Biopsy pending scheduling', daysLeft: 18, status: 'Elevated Risk' },
    { id: '#67890', name: 'A. S.', pathway: 'Cervical Cancer', type: 'red', desc: 'Surgical center bottleneck', daysLeft: 5, status: 'Critical Risk' },
    { id: '#24680', name: 'R. L.', pathway: 'Colon Cancer', type: 'green', desc: 'Chemotherapy started', daysLeft: 30, status: 'On Track' },
    { id: '#13579', name: 'F. C.', pathway: 'Breast Cancer', type: 'green', desc: 'Post-op recovery', daysLeft: 50, status: 'On Track' },
    { id: '#11223', name: 'J. C.', pathway: 'Lung Cancer', type: 'yellow', desc: 'Awaiting imaging results', daysLeft: 14, status: 'Elevated Risk' },
    { id: '#44556', name: 'P. G.', pathway: 'Thyroid Cancer', type: 'red', desc: 'Critical Delay - AI Squeeze req.', daysLeft: 1, status: 'Critical Risk' },
    { id: '#77889', name: 'R. A.', pathway: 'Prostate Cancer', type: 'green', desc: 'Radiation therapy', daysLeft: 40, status: 'On Track' }
  ];

  const analyticsData = [
    { month: 'Jan', compliance: 88, cost: 4200 },
    { month: 'Feb', compliance: 91, cost: 3800 },
    { month: 'Mar', compliance: 94, cost: 3500 }
  ];

  const openPatientSim = (p) => {
    setSelectedPatient(p);
    setShowPatientSim(true);
  };

  const handleAiApproval = (id, decision) => {
    setAiApprovals(prev => prev.map(req => req.id === id ? { ...req, status: decision } : req));
    if (decision.startsWith('approved')) {
      const req = aiApprovals.find(r => r.id === id);
      setLastDispatched(req.action);
      setShowDispatchToast(true);
      setTimeout(() => setShowDispatchToast(false), 5000);
    }
  };

  const filteredPatients = useMemo(() => {
    let result = managerPatients;
    
    if (filterPathway !== 'All') {
      result = result.filter(p => p.pathway === filterPathway);
    }

    if (filterRisk !== 'All') {
      if (filterRisk === 'Critical') result = result.filter(p => p.daysLeft <= 5);
      else if (filterRisk === 'Elevated') result = result.filter(p => p.daysLeft > 5 && p.daysLeft <= 20);
      else if (filterRisk === 'On Track') result = result.filter(p => p.daysLeft > 20);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      if (sortOrder === 'asc') return a.daysLeft - b.daysLeft;
      return b.daysLeft - a.daysLeft;
    });
    return result;
  }, [filterPathway, filterRisk, searchQuery, sortOrder]);

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

  const executeRoutingMove = (id) => {
    setRoutingActions(prev => prev.map(a => a.id === id ? { ...a, status: 'executing' } : a));
    setTimeout(() => {
      setRoutingActions(prev => prev.map(a => a.id === id ? { ...a, status: 'done' } : a));

      // OPTIONALLY UPDATE DATA TO SHOW IMPACT
      if (id === 1) {
        setNetworkDataByRegion(prev => ({
          ...prev,
          'North Zone': prev['North Zone'].map(d => d.name === 'PET-CT' ? { ...d, capacity: 12 } : d)
        }));
      }
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className={`rounded-xl p-10 max-w-sm w-full text-center shadow-sm ${hcBg}`}>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400' : 'bg-indigo-50 border border-indigo-100'}`}>
            <LayoutDashboard className={`w-8 h-8 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
          </div>

          <h2 className="text-xl font-medium mb-2">Manager Access</h2>
          <p className={`mb-8 text-xs ${hcText}`}>Federated HIE Analytics & cross-region resource balancing.</p>

          <button
            onClick={() => setIsAuthenticated(true)}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 text-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] hover:bg-[#3b0764] text-white'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Login & Synchronize
          </button>
          <p className={`text-[10px] px-2 ${hcText}`}>
            By proceeding, you verify your authorization to access enterprise health records under HIPAA/GDPR auditing rules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 relative pb-20 md:pb-0">

      {/* DISPATCH TOAST (MASSIVE REGIONAL NOTIFICATION) */}
      {showDispatchToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[200] animate-in slide-in-from-top-6 duration-500 w-full max-w-xl px-4">
          <div className={`p-6 rounded-2xl shadow-2xl border flex items-center gap-6 ${highContrast ? 'bg-black border-yellow-400 text-yellow-400' : 'bg-white border-gray-100 shadow-indigo-100'}`}>
            <div className={`p-3.5 rounded-xl ${highContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-50 text-[#4c1d95]'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className={`text-[10px] font-medium uppercase tracking-widest mb-1.5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}>
                Federated System Dispatch
              </h4>
              <p className={`text-sm font-medium leading-relaxed ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
                Regional alert broadcast for <span className="font-medium underline decoration-indigo-200 underline-offset-4">{lastDispatched}</span>.
                <span className={`block text-[11px] font-normal mt-1 ${hcText}`}>Maximum priority override active for all regional medical nodes.</span>
              </p>
            </div>
            <button onClick={() => setShowDispatchToast(false)} className={`p-2 rounded-lg transition-colors ${highContrast ? 'hover:bg-yellow-400 hover:text-black' : 'hover:bg-gray-50 text-gray-400'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PATIENT SIMULATOR (Centered & Professional Aesthetic) */}
      {showPatientSim && selectedPatient && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0" onClick={() => setShowPatientSim(false)}></div>
          <div className={`${highContrast ? 'bg-black border-2 border-yellow-400 text-white' : 'bg-[#f8fafc] text-[#2d0a4d] shadow-2xl border border-gray-200'} relative w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300`}>

            {/* Top Navigation / Status Header */}
            <div
              className={`px-8 py-6 flex items-center justify-between border-b shrink-0 ${highContrast ? 'bg-black border-yellow-400' : 'bg-[#2d0a4d] border-white/5'}`}>
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-medium text-xl transition-all ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-white/5 border border-white/10 text-white shadow-lg'}`}>
                  {selectedPatient?.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-medium text-xl tracking-tight text-white`}>{selectedPatient?.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium border uppercase tracking-widest ${highContrast ? 'border-yellow-400 text-yellow-400' : 'bg-white/10 border-white/20 text-white'}`}>Patient 360º Clinical Intel</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium border uppercase tracking-widest ${highContrast ? 'border-yellow-400 text-yellow-400' : 'bg-white/5 border-white/10 text-white/50'}`}>Federated ID: {selectedPatient?.id}</span>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] font-medium text-white/60">
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-blue-400" /> 45Y • F</span>
                    <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-400" /> O+</span>
                    <span className={`px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[9px] font-semibold uppercase tracking-widest border border-blue-500/20`}>{selectedPatient?.pathway}</span>
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-semibold uppercase tracking-widest border ${selectedPatient.type === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>{selectedPatient.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setShowPatientSim(false)} className={`p-2.5 rounded-full transition-all ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-white/5 text-white hover:bg-white/10'}`}><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* LEFT SIDEBAR: AI MANAGER COPILOT */}
              <div className={`w-[340px] border-r overflow-y-auto p-8 space-y-8 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
                  <h4 className={`text-[11px] font-medium uppercase tracking-widest ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`}>Manager Flow Insights</h4>
                </div>

                <div className="space-y-6">
                  {[
                    { title: 'Mandate Breach Risk', icon: 'alert', content: 'Patient is approaching the 60-day limit. Flow data indicates surgery bottleneck in North Zone.', action: 'Expedite Resource' },
                    { title: 'Resource Alignment', icon: 'db', content: 'Regional MRI capacity available in South Zone. Shift possible for imaging follow-up.', action: 'Reallocate Slot' }
                  ].map((insight, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border transition-all hover:shadow-md ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-100 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {insight.icon === 'alert' ? <AlertTriangle className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-red-600'}`} /> : <Network className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-blue-600'}`} />}
                        <span className={`text-[10px] font-medium uppercase tracking-tighter ${highContrast ? 'text-white' : 'text-gray-900'}`}>{insight.title}</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${hcText}`}>
                        {insight.content}
                      </p>
                      <button className={`mt-4 w-full py-2.5 text-white text-[10px] font-medium rounded-xl transition-colors shadow-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#4c1d95] hover:bg-[#3b0764]'}`}>
                        {insight.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className={`flex-1 flex flex-col ${highContrast ? 'bg-black' : 'bg-white'}`}>
                {/* Tab Navigation (Simplified for Manager) */}
                <div className={`flex border-b px-8 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100'}`}>
                  <button className={`px-8 py-5 text-xs font-medium uppercase tracking-widest border-b-4 ${highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#4c1d95] text-[#4c1d95]'}`}>
                    Flow Data Timeline
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10">
                  <div className="space-y-10 max-w-4xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-sm text-gray-900 uppercase tracking-tight">HIE Data Sequence Trace</h4>
                    </div>

                    <div className={`space-y-8 relative before:absolute before:inset-0 before:ml-4 before:h-full before:w-px ${highContrast ? 'before:bg-yellow-400/30' : 'before:bg-gray-100'}`}>
                      <div className="relative flex items-start gap-8">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 shrink-0 z-10 shadow-sm ${highContrast ? 'border-black bg-yellow-400 text-black' : 'border-white bg-gray-100 text-[#4c1d95]'}`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className={`p-6 rounded-2xl flex-1 border-2 ${highContrast ? 'bg-black border-yellow-400' : 'bg-[#f8fafc] border-gray-100'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-gray-900">Primary Diagnostics</span>
                            <span className="text-[10px] font-medium bg-gray-100 px-2 py-1 rounded text-gray-500">12 MAR</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">Clinical Data imported via HIE API. Results confirmed and synced with regional registry.</p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-8">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 shrink-0 z-10 shadow-sm ${highContrast ? 'border-black bg-black border-2 border-yellow-400 text-yellow-400' : 'border-white bg-white border-2 border-gray-200 text-[#5b21b6]'}`}>
                          {selectedPatient.type === 'green' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-red-600" />}
                        </div>
                        <div className={`p-6 rounded-2xl flex-1 border-2 ${highContrast ? 'border-yellow-400' : selectedPatient.type === 'green' ? 'border-gray-100 bg-[#f8fafc]' : 'border-red-100 bg-red-50/30'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-gray-900">Secondary Biopsy</span>
                            <span className={`text-[9px] font-medium uppercase tracking-widest ${selectedPatient.type === 'green' ? 'text-green-600' : 'text-red-600'}`}>{selectedPatient.type === 'green' ? 'COMPLETED' : 'PENDING'}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {selectedPatient.type === 'green' ? 'Procedure performed within legal limits at South Zone Hub.' : 'Flow Data shows bottleneck at surgical center Hub B. Manager intervention suggested.'}
                          </p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-8">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 shrink-0 z-10 shadow-sm ${highContrast ? 'border-black bg-black border-2 border-yellow-400 text-yellow-400' : 'border-white bg-white border-2 border-red-200 text-red-600'}`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className={`p-6 rounded-2xl flex-1 border-2 ${highContrast ? 'border-yellow-400' : 'border-red-950/30 bg-red-950/5'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-red-950 uppercase">60-Day Mandate Deadline</span>
                            <span className={`text-[10px] font-medium bg-red-950 px-2.5 py-1 rounded-full text-white`}>CRITICAL WINDOW</span>
                          </div>
                          <p className="text-xs text-red-950 leading-relaxed font-medium">System predicts breach if surgical scheduling is not broadcasted within {selectedPatient.daysLeft} days.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="xl:grid xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Regional Network Pulse */}
        <div className="xl:col-span-4 space-y-6">
          <div className={`rounded-xl p-6 shadow-sm flex flex-col items-center justify-center ${hcBg}`}>
            <h3 className={`font-medium text-sm mb-6 text-center leading-tight ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
              General Statistics This Month
            </h3>

            <div className="grid grid-cols-2 gap-4 w-full">
              {[
                { icon: Video, val: '840', label: 'Tele-Health' },
                { icon: TrendingDown, val: '-22%', label: 'ER Avoided' },
                { icon: ArrowRightLeft, val: '142', label: 'Transfers' },
                { icon: Clock, val: '8d', label: 'Wait Avg' }
              ].map((kpi, idx) => (
                <div key={idx} className={`p-4 rounded-xl shadow-sm border ${hcBg}`}>
                  <kpi.icon className={`w-4 h-4 mb-2 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
                  <span className={`text-xl font-medium block ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`}>{kpi.val}</span>
                  <p className={`text-[10px] font-medium mt-1 leading-tight ${hcText}`}>{kpi.label}</p>
                </div>
              ))}
            </div>

          </div>

          <div className={`rounded-xl p-5 shadow-sm ${hcBg}`}>
            <h3 className={`font-medium text-sm flex items-center gap-2 mb-4 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
              <Activity className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Resource Bottlenecks
            </h3>
            <div className="space-y-3">
              {[
                { region: 'North Zone', resource: 'PET-CT', status: 'Critical', color: 'bg-red-500' },
                { region: 'Rural Area', resource: 'MRI Wait', status: 'High', color: 'bg-orange-500' },
                { region: 'Central Hub', resource: 'Staffing', status: 'Normal', color: 'bg-green-500' }
              ].map((b, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${hcMuted}`}>
                  <div>
                    <p className="text-[11px] font-medium text-[#2d0a4d]">{b.region}</p>
                    <p className={`text-[10px] ${hcText}`}>{b.resource}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${b.color}`}></div>
                    <span className="text-[9px] font-medium uppercase">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Content */}
        <div className="xl:col-span-8 space-y-6">
          {/* Unified Pill Navigation */}
          <div className={`flex shadow-sm rounded-lg p-1 mb-6 w-full overflow-x-auto ${hcBg}`}>
            {[
              { id: 'pathways', label: 'Patient Flow' },
              { id: 'coordination', label: 'Network Coordination' },
              { id: 'ai', label: 'AI Manager Assistant' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 whitespace-nowrap px-5 py-2.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                    ? (highContrast ? 'bg-yellow-400 text-black shadow-sm' : (darkMode ? 'bg-[#4c1d95] text-white shadow-sm border border-purple-400' : (tab.id === 'ai' ? 'bg-[#4c1d95] text-white shadow-sm' : 'bg-[#f5f3ff] text-[#4c1d95] shadow-sm border border-purple-200')))
                    : (highContrast ? (tab.id === 'ai' ? 'text-yellow-400 border border-yellow-400' : 'text-white hover:text-yellow-300') : (tab.id === 'ai' ? 'text-[#4c1d95] hover:bg-gray-100' : 'text-gray-500 hover:text-[#2d0a4d] dark:text-gray-300'))
                  }`}
              >
                {tab.id === 'ai' && <MessageSquare className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'pathways' && (
              <div className="space-y-6 animate-in fade-in">
                {/* NESTED: Regional Massive Dispatch (AI) */}
                <div className={`rounded-xl shadow-sm h-full flex flex-col overflow-hidden ${hcBg}`}>
                <div className={`p-6 border-b flex items-center gap-2 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#2d0a4d] text-white border-white/10'}`}>
                  <Activity className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-white'}`} />
                  <div>
                    <h3 className="font-medium text-sm">Regional Massive Dispatch (AI)</h3>
                    <p className={`text-[10px] ${highContrast ? 'text-yellow-400' : 'text-white/60'}`}>Real-time urgent task broadcasting</p>
                  </div>
                </div>
                  <div className={`p-6 grid grid-cols-1 md:grid-cols-2 gap-4 ${highContrast ? 'bg-black' : 'bg-white'}`}>
                    {aiApprovals.map(req => (
                      <div key={req.id} className={`p-4 rounded-xl shadow-sm border flex flex-col justify-between ${hcBg} hover:shadow-md transition-shadow`}>
                        <div>
                          <div className="flex justify-between items-start mb-3 border-b pb-2 border-gray-100">
                            <span className={`text-[9px] font-medium uppercase tracking-tight ${highContrast ? 'text-red-500' : 'text-red-700'}`}>High Priority Dispatch</span>
                            <span className={`text-[9px] font-mono ${hcText}`}>{req.id}</span>
                          </div>
                          <p className={`text-xs font-medium mb-2 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>{req.patient}</p>
                          <div className={`p-2.5 rounded-lg mb-3 ${hcMuted}`}>
                            <p className="text-[10px] font-medium text-[#2d0a4d] leading-tight"><span className={`${hcText} font-medium`}>Action:</span> {req.action}</p>
                          </div>
                        </div>

                        {req.status === 'pending' ? (
                          <div className="flex flex-col gap-2 mt-auto">
                            <div className="flex gap-2">
                              <button onClick={() => handleAiApproval(req.id, 'approved_nearby')} className={`flex-1 text-[9px] py-2 rounded-lg ${highContrast ? 'bg-red-600 text-white font-medium' : 'bg-indigo-50 text-[#4c1d95] border border-indigo-100 hover:bg-indigo-100 font-medium'} flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95`}>
                                <MapPin className="w-3 h-3" /> Signal Nearby
                              </button>
                              <button onClick={() => handleAiApproval(req.id, 'approved_network')} className={`flex-1 text-[9px] py-2 rounded-lg ${highContrast ? 'bg-red-900 text-white font-medium' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764] font-medium'} flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95`}>
                                <Network className="w-3 h-3" /> Signal Network
                              </button>
                            </div>
                            <button onClick={() => handleAiApproval(req.id, 'rejected')} className={`w-full text-[9px] py-1.5 rounded-lg ${highContrast ? 'border border-red-600 text-red-600 font-medium' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-red-600 hover:border-red-100 font-medium'} flex items-center justify-center gap-1 transition-colors`}>
                              <X className="w-3 h-3" /> Refuse Dispatch
                            </button>
                          </div>
                        ) : (
                          <div className={`p-2 rounded-lg text-center text-[9px] font-medium uppercase ${hcMuted}`}>
                            {req.status === 'approved_nearby' ? 'Nearby Regions Signaled' : 
                             req.status === 'approved_network' ? 'Entire Network Signaled' : 'Dispatch Refused'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PATIENT LIST TABLE (Professional Style) */}
                <div className={`rounded-xl shadow-sm h-full flex flex-col overflow-hidden ${hcBg}`}>
                  <div className={`p-6 border-b flex flex-col gap-6 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
                    <div>
                      <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Patient Flow Tracking</h3>
                      <p className={`text-[11px] ${hcText}`}>Monitoring the 60-Day Legal Mandate sequence.</p>
                    </div>

                    {/* FILTERS AND SEARCH */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm flex-1 min-w-[200px] ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                        <Search className={`w-3.5 h-3.5 mr-2 ${hcText}`} />
                        <input 
                          type="text" 
                          placeholder="Search patient or ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`bg-transparent focus:outline-none w-full ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`}
                        />
                      </div>

                      <div className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                        <Filter className={`w-3.5 h-3.5 mr-2 ${hcText}`} />
                        <select value={filterPathway} onChange={(e) => setFilterPathway(e.target.value)} className={`bg-transparent focus:outline-none cursor-pointer ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`}>
                          <option value="All">All Pathways</option>
                          <option value="Breast Cancer">Breast Cancer</option>
                          <option value="Lung Cancer">Lung Cancer</option>
                          <option value="Prostate Cancer">Prostate Cancer</option>
                        </select>
                      </div>

                      <div className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                        <AlertTriangle className={`w-3.5 h-3.5 mr-2 ${hcText}`} />
                        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className={`bg-transparent focus:outline-none cursor-pointer ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`}>
                          <option value="All">All Risk Levels</option>
                          <option value="Critical">Critical (≤ 5 Days)</option>
                          <option value="Elevated">Elevated (6-20 Days)</option>
                          <option value="On Track">On Track (&gt; 20 Days)</option>
                        </select>
                      </div>

                      <button 
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm transition-colors ${highContrast ? 'bg-black border-yellow-400 hover:bg-gray-900 text-yellow-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-[#2d0a4d]'}`}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
                        {sortOrder === 'asc' ? 'Urgent first' : 'Later first'}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className={`border-b ${highContrast ? 'bg-black border-yellow-400/30' : 'bg-white border-gray-200'}`}>
                        <tr>
                          <th className={`p-5 text-[10px] font-medium uppercase tracking-wider ${hcText}`}>Patient</th>
                          <th className={`p-5 text-[10px] font-medium uppercase tracking-wider ${hcText}`}>Pathway</th>
                          <th className={`p-5 text-[10px] font-medium uppercase tracking-wider ${hcText}`}>Status</th>
                          <th className={`p-5 text-[10px] font-medium uppercase tracking-wider ${hcText}`}>Action</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${highContrast ? 'divide-yellow-400/20' : 'divide-gray-100'}`}>
                        {filteredPatients.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-10 text-center">
                              <p className={`text-xs font-medium ${hcText}`}>No patients matching your filters.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredPatients.map((p, i) => (
                            <tr key={i} className={`transition-colors ${highContrast ? 'hover:bg-gray-900' : 'hover:bg-[#f8fafc]'}`}>
                              <td className="p-5">
                                <div className="flex flex-col">
                                  <span className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>{p.name}</span>
                                  <span className={`text-[10px] font-mono mt-0.5 ${hcText}`}>{p.id}</span>
                                </div>
                              </td>
                              <td className={`p-5 text-xs font-medium ${highContrast ? 'text-white' : 'text-[#334155]'}`}>{p.pathway}</td>
                              <td className="p-5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${p.status === 'Critical Risk' ? 'bg-[#7f1d1d]' : p.status === 'Elevated Risk' ? 'bg-[#d97706]' : 'bg-[#5b21b6]'}`}></div>
                                  <span className={`text-[10px] font-medium uppercase tracking-wider ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>{p.daysLeft} Days Left</span>
                                </div>
                              </td>
                              <td className="p-5">
                                <button 
                                  onClick={() => openPatientSim(p)}
                                  className={`text-[11px] font-medium hover:underline ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'coordination' && (
              <div className="space-y-6 animate-in fade-in">
                {/* NESTED: Resource Routing (AI) */}
                <div className={`rounded-xl p-8 shadow-sm ${hcBg}`}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-medium flex items-center gap-3"><Activity className={`w-6 h-6 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> AI Intelligent Routing Engine</h3>
                      <p className={`text-xs mt-1 ${hcText}`}>Real-time workload balancing & cross-region optimization</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest ${highContrast ? 'bg-gray-900 text-yellow-400 border border-yellow-400' : 'bg-purple-50 text-[#4c1d95]'}`}>Active Nodes: 14/15</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {routingActions.map((item) => (
                      <div key={item.id} className={`p-6 rounded-xl border-l-4 transition-all hover:scale-[1.02] ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100 hover:bg-white hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <span className={`text-[9px] font-medium px-2 py-0.5 rounded uppercase tracking-tighter ${item.type === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{item.type}</span>
                        </div>
                        <p className={`text-xs leading-relaxed mb-4 ${hcText}`}>{item.desc}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100/10">
                          <span className="text-[10px] font-medium text-green-600 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> {item.impact}</span>
                          {item.status === 'pending' ? (
                            <button
                              onClick={() => executeRoutingMove(item.id)}
                              className={`text-[11px] font-medium flex items-center gap-1 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95] hover:underline'}`}
                            >
                              Execute Move <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-medium text-green-600 uppercase flex items-center gap-1">
                              {item.status === 'executing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              {item.status === 'executing' ? 'Executing...' : 'Completed'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LOAD BALANCING CHART */}
                <div className={`rounded-xl shadow-sm p-6 ${hcBg}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Network Load Balancing</h3>
                      <p className={`text-[11px] ${hcText}`}>Real-time Demand vs Capacity breakdown.</p>
                    </div>
                    <div className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm w-max ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                      <MapPin className={`w-3.5 h-3.5 mr-2 ${highContrast ? 'text-yellow-400' : 'text-[#475569]'}`} />
                      <select value={networkRegion} onChange={(e) => setNetworkRegion(e.target.value)} className="bg-transparent focus:outline-none cursor-pointer text-xs">
                        <option value="Global View">Global View</option>
                        <option value="Central Hub">Central Hub</option>
                        <option value="South Zone">South Zone</option>
                        <option value="North Zone">North Zone</option>
                        <option value="Rural Area">Rural Area</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={networkDataByRegion[networkRegion]} margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="demand" name="Demand" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="capacity" name="Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className={`rounded-xl shadow-sm flex flex-col h-[600px] animate-in fade-in overflow-hidden ${hcBg}`}>
                <div className={`p-4 flex items-center justify-between border-b ${highContrast ? 'bg-gray-900 border-yellow-400' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f1f5f9] border-gray-200'}`}>
                  <div>
                    <h3 className={`font-medium text-sm flex items-center gap-2 ${highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}>
                      <MessageSquare className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> AI Manager Strategic Assistant
                    </h3>
                    <p className={`text-[11px] mt-0.5 ${hcText}`}>Enterprise-wide decision support & workload balancing</p>
                  </div>
                </div>

                <div className={`flex-1 p-6 overflow-y-auto space-y-4 ${highContrast ? 'bg-black' : darkMode ? 'bg-[#2d0a4d]' : 'bg-white'}`}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl shadow-sm max-w-[85%] animate-in fade-in slide-in-from-bottom-2 border ${msg.role === 'ai'
                          ? `rounded-tl-none ${highContrast ? 'bg-gray-900 border-yellow-400' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f1f5f9] border-gray-200'}`
                          : `rounded-tr-none ml-auto ${highContrast ? 'bg-yellow-400 text-black border-yellow-500' : darkMode ? 'bg-[#3b0764] text-white border-purple-700' : 'bg-[#4c1d95] text-white'}`
                        }`}
                    >
                      {msg.text.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={`text-xs leading-relaxed ${idx > 0 ? 'mt-2' : ''} ${msg.role === 'ai' ? (highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]') : 'font-medium'}`}>
                          {paragraph.split('**').map((part, index) =>
                            index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                          )}
                        </p>
                      ))}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className={`p-4 ${highContrast ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask the Strategic AI... e.g. 'Reallocate PET-CT units'"
                      className={`flex-1 rounded-md px-3 py-2 text-xs focus:outline-none ${highContrast ? 'bg-black border border-yellow-400 text-white focus:border-yellow-300' : 'bg-white border border-gray-300 text-[#2d0a4d] focus:border-[#4c1d95]'}`}
                    />
                    <button onClick={() => handleSendMessage()} className={`px-4 py-2 rounded-md text-xs font-medium transition-colors shadow-sm flex items-center justify-center ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] hover:bg-[#3b0764] text-white'}`}>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
