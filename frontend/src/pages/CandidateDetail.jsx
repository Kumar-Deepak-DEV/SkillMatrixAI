import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const roadmapSteps = [
  {
    icon: 'done',
    label: 'System Architectures',
    sub: 'Completed · Oct 12',
    state: 'done',
  },
  {
    icon: 'play_arrow',
    label: 'Advanced React Systems',
    sub: 'Ongoing · 65% Complete',
    state: 'active',
    progress: 65,
  },
  {
    icon: 'lock',
    label: 'Vector Data & Search',
    sub: 'Pending',
    state: 'locked',
  },
  {
    icon: 'lock',
    label: 'AI Orchestration Deployment',
    sub: 'Pending',
    state: 'locked',
  },
];

const insights = [
  {
    name: 'Marcus Thorne',
    time: '2 Days Ago',
    text: "Excellent performance on the technical screen. Her architectural logic is sound, but we should push her towards more complex data state management in the next sprint.",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyqkOZwJkcyAKaMTjqdlnlAvPc_C7m7eeS3_S06UvSpro1x24TWm9R_UbZR_14rYy8JW2WKeVPr1x-P36Q_gVi37qXPWrO5D7jMLdrnkfP51fDYpGJyBnrYdJb-koE3CjReRU5txxxm4cheJRJeeUa_RrtPKL_Ihglz44t2rGMII4lsIiVRtcvONhKE7Mt4SSUz8tp3tCbNgpZJONsyb8_8jxYfQPh2yVglYu8XMdwE2rSSCYLlzpMEIkCfHei6WAuRUIdJZ1uAw',
  },
  {
    name: 'Sarah Jenkins',
    time: '5 Days Ago',
    text: 'Candidate demonstrated strong leadership during the group whiteboard session. Soft skills are a major plus here.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyqkOZwJkcyAKaMTjqdlnlAvPc_C7m7eeS3_S06UvSpro1x24TWm9R_UbZR_14rYy8JW2WKeVPr1x-P36Q_gVi37qXPWrO5D7jMLdrnkfP51fDYpGJyBnrYdJb-koE3CjReRU5txxxm4cheJRJeeUa_RrtPKL_Ihglz44t2rGMII4lsIiVRtcvONhKE7Mt4SSUz8tp3tCbNgpZJONsyb8_8jxYfQPh2yVglYu8XMdwE2rSSCYLlzpMEIkCfHei6WAuRUIdJZ1uAw',
  },
];

