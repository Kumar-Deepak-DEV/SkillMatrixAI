import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function HRCandidateProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitMsg, setResubmitMsg] = useState('');

  const fetchCandidate = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:3000/api/hr/candidate/${id}`, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      if (data.success) {
        setCandidate(data.candidate);
        setRoadmap(data.candidate.roadmapId);
      }
    } catch (err) {
      console.error("Failed to fetch candidate:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidate(); }, [id]);

  const handleResubmit = async () => {
    if (!window.confirm('Re-run AI to generate a brand new roadmap for this candidate?')) return;
    setResubmitting(true);
    setResubmitMsg('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:3000/api/hr/candidate/${id}/resubmit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        setResubmitMsg('✅ Roadmap resubmitted! The trainer will receive the new AI roadmap.');
        fetchCandidate(); // Refresh state
      } else {
        setResubmitMsg(`❌ ${data.message}`);
      }
    } catch (err) {
      setResubmitMsg('❌ Failed to resubmit. Please try again.');
    } finally {
      setResubmitting(false);
    }
  };

  if (loading) return <div className="text-white p-10 min-h-screen text-center mt-20 text-xl font-bold">Loading...</div>;
  if (!candidate) return <div className="text-white p-10 min-h-screen text-center mt-20 text-xl font-bold">Candidate not found</div>;

  let aiData = { skills: [], experience: '', projects: [] };
  try { if (candidate.aiInsight) aiData = JSON.parse(candidate.aiInsight); } catch(e) {}

  const letters = candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  const isRejected = candidate.status === 'REJECTED';

  const statusColors = {
    'PENDING':     'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'APPROVED':    'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    'REJECTED':    'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'IN TRAINING': 'bg-secondary/10 text-secondary border-secondary/20',
    'IN_PROGRESS': 'bg-secondary/10 text-secondary border-secondary/20',
    'COMPLETED':   'bg-primary/10 text-primary border-primary/20'
  };
  const statusClass = statusColors[(candidate.status || 'PENDING').toUpperCase()] || statusColors['PENDING'];

  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate('/hr/dashboard')}
          className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Dashboard
        </button>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-black text-2xl shadow-2xl">
            {letters}
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">{candidate.name}</h1>
            <p className="text-slate-400 font-medium mt-1">{candidate.roleApplied || 'Unspecified'}</p>
            <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusClass}`}>
              {candidate.status || 'PENDING'}
            </span>
          </div>
        </div>

        {/* Resubmit Button — only shown if REJECTED */}
        {isRejected && (
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={handleResubmit}
              disabled={resubmitting}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-rose-500/20 to-primary/30 border border-rose-500/30 hover:border-primary/50 text-white hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <span className="material-symbols-outlined text-rose-400" style={{ fontVariationSettings: "'FILL' 1" }}>replay</span>
              {resubmitting ? 'Generating New Roadmap...' : 'Resubmit with AI Roadmap'}
            </button>
            {resubmitMsg && <p className="text-xs font-medium text-slate-300">{resubmitMsg}</p>}
          </div>
        )}
      </header>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Skills */}
        <div className="bg-[#1a2236] border border-white/5 rounded-[2.5rem] p-8 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">psychology</span>
            Skills Extracted
          </h3>
          <div className="flex flex-wrap gap-2">
            {(aiData.skills || []).length > 0 ? aiData.skills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">{s}</span>
            )) : <p className="text-xs text-slate-500 italic">No skills extracted.</p>}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-[#1a2236] border border-white/5 rounded-[2.5rem] p-8 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">terminal</span>
            Projects
          </h3>
          <ul className="space-y-3">
            {(aiData.projects || []).length > 0 ? aiData.projects.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">verified</span>
                {typeof p === 'string' ? p : p.title}
              </li>
            )) : <p className="text-xs text-slate-500 italic">No projects listed.</p>}
          </ul>
        </div>

        {/* AI Roadmap summary */}
        <div className="bg-[#1a2236] border border-white/5 rounded-[2.5rem] p-8 space-y-5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">route</span>
            Roadmap Phases
          </h3>
          {(!roadmap?.content || roadmap.content.length === 0) ? (
            <p className="text-xs text-slate-500 italic">No roadmap generated.</p>
          ) : (
            <div className="space-y-3">
              {roadmap.content.map((phase, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-black flex-shrink-0">{i + 1}</div>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed">{phase.title}</p>
                </div>
              ))}
            </div>
          )}

          {/* Rejection feedback if any */}
          {roadmap?.feedback && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Trainer Feedback</p>
              <p className="text-xs text-slate-300">{roadmap.feedback}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HRCandidateProfile;
