import { useState } from 'react';
import { CalendarDays, Check, Circle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

const categoryTone = (category = '') => {
  const value = category.toLowerCase();
  if (['react', 'frontend', 'project', 'deploy'].some((word) => value.includes(word))) return 'tag-blue';
  if (['study', 'learning', 'testing', 'notes'].some((word) => value.includes(word))) return 'tag-teal';
  if (['bug', 'health'].some((word) => value.includes(word))) return 'tag-pink';
  return 'tag-purple';
};

export default function TaskBoardCard({ task, status, onToggle, onEdit, onDelete, onStatusChange, formatDate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const completed = status === 'done';
  return (
    <article className={`task-card ${completed ? 'task-card-done' : ''}`}>
      <div className="task-card-heading">
        <button className={`task-checkbox ${completed ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label={completed ? 'Mark task pending' : 'Mark task completed'}>{completed ? <Check size={13} /> : null}</button>
        <div className="task-card-title-wrap"><h3>{task.title}</h3></div>
        <div className="task-menu-wrap">
          <button className="card-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={`Options for ${task.title}`}><MoreHorizontal size={18} /></button>
          {menuOpen && <>
            <button className="menu-scrim" aria-label="Close task menu" onClick={() => setMenuOpen(false)} />
            <div className="task-context-menu">
              <button onClick={() => { onEdit(); setMenuOpen(false); }}><Pencil size={13} /> Edit task</button>
              <span className="menu-label">Move to</span>
              {[['todo', 'To Do'], ['inProgress', 'In Progress'], ['done', 'Done']].filter(([value]) => value !== status).map(([value, label]) => <button key={value} onClick={() => { onStatusChange(task.id, value); setMenuOpen(false); }}><Circle size={12} /> {label}</button>)}
              <button className="menu-danger" onClick={() => { onDelete(task.id); setMenuOpen(false); }}><Trash2 size={13} /> Delete task</button>
            </div>
          </>}
        </div>
      </div>
      {task.description && <p className="task-card-description">{task.description}</p>}
      <div className="task-card-tags"><span className={`task-tag ${categoryTone(task.category)}`}>{task.category || 'General'}</span>{task.priority && <span className={`task-tag priority-${task.priority.toLowerCase()}`}>{task.priority}</span>}</div>
      {status === 'inProgress' && <div className="task-card-progress"><div><span style={{ width: `${task.progress || 40}%` }} /></div><small>{task.progress || 40}%</small></div>}
      <div className="task-card-footer"><span className={`task-date ${task.dueDate && new Date(`${task.dueDate}T23:59:59`) < new Date() && !completed ? 'date-overdue' : ''}`}><CalendarDays size={13} /> {formatDate(task.dueDate)}</span><span className={`status-indicator status-${status}`}>{completed ? 'Completed' : status === 'inProgress' ? 'In progress' : 'Pending'}</span></div>
    </article>
  );
}
