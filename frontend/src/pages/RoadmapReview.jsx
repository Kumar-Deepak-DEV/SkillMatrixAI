import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const roadmapSteps = [
  {
    icon: 'architecture',
    iconColor: 'text-primary',
    iconFill: true,
    title: 'Architectural Patterns',
    badge: 'Priority 1',
    badgeClass: 'bg-surface-container-highest text-outline-variant',
    description: 'Focus on CQRS and Event Sourcing patterns within Go environments. Deep dive into DDD (Domain Driven Design).',
    meta: [
      { icon: 'schedule', text: '2 Weeks' },
      { icon: 'menu_book', text: '4 Modules' },
    ],
    mentors: null,
  },
  {
    icon: 'database',
    iconColor: 'text-secondary',
    iconFill: false,
    title: 'Distributed State',
    badge: 'AI Suggested',
    badgeClass: 'bg-secondary/10 text-secondary',
    description: 'Mastering Redis cache invalidation strategies and Consistency levels in NoSQL distributed environments.',
    meta: null,
    mentors: true,
  },
  {
    icon: 'cloud_done',
    iconColor: 'text-primary',
    iconFill: false,
    title: 'Platform Engineering',
    badge: 'Optional',
    badgeClass: 'bg-surface-container-highest text-outline-variant',
    description: 'Infrastructure as Code (Terraform) and Kubernetes operator development for automated scaling.',
    meta: null,
    mentors: null,
  },
];

