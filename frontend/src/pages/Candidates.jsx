import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from '../components/CustomDropdown';

function Candidates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  // Data State
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ total: 0, inTraining: 0, processed: 0 });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter State
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trainer/candidates`, {
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
        });
        const data = await res.json();
        
        if (data && data.data) {
          const formatted = data.data.map(c => {
             const statusMap = {
               'PENDING':     { label: 'Pending',     class: 'bg-surface-container-highest text-outline border-outline-variant/20' },
               'IN REVIEW':   { label: 'In Review',   class: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
               'IN_PROGRESS': { label: 'In Progress', class: 'bg-secondary/10 text-secondary border-secondary/20' },
               'IN TRAINING': { label: 'In Training', class: 'bg-secondary/10 text-secondary border-secondary/20' },
               'APPROVED':    { label: 'Approved',    class: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
               'REJECTED':    { label: 'Rejected',    class: 'bg-error/10 text-error border-error/20' },
               'COMPLETED':   { label: 'Completed',   class: 'bg-primary/10 text-primary border-primary/20' }
             };
             
             const st = statusMap[(c.status || 'PENDING').toUpperCase()] || statusMap['PENDING'];
             
             return {
                id: c._id,
                name: c.name || 'Unknown Candidate',
                email: c.email || 'No email',
                role: c.roleApplied || 'Unspecified',
                status: st.label,
                statusClass: st.class,
                progress: c.matchScore || Math.floor(c.aiConfidence || 0),
                avatar: null
             };
          });
          setCandidates(formatted);
          setStats({
            total: formatted.length,
            inTraining: formatted.filter(f => f.status === 'In Training').length,
            processed: formatted.filter(f => f.status !== 'Review').length
          });
        }
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, candidates]);

  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);
  const currentData = filteredCandidates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-10 space-y-10">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tight leading-none mb-4 text-white">Candidates</h2>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Manage your talent pool and track training progress across active workspaces.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input
              className="bg-[#1a2236] border border-white/10 rounded-2xl pl-12 pr-6 py-3 w-80 focus:ring-2 focus:ring-primary/50 text-white placeholder-slate-600 transition-all outline-none text-sm"
              placeholder="Search by name or role..."
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <CustomDropdown 
            label="Status"
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Ready', value: 'Ready' },
              { label: 'In Training', value: 'In Training' },
              { label: 'Stuck', value: 'Stuck' },
              { label: 'Review', value: 'Review' }
            ]}
          />
        </div>
      </header>

      {/* Bento Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-8 rounded-3xl bg-[#1a2236] border border-white/5 flex flex-col justify-between h-40 group hover:border-primary/30 transition-all">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Total Talent</span>
          <span className="text-4xl font-black text-white">{stats.total}</span>
        </div>
        <div className="p-8 rounded-3xl bg-[#1a2236] border border-white/5 flex flex-col justify-between h-40 group hover:border-secondary/30 transition-all">
          <span className="text-xs font-bold tracking-widest text-secondary uppercase">In Training</span>
          <span className="text-4xl font-black text-white">{stats.inTraining}</span>
        </div>
        <div className="col-span-2 p-8 rounded-3xl bg-gradient-to-br from-[#1a2236] to-[#0b1326] border border-white/5 flex items-center gap-8 h-40">
          <div className="flex-1">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block mb-1">Approval Velocity</span>
            <p className="text-sm text-slate-500 mb-4">Your AI agent processed {stats.processed} profiles today.</p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4 shadow-[0_0_10px_rgba(128,131,255,0.4)]"></div>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
          </div>
        </div>
      </section>

      {/* Directory Table */}
      <div className="bg-[#1a2236] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0b1326]/30">
              {['Candidate', 'Assigned Role', 'Status', 'Skill Growth', 'Action'].map((col) => (
                <th key={col} className="px-8 py-6 text-[11px] font-black tracking-[0.1em] text-slate-500 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentData.map((c) => (
              <tr key={c.id} onClick={() => navigate(`/trainer/candidate/${c.id}`)} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0b1326] border border-white/10 flex items-center justify-center text-primary font-bold">
                       {c.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-300 text-sm font-medium">{c.role}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${c.statusClass}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(128,131,255,0.3)]" style={{ width: `${c.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-black text-primary w-8">{c.progress}%</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">more_horiz</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination UI */}
        <div className="px-8 py-6 bg-[#0b1326]/30 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-white font-bold">{currentData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to <span className="text-white font-bold">{Math.min(currentPage * rowsPerPage, filteredCandidates.length)}</span> of <span className="text-white font-bold">{filteredCandidates.length.toLocaleString()}</span> candidates
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-[#1a2236] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${currentPage === i + 1 ? 'bg-primary border-primary text-on-primary' : 'bg-[#1a2236] border-white/10 text-slate-400 hover:border-white/20'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl bg-[#1a2236] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Candidates;
