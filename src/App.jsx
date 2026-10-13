import { useEffect, useMemo, useState } from 'react';
import {
  Bell, CalendarDays, Check, CheckCircle2, ChevronDown, Circle,
  FileText, Filter, LayoutGrid, MoreHorizontal, Plus,
  Search, Settings2, StickyNote, X, UserRound, Download, Moon, Sun,
  SlidersHorizontal, Database, CheckCheck, ShieldCheck, Monitor,
  CircleHelp, Save
} from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import TaskForm from './components/TaskForm.jsx';
import NoteForm from './components/NoteForm.jsx';
import TaskBoardCard from './components/TaskBoardCard.jsx';
import NoteCard from './components/NoteCard.jsx';

const TASKS_KEY = 'todo_list_notes_tasks_v2';
const NOTES_KEY = 'todo_list_notes_notes_v2';
const today = new Date();
const asDate = (offset) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const starterTasks = [
  { id: 't1', title: 'Finish React minor project', description: 'Complete the UI, add local storage and fix mobile responsiveness.', category: 'React', dueDate: asDate(2), status: 'todo', completed: false, createdAt: new Date().toISOString() },
  { id: 't2', title: 'Review DBMS CIA-2 questions', description: 'Go through the selected questions and practise SQL queries.', category: 'Study', dueDate: asDate(1), status: 'todo', completed: false, createdAt: new Date().toISOString() },
  { id: 't3', title: 'Fix responsive sidebar', description: 'Adjust the sidebar layout for smaller screens and test mobile view.', category: 'Frontend', dueDate: asDate(3), status: 'todo', completed: false, createdAt: new Date().toISOString() },
  { id: 't4', title: 'Write README and setup steps', description: 'Add the project overview and installation instructions.', category: 'Project', dueDate: asDate(4), status: 'todo', completed: false, createdAt: new Date().toISOString() },
  { id: 't5', title: 'Practice useEffect examples', description: 'Build small examples and understand dependencies and cleanup.', category: 'Learning', dueDate: asDate(1), status: 'inProgress', completed: false, createdAt: new Date().toISOString() },
  { id: 't6', title: 'Test notes search and categories', description: 'Check search, category filtering and empty states.', category: 'Testing', dueDate: asDate(2), status: 'inProgress', completed: false, createdAt: new Date().toISOString() },
  { id: 't7', title: 'Push final build to GitHub', description: 'Create a production build and push the latest version.', category: 'Deploy', dueDate: asDate(3), status: 'inProgress', completed: false, createdAt: new Date().toISOString() },
  { id: 't8', title: 'Set up Vite project', description: 'Create the React app and install dependencies.', category: 'Setup', dueDate: asDate(-1), status: 'done', completed: true, createdAt: new Date().toISOString() },
  { id: 't9', title: 'Build task form', description: 'Add the task create and edit flow.', category: 'React', dueDate: asDate(-1), status: 'done', completed: true, createdAt: new Date().toISOString() },
  { id: 't10', title: 'Create note categories', description: 'Add category filtering to the Notes view.', category: 'Notes', dueDate: asDate(-2), status: 'done', completed: true, createdAt: new Date().toISOString() },
  { id: 't11', title: 'Add Local Storage', description: 'Keep tasks and notes after refreshing the browser.', category: 'Frontend', dueDate: asDate(-2), status: 'done', completed: true, createdAt: new Date().toISOString() },
];

