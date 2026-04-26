import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend, Cell } from 'recharts';
import { AlertTriangle, Clock, CheckCircle, Video, X, Check, ShieldCheck, MapPin, User, Activity, TrendingDown, RefreshCw, ArrowRightLeft, Filter, ArrowUpDown, LayoutDashboard } from 'lucide-react';

export default function ManagerView({ highContrast, darkMode, isAuthenticated, setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('coordination');
  const [showPatientSim, setShowPatientSim] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [filterPathway, setFilterPathway] = useState('All'); // All, Breast Cancer, etc.
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  
  const [networkRegion, setNetworkRegion] = useState('Global View');

  const [aiApprovals, setAiApprovals] = useState([
    { id: 'REQ-102', patient: 'N. R. (ID: #10293)', action: 'Expedite Core Needle Biopsy', reason: 'Critical Delay: 2 Days left on 60-Day Mandate', status: 'pending' },
    { id: 'REQ-103', patient: 'A. S. (ID: #67890)', action: 'Block Secondary Order (Duplicates)', reason: 'Identical pathology exam requested by two different physicians', status: 'pending' },
    { id: 'REQ-104', patient: 'R. A. (ID: #77889)', action: 'Suggest Tele-Consultation', reason: 'Rural region patient. Avoids unnecessary ER travel', status: 'pending' }
  ]);

  const networkDataByRegion = {
    'Global View': [
      { name: 'Blood Tests', demand: 1200, capacity: 1500 },
      { name: 'MRI & CT', demand: 850, capacity: 800 },
      { name: 'PET-CT', demand: 420, capacity: 300 }, // Bottleneck
      { name: 'Core Biopsies', demand: 550, capacity: 480 }, // Bottleneck
      { name: 'Surgical Slots', demand: 320, capacity: 310 },
      { name: 'Chemo & Radio', demand: 980, capacity: 1100 }
    ],
    'Central Hub': [
      { name: 'Blood Tests', demand: 400, capacity: 600 },
      { name: 'MRI & CT', demand: 300, capacity: 400 },
      { name: 'PET-CT', demand: 150, capacity: 200 }, // Safe
      { name: 'Core Biopsies', demand: 200, capacity: 250 }, // Safe
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
      { name: 'MRI & CT', demand: 120, capacity: 50 }, // Massive bottleneck
      { name: 'PET-CT', demand: 60, capacity: 0 }, // No equipment
      { name: 'Core Biopsies', demand: 80, capacity: 20 }, // Severe bottleneck
      { name: 'Surgical Slots', demand: 40, capacity: 20 },
      { name: 'Chemo & Radio', demand: 100, capacity: 50 }
    ]
  };

  const managerPatients = [
    { id: '#84729', name: 'M. S.', pathway: 'Breast Cancer', type: 'red', desc: 'Secondary procedures delayed', daysLeft: 2, status: 'Critical Risk' },
    { id: '#10293', name: 'N. R.', pathway: 'Breast Cancer', type: 'yellow', desc: 'Awaiting specialist consult', daysLeft: 12, status: 'Elevated Risk' },
    { id: '#93847', name: 'E. F.', pathway: 'Lung Cancer', type: 'green', desc: 'Treatment initiated', daysLeft: 45, status: 'On Track' },
    { id: '#54321', name: 'C. M.', pathway: 'Prostate Cancer', type: 'yellow', desc: 'Biopsy pending scheduling', daysLeft: 18, status: 'Elevated Risk' },
    { id: '#67890', name: 'A. S.', pathway: 'Cervical Cancer', type: 'red', desc: 'Surgical center bottleneck', daysLeft: 5, status: 'Critical Risk' },
    { id: '#24680', name: 'R. L.', pathway: 'Colon Cancer', type: 'green', desc: 'Chemotherapy started', daysLeft: 30, status: 'On Track' },
    { id: '#13579', name: 'F. C.', pathway: 'Breast Cancer', type: 'green', desc: 'Post-op recovery', daysLeft: 50, status: 'On Track' },
    { id: '#11223', name: 'J. C.', pathway: 'Lung Cancer', type: 'yellow', desc: 'Awaiting imaging results', daysLeft: 14, status: 'Elevated Risk' },
    { id: '#44556', name: 'P. G.', pathway: 'Thyroid Cancer', type: 'red', desc: 'Critical Delay - Squeeze-in req.', daysLeft: 1, status: 'Critical Risk' },
    { id: '#77889', name: 'R. A.', pathway: 'Prostate Cancer', type: 'green', desc: 'Radiation therapy', daysLeft: 40, status: 'On Track' }
  ];

  const openPatientSim = (p) => {
    setSelectedPatient(p);
    setShowPatientSim(true);
  };

  const handleAiApproval = (id, decision) => {
    setAiApprovals(prev => prev.map(req => req.id === id ? { ...req, status: decision } : req));
  };

  const filteredPatients = useMemo(() => {
    let result = managerPatients;
    if (filterPathway !== 'All') {
      result = result.filter(p => p.pathway === filterPathway);
    }
    result = result.sort((a, b) => {
      if (sortOrder === 'asc') return a.daysLeft - b.daysLeft;
      return b.daysLeft - a.daysLeft;
    });
    return result;
  }, [filterPathway, sortOrder]);

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
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 text-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] hover:bg-[#312e81] text-white shadow-md shadow-indigo-100'}`}
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
    <div className="animate-in fade-in duration-500 relative">

      {/* PATIENT SIMULATOR */}
      {showPatientSim && selectedPatient && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex justify-end">
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

      {/* Unified Pill Navigation */}
      <div className={`flex flex-wrap shadow-sm rounded-lg p-1 mb-6 gap-1 w-max ${hcBg}`}>
        {[
          { id: 'ai_queue', label: 'AI Actions Queue' },
          { id: 'routing', label: 'Resource Routing (AI)' },
          { id: 'pathways', label: 'Patient Flow' },
          { id: 'coordination', label: 'Network Coordination' },
          { id: 'analytics', label: 'HIE Analytics' }
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

      {/* TAB: ROUTING (NEW AI SECTION) */}
      {activeTab === 'routing' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-500">
          <div className="xl:col-span-8 space-y-6">
            <div className={`rounded-xl p-8 shadow-sm ${hcBg}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-medium flex items-center gap-3">
                    <Activity className={`w-6 h-6 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> AI Intelligent Routing Engine
                  </h3>
                  <p className={`text-xs mt-1 ${hcText}`}>Real-time workload balancing & cross-region optimization</p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest ${highContrast ? 'bg-gray-900 text-yellow-400 border border-yellow-400' : 'bg-purple-50 text-[#4c1d95]'}`}>
                  Active Nodes: 14/15
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    title: 'Load Balancing: North Zone', 
                    desc: 'PET-CT capacity at 0%. AI suggests shifting 12 non-critical scans to South Zone Hub.',
                    impact: 'Reduces wait by 4 days',
                    type: 'high'
                  },
                  { 
                    title: 'Workload Shift: Dr. Jenkins', 
                    desc: 'Surgery backlog identified. Suggest routing biopsy reviews to Dr. Miller (Rural Cluster).',
                    impact: 'Prevents mandate breach for 5 patients',
                    type: 'critical'
                  },
                  { 
                    title: 'Resource Pre-allocation', 
                    desc: 'Expected spike in Breast Cancer referrals in Central Hub. Suggesting +2 biopsy slots for next week.',
                    impact: 'Operational efficiency +15%',
                    type: 'medium'
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`p-6 rounded-xl border-l-4 transition-all hover:scale-[1.02] ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100 hover:bg-white hover:shadow-md'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded uppercase tracking-tighter ${
                        item.type === 'critical' ? 'bg-red-100 text-red-700' : item.type === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed mb-4 ${hcText}`}>{item.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100/10">
                      <span className="text-[10px] font-medium text-green-600 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> {item.impact}
                      </span>
                      <button className={`text-[11px] font-medium flex items-center gap-1 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95] hover:underline'}`}>
                        Execute Move <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className={`rounded-xl p-6 shadow-sm border-t-4 ${highContrast ? 'bg-black border-yellow-400 text-white' : 'bg-white border-[#4c1d95] border-t-[#4c1d95] text-[#0f172a]'}`}>
              <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Routing Simulations
              </h4>
              <p className={`text-xs leading-relaxed ${hcText}`}>
                AI is currently simulating a <strong>Cross-Region Shift</strong> of surgical equipment from South to North Zone to cover a critical maintenance window.
              </p>
              <div className="mt-6 space-y-3">
                <div className={`h-2 rounded-full overflow-hidden ${highContrast ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <div className="bg-[#4c1d95] h-full w-[78%] animate-pulse"></div>
                </div>
                <p className="text-[10px] text-right text-gray-500 font-mono">SIMULATING: 78% COMPLETE</p>
              </div>
              <button className={`w-full mt-8 py-3 rounded-lg text-[11px] font-medium transition-all ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}>
                View Simulation Reports
              </button>
            </div>

            <div className={`rounded-xl p-6 shadow-sm ${hcBg}`}>
              <h4 className="font-medium text-sm mb-4">Inter-Node Latency</h4>
              <div className="space-y-4">
                {['Central Hub', 'South Zone', 'North Zone'].map(node => (
                  <div key={node} className="flex items-center justify-between">
                    <span className={`text-xs ${hcText}`}>{node}</span>
                    <span className="text-[10px] font-medium text-green-500">Live (2ms)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-12 space-y-6">

          {activeTab === 'ai_queue' && (
            <div className={`rounded-xl shadow-sm h-full flex flex-col overflow-hidden max-w-4xl ${hcBg}`}>
              <div className={`p-6 border-b flex items-center gap-2 ${highContrast ? 'bg-gray-900 border-yellow-400' : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f8fafc] border-gray-200'}`}>
                <Activity className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
                <div>
                  <h3 className={`font-medium text-sm ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                    AI Network Actions Queue
                  </h3>
                </div>
              </div>

              <div className={`p-6 flex-1 space-y-4 ${highContrast ? 'bg-black' : 'bg-white'}`}>
                {aiApprovals.map(req => (
                  <div key={req.id} className={`p-5 rounded-xl shadow-sm ${hcBg}`}>
                    <div className={`flex justify-between items-start mb-4 border-b pb-3 ${highContrast ? 'border-yellow-400/30' : 'border-gray-100'}`}>
                      <span className={`px-2.5 py-1 rounded text-[9px] font-medium uppercase tracking-wider shadow-sm ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#f8fafc] text-[#4c1d95] border border-gray-200'}`}>System Request</span>
                      <span className={`text-[10px] font-mono ${hcText}`}>{req.id}</span>
                    </div>
                    
                    <p className={`text-xs font-medium mb-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Patient: {req.patient}</p>
                    
                    <div className={`p-3 rounded-lg mb-4 ${hcMuted}`}>
                      <p className={`text-[11px] font-medium mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}><span className={`${hcText} font-medium`}>Action:</span> {req.action}</p>
                      <p className={`text-[10px] font-medium ${highContrast ? 'text-yellow-300' : 'text-[#7f1d1d]'}`}><span className={`${hcText} font-medium`}>Reason:</span> {req.reason}</p>
                    </div>

                    {req.status === 'pending' ? (
                      <div className="flex gap-3">
                        <button onClick={() => handleAiApproval(req.id, 'approved')} className={`flex-1 text-[11px] font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}>
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleAiApproval(req.id, 'rejected')} className={`flex-1 text-[11px] font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400 hover:bg-gray-900' : 'bg-white text-[#334155] border border-gray-300 hover:bg-gray-50'}`}>
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className={`p-3 rounded-lg text-center text-[10px] font-medium uppercase ${hcMuted}`}>
                        {req.status === 'approved' ? 'Authorized' : 'Rejected'}
                      </div>
                    )}
                  </div>
                ))}
                
                {aiApprovals.every(req => req.status !== 'pending') && (
                  <div className={`text-center p-8 rounded-xl flex flex-col items-center justify-center h-48 ${hcMuted}`}>
                    <CheckCircle className={`w-8 h-8 mb-2 ${highContrast ? 'text-yellow-400' : 'text-[#cbd5e1]'}`} />
                    <p className={`text-xs font-medium ${highContrast ? 'text-white' : 'text-[#64748b]'}`}>No pending actions.</p>
                    <p className={`text-[10px] mt-1 ${hcText}`}>All network pathways are currently optimized.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pathways' && (
            <div className={`rounded-xl shadow-sm h-full flex flex-col overflow-hidden max-w-4xl ${hcBg}`}>
              <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
                <div>
                  <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Patient Flow Tracking</h3>
                  <p className={`text-[11px] ${hcText}`}>Monitoring the 60-Day Legal Mandate sequence.</p>
                </div>
                
                {/* FILTERS AND SORT */}
                <div className="flex items-center gap-3">
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

                  <button 
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm transition-colors ${highContrast ? 'bg-black border-yellow-400 hover:bg-gray-900 text-yellow-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-[#0f172a]'}`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
                    Days Left ({sortOrder === 'asc' ? 'Min first' : 'Max first'})
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[600px] p-6 space-y-3">
                {filteredPatients.length === 0 ? (
                  <div className={`text-center p-8 rounded-xl flex flex-col items-center justify-center ${hcMuted}`}>
                    <p className={`text-xs font-medium ${highContrast ? 'text-white' : 'text-[#64748b]'}`}>No patients found for '{filterPathway}'.</p>
                  </div>
                ) : (
                  filteredPatients.map((p, i) => (
                    <div key={i} onClick={() => openPatientSim(p)} className={`flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer shadow-sm ${highContrast ? 'bg-black border border-yellow-400 hover:border-yellow-200' : 'bg-white border border-gray-200 hover:border-[#4c1d95]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${p.type === 'red' ? 'bg-[#7f1d1d]' : p.type === 'yellow' ? 'bg-[#d97706]' : 'bg-[#5b21b6]'}`}></div>
                        <div>
                          <h4 className={`font-medium text-xs ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Patient {p.id}</h4>
                          <p className={`text-[10px] mt-0.5 ${hcText}`}>{p.pathway} • {p.desc}</p>
                        </div>
                      </div>
                      
                      {/* FLAT "X Days Left", NO BACKGROUND NO BORDER */}
                      <span className={`text-[10px] font-medium flex items-center gap-1.5 uppercase tracking-wider ${highContrast ? 'text-white' : 'text-[#334155]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.type === 'red' ? 'bg-[#7f1d1d]' : p.type === 'yellow' ? 'bg-[#d97706]' : 'bg-[#5b21b6]'}`}></div>
                        {p.daysLeft} Days
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'coordination' && (
            <div className="space-y-6">
              {/* KPIs Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Video, val: '840', label: 'Tele-Health Consults', sub: '+15% this month' },
                  { icon: TrendingDown, val: '-22%', label: 'ER Visits Avoided', sub: 'Early intervention' },
                  { icon: ArrowRightLeft, val: '142', label: 'Inter-facility Transfers', sub: 'Optimized routing' },
                  { icon: Clock, val: '8 Days', label: 'Avg Waiting Time', sub: 'For initial diagnostic' }
                ].map((kpi, idx) => (
                  <div key={idx} className={`p-5 rounded-xl shadow-sm flex flex-col ${hcBg}`}>
                    <div className="flex items-center justify-between mb-3">
                      <kpi.icon className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
                    </div>
                    <span className={`text-3xl font-medium ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}>{kpi.val}</span>
                    <p className={`text-xs font-medium mt-1 ${highContrast ? 'text-white' : 'text-[#334155]'}`}>{kpi.label}</p>
                    <p className={`text-[10px] mt-0.5 ${hcText}`}>{kpi.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demand vs Capacity Chart */}
                <div className={`rounded-xl shadow-sm p-6 flex flex-col ${hcBg}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>Load Balancing by Procedure</h3>
                      <p className={`text-[11px] ${hcText}`}>Real-time Demand vs Capacity breakdown.</p>
                    </div>
                    
                    <div className={`flex items-center px-3 py-2 rounded-md text-xs font-medium border shadow-sm w-max ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                      <MapPin className={`w-3.5 h-3.5 mr-2 ${highContrast ? 'text-yellow-400' : 'text-[#475569]'}`} />
                      <select 
                        value={networkRegion}
                        onChange={(e) => setNetworkRegion(e.target.value)}
                        className={`bg-transparent focus:outline-none cursor-pointer ${highContrast ? 'text-yellow-400' : 'text-[#0f172a]'}`}
                      >
                        <option value="Global View">Global View</option>
                        <option value="Central Hub">Central Hub</option>
                        <option value="South Zone">South Zone</option>
                        <option value="North Zone">North Zone</option>
                        <option value="Rural Area">Rural Area</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={networkDataByRegion[networkRegion]} margin={{ top: 5, right: 0, bottom: 25, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={highContrast ? '#333' : '#e2e8f0'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : '#64748b'}} interval={0} angle={-25} textAnchor="end" />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: highContrast ? '#facc15' : '#64748b'}} />
                        <Tooltip cursor={{fill: highContrast ? '#222' : '#f1f5f9'}} contentStyle={highContrast ? {backgroundColor: '#000', color: '#fff', border: '1px solid #facc15'} : {borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px'}} />
                        <Legend verticalAlign="top" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                        <Bar dataKey="demand" name="Patient Demand" fill={highContrast ? '#facc15' : '#7c3aed'} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="capacity" name="Available Slots" fill={highContrast ? '#fff' : '#cbd5e1'} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Load Balancing Log */}
                <div className={`rounded-xl shadow-sm flex flex-col h-full overflow-hidden ${hcBg}`}>
                  <div className={`p-6 border-b ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
                    <h3 className={`font-medium text-sm flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>
                      <RefreshCw className="w-4 h-4" /> AI Dynamic Load Balancing
                    </h3>
                    <p className={`text-[11px] mt-1 ${hcText}`}>Automatic resource reallocation history.</p>
                  </div>
                  
                  <div className={`p-6 flex-1 space-y-4 overflow-y-auto ${highContrast ? 'bg-black' : 'bg-white'}`}>
                    {[
                      { action: 'Shifted 15 MRI slots', from: 'Central Hub', to: 'South Zone', time: '10 min ago' },
                      { action: 'Redirected 4 Biopsies', from: 'East Sector', to: 'North Zone', time: '1 hr ago' },
                      { action: 'Activated Tele-Triaging', from: 'Rural Area', to: 'Central Specialists', time: '3 hrs ago' }
                    ].map((log, idx) => (
                      <div key={idx} className={`p-4 rounded-lg flex items-start justify-between ${hcMuted}`}>
                        <div>
                          <h4 className={`text-xs font-medium ${highContrast ? 'text-white' : 'text-[#0f172a]'}`}>{log.action}</h4>
                          <p className={`text-[10px] mt-1 ${hcText}`}>From <strong className={highContrast ? 'text-yellow-400' : 'text-[#334155]'}>{log.from}</strong> to <strong className={highContrast ? 'text-yellow-400' : 'text-[#334155]'}>{log.to}</strong>.</p>
                        </div>
                        <span className={`text-[9px] font-medium ${hcText}`}>{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
