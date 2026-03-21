import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CandidateDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [feedback, setFeedback] = useState('');
  
  const [candidate, setCandidate] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');
        const res = await fetch(`http://localhost:3000/api/trainer/candidate/${id}`, {
          headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
        });
        const data = await res.json();
        
        if (data && data.candidate) {
          setCandidate(data.candidate);
          setRoadmap(data.candidate.roadmapId);
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Failed to fetch candidate details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      const res = await fetch(`http://localhost:3000/api/trainer/candidate/${id}/complete`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ comment: feedback })
      });
      if (res.ok) {
        alert("Training Completed!");
        navigate('/trainer/dashboard');
      } else {
        alert("Failed to mark as completed.");
      }
    } catch (err) {
      console.error("Error submitting completion:", err);
      alert("Failed to submit.");
    }
  };

  if (loading) return <div className="text-white p-10 min-h-screen text-center mt-20 text-xl font-bold">Loading Data...</div>;
  if (!candidate) return <div className="text-white p-10 min-h-screen text-center mt-20 text-xl font-bold">Candidate not found</div>;

  let aiData = { skills: [], experience: '', projects: [] };
  try { if (candidate.aiInsight) aiData = JSON.parse(candidate.aiInsight); } catch(e){}

  const letters = candidate.name ? candidate.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '??';

  return (
    <div className="p-10 space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase tracking-[0.2em] font-black text-primary">
              Active Candidate
            </span>
            <span className="text-slate-500 font-bold text-xs">ID: {candidate._id.substring(candidate._id.length - 8).toUpperCase()}</span>
          </div>
          <h1 className="text-white font-black tracking-tight leading-none mb-4" style={{ fontSize: '4.5rem' }}>
            {candidate.name || 'Unknown'}
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
            {candidate.roleApplied || 'Unspecified'} Engineer. Status:{' '}
            <span className="text-primary italic">{candidate.status || 'Pending'}</span>.
          </p>
        </div>
        <div className="flex gap-4 flex-shrink-0">
          <button className="px-8 py-4 rounded-2xl bg-[#1a2236] text-white font-bold hover:bg-[#2d3449] transition-all active:scale-95 text-sm border border-white/5">
            Download CV
          </button>
          <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-black shadow-2xl shadow-primary/20 hover:brightness-110 transition-all active:scale-95 text-sm">
            Schedule Review
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Summary */}
        <section className="lg:col-span-8 bg-[#1a2236] border border-white/5 rounded-[2.5rem] p-10 space-y-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <span className="material-symbols-outlined text-xs">analytics</span>
                Projects & Highlights
              </h3>
              
              {(aiData.projects && aiData.projects.length > 0) ? (
                <ul className="space-y-4 pt-4">
                  {aiData.projects.map((item, i) => {
                     const title = typeof item === 'string' ? item : (item.title || 'Project');
                     return (
                      <li key={i} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed font-medium">
                        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">verified</span>
                        {title}
                      </li>
                     )
                  })}
                </ul>
              ) : (
                <p className="text-slate-500 italic text-sm">No specific projects identified.</p>
              )}
            </div>
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <span className="material-symbols-outlined text-xs">psychology</span>
                Top Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(aiData.skills || []).map((skill) => (
                  <span key={skill} className="px-4 py-2 rounded-xl bg-[#0b1326] border border-white/5 text-xs font-bold text-slate-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Learning Roadmap */}
        <section className="lg:col-span-4 bg-[#1a2236] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-xs">route</span>
            Learning Roadmap
          </h3>
          
          {(!roadmap?.content || roadmap.content.length === 0) && (
            <p className="text-slate-500 text-sm italic">No roadmap steps generated yet.</p>
          )}

          <div className="space-y-8 flex-1 overflow-y-auto max-h-[480px] pr-1">
            {(roadmap?.content || []).map((phase, phaseIdx) => {
              const doneTasks = phase.tasks?.filter(t => t.completed).length || 0;
              const totalTasks = phase.tasks?.length || 0;
              const phaseProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

              return (
                <div key={phaseIdx} className="space-y-3">
                  {/* Phase Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{phase.title}</h4>
                    <span className="text-[10px] font-bold text-primary">{phaseProgress}%</span>
                  </div>
                  {/* Phase progress bar */}
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${phaseProgress}%` }}></div>
                  </div>
                  {/* Tasks */}
                  <div className="space-y-2 pl-1">
                    {(phase.tasks || []).map((task, taskIdx) => (
                      <label
                        key={taskIdx}
                        className="flex items-start gap-3 cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition-all"
                        onClick={async (e) => {
                          e.preventDefault();
                          const token = localStorage.getItem('token') || localStorage.getItem('userToken');
                          try {
                            const res = await fetch(`http://localhost:3000/api/trainer/roadmap/${roadmap._id}/task/toggle`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({ phaseIndex: phaseIdx, taskIndex: taskIdx })
                            });
                            const data = await res.json();
                            if (data.success) {
                              // Update local state optimistically
                              setRoadmap(prev => {
                                const updated = JSON.parse(JSON.stringify(prev));
                                updated.content[phaseIdx].tasks[taskIdx].completed = data.completed;
                                return updated;
                              });
                            }
                          } catch (err) {
                            console.error('Toggle task error:', err);
                          }
                        }}
                      >
                        <div className={`w-4 h-4 mt-0.5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary' : 'border-slate-600 group-hover:border-primary/50'}`}>
                          {task.completed && (
                            <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '10px', fontVariationSettings: "'wght' 700" }}>check</span>
                          )}
                        </div>
                        <span className={`text-xs leading-relaxed font-medium transition-all ${task.completed ? 'line-through text-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
                          {task.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-6 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-white/[0.02] transition-all">
            View Full Curriculum
          </button>
        </section>

        {/* Feedback Section */}
        <section className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#1a2236] border border-white/5 rounded-3xl p-8 flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Add Trainer Insight</h3>
            <textarea
              className="w-full bg-[#0b1326] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 text-white text-sm p-6 placeholder-slate-600 transition-all outline-none resize-none flex-grow"
              placeholder="What's your assessment of the progress?"
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button 
              onClick={handleComplete}
              className="w-full mt-6 py-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95"
            >
              Submit & Mark Complete
            </button>
          </div>

          <div className="bg-[#1a2236] border border-white/5 rounded-3xl p-8 lg:col-span-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Recent History</h3>
            <div className="space-y-6">
              {comments.length === 0 && <p className="text-slate-500 text-sm">No comments yet.</p>}
              {comments.map((insight) => (
                <div key={insight._id} className="flex gap-6 p-6 bg-[#0b1326]/50 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#1a2236] flex items-center justify-center text-primary font-bold shadow-lg">
                    C
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white text-sm font-bold">Trainer Note</h4>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(insight.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{insight.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CandidateDetail;
