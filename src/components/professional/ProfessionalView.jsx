import { useState, useMemo, useEffect } from 'react';
import { Bookmark, CheckCircle2, FileJson, Video, ClipboardCheck, X, Mic, Camera, MonitorUp, PhoneOff, User, UserCircle, ChevronLeft, Calendar, MapPin, CalendarPlus, ArrowRight, CalendarDays, AlertTriangle, Check, Filter, ArrowUpDown, Stethoscope, ShieldCheck, Activity, Clock, Brain, Sparkles, FileText, Users, MessageSquare, ChevronRight, Share2, Award, Thermometer, Database, Search, Plus, RefreshCw } from 'lucide-react';

export default function ProfessionalView({ highContrast, darkMode, isAuthenticated, setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showTeleSim, setShowTeleSim] = useState(false);
  const [showScheduleSim, setShowScheduleSim] = useState(false);
  const [showMsView, setShowMsView] = useState(false);
  const [aiChatView, setAiChatView] = useState(false);
  const [simulatorMessages, setSimulatorMessages] = useState([]);

  // Initialize and Reset simulator messages
  useEffect(() => {
    if (showScheduleSim) {
      setSimulatorMessages([
        {
          role: 'ai',
          type: 'network',
          content: 'Current workload at Hub A is 88%, while Hub B (Biopsy Specialized) reports 42%. By routing this procedure to Hub B on April 03, we achieve a 25% increase in throughput efficiency.'
        },
        {
          role: 'ai',
          type: 'compliance',
          content: 'This date ensures a 12-day margin before the legal breach threshold. Predictive models suggest 94% probability of successful post-op follow-up within the same window.'
        }
      ]);
    } else {
      setSimulatorMessages([]);
      setAiChatView(false); // Also reset the view to calendar
    }
  }, [showScheduleSim]);

  const [aiSqueezeStatus, setAiSqueezeStatus] = useState('pending'); // pending, accepted, rejected
  const [calendarView, setCalendarView] = useState('week'); // day, week, month, year

  const [filterPathway, setFilterPathway] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDispatches, setPendingDispatches] = useState([
    { id: 'D1', patient: 'A. K.', id_num: '#99821', pathway: 'Lung Cancer', daysLeft: 2, type: 'Global Dispatch', region: 'North Zone', procedure: 'Urgent Biopsy' },
    { id: 'D2', patient: 'L. M.', id_num: '#77210', pathway: 'Breast Cancer', daysLeft: 4, type: 'Local Dispatch', region: 'This Facility', procedure: 'Post-op Review' }
  ]);

  const [hiddenCriticalCards, setHiddenCriticalCards] = useState([]);

  const handleAcceptDispatch = (id) => {
    const dispatch = pendingDispatches.find(d => d.id === id);
    if (dispatch) {
      // Add to patient list
      const newPatient = {
        id: dispatch.id_num,
        name: dispatch.patient,
        pathway: dispatch.pathway,
        status: dispatch.daysLeft <= 5 ? 'Critical Risk' : 'Elevated Risk',
        mandate: `${dispatch.daysLeft} Days Left`,
        daysLeft: dispatch.daysLeft,
        highlight: true
      };
      setPatientsListState(prev => [newPatient, ...prev]);

      // Critical dispatches will now automatically appear in the Sidebar 
      // as an 'AI Squeeze' due to the sidebar's filter logic.
    }
    setPendingDispatches(prev => prev.filter(d => d.id !== id));
  };

  const handleRejectDispatch = (id) => {
    setPendingDispatches(prev => prev.filter(d => d.id !== id));
  };

  const [sortOrder, setSortOrder] = useState('asc');
  const [showPatientSim, setShowPatientSim] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTab, setPatientTab] = useState('timeline'); // timeline, collaboration, copilot

  // NEW FEATURES STATE
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [teleTranscription, setTeleTranscription] = useState([]);
  const [isScribeActive, setIsScribeActive] = useState(false);
  const [teleSummary, setTeleSummary] = useState('');
  const [collaborationVotes, setCollaborationVotes] = useState({
    'Neoadjuvant Chemo': 3,
    'Immediate Surgery': 1,
    'Radiation First': 0
  });

  const [dragError, setDragError] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [simInput, setSimInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'ai',
      content: (
        <>
          AI Clinical Triage Active
          <br />
          You have 3 patients approaching the 60-Day Mandate breach (P. G., M. S., A. S.). I have prepared optimized AI Squeeze slots for each. Should I proceed with the overbooking sequence?
        </>
      ),
      text: 'initial'
    }
  ]);

  const [patientsListState, setPatientsListState] = useState([
    {
      id: '#84729', name: 'M. S.', pathway: 'Breast Cancer', status: 'Critical Risk', mandate: '2 Days Left', daysLeft: 2, highlight: true,
      age: 58, gender: 'Female', bloodType: 'O+', region: 'North Zone Hub',
      timeline: [
        { title: 'Primary Diagnosis Confirmation', date: 'MAR 12', type: 'Pathology', desc: 'Positive for invasive ductal carcinoma. HER2 negative. ER/PR positive.', doc: { title: 'Primary Pathology Report', type: 'Pathology', content: 'Positive for invasive ductal carcinoma. Histological grade G2. ER: 90%, PR: 80%.' } },
        { title: 'Staging Imaging (CT Scan)', date: 'MAR 18', type: 'Radiology', desc: 'Image data stored at Federated Hub A. PET-CT scheduled.', doc: { title: 'Total Body CT Scan', type: 'Radiology', date: 'MAR 18' } }
      ],
      discussion: [
        { dr: 'Robert J.', role: 'Oncological Surgeon', time: '2h ago', content: 'Nodule is 2.4cm. Neoadjuvant therapy might be safer before excision.' },
        { dr: 'Alice O.', role: 'Medical Oncology', time: '15m ago', content: 'Agreed. Let\'s confirm markers on tomorrow\'s biopsy.' }
      ],
      exams: [
        { title: 'Primary Pathology Report', type: 'Pathology', date: 'Mar 12, 2026', size: '2.4 MB', clinic: 'City Hub B' },
        { title: 'Full Body CT Scan', type: 'Radiology', date: 'Mar 18, 2026', size: '45.1 MB', clinic: 'Regional Center' },
        { title: 'Genomic Panel (BRCA)', type: 'Genetics', date: 'Feb 28, 2026', size: '1.2 MB', clinic: 'Natl Lab' }
      ],
      aiInsights: [
        { title: 'Critical Risk Sync', icon: 'alert', content: 'Hemoglobin Drop (15%). HIE Federated Registry detected a drop to 10.2 g/dL in labs from City Hub B.', action: 'Request Pre-Op Support' },
        { title: 'Network Protocol Sync', icon: 'db', content: 'Contrast Allergy Alert. Patient reported Gadolinium reaction at Regional Hospital A (2023).', action: 'Update Imaging Order' }
      ]
    },
    {
      id: '#44556', name: 'P. G.', pathway: 'Thyroid Cancer', status: 'Critical Risk', mandate: '1 Day Left', daysLeft: 1, highlight: false,
      age: 42, gender: 'Male', bloodType: 'A-', region: 'Rural Area Hub',
      timeline: [
        { title: 'Initial Ultrasound', date: 'MAR 05', type: 'Radiology', desc: 'Hypoechoic nodule detected in right lobe. TRADS-5.', doc: { title: 'Thyroid Ultrasound', type: 'Radiology', content: '1.8cm solid nodule with microcalcifications.' } },
        { title: 'Fine Needle Aspiration', date: 'MAR 20', type: 'Pathology', desc: 'Bethesda VI: Papillary Thyroid Carcinoma suspected.', doc: { title: 'Cytology Report', type: 'Pathology', content: 'Malignant cells consistent with papillary carcinoma.' } }
      ],
      discussion: [
        { dr: 'Elena V.', role: 'Endocrinologist', time: '1d ago', content: 'Patient is asymptomatic but cytology is conclusive. Total thyroidectomy recommended.' },
        { dr: 'Marc K.', role: 'Head & Neck Surgeon', time: '4h ago', content: 'Cleared for surgery once mandate compliance is logged.' }
      ],
      exams: [
        { title: 'Thyroid Ultrasound', type: 'Radiology', date: 'Mar 05, 2026', size: '12.4 MB', clinic: 'Rural Clinic' },
        { title: 'FNA Cytology', type: 'Pathology', date: 'Mar 20, 2026', size: '0.9 MB', clinic: 'City Lab' }
      ],
      aiInsights: [
        { title: 'Surgical Readiness', icon: 'alert', content: 'Nerve monitoring equipment availability confirmed for Friday session at Rural Hub B.', action: 'Lock Surgical Slot' },
        { title: 'HIE Data Pull', icon: 'db', content: 'Calcium levels stable (9.2 mg/dL) from outside lab sync.', action: 'Review Labs' }
      ]
    },
    {
      id: '#67890', name: 'A. S.', pathway: 'Cervical Cancer', status: 'Critical Risk', mandate: '5 Days Left', daysLeft: 5, highlight: false,
      age: 34, gender: 'Female', bloodType: 'B+', region: 'Central Hub',
      timeline: [
        { title: 'Abnormal Pap Smear', date: 'FEB 15', type: 'Pathology', desc: 'HSIL detected. Urgent colposcopy performed.', doc: { title: 'Cytology Report', type: 'Pathology', content: 'High-grade squamous intraepithelial lesion.' } },
        { title: 'MRI Pelvis Staging', date: 'MAR 10', type: 'Radiology', desc: 'Parametrial involvement suspected. Staging IIB.', doc: { title: 'MRI Pelvis', type: 'Radiology', content: '3cm lesion with potential stromal invasion.' } }
      ],
      discussion: [
        { dr: 'Sarah L.', role: 'GYN Oncologist', time: '3h ago', content: 'Radiotherapy should start as soon as possible. Delay would impact prognosis.' },
        { dr: 'James B.', role: 'Radiotherapy', time: '1h ago', content: 'Simulation scheduled for Thursday. Waiting for final consult.' }
      ],
      exams: [
        { title: 'HSIL Pathology', type: 'Pathology', date: 'Feb 15, 2026', size: '1.1 MB', clinic: 'Women\'s Clinic' },
        { title: 'MRI Pelvis', type: 'Radiology', date: 'Mar 10, 2026', size: '32.5 MB', clinic: 'Hub Central' }
      ],
      aiInsights: [
        { title: 'Treatment Urgency', icon: 'alert', content: 'Waitlist at Hub Central is 14 days. AI suggests redirecting to North Zone for 48h start.', action: 'Route to North Hub' },
        { title: 'Fertility Sync', icon: 'db', content: 'Patient expressed interest in oocyte cryopreservation prior to RT.', action: 'Consult Fertility' }
      ]
    },
    {
      id: '#10293', name: 'N. R.', pathway: 'Breast Cancer', status: 'Elevated Risk', mandate: '12 Days Left', daysLeft: 12, highlight: false,
      age: 48, gender: 'Female', bloodType: 'O-', region: 'West Wing',
      timeline: [{ title: 'Mammogram', date: 'FEB 20', type: 'Radiology', desc: 'BIRADS 4c. Irregular mass.', doc: { title: 'Mammography', type: 'Radiology', content: 'Spiculated mass 1.5cm.' } }],
      discussion: [{ dr: 'Kevin M.', role: 'Radiologist', time: '5d ago', content: 'Architectural distortion is significant.' }],
      exams: [{ title: 'Mammogram', type: 'Radiology', date: 'Feb 20, 2026', size: '15 MB', clinic: 'West Imaging' }],
      aiInsights: [{ title: 'Genomic Warning', icon: 'alert', content: 'Family history of BRCA+ in HIE records. Genetic counseling highly recommended.', action: 'Refer to Genetics' }]
    },
    {
      id: '#93847', name: 'E. F.', pathway: 'Lung Cancer', status: 'On Track', mandate: '45 Days Left', daysLeft: 45, highlight: false,
      age: 65, gender: 'Male', bloodType: 'AB+', region: 'Coastal Facility',
      timeline: [{ title: 'Chest CT', date: 'JAN 15', type: 'Radiology', desc: '2cm nodule in left upper lobe.', doc: { title: 'Chest CT', type: 'Radiology', content: 'Solid nodule with pleural indentation.' } }],
      discussion: [{ dr: 'Linda P.', role: 'Pulmonologist', time: '1w ago', content: 'Biopsy planned for next month. Patient is stable.' }],
      exams: [{ title: 'Chest CT', type: 'Radiology', date: 'Jan 15, 2026', size: '50 MB', clinic: 'Coastal Diagnostic' }],
      aiInsights: [{ title: 'Stability Audit', icon: 'db', content: 'Growth rate is low (3% in 6 months). Safe to maintain current timeline.', action: 'Log Audit' }]
    },
    {
      id: '#54321', name: 'C. M.', pathway: 'Prostate Cancer', status: 'Elevated Risk', mandate: '18 Days Left', daysLeft: 18, highlight: false,
      age: 72, gender: 'Male', bloodType: 'O+', region: 'Central Hub',
      timeline: [{ title: 'PSA Screening', date: 'MAR 01', type: 'Clinical', desc: 'PSA elevated at 8.4 ng/mL.', doc: { title: 'PSA Labs', type: 'Clinical', content: 'Serum PSA: 8.4 ng/mL. Free/Total ratio 12%.' } }],
      discussion: [{ dr: 'Tom H.', role: 'Urologist', time: '3d ago', content: 'Multiparametric MRI needed before biopsy.' }],
      exams: [{ title: 'PSA Labs', type: 'Clinical', date: 'Mar 01, 2026', size: '0.5 MB', clinic: 'Central Lab' }],
      aiInsights: [{ title: 'Pathway Optimization', icon: 'alert', content: 'Fusion Biopsy slot available at East Annex. Faster than local wait.', action: 'Book Fusion Biopsy' }]
    },
    {
      id: '#24680', name: 'R. L.', pathway: 'Colon Cancer', status: 'On Track', mandate: '30 Days Left', daysLeft: 30, highlight: false,
      age: 55, gender: 'Male', bloodType: 'A+', region: 'Metro South',
      timeline: [{ title: 'Colonoscopy', date: 'FEB 28', type: 'Radiology', desc: 'Polypoid lesion in descending colon.', doc: { title: 'Colonoscopy Report', type: 'Radiology', content: '3cm sessile polyp. Biopsied.' } }],
      discussion: [{ dr: 'Nancy W.', role: 'Gastroenterologist', time: '2w ago', content: 'Adenocarcinoma confirmed. CT abdomen next.' }],
      exams: [{ title: 'Colonoscopy', type: 'Radiology', date: 'Feb 28, 2026', size: '20 MB', clinic: 'Metro GI' }],
      aiInsights: [{ title: 'Staging Readiness', icon: 'db', content: 'Carcinoembryonic Antigen (CEA) requested via auto-protocol.', action: 'View CEA' }]
    },
    {
      id: '#11223', name: 'J. C.', pathway: 'Lung Cancer', status: 'Elevated Risk', mandate: '14 Days Left', daysLeft: 14, highlight: false,
      age: 60, gender: 'Female', bloodType: 'B-', region: 'North Zone Hub',
      timeline: [{ title: 'Bronchoscopy', date: 'MAR 15', type: 'Radiology', desc: 'Central mass visible. Samples taken.', doc: { title: 'Bronchoscopy Report', type: 'Radiology', content: 'Endobronchial lesion in right main bronchus.' } }],
      discussion: [{ dr: 'Peter S.', role: 'Thoracic Surgeon', time: '5d ago', content: 'Potential candidate for VATS lobectomy.' }],
      exams: [{ title: 'Bronchoscopy', type: 'Radiology', date: 'Mar 15, 2026', size: '18 MB', clinic: 'North Lung Center' }],
      aiInsights: [{ title: 'Waitlist Triage', icon: 'alert', content: 'OR availability in North Zone is tight. AI recommends overbook request.', action: 'Start Squeeze Flow' }]
    },
    {
      id: '#77889', name: 'R. A.', pathway: 'Pancreatic Cancer', status: 'On Track', mandate: '45 Days Left', daysLeft: 45, highlight: false,
      age: 62, gender: 'Male', bloodType: 'O+', region: 'East Wing',
      timeline: [{ title: 'EUS Staging', date: 'MAR 05', type: 'Radiology', desc: 'Mass in head of pancreas. No vascular invasion.', doc: { title: 'EUS Report', type: 'Radiology', content: 'T2N0M0 suspected.' } }],
      discussion: [{ dr: 'Julia K.', role: 'Surgical Oncologist', time: '2w ago', content: 'Whipple procedure is the goal if markers remain stable.' }],
      exams: [{ title: 'EUS Report', type: 'Radiology', date: 'Mar 05, 2026', size: '25 MB', clinic: 'East Surgical' }],
      aiInsights: [{ title: 'Marker Monitoring', icon: 'db', content: 'CA 19-9 trending slightly up. Suggest repeat in 7 days.', action: 'Order CA 19-9' }]
    }
  ]);

  const aiResponses = [
    {
      keywords: ['p. g.', 'pg', 'p g', 'overbook', 'tomorrow', 'tuesday', 'tue', '11'],
      reply: (<>Confirming **Biopsy** for **P. G. (ID: #44556)** on **Tuesday at 11:00 AM**. I am flagging this slot as Mandate Critical in the biopsy suite ledger. I've also updated the Federated Compliance Hub. Would you like me to notify the pathology team to prioritize this specimen?</>),
      action: () => {
        const newApp = { id: 'overbook-pg', title: 'Biopsy (booked by AI) - P. G.', day: 1, time: '11:00 AM', color: 'purple', isOverbook: true };
        setAppointments(prev => [...prev, newApp]);
      }
    },
    {
      keywords: ['m. s.', 'ms', 'm s', '84729', 'breast', 'wednesday'],
      reply: (<>Understood. I recommend overbooking the **Core Biopsy** for **M. S. (ID: #84729)** on **Wednesday at 09:30 AM**. This slot is within the safe 60-Day Mandate window. Shall I lock this in and update the Multidisciplinary Collaboration Portal?</>),
      action: () => {
        const newApp = { id: 'overbook-ms', title: 'Core Biopsy (booked by AI) - M. S.', day: 2, time: '09:30 AM', color: 'purple', isOverbook: true };
        setAppointments(prev => [...prev, newApp]);
      }
    },
    {
      keywords: ['a. s.', 'as', 'a s', '67890', 'cervical', 'friday'],
      reply: (<>For **A. S. (ID: #67890)**, the safest compliant slot is **Friday at 15:00 PM**. Although it is an afternoon slot, it ensures her pathway stays on track with the mandate. Should I proceed with this booking?</>),
      action: () => {
        const newApp = { id: 'overbook-as', title: 'Urgent Consult (booked by AI) - A. S.', day: 4, time: '15:00 PM', color: 'purple', isOverbook: true };
        setAppointments(prev => [...prev, newApp]);
      }
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
    if (match?.action) match.action();
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

    { id: '11', title: 'Multidisciplinary Collaboration Portal', day: 3, time: '09:30 AM', color: 'gray', limit: 4 },
    { id: '12', title: 'Exam Reviews', day: 3, time: '13:30 PM', color: 'gray', limit: 4 },

    { id: '13', title: 'Biopsy #10293', day: 4, time: '09:30 AM', color: 'purple', limit: 4 },
    { id: '14', title: 'Consult Follow-up', day: 4, time: '15:00 PM', color: 'purple', limit: 4 },
  ]);

  const filteredPatients = useMemo(() => {
    let result = patientsListState;
    if (filterPathway !== 'All') result = result.filter(p => p.pathway === filterPathway);
    if (filterRisk !== 'All') {
      if (filterRisk === 'Critical') result = result.filter(p => p.daysLeft <= 5);
      if (filterRisk === 'Elevated') result = result.filter(p => p.daysLeft > 5 && p.daysLeft <= 20);
      if (filterRisk === 'On Track') result = result.filter(p => p.daysLeft > 20);
    }
    if (searchQuery) {
      const low = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(low) ||
        p.id.toLowerCase().includes(low) ||
        p.pathway.toLowerCase().includes(low) ||
        p.status.toLowerCase().includes(low)
      );
    }
    result = [...result].sort((a, b) => sortOrder === 'asc' ? a.daysLeft - b.daysLeft : b.daysLeft - a.daysLeft);
    return result;
  }, [patientsListState, filterPathway, filterRisk, searchQuery, sortOrder]);

  const handleOpenPatientSim = (p) => {
    // Map ProfessionalView patient structure to Simulator structure
    const mappedPatient = {
      ...p,
      type: p.status === 'Critical Risk' ? 'red' : p.status === 'Elevated Risk' ? 'yellow' : 'green'
    };
    setSelectedPatient(mappedPatient);
    setShowPatientSim(true);
  };

  const hcBg = highContrast
    ? 'bg-black text-white border-2 border-yellow-400'
    : darkMode
      ? 'bg-gray-900 border border-gray-800 text-gray-100'
      : 'bg-white border border-gray-200 text-[#2d0a4d]';

  const hcText = highContrast
    ? 'text-yellow-300'
    : darkMode
      ? 'text-white'
      : 'text-[#64748b]';

  const hcMuted = highContrast
    ? 'bg-gray-800 border-2 border-yellow-400 text-white'
    : darkMode
      ? 'bg-gray-800 border border-gray-700 text-white font-medium'
      : 'bg-[#f8fafc] border border-gray-200 text-[#334155]';

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className={`rounded-xl p-10 max-w-sm w-full text-center shadow-sm ${hcBg}`}>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400' : 'bg-red-50 border border-red-100'}`}>
            <Stethoscope className={`w-8 h-8 ${highContrast ? 'text-yellow-400' : 'text-[#7f1d1d]'}`} />
          </div>

          <h2 className="text-xl font-medium mb-2">Professional Access</h2>
          <p className={`mb-8 text-xs ${hcText}`}>Clinical Staff Authentication Required. Accessing Patient Pathways via HIE.</p>

          <button
            onClick={() => setIsAuthenticated(true)}
            data-active={highContrast ? "true" : undefined}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 text-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#7f1d1d] hover:bg-[#450a0a] text-white'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Clinical Login & Synchronize
          </button>
          <p className={`text-[10px] px-2 ${hcText}`}>
            By proceeding, you verify your credentials for health record access under HIPAA/GDPR auditing rules.
          </p>
        </div>
      </div>
    );
  }

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

  const handleAutoSummary = () => {
    setIsScribeActive(false);
    setTeleSummary("Patient M. S. discussed biopsy scheduling. Expressed concern regarding the 60-day mandate. Confirmed Core Needle Biopsy for tomorrow. Vitals stable. No new symptoms reported since last consult.");
  };

  const startScribe = () => {
    setIsScribeActive(true);
    setTeleTranscription([
      { time: "10:02", speaker: "Dr. S. J.", text: "Good morning, M. S. How are you feeling today?" },
      { time: "10:02", speaker: "Patient", text: "A bit anxious about the biopsy tomorrow, doctor." },
      { time: "10:03", speaker: "Dr. S. J.", text: "That's understandable. We've expedited the process to ensure we meet the legal mandate window." },
      { time: "10:04", speaker: "Patient", text: "Thank you. I noticed my last blood work had some changes." },
      { time: "10:04", speaker: "Dr. S. J.", text: "Yes, the AI Copilot flagged a 15% drop in Hemoglobin. We will monitor that." }
    ]);
  };

  if (showTeleSim) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col md:flex-row">
        <div className="flex-1 relative flex flex-col items-center justify-center bg-[#2d0a4d] border-r border-gray-800">
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-md border border-gray-800">
            <div className={`w-2 h-2 rounded-full ${isScribeActive ? 'bg-red-600 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="font-medium text-[10px] tracking-widest text-gray-300">{isScribeActive ? 'SCRIBE ACTIVE' : 'LIVE'}</span>
            <span className="ml-2 font-mono text-gray-300 text-xs">00:14:32</span>
          </div>
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6 border-4 border-gray-700">
                <User className="w-16 h-16 text-gray-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-200">M. S. (Breast Oncology)</h2>
              <p className="text-xs text-gray-400 mt-1">HIE Federated Connection Secure</p>
            </div>
          </div>
          <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-md p-6 flex justify-center gap-4 border-t border-gray-800">
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"><Mic className="w-6 h-6 text-gray-300" /></button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"><Camera className="w-6 h-6 text-gray-300" /></button>
            <button onClick={() => setShowTeleSim(false)} className="p-4 bg-red-700 hover:bg-red-800 rounded-xl transition-colors shadow-lg shadow-red-900/20"><PhoneOff className="w-6 h-6 text-white" /></button>
          </div>
        </div>

        <div className={`w-full md:w-[450px] flex flex-col h-full ${highContrast ? 'bg-black border-l-2 border-yellow-400 text-white' : 'bg-white text-[#2d0a4d]'}`}>
          <div className={`p-5 flex items-center justify-between border-b ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Brain className={`w-4 h-4 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
              <h3 className="font-medium text-sm">AI Scribe & Clinical Intel</h3>
            </div>
            <button onClick={() => setShowTeleSim(false)} className="hover:opacity-70"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col">
            {/* LIVE TRANSCRIPTION AREA */}
            <div className={`flex-1 rounded-xl p-4 mb-4 border overflow-y-auto max-h-[300px] ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Live Transcription</span>
                {!isScribeActive && (
                  <button onClick={startScribe} className="text-[10px] font-medium text-[#4c1d95] hover:underline flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Start AI Scribe
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {teleTranscription.map((t, i) => (
                  <div key={i} className="animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-medium text-gray-400">{t.time}</span>
                      <span className={`text-[9px] font-medium ${t.speaker === 'Patient' ? 'text-blue-600' : 'text-[#4c1d95]'}`}>{t.speaker}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-700">{t.text}</p>
                  </div>
                ))}
                {isScribeActive && (
                  <div className="flex gap-1 items-center py-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
              </div>
            </div>

            {/* AI SUMMARY AREA */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Clinical Note</h4>
                <button
                  onClick={handleAutoSummary}
                  disabled={!isScribeActive}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1.5 transition-all ${!isScribeActive ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764] shadow-sm'}`}
                >
                  <RefreshCw className={`w-3 h-3 ${isScribeActive ? 'animate-spin-slow' : ''}`} /> Auto-Summary
                </button>
              </div>
              <textarea
                className={`w-full h-40 p-4 text-xs rounded-xl resize-none shadow-sm focus:outline-none border-2 transition-all ${highContrast ? 'bg-gray-900 border-yellow-400 text-white focus:border-yellow-300' : 'bg-white border-gray-100 text-[#2d0a4d] focus:border-[#4c1d95]'}`}
                placeholder="AI is listening... Notes will appear here after auto-summary."
                value={teleSummary}
                onChange={(e) => setTeleSummary(e.target.value)}
              ></textarea>
              <button onClick={() => setShowTeleSim(false)} className={`w-full py-4 rounded-xl text-xs font-medium shadow-md transition-all active:scale-[0.98] ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}>
                Submit to Patient HIE History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenSchedule = (p) => {
    setSelectedPatient(p);
    setAiChatView(false); // Reset to main view
    setShowScheduleSim(true);
  };

  return (
    <div className="animate-in fade-in duration-500 relative pb-20 md:pb-0">

      {/* HIE DOCUMENT VIEWER MODAL */}
      {showDocViewer && selectedDoc && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDocViewer(false)}></div>
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 ${highContrast ? 'bg-black border-2 border-yellow-400' : 'bg-white'}`}>
            <div className={`p-8 border-b-4 ${selectedDoc.type === 'Radiology' ? 'border-blue-400' : 'border-purple-400'} flex justify-between items-center ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#2d0a4d] text-white border-white/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedDoc.type === 'Radiology' ? 'bg-blue-100/10 text-blue-400' : 'bg-purple-100/10 text-purple-400'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-medium text-xl ${highContrast ? 'text-yellow-400' : 'text-white'}`}>{selectedDoc.title}</h3>
                  <p className={`text-xs font-medium uppercase tracking-widest ${highContrast ? 'text-yellow-200' : 'text-white/60'}`}>{selectedDoc.type} REPORT • HIE AUTHENTICATED</p>
                </div>
              </div>
              <button onClick={() => setShowDocViewer(false)} className={`p-2 rounded-full transition-colors ${highContrast ? 'hover:bg-yellow-400 hover:text-black' : 'hover:bg-white/10 text-white/70'}`}><X className="w-6 h-6" /></button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-medium uppercase tracking-tighter text-gray-400 border-b pb-1">Patient Details</h4>
                  <p className="text-sm font-medium text-gray-800">{selectedPatient.name}</p>
                  <p className="text-xs text-gray-500">DOB: 12/05/1984 • ID: {selectedPatient.id}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-medium uppercase tracking-tighter text-gray-400 border-b pb-1">Report Context</h4>
                  <p className="text-sm font-medium text-gray-800">Clinic: OncoNav Federated Hub</p>
                  <p className="text-xs text-gray-500">Date: {selectedDoc.date} • Status: FINAL</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 font-serif leading-relaxed text-gray-800">
                <h4 className="font-medium text-sm mb-4 border-b border-gray-200 pb-2">CLINICAL FINDINGS</h4>
                {selectedDoc.content || "Detailed pathology analysis indicates malignant cells present. Histological grade G2. Clear margins not yet established."}
                {selectedDoc.type === 'Radiology' && (
                  <div className="mt-6 flex flex-col items-center">
                    <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="w-full h-full border border-white/20 grid grid-cols-4 grid-rows-4">
                          {Array.from({ length: 16 }).map((_, i) => <div key={i} className="border border-white/10"></div>)}
                        </div>
                      </div>
                      <Database className="w-12 h-12 text-blue-500/50" />
                      <span className="absolute bottom-3 right-3 text-[9px] font-mono text-white/40">DICOM RENDER V1.2</span>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-2">
                          <Search className="w-4 h-4" /> Full DICOM Viewer
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic">Fig 1.1: Multi-planar reconstruction showing target lesion.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button className="px-5 py-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">Download PDF</button>
                <button className="px-5 py-2.5 rounded-lg bg-purple-700 text-white text-xs font-medium hover:bg-purple-800 shadow-lg shadow-purple-900/10">Share with Multidisciplinary Collaboration Portal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PATIENT SIMULATOR (Centered & Manager Aesthetic) */}
      {showPatientSim && selectedPatient && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0" onClick={() => setShowPatientSim(false)}></div>
          <div className={`${highContrast ? 'bg-black border-2 border-yellow-400 text-white' : 'bg-[#f8fafc] text-[#2d0a4d] shadow-2xl border border-gray-200'} relative w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300`}>

            {/* Top Navigation / Status Header */}
            <div
              className={`px-4 lg:px-8 py-4 lg:py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b shrink-0 ${highContrast ? 'bg-black border-yellow-400' : 'bg-[#2d0a4d] border-white/5'}`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full lg:w-auto">
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center font-medium text-lg lg:text-xl transition-all ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-white/5 border border-white/10 text-white shadow-lg'}`}>
                  {selectedPatient?.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                    <h3 className={`font-medium text-lg lg:text-xl tracking-tight text-white`}>{selectedPatient?.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium border uppercase tracking-widest ${highContrast ? 'border-yellow-400 text-yellow-400' : 'bg-white/10 border-white/20 text-white'}`}>Patient 360º</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium border uppercase tracking-widest ${highContrast ? 'border-yellow-400 text-yellow-400' : 'bg-white/5 border-white/10 text-white/50'}`}>ID: {selectedPatient?.id}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-[10px] lg:text-[11px] font-medium text-white/60">
                    <span className="flex items-center gap-1.5 text-white"><Calendar className="w-3.5 h-3.5" /> {selectedPatient?.age || 45}Y • {selectedPatient?.gender || 'F'}</span>
                    <span className="flex items-center gap-1.5 text-white"><Activity className="w-3.5 h-3.5" /> {selectedPatient?.bloodType || 'O+'}</span>
                    <span className="flex items-center gap-1.5 text-white"><MapPin className="w-3.5 h-3.5" /> {selectedPatient?.region || 'Hub A'}</span>
                    <span className={`px-2.5 py-1 rounded-md bg-white/10 text-white text-[9px] font-semibold uppercase tracking-widest border border-white/20`}>{selectedPatient?.pathway}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 lg:relative lg:top-auto lg:right-auto">
                <button onClick={() => setShowPatientSim(false)} className={`p-2 lg:p-2.5 rounded-full transition-all ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-white/5 text-white hover:bg-white/10'}`}><X className="w-4 h-4 lg:w-5 lg:h-5" /></button>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
              {/* LEFT SIDEBAR: AI CLINICAL COPILOT */}
              <div className={`w-full lg:w-[340px] lg:border-r border-b lg:border-b-0 lg:overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 shrink-0 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100'}`}>
                <div className={`rounded-xl overflow-hidden border mb-6 ${highContrast ? 'border-yellow-400' : 'border-gray-100 shadow-sm bg-white'}`}>
                  <div className={`p-4 border-b ${highContrast ? 'border-yellow-400 bg-gray-900' : 'bg-[#2d0a4d] border-white/10'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`text-[10px] font-medium uppercase tracking-widest ${highContrast ? 'text-yellow-400' : 'text-white'}`}>Clinical AI Intelligence</h4>
                      <Sparkles className={`w-3.5 h-3.5 ${highContrast ? 'text-yellow-400' : 'text-white/70'}`} />
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {(selectedPatient.aiInsights || [
                      { title: 'Critical Risk Sync', icon: 'alert', content: 'Hemoglobin Drop (15%). HIE Federated Registry detected a drop to 10.2 g/dL in labs from City Hub B.', action: 'Request Pre-Op Support' },
                      { title: 'Network Protocol Sync', icon: 'db', content: 'Contrast Allergy Alert. Patient reported Gadolinium reaction at Regional Hospital A (2023).', action: 'Update Imaging Order' }
                    ]).map((insight, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border transition-all hover:bg-gray-50 ${highContrast ? 'bg-black border-yellow-400' : 'bg-[#f8fafc] border-gray-100 shadow-sm'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          {insight.icon === 'alert' ? <AlertTriangle className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-purple-700'}`} /> : <Database className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-purple-700'}`} />}
                          <span className={`text-[10px] font-medium uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.title}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${hcText}`}>
                          {insight.content}
                        </p>
                        <button className={`mt-4 w-full py-2.5 text-white text-[10px] font-medium rounded-xl transition-colors shadow-lg ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#2d0a4d] hover:bg-[#3b0764] shadow-purple-100'}`}>
                          {insight.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Mandate Projection */}
                <div className={`rounded-2xl overflow-hidden border ${highContrast ? 'bg-black border-2 border-yellow-400' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className={`p-4 border-b ${highContrast ? 'border-yellow-400 bg-gray-900' : 'bg-[#2d0a4d] border-white/10'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium text-[10px] uppercase tracking-widest ${highContrast ? 'text-yellow-400' : 'text-white'}`}>Predictive Mandate</h3>
                      <Brain className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className={`p-4 rounded-xl border transition-all ${highContrast ? 'bg-black border-yellow-400' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-[#2d0a4d]">Compliance Confidence</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${hcText}`}>
                        High probability (92%) of compliance if procedure is executed within {selectedPatient.daysLeft * 24} hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT AREA: TABS */}
              <div className={`flex-1 flex flex-col ${highContrast ? 'bg-black' : 'bg-white'}`}>
                {/* Tab Navigation */}
                <div
                  className={`flex overflow-x-auto custom-scrollbar border-b px-4 lg:px-8 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100'}`}>
                  {[
                    { id: 'timeline', label: 'Clinical Timeline' },
                    { id: 'collaboration', label: 'Multidisciplinary Collaboration Portal' },
                    { id: 'documents', label: 'Document Viewer' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setPatientTab(t.id)}
                      className={`whitespace-nowrap px-4 lg:px-8 py-4 lg:py-5 text-[10px] lg:text-xs font-medium uppercase tracking-widest border-b-4 transition-all shrink-0 ${patientTab === t.id ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#2d0a4d] text-[#2d0a4d]') : 'border-transparent text-black/40 hover:text-black'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 lg:overflow-y-auto p-4 lg:p-10">
                  {patientTab === 'timeline' && (
                    <div className="space-y-10 max-w-4xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-sm text-gray-900 uppercase tracking-tight">HIE Federated Data Trace</h4>
                      </div>

                      <div className={`space-y-8 relative before:absolute before:inset-0 before:ml-4 before:h-full before:w-px ${highContrast ? 'before:bg-yellow-400/30' : 'before:bg-gray-100'}`}>
                        {(selectedPatient.timeline || [
                          { title: 'Primary Diagnosis Confirmation', date: 'MAR 12', type: 'Pathology', desc: 'Cross-referenced with National Health Registry. Formal biopsy confirmed malignancy.', doc: { title: 'Primary Pathology Report', type: 'Pathology', date: '12 Mar 2026', content: 'Positive for invasive ductal carcinoma.' } },
                          { title: 'Staging Imaging (CT Scan)', date: 'MAR 18', type: 'Radiology', desc: 'Image data stored at Federated Hub A. PET-CT scheduled.', doc: { title: 'Total Body CT Scan', type: 'Radiology', date: '18 Mar 2026' } }
                        ]).map((event, idx) => (
                          <div key={idx} className="relative flex items-start gap-8 group">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 shrink-0 z-10 shadow-sm transition-transform group-hover:scale-110 ${highContrast ? 'border-black bg-yellow-400 text-black' : (event.type === 'Pathology' ? 'border-white bg-[#4c1d95] text-white' : 'border-white bg-blue-600 text-white')}`}>
                              {event.type === 'Pathology' ? <CheckCircle2 className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedDoc(event.doc);
                                setShowDocViewer(true);
                              }}
                              className={`p-6 rounded-2xl flex-1 text-left transition-all border-2 ${highContrast ? 'bg-black border-yellow-400' : (event.type === 'Pathology' ? 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-lg' : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg')}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">{event.title}</span>
                                <span className="text-[10px] font-medium bg-gray-100 px-2 py-1 rounded text-gray-500">{event.date}</span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">{event.desc}</p>
                            </button>
                          </div>
                        ))}

                        {/* Timeline Item 3 (Current) */}
                        <div className="relative flex items-start gap-8">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 shrink-0 z-10 shadow-sm ${highContrast ? 'border-black bg-black border-2 border-yellow-400 text-yellow-400' : 'border-white bg-white border-2 border-red-200 text-red-600'}`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className={`p-6 rounded-2xl flex-1 border-2 ${highContrast ? 'border-yellow-400' : 'border-red-950/30 bg-red-950/5'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm text-red-950 uppercase">Mandate Critical Procedure</span>
                              <span className={`text-[10px] font-medium bg-red-950 px-2.5 py-1 rounded-full text-white`}>DAY {60 - selectedPatient.daysLeft} OF 60</span>
                            </div>
                            <p className="text-xs text-red-950 leading-relaxed font-medium">Procedure must be completed within {selectedPatient.daysLeft * 24} hours to ensure legal compliance.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {patientTab === 'collaboration' && (
                    <div className="space-y-8 animate-in fade-in max-w-5xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-xl text-gray-900">Multidisciplinary Collaboration Portal</h4>
                          <p className="text-xs text-gray-500 font-medium">Enterprise Decision Support Suite</p>
                        </div>
                        <button className="px-5 py-2.5 bg-[#4c1d95] text-white rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-[#3b0764] transition-all shadow-lg shadow-purple-900/10">
                          <Plus className="w-4 h-4" /> Start New Discussion
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Discussion List */}
                        <div className="space-y-6">
                          {(selectedPatient.discussion || [
                            { dr: 'Robert J.', role: 'Oncological Surgeon', time: '2h ago', content: 'Reviewed imaging Hub A. Nodule is 2.4cm. Neoadjuvant therapy might be safer before excision.' },
                            { dr: 'Alice O.', role: 'Medical Oncology', time: '15m ago', content: 'Agreed. Let\'s confirm markers on the biopsy tomorrow to tailor the chemo regimen.' }
                          ]).map((msg, idx) => (
                            <div key={idx} className={`p-6 rounded-2xl border ${idx === 0 ? 'border-[#4c1d95]/5 bg-purple-50/20 shadow-sm' : 'border-gray-100 bg-white shadow-sm'}`}>
                              <div className="flex items-center gap-3 mb-5">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-md ${idx === 0 ? 'bg-blue-600 shadow-blue-600/20' : 'bg-[#4c1d95] shadow-purple-600/20'}`}>
                                  {msg.dr.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-900 uppercase tracking-tight">Dr. {msg.dr} <span className="font-normal text-gray-500 ml-1">({msg.role})</span></p>
                                  <p className={`text-[9px] text-gray-400 font-medium uppercase tracking-widest`}>{msg.time} • Verified Identity</p>
                                </div>
                              </div>
                              <p className={`text-xs text-gray-700 leading-relaxed ${idx === 0 ? 'italic border-l-4 border-blue-200 pl-4 bg-white/50 py-3 rounded-r-lg' : ''}`}>
                                "{msg.content}"
                              </p>
                              {idx === 0 && (
                                <div className="flex gap-3 mt-5">
                                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">Reply Thread</button>
                                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-purple-600" /> Endorse</button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Voting Area */}
                        <div className={`p-8 rounded-3xl border-2 shadow-sm ${highContrast ? 'bg-black border-yellow-400' : 'bg-gray-50/80 border-gray-100'}`}>
                          <h5 className="font-medium text-sm mb-8 flex items-center gap-2 uppercase tracking-tight">
                            <Award className="w-5 h-5 text-purple-700" /> Clinical Conduct Protocol
                          </h5>
                          <div className="space-y-8">
                            {(selectedPatient.discussion || [
                              { dr: 'Robert J.', role: 'Oncological Surgeon' },
                              { dr: 'Alice O.', role: 'Medical Oncology' }
                            ]).map((msg, idx) => (
                              <div key={idx} className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium text-gray-800 uppercase tracking-tighter">Dr. {msg.dr}</span>
                                  <span className="text-[10px] font-medium text-[#4c1d95] bg-purple-100 px-2 py-0.5 rounded-full">Consensus Endorsed</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#4c1d95] to-[#6b21a8] transition-all duration-700 shadow-md w-full"
                                  ></div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] text-gray-500 uppercase">{msg.role}</span>
                                  <span className="text-[10px] font-medium text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Digital Signature Verified</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-10 p-5 bg-white rounded-2xl border-2 border-solid border-[#4c1d95]/30 text-center shadow-inner">
                            <p className="text-[10px] font-medium text-[#4c1d95] uppercase tracking-widest">Current Collaboration Decision: Neoadjuvant Chemo First</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {patientTab === 'documents' && (
                    <div className="space-y-8 animate-in fade-in max-w-6xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-lg text-gray-900">Federated HIE Vault</h4>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search HIE documents..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4c1d95] focus:bg-white transition-all w-64" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {(selectedPatient.exams || [
                          { title: 'Primary Pathology Report', type: 'Pathology', date: 'Mar 12, 2026', size: '2.4 MB', clinic: 'City Hub B' },
                          { title: 'Full Body CT Scan', type: 'Radiology', date: 'Mar 18, 2026', size: '45.1 MB', clinic: 'Regional Center' },
                          { title: 'Genomic Panel (BRCA)', type: 'Genetics', date: 'Feb 28, 2026', size: '1.2 MB', clinic: 'Natl Lab' },
                          { title: 'Cardiac Clearance', type: 'Clinical', date: 'Mar 24, 2026', size: '0.8 MB', clinic: 'Private Hosp' },
                          { title: 'Informed Consent', type: 'Legal', date: 'Mar 25, 2026', size: '1.1 MB', clinic: 'OncoNav Local' }
                        ]).map((doc, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDoc({ title: doc.title, type: doc.type, date: doc.date });
                              setShowDocViewer(true);
                            }}
                            className="p-6 rounded-3xl border border-gray-100 bg-white hover:border-[#4c1d95]/40 hover:shadow-xl hover:scale-[1.02] transition-all text-left flex flex-col gap-4 group"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${doc.type === 'Radiology' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-[#4c1d95] group-hover:text-white'}`}>
                                <FileText className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#4c1d95] group-hover:translate-x-1 transition-all" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900 group-hover:text-[#4c1d95] transition-colors">{doc.title}</p>
                              <p className="text-[10px] text-gray-500 mt-1 font-medium">{doc.date} • {doc.size} • {doc.clinic}</p>
                              <div className="mt-4 flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-medium uppercase tracking-wider ${doc.type === 'Radiology' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>{doc.type}</span>
                                <span className="px-2 py-0.5 rounded-md text-[8px] font-medium uppercase tracking-wider bg-green-50 text-green-700">SIGNED</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
          My Patients
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

      {/* PENDING DISPATCHES QUEUE - Refined Aesthetic */}
      {pendingDispatches.length > 0 && (
        <div className={`mb-10 rounded-2xl border animate-in slide-in-from-top-4 duration-500 overflow-hidden ${highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-100 shadow-xl shadow-purple-900/5'}`}>
          <div className={`px-6 py-5 border-b flex items-center justify-between ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highContrast ? 'bg-black border border-yellow-400' : 'bg-[#f5f3ff] border border-purple-100'}`}>
                <Activity className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} />
              </div>
              <div>
                <h4 className={`text-sm font-medium uppercase tracking-widest ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Pending Your Manager Dispatches</h4>
                <p className={`text-[11px] font-medium ${hcText}`}>Real-time clinical resource requests from Federated Hub</p>
              </div>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {pendingDispatches.map(dispatch => (
              <div key={dispatch.id} className={`p-4 rounded-xl border flex flex-col items-stretch justify-between gap-4 transition-all group ${highContrast ? 'border-yellow-400 bg-gray-900' : darkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-white border-gray-100 hover:border-purple-100 hover:shadow-lg'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${dispatch.daysLeft <= 5 ? (highContrast ? 'bg-black text-yellow-400 border-yellow-400' : darkMode ? 'bg-red-950/40 text-red-400 border-red-900' : 'bg-[#fef2f2] text-[#7f1d1d] border-red-100') : (highContrast ? 'bg-gray-900 text-white border-white' : darkMode ? 'bg-purple-900/30 text-purple-300 border-purple-800' : 'bg-purple-50 text-purple-600 border-purple-100')} border group-hover:scale-105 shadow-inner`}>
                      <UserCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium text-base ${highContrast || darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}>{dispatch.patient}</span>
                        <span className={`text-[8px] px-2 py-0.5 rounded-md uppercase font-medium tracking-tighter ${dispatch.type === 'AI Squeeze' ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-[#4c1d95] text-white') :
                          dispatch.type === 'Global Dispatch' ? (highContrast ? 'bg-black text-white border border-white' : darkMode ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700 shadow-sm' : 'bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm') :
                            (highContrast ? 'bg-white text-black border border-white' : darkMode ? 'bg-[#064e3b] text-emerald-200 border border-[#065f46] shadow-sm' : 'bg-[#064e3b] text-white border border-[#065f46] shadow-sm')
                          }`}>
                          {dispatch.type}
                        </span>
                      </div>
                      <p className={`text-[10px] mt-0.5 font-medium ${highContrast ? 'text-yellow-400/80' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{dispatch.procedure} • {dispatch.region}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3 h-3 ${dispatch.daysLeft <= 5 ? (highContrast ? 'text-yellow-400' : darkMode ? 'text-red-400' : 'text-[#7f1d1d]') : (highContrast || darkMode ? 'text-white' : 'text-[#4c1d95]')}`} />
                      <span className={`text-[10px] font-medium uppercase tracking-widest ${dispatch.daysLeft <= 5 ? (highContrast ? 'text-yellow-400' : darkMode ? 'text-red-400' : 'text-[#7f1d1d]') : (highContrast || darkMode ? 'text-white' : 'text-[#4c1d95]')}`}>
                        {dispatch.daysLeft}d
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectDispatch(dispatch.id)}
                    className={`flex-1 py-2 rounded-lg border transition-all text-[10px] font-medium uppercase tracking-widest ${highContrast ? 'border-gray-700 hover:bg-gray-800 text-white' : darkMode ? 'border-gray-600 hover:bg-gray-700 hover:text-red-400 text-gray-300' : 'border-gray-100 hover:bg-gray-50 hover:text-red-600 text-gray-600'}`}
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAcceptDispatch(dispatch.id)}
                    className={`flex-[2] py-2 text-[10px] font-medium uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Accept in my agenda
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pill Navigation */}
      <div className={`flex shadow-sm rounded-lg p-1 mb-6 w-fit max-w-full overflow-x-auto ${hcBg}`}>
        {[
          { id: 'calendar', label: 'Clinical Agenda (Calendar)' },
          { id: 'pathways', label: 'My Patients' }
        ].map((tab) => (
        <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            className={`whitespace-nowrap px-5 py-2.5 rounded-md text-xs font-medium transition-all ${activeTab === tab.id
              ? (highContrast ? 'bg-yellow-400 text-black' : (darkMode ? 'bg-[#4c1d95] text-white shadow-sm border border-purple-400' : 'bg-[#f1f5f9] text-[#2d0a4d] shadow-sm border border-gray-200'))
              : (highContrast ? 'text-white hover:text-yellow-300' : 'text-[#64748b] hover:text-[#2d0a4d]')
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
                <h3 className={`font-medium flex items-center gap-2 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
                  <CalendarDays className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-[#4c1d95]'}`} /> Schedule ({calendarView.charAt(0).toUpperCase() + calendarView.slice(1)})
                </h3>

                {/* View Toggles */}
                <div className={`flex p-1 rounded-lg shadow-sm ${highContrast ? 'bg-gray-900 border border-yellow-400' : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'}`}>
                  {['Day', 'Week', 'Month', 'Year'].map(v => (
                    <button
                      key={v}
                      onClick={() => setCalendarView(v.toLowerCase())}
                      aria-selected={calendarView === v.toLowerCase()}
                      className={`text-[10px] px-3 py-1.5 rounded-md font-medium transition-colors ${calendarView === v.toLowerCase()
                        ? (highContrast ? 'bg-yellow-400 text-black' : (darkMode ? 'bg-[#4c1d95] text-white shadow-sm border border-purple-400' : 'bg-white text-[#4c1d95] shadow-sm border border-gray-200'))
                        : (highContrast ? 'text-white hover:text-yellow-300' : 'text-[#64748b] hover:text-[#2d0a4d]')
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
                  <div className={`border-b p-4 text-center font-medium text-sm ${highContrast ? 'bg-gray-900 border-yellow-400 text-yellow-400' : 'bg-[#f8fafc] border-gray-200 text-[#2d0a4d]'}`}>Today's Timeline (Monday)</div>
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
                                <span className={`text-[10px] font-medium opacity-80 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>Patient Visit • ID #{80000 + Math.floor(Math.random() * 9000)}</span>
                                {app.isOverbook && <span className="bg-[#4c1d95] text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium animate-pulse">AI SQUEEZE</span>}
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
                          const appsInSlot = appointments.filter(a => a.day === dayIndex && a.time === timeStr);

                          if (appsInSlot.length > 0) {
                            return (
                              <div key={timeStr} className="space-y-2">
                                {appsInSlot.map(app => (
                                  <div
                                    key={app.id}
                                    draggable
                                    onDragStart={(e) => {
                                      e.dataTransfer.setData('id', app.id);
                                      e.dataTransfer.effectAllowed = 'move';
                                    }}
                                    className={`p-3 rounded-xl shadow-sm border-l-4 cursor-move ${app.isOverbook ? 'shadow-md ring-1 ring-purple-100 animate-in fade-in zoom-in' : ''} ${getColorClasses(app.color, app.isOverbook)}`}>
                                    <span className={`text-[9px] font-medium block mb-0.5 ${getTextColor(app.color, app.isOverbook)}`}>{app.time} {app.isOverbook && 'AI SQUEEZE'}</span>
                                    <p className={`text-[10px] font-medium leading-tight truncate ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>{app.title}</p>
                                  </div>
                                ))}
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={timeStr}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, dayIndex, timeStr)}
                                className={`border p-4 rounded-xl h-[80px] flex items-center justify-center ${highContrast ? 'border-yellow-400/20 bg-black/40 hover:bg-yellow-400/10' : 'border-gray-100 bg-[#f8fafc] hover:bg-gray-50'}`}
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
                      <div className={`font-medium text-xs mb-3 uppercase tracking-tighter ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`}>{month} 2026</div>
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

          <div className="xl:col-span-4 space-y-6">
            {patientsListState
              .filter(p => p.daysLeft <= 5 && !hiddenCriticalCards.includes(p.id))
              .map(p => {
                // Dynamic scheduling logic based on mandate window
                const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const dayIdx = Math.min(p.daysLeft, 4);
                const suggestedDay = p.daysLeft === 0 ? 'TODAY' : p.daysLeft === 1 ? 'Tomorrow (Tue)' : daysOfWeek[dayIdx];
                const suggestedTime = p.daysLeft <= 1 ? '11:00 AM' : p.daysLeft <= 3 ? '09:30 AM' : '15:00 PM';
                const procedureName = p.pathway === 'Thyroid Cancer' ? 'Biopsy' : p.pathway === 'Breast Cancer' ? 'Core Biopsy' : 'Urgent Consult';

                return (
                  <div key={p.id} className={`rounded-xl shadow-sm overflow-hidden border-t-4 animate-in slide-in-from-right-4 ${highContrast ? 'bg-black border-2 border-t-8 border-red-500 text-white' : 'bg-white border border-gray-200 border-t-[#7f1d1d]'}`}>
                    <div className={`p-5 border-b flex items-start gap-3 ${highContrast ? 'border-red-500/30' : 'border-gray-100'}`}>
                      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${highContrast ? 'text-red-500' : 'text-[#7f1d1d]'}`} />
                      <div>
                        <h4 className={`font-medium text-sm ${highContrast ? 'text-white' : darkMode ? 'text-white' : 'text-[#2d0a4d]'}`}>AI Squeeze</h4>
                        <p className={`text-xs mt-2 leading-relaxed ${hcText}`}>
                          Your patient {p.name} is {p.daysLeft} day{p.daysLeft !== 1 ? 's' : ''} away from breaching the 60-Day Mandate. Can you overbook her {procedureName} for {suggestedDay} at {suggestedTime}?
                        </p>
                      </div>
                    </div>
                    <div className={`p-4 flex gap-3 ${highContrast ? 'bg-gray-900' : 'bg-[#f8fafc]'}`}>
                      <button
                        onClick={() => {
                          const newApp = { id: `overbook-${p.id}`, title: `${procedureName} (booked by AI) - ${p.name}`, day: dayIdx, time: suggestedTime, color: 'purple', isOverbook: true };
                          setAppointments(prev => [...prev, newApp]);
                          setHiddenCriticalCards(prev => [...prev, p.id]);
                        }}
                        className={`flex-1 text-[11px] font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400' : 'bg-white hover:bg-gray-50 text-[#2d0a4d] border border-gray-200'}`}
                      >
                        <Check className={`w-4 h-4 ${highContrast ? 'text-black' : 'text-[#7f1d1d]'}`} /> Accept
                      </button>
                      <button onClick={() => setHiddenCriticalCards(prev => [...prev, p.id])} className={`flex-1 text-[11px] font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${highContrast ? 'bg-black text-yellow-400 hover:bg-gray-800 border-2 border-yellow-400' : 'bg-white hover:bg-gray-50 text-[#64748b] border border-gray-200'}`}>
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}

            {patientsListState.filter(p => p.daysLeft <= 5 && !hiddenCriticalCards.includes(p.id)).length === 0 && (
              <div className={`p-8 rounded-xl border border-dashed flex flex-col items-center justify-center text-center ${hcMuted}`}>
                <CheckCircle2 className="w-10 h-10 mb-3 text-green-500/50" />
                <p className="text-xs font-medium text-gray-400">All mandate-critical gaps cleared.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PATHWAYS (PATIENTS LIST) - Unified Manager Aesthetic */}
      {activeTab === 'pathways' && (
        <div className={`rounded-xl shadow-sm h-full flex flex-col overflow-hidden animate-in fade-in ${hcBg}`}>
          <div className={`p-6 border-b flex flex-col gap-6 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-200'}`}>
            <div>
              <h3 className={`font-medium text-sm mb-1 ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>My Patients</h3>
              <p className={`text-[11px] ${hcText}`}>Direct clinical oversight of the 60-Day Mandate sequence.</p>
            </div>

            {/* FILTERS AND SEARCH - Unified with Manager */}
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
                  {['Breast Cancer', 'Lung Cancer', 'Prostate Cancer', 'Cervical Cancer', 'Colon Cancer', 'Thyroid Cancer'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
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
                  <th className={`p-5 text-[10px] font-normal uppercase tracking-wider ${hcText}`}>Patient</th>
                  <th className={`p-5 text-[10px] font-normal uppercase tracking-wider ${hcText}`}>Pathway</th>
                  <th className={`p-5 text-[10px] font-normal uppercase tracking-wider ${hcText}`}>Status</th>
                  <th className={`p-5 text-[10px] font-normal uppercase tracking-wider text-right ${hcText}`}>Management</th>
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
                          <span className={`font-normal text-xs ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>{p.name}</span>
                          <span className={`text-[10px] font-mono mt-0.5 font-normal ${hcText}`}>{p.id}</span>
                        </div>
                      </td>
                      <td className={`p-5 text-xs font-normal ${highContrast ? 'text-white' : 'text-[#334155]'}`}>{p.pathway}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.daysLeft <= 5 ? 'bg-[#7f1d1d]' : p.daysLeft <= 20 ? 'bg-[#d97706]' : 'bg-[#5b21b6]'}`}></div>
                          <span className={`text-[10px] font-normal uppercase tracking-wider ${highContrast ? 'text-white' : 'text-[#2d0a4d]'}`}>
                            {p.daysLeft} Days Left
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex flex-col lg:flex-row items-end lg:items-center justify-end gap-2 lg:gap-4">
                          <button
                            onClick={() => handleOpenPatientSim(p)}
                            className={`text-[11px] font-normal uppercase tracking-widest px-4 py-1.5 rounded-full border flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap w-full lg:w-auto ${highContrast ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-[#4c1d95] text-[#4c1d95] hover:bg-purple-50'}`}
                          >
                            <Search className="w-3 h-3 shrink-0" />
                            View Case
                          </button>
                          {p.daysLeft > 5 ? (
                            <button
                              onClick={() => handleOpenSchedule(p)}
                              className={`text-[11px] font-normal uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95 whitespace-nowrap w-full lg:w-auto ${highContrast ? 'bg-yellow-400 text-black' : 'bg-[#4c1d95] text-white hover:bg-[#3b0764]'}`}
                            >
                              <Calendar className="w-3 h-3 shrink-0" />
                              Smart Schedule
                            </button>
                          ) : (
                            <div className={`${highContrast ? 'text-red-500' : 'text-red-950 font-normal'} w-full lg:w-auto text-right lg:text-center mt-1 lg:mt-0`}>
                              <span className="text-[10px] uppercase tracking-widest whitespace-nowrap">AI Squeeze</span>
                            </div>
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
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0" onClick={() => setShowScheduleSim(false)}></div>
          <div className={`${highContrast ? 'bg-black border-2 border-yellow-400 text-white' : 'bg-[#f8fafc] text-[#2d0a4d] shadow-2xl border border-gray-200'} relative w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200`}>

            {/* Top Navigation / Status Header (MATCHING PatientSim) */}
            <div
              style={{ backgroundColor: '#2d0a4d' }}
              className={`px-4 lg:px-8 py-4 lg:py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b shrink-0 ${highContrast ? 'border-yellow-400' : 'border-white/5'}`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full lg:w-auto">
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center font-medium text-lg lg:text-xl transition-all ${highContrast ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-white/5 border border-white/10 text-white shadow-lg'}`}>
                  {selectedPatient?.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                    <h3 className={`text-lg lg:text-xl font-medium tracking-tight ${highContrast ? 'text-yellow-400' : 'text-white'}`}>{selectedPatient?.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium border uppercase tracking-widest ${highContrast ? 'border-yellow-400 text-yellow-400' : 'bg-white/5 border-white/10 text-white/50'}`}>ID: {selectedPatient?.id}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-[10px] lg:text-[11px] font-medium text-white/60">
                    <span className="flex items-center gap-1.5 text-white"><Calendar className="w-3.5 h-3.5" /> {selectedPatient?.age || 45}Y • {selectedPatient?.gender || 'F'}</span>
                    <span className="flex items-center gap-1.5 text-white"><Activity className="w-3.5 h-3.5" /> {selectedPatient?.bloodType || 'O+'}</span>
                    <span className="flex items-center gap-1.5 text-white"><MapPin className="w-3.5 h-3.5" /> {selectedPatient?.region || 'Hub A'}</span>
                    <span className={`px-2.5 py-1 rounded-md bg-white/10 text-white text-[9px] font-semibold uppercase tracking-widest border border-white/20`}>{selectedPatient?.pathway}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 lg:relative lg:top-auto lg:right-auto">
                <button onClick={() => setShowScheduleSim(false)} className={`hover:bg-white/10 p-2 lg:p-2.5 rounded-2xl transition-all ${highContrast ? 'text-yellow-400' : 'text-white/40 hover:text-white'}`}><X className="w-4 h-4 lg:w-6 lg:h-6" /></button>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
              {/* LEFT SIDEBAR: AI SCHEDULING INTELLIGENCE */}
              <div className={`w-full md:w-[360px] md:border-r border-b md:border-b-0 md:overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 shrink-0 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100'}`}>
                <div className={`rounded-2xl overflow-hidden border ${highContrast ? 'border-yellow-400' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className={`p-4 border-b ${highContrast ? 'border-yellow-400 bg-gray-900' : 'bg-[#2d0a4d] border-white/10'}`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`text-[10px] font-bold uppercase tracking-widest ${highContrast ? 'text-yellow-400' : 'text-white'}`}>AI Strategic Recommendations</h4>
                      <Sparkles className={`w-3.5 h-3.5 ${highContrast ? 'text-yellow-400' : 'text-white/70'}`} />
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-[8px] text-gray-500 font-bold uppercase mb-2">Optimal Window Identified</span>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#2d0a4d] flex items-center justify-center text-white font-bold text-sm">03</div>
                          <div>
                            <p className="text-[11px] font-bold text-[#2d0a4d]">Wednesday, April 03</p>
                            <p className="text-[9px] text-gray-500 uppercase font-bold">09:00 AM • Biopsy Suite 01</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        The AI has identified a capacity gap in the Biopsy Suite. Scheduling now ensures a <span className="font-bold text-[#2d0a4d]">12-day safety margin</span> relative to the federated mandate.
                      </p>
                    </div>
                    <button
                      onClick={() => setAiChatView(true)}
                      className={`w-full py-3 rounded-xl bg-[#2d0a4d] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-900 transition-all shadow-lg shadow-purple-100`}>
                      Analyze Reasoning
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSimulatorMessages(prev => [...prev, { role: 'user', content: 'Authorize Appointment' }]);
                      setAiChatView(true);
                      setTimeout(() => {
                        setSimulatorMessages(prev => [...prev, { role: 'ai', content: 'Confirmed. The appointment for April 03 has been processed and synced with the Regional HIE. Patient will be notified via portal.' }]);
                      }, 800);
                      setTimeout(() => {
                        setAppointments(prev => [...prev, {
                          id: 'smart_sched_' + Date.now(),
                          title: (selectedPatient?.pathway === 'Thyroid Cancer' ? 'Biopsy' : 'Consult') + ' (AI)',
                          day: 1,
                          time: '11:00 AM',
                          color: 'purple',
                          isOverbook: true
                        }]);
                        setShowScheduleSim(false);
                      }, 2500);
                    }}
                    className={`w-full py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-gradient-to-r from-[#2d0a4d] to-[#4c1d95] text-white hover:shadow-purple-200/50 hover:translate-y-[-2px]'}`}
                  >
                    Authorize Appointment
                  </button>
                  <button
                    onClick={() => {
                      setSimulatorMessages(prev => [...prev, { role: 'user', content: 'Find alternative date' }]);
                      setAiChatView(true);
                      setTimeout(() => {
                        setSimulatorMessages(prev => [...prev, { role: 'ai', content: 'Understood. I am re-analyzing available slots at Hubs C and D for next week. Please wait a moment...' }]);
                      }, 800);
                    }}
                    className={`w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${highContrast ? 'bg-black border border-yellow-400 text-yellow-400' : 'bg-white border border-gray-200 text-[#2d0a4d] hover:bg-gray-50'}`}
                  >
                    Find alternative date
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT AREA: TABBED INTERFACE */}
              <div className={`flex-1 flex flex-col ${highContrast ? 'bg-black' : 'bg-white'}`}>
                {/* Tab Navigation */}
                <div
                  className={`flex overflow-x-auto custom-scrollbar border-b px-4 md:px-8 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-[#f8fafc] border-gray-100'}`}>
                  {[
                    { id: 'calendar', label: 'Strategic Calendar' },
                    { id: 'ai', label: 'AI Clinical Assistant' }
                  ].map(t => {
                    const isActive = (t.id === 'ai' && aiChatView) || (t.id === 'calendar' && !aiChatView);
                    return (
                      <button
                        key={t.id}
                        onClick={() => setAiChatView(t.id === 'ai')}
                        className={`whitespace-nowrap px-4 md:px-8 py-4 md:py-5 text-[10px] md:text-xs font-medium uppercase tracking-widest border-b-4 transition-all shrink-0 ${isActive ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-[#2d0a4d] text-[#2d0a4d]') : 'border-transparent text-black/40 hover:text-black'}`}
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>

                <div className="flex-1 lg:overflow-y-auto">
                  {aiChatView ? (
                    <div className="p-10 max-w-4xl mx-auto space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-[#2d0a4d]" />
                          <h3 className="text-lg font-bold text-[#2d0a4d]">AI Clinical Assistant</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          The following dispatch logic has been generated based on real-time federated network capacity and mandate proximity for <strong>{selectedPatient?.name}</strong>.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {simulatorMessages.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-6 rounded-3xl ${msg.role === 'user' ? 'rounded-tr-none bg-[#2d0a4d] text-white' : 'rounded-tl-none bg-gray-50 border border-gray-100 text-xs leading-relaxed text-[#334155] shadow-sm'}`}>
                              {msg.type === 'network' && <span className="block text-[8px] font-bold uppercase text-indigo-600 mb-2">Network Analysis</span>}
                              {msg.type === 'compliance' && <span className="block text-[8px] font-bold uppercase text-emerald-600 mb-2">Compliance Assurance</span>}
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-10 border-t border-dashed border-gray-200 space-y-6">
                        <div className="space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Suggested Next Steps</p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              'Verify Hub B Equipment Status',
                              'Ping Clinical Coordinator',
                              'Review Mandate Buffer History',
                              'Request Transportation Support'
                            ].map(suggestion => (
                              <button
                                key={suggestion}
                                onClick={() => {
                                  setSimulatorMessages(prev => [...prev, { role: 'user', content: suggestion }]);
                                  setTimeout(() => {
                                    setSimulatorMessages(prev => [...prev, { role: 'ai', content: `Understood. Processing request for "${suggestion}" across the federated network. I will update the dashboard shortly.` }]);
                                  }, 800);
                                }}
                                className="px-4 py-2 rounded-full border border-gray-100 bg-white text-[9px] font-bold text-[#2d0a4d] hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <input
                              type="text"
                              value={simInput}
                              onChange={(e) => setSimInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && simInput.trim()) {
                                  const text = simInput;
                                  setSimulatorMessages(prev => [...prev, { role: 'user', content: text }]);
                                  setSimInput('');
                                  setTimeout(() => {
                                    setSimulatorMessages(prev => [...prev, { role: 'ai', content: `Processing your custom request: "${text}". I am analyzing the relevant federated data points now.` }]);
                                  }, 1000);
                                }
                              }}
                              placeholder="Ask the AI Clinical Assistant anything..."
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                            />
                            <button
                              onClick={() => {
                                if (simInput.trim()) {
                                  const text = simInput;
                                  setSimulatorMessages(prev => [...prev, { role: 'user', content: text }]);
                                  setSimInput('');
                                  setTimeout(() => {
                                    setSimulatorMessages(prev => [...prev, { role: 'ai', content: `Processing your custom request: "${text}". I am analyzing the relevant federated data points now.` }]);
                                  }, 1000);
                                }
                              }}
                              className="p-3 rounded-xl bg-[#2d0a4d] text-white hover:bg-indigo-900 transition-all shadow-lg"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setSimulatorMessages(prev => [...prev, { role: 'user', content: 'Authorize Appointment' }]);
                              setTimeout(() => {
                                setSimulatorMessages(prev => [...prev, { role: 'ai', content: 'Confirmed. The appointment for April 03 has been processed and synced with the Regional HIE. Patient will be notified via portal.' }]);
                              }, 800);
                              setTimeout(() => {
                                setAppointments(prev => [...prev, {
                                  id: 'smart_sched_' + Date.now(),
                                  title: (selectedPatient?.pathway === 'Thyroid Cancer' ? 'Biopsy' : 'Consult') + ' (AI)',
                                  day: 1,
                                  time: '11:00 AM',
                                  color: 'purple',
                                  isOverbook: true
                                }]);
                                setShowScheduleSim(false);
                              }, 2500);
                            }}
                            className="w-full py-5 rounded-2xl bg-[#2d0a4d] text-white font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-900 transition-all"
                          >
                            Authorize Appointment
                          </button>
                          <button
                            onClick={() => {
                              setSimulatorMessages(prev => [...prev, { role: 'user', content: 'Find alternative date' }]);
                              setTimeout(() => {
                                setSimulatorMessages(prev => [...prev, { role: 'ai', content: 'Understood. I am re-analyzing available slots at Hubs C and D for next week. Please wait a moment...' }]);
                              }, 800);
                            }}
                            className="w-full py-4 rounded-2xl bg-white border border-gray-200 text-[#2d0a4d] font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                          >
                            Find alternative date
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#2d0a4d]">April 2026</h2>
                        <div className="flex gap-1">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="w-10 h-10 flex items-center justify-center text-[10px] font-bold text-gray-300">{d}</div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-7 border-t border-l border-gray-100 rounded-xl overflow-hidden shadow-2xl">
                        {Array.from({ length: 35 }).map((_, i) => {
                          const day = i + 1;
                          const isSelected = i === 2; // April 03
                          const hasApps = (i * 13) % 7 === 0;

                          return (
                            <div key={i} className={`relative border-r border-b min-h-[100px] p-3 transition-all ${isSelected ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50/50'}`}>
                              <span className={`text-[11px] font-bold ${isSelected ? 'text-[#2d0a4d]' : 'text-gray-400'}`}>{day.toString().padStart(2, '0')}</span>

                              {isSelected && (
                                <div className="mt-2 p-2 rounded-lg bg-[#2d0a4d] text-white shadow-lg animate-in fade-in zoom-in duration-500">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">AI Pick</span>
                                  </div>
                                  <p className="text-[9px] font-bold leading-tight">{selectedPatient?.pathway === 'Thyroid Cancer' ? 'Biopsy' : 'Consult'}</p>
                                  <p className="text-[7px] opacity-70 font-bold mt-0.5">09:00 AM</p>
                                </div>
                              )}

                              {!isSelected && hasApps && (
                                <div className="mt-2 space-y-1">
                                  <div className="h-1 w-full bg-gray-100 rounded-full"></div>
                                  <div className="h-1 w-2/3 bg-gray-100 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMsView && (
        <div className="fixed inset-0 z-[10010] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowMsView(false)}></div>
          <div className={`relative w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl ${highContrast ? 'bg-black border-2 border-yellow-400 text-white' : darkMode ? 'bg-gray-900 border border-gray-800 text-gray-100' : 'bg-white border border-gray-200 text-[#2d0a4d]'}`}>
            <div className={`flex flex-col gap-4 p-8 border-b ${highContrast ? 'border-yellow-400 bg-gray-900' : 'bg-[#2d0a4d] text-white border-white/10'}`}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold">M.S. Dedicated View</p>
                <h3 className={`mt-3 text-2xl font-semibold ${highContrast ? 'text-yellow-400' : 'text-white'}`}>M. S. — Breast Oncology Patient</h3>
                <p className={`mt-2 text-sm ${highContrast ? 'text-yellow-200' : 'text-white/60'}`}>Dedicated workflow and Smart Schedule coordination for the mandate-critical case.</p>
              </div>
              <button onClick={() => setShowMsView(false)} className={`self-start rounded-full px-4 py-3 text-sm font-medium transition ${highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                Close View
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-[320px_1fr] p-8">
              <div className={`rounded-3xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-white border border-gray-200'}`}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Patient Snapshot</p>
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-semibold">M. S. (ID: #84729)</p>
                  <p className="text-xs text-gray-500">Breast Cancer • Critical Risk • 2 Days to Breach</p>
                </div>
                <div className="mt-6 space-y-4">
                  <div className={`rounded-2xl p-4 text-sm ${highContrast ? 'bg-black/60 text-white' : 'bg-gray-50'}`}>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">Smart Schedule status</p>
                    <p className="font-medium">AI recommended slot: <strong>Tuesday 11:00 AM</strong></p>
                    <p className="text-[11px] text-gray-500 mt-2">Mandate-compliant scheduling with minimum disruption to current clinic flow.</p>
                  </div>
                  <div className={`rounded-2xl p-4 text-sm ${highContrast ? 'bg-black/60 text-white' : 'bg-gray-50'}`}>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">Clinical coordination</p>
                    <p className="font-medium">Federated HIE record synchronized across the North Zone HUB and Multidisciplinary Collaboration Portal.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className={`rounded-3xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-white border border-gray-200'}`}>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">Flow Snapshot</p>
                      <h4 className={
                        `mt-2 text-lg font-semibold ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`
                      }>60-Day Pathway Status</h4>
                    </div>
                    <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[10px] font-semibold text-[#4338ca]">Critical</span>
                  </div>
                  <div className="grid gap-4 text-sm">
                    <div className={`flex items-center justify-between rounded-2xl p-4 ${highContrast ? 'bg-black/60 text-white' : 'bg-[#f8fafc]'}`}>
                      <span>Compliance window</span>
                      <strong>2 days</strong>
                    </div>
                    <div className={`flex items-center justify-between rounded-2xl p-4 ${highContrast ? 'bg-black/60 text-white' : 'bg-[#f8fafc]'}`}>
                      <span>Pathway</span>
                      <strong>Breast Cancer</strong>
                    </div>
                    <div className={`flex items-center justify-between rounded-2xl p-4 ${highContrast ? 'bg-black/60 text-white' : 'bg-[#f8fafc]'}`}>
                      <span>Current action</span>
                      <strong>Core Needle Biopsy</strong>
                    </div>
                  </div>
                </div>
                <div className={`rounded-3xl p-6 ${highContrast ? 'bg-gray-900 border border-yellow-400' : 'bg-white border border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">Action Queue</p>
                      <h4 className={`mt-2 text-lg font-semibold ${highContrast ? 'text-yellow-400' : 'text-[#2d0a4d]'}`}>Smart Schedule Tasks</h4>
                    </div>
                    <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[10px] font-semibold text-[#4338ca]">Live</span>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className={`rounded-2xl border border-gray-200 p-4 ${highContrast ? 'bg-black/60 text-white border-yellow-400' : 'bg-gray-50'}`}>
                      <p className="font-semibold">Confirm slot with biopsy suite</p>
                      <p className="text-[11px] text-gray-500 mt-2">AI has reserved Monday 11:00 AM and is awaiting coordinator approval.</p>
                    </div>
                    <div className={`rounded-2xl border border-gray-200 p-4 ${highContrast ? 'bg-black/60 text-white border-yellow-400' : 'bg-gray-50'}`}>
                      <p className="font-semibold">Notify patient</p>
                      <p className="text-[11px] text-gray-500 mt-2">Automated patient notification is ready for dispatch through the HIE.</p>
                    </div>
                    <div className={`rounded-2xl border border-gray-200 p-4 ${highContrast ? 'bg-black/60 text-white border-yellow-400' : 'bg-gray-50'}`}>
                      <p className="font-semibold">Lock the schedule</p>
                      <p className="text-[11px] text-gray-500 mt-2">Protect the selected Smart Schedule slot from rescheduling to preserve the mandate window.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
