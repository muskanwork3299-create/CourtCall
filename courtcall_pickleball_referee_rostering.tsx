import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, Users, Calendar, MapPin, AlertTriangle, CheckCircle2, 
  XCircle, Clock, Wifi, WifiOff, RefreshCw, Smartphone, Monitor, 
  Download, Send, UserX, UserPlus, Filter, Search, ChevronRight, 
  ChevronLeft, AlertCircle, Check, X, Bell, Info, Award, ArrowRight,
  Menu, Globe, Settings, HelpCircle, PhoneCall
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONSTANTS
// ==========================================
const INITIAL_REFEREES = [
  { id: 'REF-01', name: 'Marcus Vance', level: 'Certified Level 2', email: 'marcus.v@courtcall.org', phone: '+1 (555) 234-5678', status: 'Available', avatar: 'MV', maxMatches: 4 },
  { id: 'REF-02', name: 'Sarah Jenkins', level: 'Certified Level 3 (Pro)', email: 'sarah.j@courtcall.org', phone: '+1 (555) 876-5432', status: 'Available', avatar: 'SJ', maxMatches: 5 },
  { id: 'REF-03', name: 'David Kim', level: 'Certified Level 1', email: 'david.k@courtcall.org', phone: '+1 (555) 345-6789', status: 'Available', avatar: 'DK', maxMatches: 3 },
  { id: 'REF-04', name: 'Elena Rostova', level: 'Certified Level 2', email: 'elena.r@courtcall.org', phone: '+1 (555) 456-7890', status: 'Available', avatar: 'ER', maxMatches: 4 },
  { id: 'REF-05', name: 'James Wilson', level: 'Trainee', email: 'james.w@courtcall.org', phone: '+1 (555) 567-8901', status: 'Available', avatar: 'JW', maxMatches: 3 },
  { id: 'REF-06', name: 'Aaliyah Patel', level: 'Certified Level 3 (Pro)', email: 'aaliyah.p@courtcall.org', phone: '+1 (555) 678-9012', status: 'Available', avatar: 'AP', maxMatches: 5 },
  { id: 'REF-07', name: 'Robert Chen', level: 'Certified Level 1', email: 'robert.c@courtcall.org', phone: '+1 (555) 789-0123', status: 'Available', avatar: 'RC', maxMatches: 4 },
  { id: 'REF-08', name: 'Maria Garcia', level: 'Certified Level 2', email: 'maria.g@courtcall.org', phone: '+1 (555) 890-1234', status: 'Available', avatar: 'MG', maxMatches: 4 },
];

const INITIAL_MATCHES = [
  { id: 'PB-101', time: '09:00 AM', court: 'Court 1', category: 'Open Singles Semifinal', refId: 'REF-02', refName: 'Sarah Jenkins', qualStatus: 'Qualified', response: 'Confirmed', conflict: false },
  { id: 'PB-102', time: '09:00 AM', court: 'Court 2', category: 'Senior Pro Doubles', refId: 'REF-01', refName: 'Marcus Vance', qualStatus: 'Qualified', response: 'Confirmed', conflict: false },
  { id: 'PB-103', time: '09:45 AM', court: 'Court 1', category: 'Mixed Doubles Final', refId: 'REF-06', refName: 'Aaliyah Patel', qualStatus: 'Qualified', response: 'Pending', conflict: false },
  { id: 'PB-104', time: '10:30 AM', court: 'Court 3', category: 'Pro Singles Quarterfinal', refId: null, refName: 'Unassigned', qualStatus: 'Needs Level 2+', response: 'Unassigned', conflict: false },
  { id: 'PB-105', time: '10:30 AM', court: 'Court 2', category: "Women's Doubles Round Robin", refId: 'REF-04', refName: 'Elena Rostova', qualStatus: 'Qualified', response: 'Confirmed', conflict: false },
  { id: 'PB-106', time: '11:15 AM', court: 'Court 1', category: "Men's Pro Singles", refId: 'REF-03', refName: 'David Kim', qualStatus: 'Level Mismatch', response: 'Confirmed', conflict: true },
  { id: 'PB-107', time: '11:15 AM', court: 'Court 4', category: 'Amateur Gold Bracket', refId: 'REF-05', refName: 'James Wilson', qualStatus: 'Qualified', response: 'Declined', conflict: false },
  { id: 'PB-108', time: '12:00 PM', court: 'Court 3', category: 'Mixed Pro Bracket', refId: null, refName: 'Unassigned', qualStatus: 'Needs Level 2+', response: 'Unassigned', conflict: false },
  { id: 'PB-109', time: '01:00 PM', court: 'Court 1', category: 'Championship Singles', refId: 'REF-02', refName: 'Sarah Jenkins', qualStatus: 'Qualified', response: 'Confirmed', conflict: false },
  { id: 'PB-110', time: '01:00 PM', court: 'Court 2', category: 'Championship Doubles', refId: 'REF-06', refName: 'Aaliyah Patel', qualStatus: 'Qualified', response: 'Pending', conflict: false },
  { id: 'PB-111', time: '02:00 PM', court: 'Court 3', category: 'Masters Over-50 Final', refId: 'REF-08', refName: 'Maria Garcia', qualStatus: 'Qualified', response: 'Confirmed', conflict: false },
  { id: 'PB-112', time: '02:30 PM', court: 'Court 4', category: 'Junior Showcase', refId: null, refName: 'Unassigned', qualStatus: 'Trainee OK', response: 'Unassigned', conflict: false },
];