function RoadmapReview() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');

  return (
    <div
      className="antialiased overflow-hidden min-h-screen"
      style={{ backgroundColor: '#0b1326', color: '#dae2fd', fontFamily: 'Inter, sans-serif' }}
    >
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-[#131b2e] hidden lg:flex flex-col py-8">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <h2 className="text-lg font-black text-white">The Kinetic Path</h2>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold ml-11">AI Orchestrator</p>
        </div>
        <nav className="flex-grow space-y-1">
          {[
            { icon: 'dashboard', label: 'Dashboard', active: false },
            { icon: 'route', label: 'Roadmaps', active: true, fill: true },
            { icon: 'group', label: 'Candidates', active: false },
            { icon: 'menu_book', label: 'Curriculum', active: false },
            { icon: 'leaderboard', label: 'Analytics', active: false },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className={`relative flex items-center gap-4 px-8 py-3 transition-colors duration-200 ${
                item.active
                  ? 'text-[#c0c1ff] font-semibold bg-[#2d3449]/30 before:content-[""] before:absolute before:left-0 before:w-1 before:h-6 before:bg-[#c0c1ff] before:rounded-r-full'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#2d3449]'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={item.active && item.fill ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="px-8 mt-auto pt-8 border-t border-outline-variant/10">
          <button className="w-full py-3 px-4 bg-primary text-on-primary-fixed font-bold rounded-xl flex items-center justify-center gap-2 mb-8 hover:brightness-110 transition-all active:scale-95">
            <span className="material-symbols-outlined">add</span>
            New Workflow
          </button>
          <div className="space-y-4">
            <a className="flex items-center gap-4 text-slate-500 hover:text-slate-300 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">help_outline</span>
              <span className="text-sm">Help Center</span>
            </a>
            <a className="flex items-center gap-4 text-slate-500 hover:text-slate-300 transition-colors" href="#">
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="text-sm">Log Out</span>
            </a>
          </div>
        </div>
      </aside>

      {/* TopNavBar */}
      <nav className="flex justify-between items-center w-full px-8 h-16 fixed top-0 left-0 bg-[#0b1326]/60 backdrop-blur-xl z-40 shadow-[0_20px_50px_rgba(7,0,108,0.15)]">
        <div className="flex items-center gap-12">
          <span className="text-xl font-bold tracking-tight text-[#c0c1ff]">SkillPath AI</span>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-slate-400 hover:text-slate-200 transition-colors text-sm" href="#">Workspaces</a>
            <a className="text-slate-400 hover:text-slate-200 transition-colors text-sm" href="#">Insights</a>
            <a className="text-slate-400 hover:text-slate-200 transition-colors text-sm" href="#">Archive</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/upload-resumes')}
            className="bg-[#c0c1ff] text-[#0d0096] px-5 py-2 rounded-xl font-semibold active:scale-95 hover:bg-[#8083ff] transition-all duration-300"
          >
            Upload Resumes
          </button>
          <div className="flex items-center gap-4 text-[#c0c1ff]">
            <span className="material-symbols-outlined cursor-pointer hover:bg-[#2d3449]/50 p-2 rounded-full transition-all">notifications</span>
            <span className="material-symbols-outlined cursor-pointer hover:bg-[#2d3449]/50 p-2 rounded-full transition-all">settings</span>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest">
              <img
                alt="HR Manager Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDQinuQJktNxs2Oz2r0Le5fZGvvxq3-9Syeo6d2b3j1xXVnmP7U8l82HHwRZCoczIWGlzSf9g-VotbRdcAL_ISu2eFlcx1467cqE5YK1JI26VgBuMZuM8o20731AuNQ0Eiw8WT6Y9coqhQhj_o8pH0N3nR_ItwitgTJ6UBJJRJfxLNrVKWiemjgSLMv2wKUOcexjBnumR0xImNcZUbwgMziGn-Dc_1orySrXBw_KQpCbxwoMr0obNpKrSJOrEi4vxgVf6gRbTPiw"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 h-screen flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row h-full overflow-hidden">

          {/* Left Panel — Candidate Summary */}
          <section
            className="w-full md:w-[40%] p-8 overflow-y-auto"
            style={{ backgroundColor: '#131b2e' }}
          >
            {/* Candidate Header */}
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <img
                  alt="Candidate"
                  className="w-20 h-20 rounded-2xl object-cover shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyqkOZwJkcyAKaMTjqdlnlAvPc_C7m7eeS3_S06UvSpro1x24TWm9R_UbZR_14rYy8JW2WKeVPr1x-P36Q_gVi37qXPWrO5D7jMLdrnkfP51fDYpGJyBnrYdJb-koE3CjReRU5txxxm4cheJRJeeUa_RrtPKL_Ihglz44t2rGMII4lsIiVRtcvONhKE7Mt4SSUz8tp3tCbNgpZJONsyb8_8jxYfQPh2yVglYu8XMdwE2rSSCYLlzpMEIkCfHei6WAuRUIdJZ1uAw"
                />
                <div>
                  <h1 className="text-3xl font-black text-on-surface tracking-tight mb-1">Alex Rivers</h1>
                  <p className="text-primary font-medium">Senior Backend Engineer Path</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface-container-highest/40">
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Experience</p>
                  <p className="text-lg font-bold text-on-surface">6.5 Years</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-highest/40">
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Current Role</p>
                  <p className="text-lg font-bold text-on-surface">Mid-Level Dev</p>
                </div>
              </div>
            </header>

            <div className="space-y-8">
              {/* Core Competencies */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-outline-variant mb-4">Core Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {['System Design', 'Distributed Systems', 'Go / Rust', 'Kafka', 'GraphQL'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg border border-outline-variant/15 text-xs font-medium text-on-surface-variant">
                      {skill}
                    </span>
                  ))}
                  <div className="px-3 py-1.5 rounded-lg border border-secondary/30 text-xs font-medium text-secondary flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    Vector Databases
                  </div>
                </div>
              </div>

              {/* Work Experience Timeline */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-outline-variant mb-4">Work Experience</h3>
                <div className="space-y-6">
                  {[
                    {
                      company: 'FinTech Innovations',
                      role: 'Mid Software Engineer • 2021—Present',
                      desc: 'Led the migration of legacy payment gateways to a microservices architecture using Go.',
                      active: true,
                    },
                    {
                      company: 'DataStream Systems',
                      role: 'Junior Developer • 2018—2021',
                      desc: 'Implemented real-time data processing pipelines for Fortune 500 clients.',
                      active: false,
                    },
                  ].map((exp) => (
                    <div key={exp.company} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-0 before:w-px before:bg-outline-variant/20">
                      <div
                        className={`absolute left-[-3px] top-1.5 w-[7px] h-[7px] rounded-full ${exp.active ? 'bg-primary shadow-[0_0_8px_rgba(192,193,255,0.6)]' : 'bg-outline-variant'}`}
                      ></div>
                      <p className="text-sm font-bold text-on-surface">{exp.company}</p>
                      <p className="text-xs text-outline mb-2">{exp.role}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notable Projects */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-outline-variant mb-4">Notable Projects</h3>
                <div className="p-4 rounded-2xl bg-surface-container-highest/20 border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary">terminal</span>
                    <p className="text-sm font-bold text-on-surface">Open Source: NexusEngine</p>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    High-performance async request orchestrator with 2.5k+ GitHub stars.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel — Generated Roadmap */}
          <section className="w-full md:w-[60%] p-8 lg:p-12 overflow-y-auto flex flex-col" style={{ backgroundColor: '#0b1326' }}>
            <div className="max-w-3xl mx-auto w-full">
              {/* Header */}
              <div className="flex justify-between items-end mb-12">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-secondary mb-2">Curated Pathway</p>
                  <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Backend Excellence</h2>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-primary-container">03</span>
                  <span className="text-sm text-outline font-bold ml-1 uppercase">Phases</span>
                </div>
              </div>

              {/* Step-by-Step Path */}
              <div className="space-y-12 mb-20 relative">
                {/* Connecting Line */}
                <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-surface-container-highest rounded-full"></div>

                {roadmapSteps.map((step) => (
                  <div key={step.title} className="relative pl-16">
                    {/* Icon Node */}
                    <div
                      className="absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-outline-variant/15 z-10"
                      style={{ background: 'rgba(45, 52, 73, 0.6)', backdropFilter: 'blur(24px)' }}
                    >
                      <span
                        className={`material-symbols-outlined ${step.iconColor}`}
                        style={step.iconFill ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {step.icon}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/10 transition-all cursor-default">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-on-surface">{step.title}</h4>
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${step.badgeClass}`}>
                          {step.badge}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{step.description}</p>

                      {step.meta && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {step.meta.map((m) => (
                            <div key={m.text} className="flex items-center gap-2 text-xs text-outline">
                              <span className="material-symbols-outlined text-sm">{m.icon}</span>
                              {m.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {step.mentors && (
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex -space-x-2">
                            {[
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuAyqkOZwJkcyAKaMTjqdlnlAvPc_C7m7eeS3_S06UvSpro1x24TWm9R_UbZR_14rYy8JW2WKeVPr1x-P36Q_gVi37qXPWrO5D7jMLdrnkfP51fDYpGJyBnrYdJb-koE3CjReRU5txxxm4cheJRJeeUa_RrtPKL_Ihglz44t2rGMII4lsIiVRtcvONhKE7Mt4SSUz8tp3tCbNgpZJONsyb8_8jxYfQPh2yVglYu8XMdwE2rSSCYLlzpMEIkCfHei6WAuRUIdJZ1uAw',
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuDWGuwLWsD6tv3Wa-N_cwUFoiKyQipQV4JLoBUiONx9MkN8BosPmObnEhi2lf7bi0vpOMDJKUPoI-RK_Uc426yQ0a73WnTq9RvyspwmyCACvnhPkUIUxUu2H3CH763qM-g-cDyED1EcYwUqu_zSIaJTIbg6mPrge47-z0UlpLW38N-eo0M3BbCIB4XSpahl8anrxo5gf8Itj5QmwB4CK7R6TwXJm1ckXfewWe6Nss29XLqHHTxa1rax2gA-PYmbdc1uabsQGff07g',
                            ].map((src, i) => (
                              <img key={i} alt="Avatar" className="w-6 h-6 rounded-full border-2 border-surface" src={src} />
                            ))}
                          </div>
                          <span className="text-[10px] text-outline font-bold">Recommended by 4 Mentors</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback & Actions */}
              <section className="pt-12 border-t border-outline-variant/10">
                <label className="block text-sm font-bold text-on-surface mb-3 ml-1">
                  Curator Notes &amp; Feedback
                </label>
                <textarea
                  className="w-full bg-surface-container-lowest border-none rounded-2xl focus:ring-1 focus:ring-primary/40 text-sm p-4 placeholder-outline-variant transition-all mb-8 outline-none resize-none text-on-surface"
                  placeholder="Add specific adjustments for the candidate..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ backgroundColor: '#060e20' }}
                />
                <div className="flex items-center justify-end gap-4">
                  <button className="px-8 py-3.5 rounded-xl text-on-surface font-bold text-sm bg-surface-container-highest hover:bg-surface-bright transition-all active:scale-95">
                    Reject &amp; Redesign
                  </button>
                  <button
                    onClick={() => navigate('/trainer-dashboard')}
                    className="px-10 py-3.5 rounded-xl text-on-primary-fixed font-bold text-sm bg-gradient-to-r from-primary to-primary-container shadow-[0_0_20px_rgba(192,193,255,0.2)] hover:shadow-[0_0_30px_rgba(192,193,255,0.4)] transition-all active:scale-95"
                  >
                    Approve Roadmap
                  </button>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default RoadmapReview;
