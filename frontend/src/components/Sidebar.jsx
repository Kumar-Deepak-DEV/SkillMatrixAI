import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Upload', path: '/upload', icon: 'cloud_upload' },
    { name: 'Roadmap', path: '/roadmap', icon: 'route' },
    { name: 'Analysis', path: '/analysis', icon: 'analytics' },
    { name: 'Settings', path: '#', icon: 'settings' },
  ];

  return (
    <aside className="bg-[#131b2e] h-screen w-64 fixed left-0 top-0 overflow-y-auto no-border shadow-2xl shadow-[20px_0_50px_rgba(7,0,108,0.15)] z-50">
      <div className="flex flex-col h-full py-8">
        {/* Header/Logo Section */}
        <div className="px-6 mb-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-[#c0c1ff]">SkillPath AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">AI Digital Curator</p>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-grow space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center px-6 py-4 transition-all duration-300 ease-in-out hover:bg-[#2d3449] ${
                  isActive ? 'text-[#c0c1ff]' : 'text-slate-400 opacity-80 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-0.5 h-8 bg-[#c0c1ff] rounded-r-full" />
                )}
                <span className="material-symbols-outlined mr-4">{item.icon}</span>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* CTA & Footer */}
        <div className="px-6 mt-auto pt-8">
          <Link 
            to="/upload" 
            className="w-full py-3 px-4 rounded-xl bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-widest hover:bg-surface-bright transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Analysis
          </Link>
          <button 
            onClick={() => navigate('/hr-dashboard')}
            className="w-full mt-3 py-3 px-4 rounded-xl border border-white/5 bg-white/5 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">corporate_fare</span>
            Switch to Enterprise
          </button>
          <div className="mt-6 flex items-center px-0 py-4 text-slate-500 opacity-80 hover:text-[#c0c1ff] transition-colors cursor-pointer">
            <span className="material-symbols-outlined mr-4">help</span>
            <span className="font-medium text-sm">Help Center</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
