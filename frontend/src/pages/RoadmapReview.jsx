import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function RoadmapReview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notes, setNotes] = useState('');
  
  const [candidate, setCandidate] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trainer/candidate/${id}`, {
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
        });
        const data = await res.json();
        
        if (data && data.candidate) {
          setCandidate(data.candidate);
          setRoadmap(data.candidate.roadmapId);
        }
      } catch (err) {
        console.error("Failed to fetch candidate details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleReview = async (action) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trainer/roadmap/${roadmap._id}/review`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ action, feedback: notes })
      });
      if (res.ok) {
        navigate('/trainer/dashboard');
      } else {
        alert("Failed to review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    }
  };

  if (loading) return <div className="text-white p-10 min-h-screen text-center mt-20 text-xl font-bold">Loading AI Data...</div>;
  if (!candidate) return <div className="text-white p-10 min-h-screen text-center mt-20 text-xl font-bold">Candidate not found</div>;

  let aiData = { skills: [], experience: '', projects: [] };
  try { if (candidate.aiInsight) aiData = JSON.parse(candidate.aiInsight); } catch(e){}

  const letters = candidate.name ? candidate.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '??';

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-0px)]">
      {/* Left Panel — Candidate Summary */}
      <section className="w-full lg:w-[40%] p-10 bg-[#131b2e] border-r border-white/5 overflow-y-auto">
        <header className="mb-12">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-black text-2xl shadow-2xl">
              {letters}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{candidate.name || 'Unknown'}</h1>
              <p className="text-primary font-bold text-sm uppercase tracking-widest">{candidate.roleApplied || 'Unspecified'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2.5xl bg-[#1a2236] border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Experience Info</p>
              <p className="text-sm font-bold text-white truncate" title={aiData.experience || 'N/A'}>{aiData.experience || 'N/A'}</p>
            </div>
            <div className="p-5 rounded-2.5xl bg-[#1a2236] border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Match Score</p>
              <p className="text-xl font-bold text-white">{candidate.matchScore || roadmap?.aiConfidence || 0}%</p>
            </div>
          </div>
        </header>

        <div className="space-y-10">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Core Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {(aiData.skills && aiData.skills.length > 0) ? aiData.skills.map((skill, idx) => (
                <span key={idx} className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                  {skill}
                </span>
              )) : (
                <span className="text-xs text-slate-500 italic">No specific skills extracted.</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">Projects & Experience</h3>
            <div className="space-y-8">
              {(aiData.projects && aiData.projects.length > 0) ? aiData.projects.map((exp, idx) => {
                 const title = typeof exp === 'string' ? exp : (exp.title || 'Project');
                 return (
                  <div key={idx} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-0 before:w-px before:bg-white/10">
                    <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary shadow-[0_0_10px_rgba(128,131,255,0.8)]' : 'bg-white/20'}`}></div>
                    <p className="text-sm font-bold text-white mb-1">{title}</p>
                  </div>
                 )
              }) : (
                 <p className="text-xs text-slate-500 italic">No specific projects identified.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel — Generated Roadmap */}
      <section className="w-full lg:w-[60%] p-10 lg:p-16 flex flex-col bg-[#0b1326] overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-3">Curated AI Pathway</p>
              <h2 className="text-5xl font-black text-white tracking-tight">AI Roadmap</h2>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-white/10 italic">{(roadmap?.content || []).length < 10 ? '0'+(roadmap?.content || []).length : (roadmap?.content || []).length}</span>
              <span className="text-[10px] text-slate-500 font-black ml-2 uppercase tracking-widest">Phases</span>
            </div>
          </div>

          <div className="space-y-12 relative mb-20">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-white/5"></div>
            
            {(!roadmap?.content || roadmap.content.length === 0) && (
              <div className="p-8 rounded-[2rem] bg-[#1a2236]/50 border border-white/5 relative pl-20">
                <div className="absolute left-0 top-0 w-14 h-14 rounded-2.5xl bg-[#1a2236] border border-white/10 flex items-center justify-center z-10 shadow-2xl">
                  <span className="material-symbols-outlined text-primary text-2xl px-1" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                </div>
                <p className="text-white text-lg font-bold">No roadmap steps were generated.</p>
                <p className="text-slate-500 text-sm mt-2 font-medium">The AI output didn't contain an explicit list of phases or the resume lacked enough details for accurate task planning. You can try uploading a more detailed resume.</p>
              </div>
            )}

            {(roadmap?.content || []).map((step, idx) => (
              <div key={idx} className="relative pl-20 transition-all">
                <div className="absolute left-0 top-0 w-14 h-14 rounded-2.5xl bg-[#1a2236] border border-white/10 flex items-center justify-center z-10 shadow-2xl">
                  <span className={`material-symbols-outlined text-primary text-2xl px-1`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                </div>

                <div className="p-8 rounded-[2rem] bg-[#1a2236] hover:bg-[#2d3449]/40 border border-white/5 transition-all group shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{step.title}</h4>
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20`}>
                      Phase {idx + 1}
                    </span>
                  </div>
                  
                  {step.tasks && step.tasks.length > 0 && (
                    <ul className="list-disc ml-5 space-y-3 mt-4 text-slate-300 font-medium text-sm">
                       {step.tasks.map((t, i) => (
                         <li key={i}>{t.title}</li>
                       ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          <section className="pt-12 border-t border-white/5">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-4 ml-1">
              Trainer Notes & Adjustments
            </label>
            <textarea
              className="w-full bg-[#1a2236] border border-white/10 rounded-[2rem] focus:ring-2 focus:ring-primary/20 text-white text-sm p-6 placeholder-slate-600 transition-all mb-10 outline-none resize-none"
              placeholder="Add specific instructions for the candidate..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex items-center justify-end gap-4">
              <button 
                onClick={() => handleReview('REJECT')}
                className="px-8 py-4 rounded-2xl text-slate-400 font-bold text-sm bg-white/5 hover:bg-white/10 transition-all active:scale-95"
              >
                Reject & Redesign
              </button>
              <button
                onClick={() => handleReview('APPROVE')}
                className="px-12 py-4 rounded-2xl text-on-primary font-bold text-sm bg-gradient-to-r from-primary to-primary-container shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
              >
                Approve Roadmap
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default RoadmapReview;
