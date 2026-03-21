import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from '../components/CustomDropdown';

function HRDashboard() {
  const navigate = useNavigate();
  
  // Data State
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ total: 0, rejected: 0, approved: 0, inProgress: 0 });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter State
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hr/dashboard`, {
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
        });
        const data = await res.json();
        if (data.success && data.recent) {
          const statusColors = {
            'PENDING': 'text-tertiary',
            'APPROVED': 'text-primary',
            'IN_PROGRESS': 'text-secondary',
            'IN TRAINING': 'text-secondary',
            'COMPLETED': 'text-emerald-400',
            'REJECTED': 'text-rose-400'
          };

          const formatted = data.recent.map(c => ({
             id: c._id,
             name: c.name || 'Unknown',
             email: c.email || 'No email',
             role: c.roleApplied || 'Unspecified',
             match: c.matchScore || 0,
             status: c.status || 'PENDING',
             color: statusColors[c.status?.toUpperCase()] || 'text-tertiary'
          }));
          setCandidates(formatted);
          setStats({ 
             total: data.total || 0, 
             rejected: data.rejected || 0, 
             approved: data.approved || 0, 
             inProgress: data.inProgress || 0 
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase());
  }, [statusFilter, candidates]);

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / rowsPerPage));
  const currentData = filteredCandidates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-10 space-y-10">
      {/* Page Header */}
      <div>
        <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2">Talent Operations</p>
        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Candidate Status</h2>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Tracking the end-to-end recruitment pipeline and AI-driven upskilling progress for all active candidates.
        </p>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Candidates', value: stats.total.toString(), icon: 'groups', color: 'text-primary' },
          { label: 'Pending', value: (stats.total - stats.approved - stats.rejected - stats.inProgress).toString(), icon: 'rate_review', color: 'text-tertiary' },
          { label: 'In Training', value: stats.inProgress.toString(), icon: 'model_training', color: 'text-secondary' },
          { label: 'Approved', value: stats.approved.toString(), icon: 'verified', color: 'text-emerald-400' }
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a2236] p-6 rounded-2xl group hover:bg-[#2d3449]/50 transition-all border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
              <span className={`${stat.color} material-symbols-outlined text-3xl opacity-20 group-hover:opacity-100 transition-opacity`}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Table Section */}
      <div className="bg-[#1a2236] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Active Candidates</h3>
            <p className="text-sm text-slate-500">Real-time mapping of skills and onboarding milestones</p>
          </div>
          <div className="flex items-center gap-3">
            <CustomDropdown 
              label="Status"
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Approved', value: 'Approved' },
                { label: 'In Training', value: 'In Training' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Pending', value: 'Pending' }
              ]}
            />
            <button 
              onClick={() => navigate('/hr/upload')}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container rounded-xl text-sm font-bold text-on-primary shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all"
            >
              Upload Resume
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0b1326]/30">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Candidate Name</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Role Applied</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Match %</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentData.map((candidate) => (
                <tr key={candidate.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-[#0b1326] flex items-center justify-center font-bold text-xs ${candidate.color} border border-white/10`}>
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{candidate.name}</p>
                        <p className="text-xs text-slate-500">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-300">{candidate.role}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs font-bold ${candidate.color}`}>{candidate.match}%</span>
                      <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${candidate.color.replace('text-', 'bg-')}`} style={{ width: `${candidate.match}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 ${candidate.color} border border-white/5 uppercase tracking-wider`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => navigate(`/hr/candidate/${candidate.id}`)}
                      className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors border border-white/5 hover:border-primary/20 px-4 py-2 rounded-xl bg-white/[0.02]"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="px-8 py-6 bg-[#0b1326]/30 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5">
          <p className="text-xs text-slate-500">
            Showing <span className="text-white font-bold">{currentData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to <span className="text-white font-bold">{Math.min(currentPage * rowsPerPage, filteredCandidates.length)}</span> of <span className="text-white font-bold">{filteredCandidates.length}</span> candidates
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-[#1a2236] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <span className="material-symbols-outlined">chevron_left</span>
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
              className="w-10 h-10 rounded-xl bg-[#1a2236] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