const starterNotes = [
  { id: 'n1', title: 'React hooks', content: 'useState — manages state in functional components\nuseEffect — runs side effects (API calls, cleanup, etc.)\nuseMemo — caches a calculated value', category: 'Study', color: 'lilac', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'n2', title: 'Project checklist', content: 'UI complete (tasks + notes)\nLocal storage working\nResponsive design\nREADME + screenshots', category: 'Project', color: 'mint', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'n3', title: 'Small project ideas', content: 'Campus event finder\nStudent expense tracker\nA tiny habit tracker', category: 'Ideas', color: 'butter', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'n4', title: 'Useful links', content: 'React documentation\nMDN JavaScript guide\nGitHub repository', category: 'Study', color: 'rose', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function taskStatus(task) {
  if (task.status === 'todo' || task.status === 'inProgress' || task.status === 'done') return task.status;
  return task.completed ? 'done' : 'todo';
}

function formatDate(dateString) {
  if (!dateString) return 'No due date';
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

const columns = [
  { id: 'todo', title: 'To Do', tone: 'blue' },
  { id: 'inProgress', title: 'In Progress', tone: 'aqua' },
  { id: 'done', title: 'Done', tone: 'green' },
];

export default function App() {
  const [activePage, setActivePage] = useState('tasks');
  const [tasks, setTasks] = useState(() => readStorage(TASKS_KEY, starterTasks));
  const [notes, setNotes] = useState(() => readStorage(NOTES_KEY, starterNotes));
  const [globalSearch, setGlobalSearch] = useState('');
  const [taskFilter, setTaskFilter] = useState('All');
  const [noteCategory, setNoteCategory] = useState('All');
  const [taskModal, setTaskModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [toast, setToast] = useState('');
  const [openOverlay, setOpenOverlay] = useState(null);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('todo_list_notes_theme') || 'light');
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('todo_list_notes_compact') === 'true');
  const [notificationsRead, setNotificationsRead] = useState(() => localStorage.getItem('todo_list_notes_notifications_read') === 'true');
  const [profileModal, setProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(() => readStorage('todo_list_notes_profile', { name: 'Divya N', role: 'Student workspace' }).name || 'Divya N');
  const [profileRole, setProfileRole] = useState(() => readStorage('todo_list_notes_profile', { name: 'Divya N', role: 'Student workspace' }).role || 'Student workspace');
  const [profileNameDraft, setProfileNameDraft] = useState(profileName);
  const [profileRoleDraft, setProfileRoleDraft] = useState(profileRole);

  useEffect(() => { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('todo_list_notes_theme', themeMode); }, [themeMode]);
  useEffect(() => { localStorage.setItem('todo_list_notes_compact', String(compactMode)); }, [compactMode]);
  useEffect(() => { localStorage.setItem('todo_list_notes_notifications_read', String(notificationsRead)); }, [notificationsRead]);
  useEffect(() => { localStorage.setItem('todo_list_notes_profile', JSON.stringify({ name: profileName, role: profileRole })); }, [profileName, profileRole]);

  const completedCount = tasks.filter((task) => taskStatus(task) === 'done').length;
  const pendingCount = tasks.length - completedCount;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const noteCategories = ['All', ...new Set(notes.map((note) => note.category).filter(Boolean))];
  const notifications = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const tomorrowKey = asDate(1);
    const dueTasks = tasks.filter((task) => taskStatus(task) !== 'done' && task.dueDate && task.dueDate <= tomorrowKey)
      .slice(0, 4)
      .map((task) => ({
        id: `due-${task.id}`,
        title: task.dueDate < todayKey ? `Overdue: ${task.title}` : `Due soon: ${task.title}`,
        message: task.dueDate < todayKey ? `This task was due ${formatDate(task.dueDate)}.` : `Due ${formatDate(task.dueDate)}. Keep it on your radar.`,
        type: 'task',
      }));
    const updates = [
      ...dueTasks,
      { id: 'progress-summary', title: `${completedCount} task${completedCount === 1 ? '' : 's'} completed`, message: tasks.length ? `${Math.round((completedCount / tasks.length) * 100)}% of your board is complete.` : 'Add a task to start tracking your progress.', type: 'progress' },
      { id: 'notes-saved', title: `${notes.length} note${notes.length === 1 ? '' : 's'} in your workspace`, message: 'Your notes are saved in this browser.', type: 'note' },
    ];
    return updates.slice(0, 5);
  }, [tasks, notes, completedCount]);
  const visibleNotes = useMemo(() => notes.filter((note) => {
    const term = globalSearch.toLowerCase();
    const matchesSearch = `${note.title} ${note.content} ${note.category}`.toLowerCase().includes(term);
    return matchesSearch && (noteCategory === 'All' || note.category === noteCategory);
  }), [notes, globalSearch, noteCategory]);

  const searchedTasks = useMemo(() => tasks.filter((task) => {
    const status = taskStatus(task);
    const term = globalSearch.toLowerCase();
    const matchesSearch = `${task.title} ${task.description || ''} ${task.category}`.toLowerCase().includes(term);
    const matchesFilter = taskFilter === 'All'
      || (taskFilter === 'Completed' && status === 'done')
      || (taskFilter === 'Pending' && status !== 'done');
    return matchesSearch && matchesFilter;
  }), [tasks, globalSearch, taskFilter]);

  function notify(message) {
    setToast(message);
    setNotificationsRead(false);
    window.setTimeout(() => setToast(''), 2300);
  }

  function toggleOverlay(name) {
    setOpenOverlay((current) => current === name ? null : name);
  }

  function openProfileEditor() {
    setProfileNameDraft(profileName);
    setProfileRoleDraft(profileRole);
    setProfileModal(true);
    setOpenOverlay(null);
  }

  function saveProfile(event) {
    event.preventDefault();
    setProfileName(profileNameDraft.trim() || 'Student');
    setProfileRole(profileRoleDraft.trim() || 'Personal workspace');
    setProfileModal(false);
    notify('Profile updated');
  }

  function exportBackup() {
    const backup = {
      app: 'To-Do List & Notes',
      exportedAt: new Date().toISOString(),
      tasks,
      notes,
      profile: { name: profileName, role: profileRole },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setOpenOverlay(null);
    notify('Backup downloaded');
  }

  function goToSettings() {
    setActivePage('settings');
    setGlobalSearch('');
    setOpenOverlay(null);
  }

  function markNotificationsRead() {
    setNotificationsRead(true);
  }

  const profileInitial = profileName.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'D';

  function saveTask(taskData) {
    const status = taskData.status || 'todo';
    const normalized = { ...taskData, status, completed: status === 'done' };
    if (taskModal?.id) {
      setTasks((current) => current.map((task) => task.id === taskModal.id ? { ...task, ...normalized } : task));
      notify('Task updated');
    } else {
      setTasks((current) => [{ ...normalized, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]);
      notify('Task created');
    }
    setTaskModal(null);
  }

  function saveNote(noteData) {
    const now = new Date().toISOString();
    if (noteModal?.id) {
      setNotes((current) => current.map((note) => note.id === noteModal.id ? { ...note, ...noteData, updatedAt: now } : note));
      notify('Note updated');
    } else {
      setNotes((current) => [{ ...noteData, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...current]);
      notify('Note created');
    }
    setNoteModal(null);
  }

  function setTaskStatus(id, status) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status, completed: status === 'done' } : task));
  }

  function toggleTask(id) {
    const current = tasks.find((task) => task.id === id);
    if (!current) return;
    setTaskStatus(id, taskStatus(current) === 'done' ? 'todo' : 'done');
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    notify('Task deleted');
  }

  function deleteNote(id) {
    setNotes((current) => current.filter((note) => note.id !== id));
    notify('Note deleted');
  }

  return (
    <div className={`app-shell ${themeMode === 'dark' ? 'theme-dark' : ''} ${compactMode ? 'compact-mode' : ''}`}>
      <Sidebar activePage={activePage} onNavigate={(page) => { setActivePage(page); setGlobalSearch(''); setOpenOverlay(null); }} taskCount={pendingCount} noteCount={notes.length} onOpenProfile={openProfileEditor} profileName={profileName} profileRole={profileRole} profileInitial={profileInitial} />
      <main className="main-content">
        <header className="topbar">
          <div className="global-search"><Search size={16} /><input aria-label="Search tasks or notes" value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search tasks or notes..." />{globalSearch && <button onClick={() => setGlobalSearch('')} aria-label="Clear search"><X size={14} /></button>}</div>
          <div className="topbar-actions">
            <div className="top-action-anchor">
              <button className="top-icon-button" aria-label="Notifications" title="Notifications" aria-expanded={openOverlay === 'notifications'} onClick={() => toggleOverlay('notifications')}>
                <Bell size={18} />{!notificationsRead && <span className="notification-dot" />}
              </button>
              {openOverlay === 'notifications' && <div className="action-popover notification-popover" role="dialog" aria-label="Notifications">
                <div className="popover-heading"><div><strong>Notifications</strong><span>{notificationsRead ? 'You are all caught up' : 'A few things to review'}</span></div><button className="popover-mark-read" onClick={markNotificationsRead} disabled={notificationsRead}><CheckCircle2 size={14} /> Mark read</button></div>
                <div className="notification-list">{notifications.map((item) => <div className="notification-item" key={item.id}><span className={`notification-type type-${item.type}`}>{item.type === 'task' ? <CalendarDays size={15} /> : item.type === 'progress' ? <CheckCircle2 size={15} /> : <StickyNote size={15} />}</span><div className="notification-copy"><strong>{item.title}</strong><p>{item.message}</p></div></div>)}</div>
                <div className="popover-footnote"><ShieldCheck size={13} /> Notifications are based on your local task and note data.</div>
              </div>}
            </div>
            <div className="top-action-anchor">
              <button className="profile-trigger" aria-label="Open profile menu" aria-expanded={openOverlay === 'profile'} onClick={() => toggleOverlay('profile')}><span className="top-avatar">{profileInitial}</span><ChevronDown size={13} className="top-chevron" /></button>
              {openOverlay === 'profile' && <div className="action-popover profile-popover" role="menu" aria-label="Profile menu">
                <div className="profile-popover-person"><span className="profile-avatar large-avatar">{profileInitial}</span><div><strong>{profileName}</strong><span>{profileRole}</span></div></div>
                <button className="popover-menu-item" onClick={openProfileEditor}><UserRound size={15} /> Edit profile</button>
                <button className="popover-menu-item" onClick={goToSettings}><Settings2 size={15} /> Settings & preferences</button>
                <button className="popover-menu-item" onClick={exportBackup}><Download size={15} /> Download data backup</button>
                <div className="popover-footnote"><Database size={13} /> Data stays in this browser.</div>
              </div>}
            </div>
          </div>
        </header>

        {activePage === 'tasks' ? (
          <section className="workspace-page board-page">
            <div className="board-toolbar">
              <div className="board-context"><span className="month-select"><CalendarDays size={17} /> {new Date().toLocaleDateString('en-IN', { month: 'long' })} <ChevronDown size={14} /></span><span className="toolbar-divider" /><span className="board-name"><LayoutGrid size={17} /> My task board <ChevronDown size={14} /></span></div>
              <div className="board-toolbar-actions"><span className="board-summary">{tasks.length} tasks <span>·</span> {pendingCount} pending</span><label className="filter-select"><Filter size={15} /><select value={taskFilter} onChange={(event) => setTaskFilter(event.target.value)} aria-label="Filter tasks"><option>All</option><option>Pending</option><option>Completed</option></select><ChevronDown size={13} /></label><button className="create-button" onClick={() => setTaskModal({ defaultStatus: 'todo' })}><Plus size={17} /> Create task</button></div>
            </div>

            <div className="board-grid">
              {columns.map((column) => {
                const columnTasks = searchedTasks.filter((task) => taskStatus(task) === column.id);
                const totalInColumn = tasks.filter((task) => taskStatus(task) === column.id).length;
                return (
                  <section key={column.id} className={`board-column column-${column.tone}`}>
                    <header className="column-header"><div className="column-title-wrap">{column.id === 'done' ? <CheckCircle2 size={19} className="column-state" /> : column.id === 'inProgress' ? <span className="progress-ring" /> : <Circle size={19} className="column-state" />}<h2>{column.title} <span>({totalInColumn})</span></h2></div><button className="column-add" onClick={() => setTaskModal({ defaultStatus: column.id })} title={`Add to ${column.title}`} aria-label={`Add task to ${column.title}`}><Plus size={17} /></button></header>
                    <div className="column-cards">
                      {columnTasks.map((task) => <TaskBoardCard key={task.id} task={task} status={column.id} onToggle={toggleTask} onEdit={() => setTaskModal(task)} onDelete={deleteTask} onStatusChange={setTaskStatus} formatDate={formatDate} />)}
                      {columnTasks.length === 0 && <div className="column-empty">{globalSearch ? 'No matching tasks' : 'Nothing here yet'}</div>}
                      <button className="column-add-card" onClick={() => setTaskModal({ defaultStatus: column.id })}><Plus size={14} /> Add a task</button>
                    </div>
                  </section>
                );
              })}
            </div>

            <section className="quick-notes-section">
              <div className="quick-notes-heading"><div className="quick-notes-title"><FileText size={17} /><h2>Quick notes</h2><span className="quick-count">{notes.length}</span></div><button className="text-link" onClick={() => { setActivePage('notes'); setGlobalSearch(''); }}>View all notes <span>→</span></button></div>
              <div className="quick-notes-grid">
                {notes.slice(0, 2).map((note) => <button key={note.id} className="quick-note" onClick={() => { setActivePage('notes'); setNoteModal(note); }}><span className={`quick-note-dot dot-${note.color || 'mint'}`} /><span className="quick-note-content"><strong>{note.title}</strong><small>{note.content.split('\n').slice(0, 2).join(' · ')}</small><em>{new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</em></span><MoreHorizontal size={17} /></button>)}
                {notes.length === 0 && <p className="quick-empty">Your notes will show up here.</p>}
              </div>
            </section>
            <footer className="app-footer"><span>To-Do List & Notes</span><span>Built with React · Saved in this browser</span></footer>
          </section>
        ) : activePage === 'notes' ? (
          <section className="workspace-page notes-page">
            <div className="notes-page-heading"><div><span className="page-kicker">YOUR WORKSPACE / NOTES</span><h1>Notes</h1><p>Ideas, reminders and useful things to come back to.</p></div><button className="create-button" onClick={() => setNoteModal({})}><Plus size={17} /> Create note</button></div>
            <div className="notes-toolbar"><div className="notes-toolbar-label"><StickyNote size={17} /><span>All notes</span><small>{visibleNotes.length} shown</small></div><label className="filter-select"><Settings2 size={15} /><select value={noteCategory} onChange={(event) => setNoteCategory(event.target.value)} aria-label="Filter note category">{noteCategories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={13} /></label></div>
            <div className="notes-board-grid">
              {visibleNotes.map((note) => <NoteCard key={note.id} note={note} onEdit={setNoteModal} onDelete={deleteNote} />)}
              <button className="new-note-tile" onClick={() => setNoteModal({})}><span><Plus size={22} /></span><strong>Create a new note</strong><small>Keep a thought for later.</small></button>
              {visibleNotes.length === 0 && <div className="empty-notes"><StickyNote size={25} /><strong>No notes found</strong><span>Try another search or create a note.</span></div>}
            </div>
            <footer className="app-footer"><span>To-Do List & Notes</span><span>Local storage · React</span></footer>
          </section>
        ) : (
          <section className="workspace-page settings-page">
            <div className="settings-page-heading"><div><span className="page-kicker">YOUR WORKSPACE / PREFERENCES</span><h1>Settings</h1><p>Make this little workspace feel right for you.</p></div><span className="settings-heading-icon"><Settings2 size={20} /></span></div>
            <div className="settings-layout">
              <section className="settings-card">
                <div className="settings-card-heading"><span className="settings-icon"><Monitor size={18} /></span><div><h2>Appearance</h2><p>Adjust how your workspace looks.</p></div></div>
                <div className="settings-row"><div><strong>Theme</strong><small>Choose a light or dark workspace.</small></div><div className="theme-picker"><button className={themeMode === 'light' ? 'active' : ''} onClick={() => setThemeMode('light')}><Sun size={14} /> Light</button><button className={themeMode === 'dark' ? 'active' : ''} onClick={() => setThemeMode('dark')}><Moon size={14} /> Dark</button></div></div>
                <div className="settings-row"><div><strong>Compact cards</strong><small>Fit more tasks on the board at once.</small></div><label className="toggle-control"><input type="checkbox" checked={compactMode} onChange={(event) => setCompactMode(event.target.checked)} /><span /></label></div>
              </section>
              <section className="settings-card">
                <div className="settings-card-heading"><span className="settings-icon"><UserRound size={18} /></span><div><h2>Profile</h2><p>The name shown in your workspace.</p></div></div>
                <div className="settings-profile-row"><span className="profile-avatar large-avatar">{profileInitial}</span><div><strong>{profileName}</strong><small>{profileRole}</small></div><button className="settings-outline-button" onClick={openProfileEditor}>Edit profile</button></div>
              </section>
              <section className="settings-card settings-data-card">
                <div className="settings-card-heading"><span className="settings-icon"><Database size={18} /></span><div><h2>Data & storage</h2><p>Your information is kept in this browser, not in a cloud account.</p></div></div>
                <div className="storage-stats"><div><span>Tasks</span><strong>{tasks.length}</strong></div><div><span>Notes</span><strong>{notes.length}</strong></div><div><span>Storage</span><strong>Local</strong></div></div>
                <div className="settings-row settings-export-row"><div><strong>Export a backup</strong><small>Download your tasks, notes and profile as a JSON file.</small></div><button className="settings-outline-button" onClick={exportBackup}><Download size={14} /> Export backup</button></div>
                <p className="settings-note"><CircleHelp size={14} /> Clearing browser site data can remove your saved tasks and notes, so keep a backup if you need one.</p>
              </section>
            </div>
            <footer className="app-footer"><span>To-Do List & Notes</span><span>Preferences are saved in this browser</span></footer>
          </section>
        )}

        {taskModal && <TaskForm key={`${taskModal.id || 'new'}-${taskModal.defaultStatus || ''}`} initialTask={taskModal.id ? taskModal : null} defaultStatus={taskModal.defaultStatus || 'todo'} onSave={saveTask} onClose={() => setTaskModal(null)} />}
        {noteModal && <NoteForm initialNote={noteModal.id ? noteModal : null} onSave={saveNote} onClose={() => setNoteModal(null)} />}
        {profileModal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfileModal(false); }}><form className="modal-card profile-edit-modal" onSubmit={saveProfile}><div className="modal-header"><div><span className="modal-eyebrow">YOUR WORKSPACE</span><h2>Edit profile</h2><p>These details are only used to personalize this browser view.</p></div><button type="button" className="icon-button" aria-label="Close profile editor" onClick={() => setProfileModal(false)}><X size={17} /></button></div><label className="field-label" htmlFor="profile-name">Display name</label><input id="profile-name" className="form-input" maxLength={48} value={profileNameDraft} onChange={(event) => setProfileNameDraft(event.target.value)} placeholder="Your name" autoFocus /><label className="field-label" htmlFor="profile-role">Workspace label</label><input id="profile-role" className="form-input" maxLength={64} value={profileRoleDraft} onChange={(event) => setProfileRoleDraft(event.target.value)} placeholder="e.g. Student workspace" /><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setProfileModal(false)}>Cancel</button><button type="submit" className="create-button"><Save size={14} /> Save profile</button></div></form></div>}
        {toast && <div className="toast"><Check size={14} /> {toast}</div>}
      </main>
    </div>
  );
}