function CandidateDetail() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');

  return (
    <div className="antialiased min-h-screen" style={{ backgroundColor: '#0b1326', color: '#dae2fd', fontFamily: 'Inter, sans-serif' }}>

      {/* TopNavBar */}
      <nav className="flex justify-between items-center w-full px-8 h-16 fixed top-0 left-0 bg-[#0b1326]/60 backdrop-blur-xl z-40 shadow-[0_20px_50px_rgba(7,0,108,0.15)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-[#c0c1ff]">SkillPath AI</span>
          <div className="hidden md:flex gap-6">
            <a className="text-slate-400 hover:text-slate-200 transition-colors text-sm" href="#">Workspaces</a>
            <a className="text-slate-400 hover:text-slate-200 transition-colors text-sm" href="#">Insights</a>
            <a className="text-slate-400 hover:text-slate-200 transition-colors text-sm" href="#">Archive</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/upload-resumes')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-semibold rounded-xl active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Upload Resumes
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:bg-[#2d3449]/50 rounded-full transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-400 hover:bg-[#2d3449]/50 rounded-full transition-all">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <img
              alt="HR Manager Profile"
              className="w-8 h-8 rounded-full border border-outline-variant/30 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyqkOZwJkcyAKaMTjqdlnlAvPc_C7m7eeS3_S06UvSpro1x24TWm9R_UbZR_14rYy8JW2WKeVPr1x-P36Q_gVi37qXPWrO5D7jMLdrnkfP51fDYpGJyBnrYdJb-koE3CjReRU5txxxm4cheJRJeeUa_RrtPKL_Ihglz44t2rGMII4lsIiVRtcvONhKE7Mt4SSUz8tp3tCbNgpZJONsyb8_8jxYfQPh2yVglYu8XMdwE2rSSCYLlzpMEIkCfHei6WAuRUIdJZ1uAw"
            />
          </div>
        </div>
      </nav>

      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-50 bg-[#131b2e] py-8">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-bold text-sm">SP</div>
            <span className="text-lg font-black text-white">The Kinetic Path</span>
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">AI Orchestrator</span>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { icon: 'dashboard', label: 'Dashboard', active: false },
            { icon: 'route', label: 'Roadmaps', active: false },
            { icon: 'group', label: 'Candidates', active: true },
            { icon: 'menu_book', label: 'Curriculum', active: false },
            { icon: 'leaderboard', label: 'Analytics', active: false },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className={`relative flex items-center gap-4 px-6 py-3 transition-colors duration-200 ${
                item.active
                  ? 'text-[#c0c1ff] font-semibold bg-[#2d3449]/30 before:content-[""] before:absolute before:left-0 before:w-1 before:h-6 before:bg-[#c0c1ff] before:rounded-r-full'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#2d3449]'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="px-6 mt-auto space-y-4">
          <button className="w-full py-3 px-4 bg-surface-container-highest text-on-surface rounded-xl flex items-center justify-center gap-2 hover:bg-surface-bright transition-colors font-semibold text-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Workflow
          </button>
          <div className="space-y-1 pt-4 border-t border-outline-variant/10">
            <a className="text-slate-500 hover:text-slate-300 flex items-center gap-4 py-2 transition-colors text-sm" href="#">
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
              Help Center
            </a>
            <a className="text-slate-500 hover:text-slate-300 flex items-center gap-4 py-2 transition-colors text-sm" href="#">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Log Out
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 min-h-screen pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-8 py-12">

          {/* Header */}
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold text-secondary">
                  Active Candidate
                </span>
                <span className="text-slate-500 text-sm">ID: SP-99201</span>
              </div>
              <h1 className="text-white mb-2" style={{ fontSize: '3.5rem', lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 800 }}>
                Elena Rostova
              </h1>
              <p className="text-xl text-slate-400 font-light max-w-2xl leading-relaxed">
                Senior Frontend Engineer transitioning into Full-Stack AI Orchestration. Currently in{' '}
                <span className="text-primary font-medium italic">Advanced React Systems</span> module.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <button className="px-6 py-3 rounded-xl bg-surface-container-highest text-on-surface font-semibold hover:bg-surface-bright transition-all active:scale-95 text-sm">
                Download CV
              </button>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-bold shadow-[0_10px_30px_rgba(192,193,255,0.2)] hover:brightness-110 transition-all active:scale-95 text-sm">
                Schedule Review
              </button>
            </div>
          </header>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Profile Summary */}
            <section className="md:col-span-8 bg-surface-container-low rounded-2xl p-8 flex flex-col gap-10">
              {/* Resume Highlights + Top Skills */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Profile Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Resume Highlights</h3>
                    <ul className="space-y-3">
                      {[
                        '6+ years experience in large-scale React architectures.',
                        'Led the modernization of legacy financial dashboards.',
                        'Consistent top 5% performance in technical assessments.',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                          <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['TypeScript', 'React / Next.js', 'Node.js', 'GraphQL'].map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-lg border border-outline-variant/15 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          {skill}
                        </span>
                      ))}
                      <span className="px-3 py-1 rounded-lg border border-primary/40 text-[11px] font-bold uppercase tracking-wider text-primary animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        LLM Integration
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Gap Analysis */}
              <div className="pt-8 border-t border-outline-variant/10">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  Experience Gap Analysis
                </h2>
                <div className="p-6 rounded-2xl border border-outline-variant/10" style={{ background: 'rgba(45,52,73,0.6)', backdropFilter: 'blur(24px)' }}>
                  <p className="text-slate-300 text-sm leading-relaxed italic mb-4">
                    "Elena shows high technical proficiency in core engineering but requires exposure to vector databases and prompt engineering for full Full-Stack AI readiness."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAyqkOZwJkcyAKaMTjqdlnlAvPc_C7m7eeS3_S06UvSpro1x24TWm9R_UbZR_14rYy8JW2WKeVPr1x-P36Q_gVi37qXPWrO5D7jMLdrnkfP51fDYpGJyBnrYdJb-koE3CjReRU5txxxm4cheJRJeeUa_RrtPKL_Ihglz44t2rGMII4lsIiVRtcvONhKE7Mt4SSUz8tp3tCbNgpZJONsyb8_8jxYfQPh2yVglYu8XMdwE2rSSCYLlzpMEIkCfHei6WAuRUIdJZ1uAw',
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuDqAMrFhgVXg819Xf3b29Iu5tegdO0d55Gm-P-K0jY1q303dsRKdMk30mmb8xaGtZM-luegGBboC0xJnln7mCcs3m60YgcugkTEiCzjW6KgIdg1yYRq1OBdhPz-zXA7AaeO5XpadipFCR0i7vI3i3TE-qWV0FketaUH7ubaIgRq0eWlWdpUeViozMBvcJg_xR1OD2Re7ZB2SDgMD6dIzk2oCQ-UXYi0QcTvO4dI3ootsu74pz0xnEYWvEr1GAVC2zkn6vvpIzp3jA',
                      ].map((src, i) => (
                        <img key={i} alt="Avatar" className="w-6 h-6 rounded-full border-2 border-surface object-cover" src={src} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">Suggested by AI Curators and 2 Trainers</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Learning Roadmap */}
            <section className="md:col-span-4 bg-surface-container-low rounded-2xl p-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">route</span>
                Learning Roadmap
              </h2>
              <div className="relative space-y-8">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-surface-container-highest"></div>
                {roadmapSteps.map((step) => (
                  <div key={step.label} className="relative flex gap-6">
                    <div
                      className={`z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.state === 'done'
                          ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(192,193,255,0.4)]'
                          : step.state === 'active'
                          ? 'bg-surface-container-highest border-2 border-primary text-primary shadow-[0_0_15px_rgba(192,193,255,0.2)]'
                          : 'bg-surface-container-highest text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${step.state === 'active' ? 'text-primary' : step.state === 'done' ? 'text-white' : 'text-slate-400'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-xs ${step.state === 'active' ? 'text-slate-400' : 'text-slate-500'}`}>{step.sub}</p>
                      {step.progress && (
                        <div className="mt-2 w-32 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${step.progress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-12 py-3 border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-all">
                View Full Curriculum
              </button>
            </section>

            {/* Feedback + Trainer Insights */}
            <section className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Add Feedback */}
              <div className="bg-surface-container-low rounded-2xl p-6 md:col-span-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Add Feedback</h2>
                <textarea
                  className="w-full border-none rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:ring-1 focus:ring-primary h-32 p-4 mb-4 resize-none outline-none"
                  style={{ backgroundColor: '#060e20' }}
                  placeholder="Type your notes here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">attach_file</span>
                    </button>
                    <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-bold active:scale-95 transition-transform">
                    Submit Note
                  </button>
                </div>
              </div>

              {/* Feedback History */}
              <div className="bg-surface-container-low rounded-2xl p-6 md:col-span-2">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Recent Trainer Insights</h2>
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div key={insight.name} className="flex gap-4 p-4 hover:bg-surface-container-highest/30 rounded-xl transition-all group">
                      <img
                        alt="Trainer"
                        className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all flex-shrink-0 object-cover"
                        src={insight.avatar}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-white text-sm font-semibold">{insight.name}</h4>
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{insight.time}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{insight.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Bottom Nav (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#131b2e] flex items-center justify-around z-50 px-4">
        {[
          { icon: 'dashboard', label: 'Home', active: false },
          { icon: 'group', label: 'Candidates', active: true, fill: true },
          { icon: 'route', label: 'Path', active: false },
          { icon: 'notifications', label: 'Alerts', active: false },
        ].map((item) => (
          <button key={item.label} className={`flex flex-col items-center gap-1 ${item.active ? 'text-[#c0c1ff]' : 'text-slate-500'}`}>
            <span className="material-symbols-outlined" style={item.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default CandidateDetail;
