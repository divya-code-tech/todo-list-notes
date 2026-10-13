import { CheckSquare, FileText, Settings, Leaf, ChevronDown } from 'lucide-react';

export default function Sidebar({ activePage, onNavigate, taskCount, noteCount, onOpenProfile, profileName = 'Divya N', profileRole = 'Student workspace', profileInitial = 'D' }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><span className="brand-icon"><Leaf size={22} /></span><span>To-Do List <b>&</b> Notes</span></div>
      <nav className="nav-list" aria-label="Main navigation">
        <button className={`nav-item ${activePage === 'tasks' ? 'selected' : ''}`} onClick={() => onNavigate('tasks')}><CheckSquare size={18} /><span>Tasks</span><span className="nav-count">{taskCount}</span></button>
        <button className={`nav-item ${activePage === 'notes' ? 'selected' : ''}`} onClick={() => onNavigate('notes')}><FileText size={18} /><span>Notes</span><span className="nav-count">{noteCount}</span></button>
      </nav>
      <div className="sidebar-secondary">
        <button className={`nav-item ${activePage === 'settings' ? 'selected' : ''}`} type="button" onClick={() => onNavigate('settings')}><Settings size={18} /><span>Settings</span></button>
      </div>
      <button className="sidebar-profile" type="button" onClick={onOpenProfile} aria-label="Open profile menu">
        <div className="profile-avatar">{profileInitial}</div>
        <div className="profile-copy"><strong>{profileName}</strong><span>{profileRole}</span></div>
        <ChevronDown size={15} className="profile-chevron" />
      </button>
    </aside>
  );
}