export default function App() {
  // Global Application State
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [referees, setReferees] = useState(INITIAL_REFEREES);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSynced, setLastSynced] = useState('Just now');
  const [viewMode, setViewMode] = useState('coordinator'); // 'coordinator' | 'referee-mobile'
  const [selectedRefMobile, setSelectedRefMobile] = useState('REF-01'); // Marcus Vance default
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Panels State
  const [activeModal, setActiveModal] = useState(null); // 'match-detail' | 'replacement' | 'notification' | 'settings' | 'export-success'
  const [activeMatch, setActiveMatch] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Time tracker for last synced
  useEffect(() => {
    const timer = setInterval(() => {
      if (isOnline) {
        setLastSynced('Just now');
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [isOnline]);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Online/Offline
  const toggleConnectivity = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (!nextState) {
      showToast('Connection lost. Operating in read-only local mode with offline queuing.', 'warning');
    } else {
      showToast('Connection restored. Syncing pending local updates...', 'success');
      setPendingSyncCount(0);
      setLastSynced('Just now');
    }
  };

  // Computed Metrics
  const metrics = useMemo(() => {
    const total = matches.length;
    const assigned = matches.filter(m => m.refId !== null).length;
    const unfilled = matches.filter(m => m.refId === null).length;
    const pending = matches.filter(m => m.response === 'Pending').length;
    const conflicts = matches.filter(m => m.conflict === true || m.response === 'Declined').length;
    return { total, assigned, unfilled, pending, conflicts };
  }, [matches]);

  // Filtered matches for coordinator
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const matchesSearch = m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.refName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filterStatus === 'All') return true;
      if (filterStatus === 'Uncovered' && m.refId === null) return true;
      if (filterStatus === 'Confirmed' && m.response === 'Confirmed') return true;
      if (filterStatus === 'Pending' && m.response === 'Pending') return true;
      if (filterStatus === 'Conflicts' && (m.conflict || m.response === 'Declined')) return true;
      return false;
    });
  }, [matches, searchQuery, filterStatus]);

  // Handle CSV Export
  const exportRosterCSV = () => {
    const headers = ['Match ID', 'Time', 'Court', 'Category', 'Referee ID', 'Referee Name', 'Qualification Status', 'Response', 'Conflict'];
    const rows = matches.map(m => [
      m.id,
      m.time,
      m.court,
      `"${m.category}"`,
      m.refId || 'NONE',
      `"${m.refName}"`,
      `"${m.qualStatus}"`,
      m.response,
      m.conflict ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CourtCall_Roster_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Match roster successfully exported to CSV.', 'success');
  };

  // Simulate Emergency Withdrawal for Match PB-102 or any match
  const simulateEmergencyWithdrawal = (matchId = 'PB-102') => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          response: 'Withdrawn',
          conflict: true
        };
      }
      return m;
    }));
    if (!isOnline) {
      setPendingSyncCount(c => c + 1);
    }
    showToast(`Emergency withdrawal logged for Match ${matchId}. Referee released. Conflict flagged.`, 'warning');
  };

  // Assign referee to match with conflict check
  const assignRefereeToMatch = (matchId, refId) => {
    const referee = referees.find(r => r.id === refId);
    const match = matches.find(m => m.id === matchId);
    
    // Check if referee is already booked at same time
    const existingCommitment = matches.find(m => m.refId === refId && m.time === match.time && m.id !== matchId);
    const hasConflict = Boolean(existingCommitment);

    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          refId: referee.id,
          refName: referee.name,
          response: 'Pending',
          conflict: hasConflict,
          qualStatus: referee.level.includes('Level 3') || referee.level.includes('Level 2') ? 'Qualified' : 'Trainee OK'
        };
      }
      return m;
    }));

    if (!isOnline) {
      setPendingSyncCount(c => c + 1);
    }

    setActiveModal(null);
    if (hasConflict) {
      showToast(`Assigned ${referee.name} to ${matchId}, but OVERLAPPING CONFLICT detected at ${match.time}!`, 'warning');
    } else {
      showToast(`Successfully assigned ${referee.name} to ${matchId}. Notification queued.`, 'success');
    }
  };

  // Referee mobile view action: accept/decline
  const handleRefereeResponse = (matchId, responseType) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          response: responseType,
          conflict: responseType === 'Declined' ? true : m.conflict
        };
      }
      return m;
    }));

    if (!isOnline) {
      setPendingSyncCount(c => c + 1);
      showToast(`Action saved locally (${responseType}). Marked as [Pending sync].`, 'warning');
    } else {
      showToast(`Assignment ${responseType.toLowerCase()} successfully sent to coordinator.`, responseType === 'Confirmed' ? 'success' : 'warning');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F4] text-[#122218] font-sans flex flex-col selection:bg-[#2D6A4F] selection:text-white">
      
      {/* ==========================================
          TOP HEADER & CONNECTIVITY BANNER
          ========================================== */}
      <header className="bg-[#1B3B2B] text-[#E8F5E9] border-b border-[#2D5A40] sticky top-0 z-40 shadow-sm">
        {/* Offline / Connectivity Banner */}
        {!isOnline && (
          <div className="bg-[#523A14] text-[#FFE0B2] px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 animate-pulse text-[#FFB74D]" />
              <span>CONNECTION LOST — Operating in Offline Mode. Showing read-only cached roster data.</span>
            </div>
            <div className="flex items-center space-x-3">
              {pendingSyncCount > 0 && (
                <span className="bg-[#33230A] text-[#FFCC80] px-2 py-0.5 rounded text-[11px] font-bold">
                  {pendingSyncCount} local change{pendingSyncCount > 1 ? 's' : ''} queued [Pending sync]
                </span>
              )}
              <span className="text-[11px] opacity-90">Last synced: {lastSynced}</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#40916C] flex items-center justify-center shadow-md border border-[#52B788]/30">
              <ShieldCheck className="w-6 h-6 text-[#E8F5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-[#E8F5E9]">CourtCall</span>
                <span className="text-xs bg-[#2D6A4F]/40 text-[#B7E4C7] font-medium px-2 py-0.5 rounded-full border border-[#52B788]/30">
                  Pickleball Referee Rostering
                </span>
              </div>
              <p className="text-xs text-[#95D5B2] hidden sm:block">National Championship Open • Venue: Central Courts, Court 1–4</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Online Status Toggle */}
            <button 
              onClick={toggleConnectivity}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isOnline 
                  ? 'bg-[#2D6A4F]/30 text-[#B7E4C7] border border-[#52B788]/40 hover:bg-[#2D6A4F]/50' 
                  : 'bg-[#523A14]/40 text-[#FFCC80] border border-[#D97706]/40 hover:bg-[#523A14]/60'
              }`}
              title="Toggle network connectivity for offline simulation"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-[#52B788]" /> : <WifiOff className="w-3.5 h-3.5 text-[#FFB74D]" />}
              <span className="hidden md:inline">{isOnline ? 'Online (Live)' : 'Offline (Cached)'}</span>
            </button>

            {/* View Mode Switcher */}
            <div className="bg-[#122A1E] p-1 rounded-xl flex items-center border border-[#2D5A40]">
              <button
                onClick={() => setViewMode('coordinator')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'coordinator' 
                    ? 'bg-[#2D6A4F] text-[#E8F5E9] shadow' 
                    : 'text-[#95D5B2] hover:text-[#E8F5E9] hover:bg-[#1B3B2B]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Coordinator Dashboard</span>
                <span className="sm:hidden">Coordinator</span>
              </button>

              <button
                onClick={() => setViewMode('referee-mobile')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'referee-mobile' 
                    ? 'bg-[#2D6A4F] text-[#E8F5E9] shadow' 
                    : 'text-[#95D5B2] hover:text-[#E8F5E9] hover:bg-[#1B3B2B]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Referee Mobile View</span>
                <span className="sm:hidden">Mobile Ref</span>
              </button>
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => setActiveModal('notification')}
              className="p-2 rounded-xl bg-[#122A1E] hover:bg-[#1B3B2B] text-[#B7E4C7] relative border border-[#2D5A40] transition"
              title="View notification center & previews"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#52B788] animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300 max-w-md">
          <div className={`p-4 rounded-xl shadow-xl flex items-start space-x-3 text-sm font-medium border ${
            toastMessage.type === 'success' ? 'bg-[#1B3B2B] text-[#E8F5E9] border-[#52B788]/50' :
            toastMessage.type === 'warning' ? 'bg-[#3A2E12] text-[#FFE0B2] border-[#D97706]/50' :
            'bg-[#3A1818] text-[#FFCDD2] border-[#EF4444]/50'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#52B788] shrink-0 mt-0.5" /> :
             toastMessage.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-[#FFB74D] shrink-0 mt-0.5" /> :
             <XCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p>{toastMessage.text}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-[#95D5B2] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          MAIN CONTENT AREA
          ========================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {viewMode === 'coordinator' ? (
          // ==========================================
          // 1. COORDINATOR DASHBOARD & ROSTER OVERVIEW
          // ==========================================
          <div className="space-y-6">
            
            {/* Top Action Banner & Quick Simulation triggers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D8E6DD] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tournament Date: Saturday, Oct 24, 2026</span>
                  <span className="text-[#B7E4C7]">•</span>
                  <MapPin className="w-3.5 h-3.5 text-[#52B788]" />
                  <span className="text-[#2D5A40]">Central Pickleball Complex</span>
                </div>
                <h1 className="text-2xl font-bold text-[#1B3B2B] tracking-tight">Roster Coordinator Dashboard</h1>
                <p className="text-sm text-[#405D50] mt-0.5">Manage referee assignments, prevent double-booking conflicts, and oversee match readiness.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => simulateEmergencyWithdrawal('PB-102')}
                  className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border border-[#FCD34D] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
                  title="Simulate Marcus Vance withdrawing from Match PB-102 at 09:00 AM"
                >
                  <UserX className="w-4 h-4 text-[#D97706]" />
                  <span>Simulate Emergency Withdrawal (PB-102)</span>
                </button>

                <button
                  onClick={exportRosterCSV}
                  className="bg-[#1B3B2B] hover:bg-[#122A1E] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#52B788]" />
                  <span>Export Roster CSV</span>
                </button>
              </div>
            </div>

            {/* Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#D8E6DD] shadow-sm">
                <div className="flex items-center justify-between text-[#405D50] mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Matches</span>
                  <Calendar className="w-4 h-4 text-[#52B788]" />
                </div>
                <div className="text-2xl font-bold text-[#1B3B2B]">{metrics.total}</div>
                <div className="text-[11px] text-[#526E60] mt-1">Across 4 courts & sessions</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D8E6DD] shadow-sm">
                <div className="flex items-center justify-between text-[#405D50] mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Assigned Refs</span>
                  <Users className="w-4 h-4 text-[#2D6A4F]" />
                </div>
                <div className="text-2xl font-bold text-[#2D6A4F]">{metrics.assigned}</div>
                <div className="text-[11px] text-[#526E60] mt-1">
                  {Math.round((metrics.assigned / metrics.total) * 100)}% staffing coverage
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D8E6DD] shadow-sm">
                <div className="flex items-center justify-between text-[#405D50] mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Unfilled</span>
                  <AlertCircle className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="text-2xl font-bold text-[#B45309]">{metrics.unfilled}</div>
                <div className="text-[11px] text-[#B45309] font-medium mt-1">Needs referee assignment</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D8E6DD] shadow-sm">
                <div className="flex items-center justify-between text-[#405D50] mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Pending Response</span>
                  <Clock className="w-4 h-4 text-[#2B6CB0]" />
                </div>
                <div className="text-2xl font-bold text-[#1E40AF]">{metrics.pending}</div>
                <div className="text-[11px] text-[#526E60] mt-1">Awaiting referee accept</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D8E6DD] shadow-sm col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-[#405D50] mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Conflicts / Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                </div>
                <div className="text-2xl font-bold text-[#B91C1C]">{metrics.conflicts}</div>
                <div className="text-[11px] text-[#B91C1C] font-medium mt-1">Double-booking / Withdrawn</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#D8E6DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                {['All', 'Uncovered', 'Confirmed', 'Pending', 'Conflicts'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                      filterStatus === status 
                        ? 'bg-[#1B3B2B] text-white shadow-sm' 
                        : 'bg-[#E8F5E9] text-[#2D5A40] hover:bg-[#D4EDDA]'
                    }`}
                  >
                    {status} {status === 'Uncovered' && `(${metrics.unfilled})`} {status === 'Conflicts' && `(${metrics.conflicts})`}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#526E60] absolute left-3.5 top-3" />
                <input 
                  type="text"
                  placeholder="Search matches, courts, refs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F4F8F4] border border-[#D8E6DD] rounded-xl text-xs focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition text-[#1B3B2B]"
                />
              </div>
            </div>

            {/* Match Roster Table Grouped by Time / Court */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8E6DD] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E8F5E9] flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#1B3B2B] text-base">Match Assignment Roster</h2>
                  <p className="text-xs text-[#526E60]">Showing {filteredMatches.length} of {matches.length} scheduled matches</p>
                </div>
                <span className="text-xs bg-[#E8F5E9] text-[#2D5A40] px-3 py-1 rounded-full font-medium border border-[#D8E6DD]">
                  Sorted by Match Time
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E8F5E9]/60 text-[#2D5A40] text-[11px] font-bold uppercase tracking-wider border-b border-[#D8E6DD]">
                      <th className="py-3 px-6">Match ID</th>
                      <th className="py-3 px-4">Time & Court</th>
                      <th className="py-3 px-6">Category</th>
                      <th className="py-3 px-6">Assigned Referee</th>
                      <th className="py-3 px-4">Qualification</th>
                      <th className="py-3 px-4">Response</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8F5E9] text-xs">
                    {filteredMatches.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-12 text-[#526E60]">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#52B788]" />
                          No matches found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredMatches.map(match => {
                        const isUncovered = match.refId === null;
                        const hasConflict = match.conflict || match.response === 'Declined' || match.response === 'Withdrawn';
                        
                        return (
                          <tr key={match.id} className={`hover:bg-[#F4F8F4] transition ${hasConflict ? 'bg-[#FEF2F2]/80' : isUncovered ? 'bg-[#FEFCE8]/60' : ''}`}>
                            <td className="py-4 px-6 font-mono font-bold text-[#1B3B2B]">
                              {match.id}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-semibold text-[#122218]">{match.time}</div>
                              <div className="text-[11px] text-[#526E60] font-medium">{match.court}</div>
                            </td>
                            <td className="py-4 px-6 font-medium text-[#2D4030]">
                              {match.category}
                            </td>
                            <td className="py-4 px-6">
                              {isUncovered ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                                  <AlertTriangle className="w-3 h-3 mr-1 text-[#D97706]" />
                                  Uncovered Match
                                </span>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-[#D8F3DC] text-[#1B3B2B] flex items-center justify-center font-bold text-[10px] border border-[#52B788]/40">
                                    {match.refName.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="font-semibold text-[#1B3B2B]">{match.refName}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium ${
                                match.qualStatus === 'Qualified' ? 'bg-[#E8F5E9] text-[#1B4D3E] border border-[#A3E4D7]' :
                                match.qualStatus.includes('Level') ? 'bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A]' :
                                'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]'
                              }`}>
                                {match.qualStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                match.response === 'Confirmed' ? 'bg-[#D8F3DC] text-[#1B4D3E]' :
                                match.response === 'Pending' ? 'bg-[#E0F2FE] text-[#0369A1]' :
                                match.response === 'Declined' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                                match.response === 'Withdrawn' ? 'bg-[#FEF3C7] text-[#78350F]' :
                                'bg-[#F1F5F9] text-[#475569]'
                              }`}>
                                {match.response}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {isUncovered || hasConflict ? (
                                  <button
                                    onClick={() => {
                                      setActiveMatch(match);
                                      setActiveModal('replacement');
                                    }}
                                    className="px-3 py-1.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1"
                                  >
                                    <UserPlus className="w-3.5 h-3.5 text-[#FECACA]" />
                                    <span>Find Replacement</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveMatch(match);
                                      setActiveModal('match-detail');
                                    }}
                                    className="px-3 py-1.5 bg-[#1B3B2B] hover:bg-[#122A1E] text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center space-x-1"
                                  >
                                    <span>Manage</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-[#52B788]" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanatory Sports Operations Note */}
            <div className="bg-[#1B3B2B] text-[#E8F5E9] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#2D5A40]">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[#95D5B2] font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-[#52B788]" />
                  <span>Centralized Conflict Prevention Guarantee</span>
                </div>
                <p className="text-xs text-[#D8F3DC]/90 leading-relaxed max-w-3xl">
                  CourtCall automatically checks referee schedules, qualification certifications (Level 1–3), and maximum match loads before confirming assignments. Overlapping timeslots trigger instant double-booking warnings.
                </p>
              </div>
              <button 
                onClick={() => setViewMode('referee-mobile')}
                className="bg-[#52B788] hover:bg-[#40916C] text-[#122218] font-bold px-4 py-2.5 rounded-xl text-xs transition whitespace-nowrap shadow-md flex items-center space-x-2"
              >
                <span>Switch to Referee Mobile View</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          // ==========================================
          // 3. REFEREE MOBILE VIEW (SIMULATED PHONE FRAME)
          // ==========================================
          <div className="py-4 flex flex-col items-center justify-center">
            
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-[#1B3B2B]">Referee Mobile View Simulator</h2>
              <p className="text-xs text-[#526E60]">Previewing how referees view and respond to assignments on outdoor mobile devices.</p>
              
              {/* Referee Selector */}
              <div className="mt-3 flex items-center justify-center space-x-2 flex-wrap gap-y-2">
                <span className="text-xs font-semibold text-[#2D5A40]">Select Referee Profile:</span>
                {referees.map(ref => (
                  <button
                    key={ref.id}
                    onClick={() => setSelectedRefMobile(ref.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      selectedRefMobile === ref.id 
                        ? 'bg-[#1B3B2B] text-white shadow-sm' 
                        : 'bg-white text-[#2D5A40] border border-[#D8E6DD] hover:bg-[#E8F5E9]'
                    }`}
                  >
                    {ref.name} ({ref.id})
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Frame */}
            <div className="w-full max-w-sm bg-[#122218] rounded-[40px] p-4 shadow-2xl border-4 border-[#1B3B2B] relative">
              {/* Phone Speaker Notch */}
              <div className="w-32 h-4 bg-[#0A140E] mx-auto rounded-b-xl mb-2 flex items-center justify-center">
                <div className="w-12 h-1 bg-[#1B3B2B] rounded-full"></div>
              </div>

              {/* Mobile Screen Content */}
              <div className="bg-[#F4F8F4] rounded-[32px] overflow-hidden flex flex-col h-[680px] text-[#122218] border border-[#1B3B2B] shadow-inner">
                
                {/* Mobile App Header */}
                <div className="bg-[#1B3B2B] text-[#E8F5E9] p-4 flex items-center justify-between border-b border-[#2D5A40]">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#52B788]" />
                      <span className="font-bold text-sm tracking-tight">CourtCall Mobile</span>
                    </div>
                    <p className="text-[10px] text-[#95D5B2]">
                      Ref: {referees.find(r => r.id === selectedRefMobile)?.name}
                    </p>
                  </div>
                  <span className="text-[10px] bg-[#2D6A4F]/60 text-[#B7E4C7] px-2 py-0.5 rounded-full font-medium border border-[#52B788]/30">
                    {referees.find(r => r.id === selectedRefMobile)?.level}
                  </span>
                </div>

                {/* Mobile Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  
                  {/* Referee Availability Status Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[#D8E6DD] shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#1B3B2B]">My Availability & Status</span>
                      <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse"></span>
                    </div>
                    <div className="text-[11px] text-[#405D50] space-y-1">
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium text-[#1B3B2B]">{referees.find(r => r.id === selectedRefMobile)?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Match Load:</span>
                        <span className="font-medium text-[#1B3B2B]">{referees.find(r => r.id === selectedRefMobile)?.maxMatches} matches / day</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#526E60]">My Assigned Matches</h3>
                    <span className="text-[10px] text-[#526E60]">Tap to Accept/Decline</span>
                  </div>

                  {/* Matches assigned to this referee */}
                  {matches.filter(m => m.refId === selectedRefMobile).length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl text-center border border-[#D8E6DD] text-[#526E60]">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#52B788]" />
                      <p className="text-xs font-semibold text-[#1B3B2B]">No matches currently assigned to you.</p>
                      <p className="text-[11px] text-[#526E60] mt-1">You will be notified when the coordinator assigns you a match.</p>
                    </div>
                  ) : (
                    matches.filter(m => m.refId === selectedRefMobile).map(match => (
                      <div key={match.id} className="bg-white rounded-2xl p-4 border border-[#D8E6DD] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold bg-[#E8F5E9] px-2 py-0.5 rounded text-[#1B3B2B]">{match.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            match.response === 'Confirmed' ? 'bg-[#D8F3DC] text-[#1B4D3E]' :
                            match.response === 'Pending' ? 'bg-[#E0F2FE] text-[#0369A1]' :
                            'bg-[#FEE2E2] text-[#991B1B]'
                          }`}>
                            {match.response}
                          </span>
                        </div>

                        <div>
                          <div className="font-bold text-[#1B3B2B] text-sm">{match.category}</div>
                          <div className="text-xs text-[#526E60] flex items-center space-x-2 mt-0.5">
                            <span className="font-semibold text-[#2D6A4F]">{match.time}</span>
                            <span>•</span>
                            <span>{match.court}</span>
                          </div>
                        </div>

                        {/* Large Outdoor-Friendly Accept / Decline Buttons */}
                        <div className="pt-2 border-t border-[#E8F5E9] flex items-center space-x-2">
                          <button
                            onClick={() => handleRefereeResponse(match.id, 'Confirmed')}
                            className="flex-1 bg-[#2D6A4F] hover:bg-[#1B3B2B] text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow transition flex items-center justify-center space-x-1"
                          >
                            <Check className="w-4 h-4 text-[#52B788]" />
                            <span>Accept</span>
                          </button>
                          
                          <button
                            onClick={() => handleRefereeResponse(match.id, 'Declined')}
                            className="flex-1 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Push Notification Explanatory Note */}
                  <div className="bg-[#E8F5E9] border border-[#A3E4D7] p-3.5 rounded-2xl text-[11px] text-[#1B4D3E] space-y-1">
                    <div className="font-bold flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      <span>Notification Delivery Note</span>
                    </div>
                    <p className="text-[#2D5A40] leading-relaxed">
                      Push notifications and lock-screen visibility depend on device permissions, OS power settings, connectivity, and background sync conditions.
                    </p>
                  </div>

                </div>

                {/* Mobile Bottom Navigation Bar */}
                <div className="bg-white border-t border-[#D8E6DD] py-2.5 px-6 flex justify-around text-[#526E60] text-[10px] font-medium">
                  <button className="flex flex-col items-center text-[#2D6A4F]">
                    <Calendar className="w-4 h-4 mb-0.5" />
                    <span>Schedule</span>
                  </button>
                  <button className="flex flex-col items-center hover:text-[#1B3B2B]">
                    <Award className="w-4 h-4 mb-0.5" />
                    <span>Badges</span>
                  </button>
                  <button className="flex flex-col items-center hover:text-[#1B3B2B]">
                    <Settings className="w-4 h-4 mb-0.5" />
                    <span>Settings</span>
                  </button>
                </div>

              </div>
            </div>

            <button
              onClick={() => setViewMode('coordinator')}
              className="mt-4 text-xs font-semibold text-[#2D6A4F] hover:text-[#1B3B2B] underline flex items-center space-x-1"
            >
              <span>Return to Coordinator Dashboard</span>
            </button>

          </div>
        )}

      </main>

      {/* ==========================================
          MODALS & WORKFLOW DIALOGS
          ========================================== */}
      
      {/* 1. MATCH ASSIGNMENT DETAIL & REPLACEMENT SHORTLIST MODAL */}
      {(activeModal === 'match-detail' || activeModal === 'replacement') && activeMatch && (
        <div className="fixed inset-0 z-50 bg-[#0A140E]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#D8E6DD] space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8F5E9]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs bg-[#E8F5E9] text-[#1B3B2B] px-2 py-0.5 rounded">{activeMatch.id}</span>
                  <span className="text-xs text-[#526E60] font-medium">{activeMatch.time} • {activeMatch.court}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1B3B2B] mt-1">{activeMatch.category}</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full hover:bg-[#E8F5E9] text-[#526E60] hover:text-[#1B3B2B] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Assignment Status */}
            <div className="bg-[#F4F8F4] p-4 rounded-2xl border border-[#D8E6DD] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#526E60]">Current Assignment Status</span>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1B3B2B] text-base">
                    {activeMatch.refId ? activeMatch.refName : 'Uncovered (No Referee Assigned)'}
                  </div>
                  <div className="text-xs text-[#526E60]">
                    Qualification check: <span className="font-semibold text-[#1B3B2B]">{activeMatch.qualStatus}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeMatch.response === 'Confirmed' ? 'bg-[#D8F3DC] text-[#1B4D3E]' :
                  activeMatch.response === 'Pending' ? 'bg-[#E0F2FE] text-[#0369A1]' :
                  'bg-[#FEF3C7] text-[#78350F]'
                }`}>
                  {activeMatch.response}
                </span>
              </div>
            </div>

            {/* 4. URGENT REPLACEMENT SHORTLIST */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#1B3B2B] text-sm">Select Eligible & Available Referees</h4>
                <span className="text-xs text-[#526E60]">Filtering by schedule & qualification</span>
              </div>

              <div className="space-y-2">
                {referees.map(ref => {
                  // Check existing commitment at this exact time
                  const isCommittedAtTime = matches.some(m => m.refId === ref.id && m.time === activeMatch.time && m.id !== activeMatch.id);
                  const isAlreadyAssignedHere = activeMatch.refId === ref.id;

                  return (
                    <div key={ref.id} className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                      isCommittedAtTime ? 'bg-[#FEF2F2]/60 border-[#FCA5A5]' :
                      isAlreadyAssignedHere ? 'bg-[#E8F5E9] border-[#52B788]' :
                      'bg-white border-[#D8E6DD] hover:border-[#2D6A4F]'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center font-bold text-xs">
                          {ref.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[#1B3B2B] text-sm">{ref.name}</span>
                            <span className="text-[10px] bg-[#E8F5E9] text-[#1B4D3E] px-2 py-0.5 rounded font-medium border border-[#D8E6DD]">{ref.level}</span>
                          </div>
                          <div className="text-xs text-[#526E60] mt-0.5">
                            {isCommittedAtTime ? (
                              <span className="text-[#B91C1C] font-bold flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 inline mr-1 text-[#DC2626]" />
                                <span>Already committed to overlapping match at {activeMatch.time}</span>
                              </span>
                            ) : (
                              <span className="text-[#2D6A4F] font-medium">Available at {activeMatch.time} • Ready to assign</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isCommittedAtTime ? (
                          <span className="px-3 py-1.5 bg-[#FEE2E2] text-[#991B1B] rounded-xl text-xs font-bold cursor-not-allowed">
                            Conflict (Blocked)
                          </span>
                        ) : (
                          <button
                            onClick={() => assignRefereeToMatch(activeMatch.id, ref.id)}
                            className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#1B3B2B] text-white rounded-xl text-xs font-semibold shadow transition flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5 text-[#52B788]" />
                            <span>Assign Referee</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8F5E9] flex items-center justify-end space-x-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#F4F8F4] hover:bg-[#E8F5E9] text-[#2D5A40] rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. NOTIFICATION PREVIEW MODAL */}
      {activeModal === 'notification' && (
        <div className="fixed inset-0 z-50 bg-[#0A140E]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D8E6DD] space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8F5E9]">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#2D6A4F]" />
                <h3 className="font-bold text-[#1B3B2B] text-lg">Notification Center & Previews</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-full hover:bg-[#E8F5E9] text-[#526E60]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F4F8F4] p-4 rounded-2xl border border-[#D8E6DD] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1B3B2B]">Preview: New Assignment Notification</span>
                  <span className="text-[10px] text-[#526E60]">Just now</span>
                </div>
                <p className="text-xs text-[#2D4030] italic bg-white p-3 rounded-xl border border-[#D8E6DD]">
                  "Hi Marcus, you have been assigned to Match PB-101 (Open Singles Semifinal) on Court 1 at 09:00 AM. Please open CourtCall to accept or decline."
                </p>
              </div>

              <div className="bg-[#FEF3C7]/60 p-4 rounded-2xl border border-[#FDE68A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#78350F]">Preview: Urgent Replacement Request</span>
                  <span className="text-[10px] text-[#B45309]">2m ago</span>
                </div>
                <p className="text-xs text-[#78350F] italic bg-white p-3 rounded-xl border border-[#FDE68A]">
                  "URGENT: Referee withdrew from Match PB-102. Replacement needed immediately on Court 2 at 09:00 AM."
                </p>
              </div>

              <div className="bg-[#E8F5E9] p-4 rounded-2xl text-xs text-[#1B4D3E] space-y-1 border border-[#A3E4D7]">
                <div className="font-bold text-[#1B3B2B]">System Delivery Notice</div>
                <p>
                  Push notifications and lock-screen visibility depend on device permissions, OS settings, and network delivery conditions.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#122A1E] text-white rounded-xl text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer Note */}
      <footer className="bg-white border-t border-[#D8E6DD] py-4 text-center text-xs text-[#526E60]">
        CourtCall Pickleball Referee Rostering Prototype • Built for Sports Operations Management. All simulated state runs locally.
      </footer>

    </div>
  );
}