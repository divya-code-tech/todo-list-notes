import { useEffect, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';

export default function TaskForm({ initialTask, defaultStatus = 'todo', onSave, onClose }) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [category, setCategory] = useState(initialTask?.category ?? 'Project');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? '');
  const [status, setStatus] = useState(initialTask?.status ?? (initialTask?.completed ? 'done' : defaultStatus));
  const [error, setError] = useState('');

  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) { setError('Enter a task title before saving.'); return; }
    onSave({ title: title.trim(), description: description.trim(), category, dueDate, status, completed: status === 'done' });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal-card" onSubmit={handleSubmit}>
        <div className="modal-header"><div><span className="modal-eyebrow">TASK DETAILS</span><h2>{initialTask ? 'Edit task' : 'Create a task'}</h2><p>Keep the next step clear and manageable.</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <label className="field-label" htmlFor="task-title">Title</label>
        <input id="task-title" className="form-input" autoFocus value={title} onChange={(event) => { setTitle(event.target.value); setError(''); }} placeholder="What needs to get done?" maxLength={120} />
        {error && <span className="field-error">{error}</span>}
        <label className="field-label" htmlFor="task-description">Description <span className="optional-label">OPTIONAL</span></label>
        <textarea id="task-description" className="form-input task-description-input" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context..." rows={3} maxLength={280} />
        <div className="form-two-col"><div><label className="field-label" htmlFor="task-category">Label</label><select id="task-category" className="form-input" value={category} onChange={(event) => setCategory(event.target.value)}><option>React</option><option>Project</option><option>Study</option><option>Learning</option><option>Frontend</option><option>Testing</option><option>Personal</option><option>Work</option><option>Health</option></select></div><div><label className="field-label" htmlFor="task-status">Status</label><select id="task-status" className="form-input" value={status} onChange={(event) => setStatus(event.target.value)}><option value="todo">To Do</option><option value="inProgress">In Progress</option><option value="done">Done</option></select></div></div>
        <label className="field-label" htmlFor="task-date">Due date <span className="optional-label">OPTIONAL</span></label>
        <div className="date-input-wrap"><CalendarDays size={16} /><input id="task-date" type="date" className="date-input" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{initialTask ? 'Save changes' : 'Create task'}</button></div>
      </form>
    </div>
  );
}
