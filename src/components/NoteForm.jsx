import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function NoteForm({ initialNote, onSave, onClose }) {
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [category, setCategory] = useState(initialNote?.category ?? 'Personal');
  const [color, setColor] = useState(initialNote?.color ?? 'butter');
  const [error, setError] = useState('');

  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() && !content.trim()) { setError('Add a title or write something in your note.'); return; }
    onSave({ title: title.trim() || 'Untitled note', content: content.trim(), category, color });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal-card note-modal" onSubmit={handleSubmit}>
        <div className="modal-header"><div><span className="modal-eyebrow">{initialNote ? 'NOTE / EDIT' : 'NOTE / NEW'}</span><h2>{initialNote ? 'Edit note' : 'A new note'}</h2><p>Add a title and any details you want to keep.</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div>
        <label className="field-label" htmlFor="note-title">Title</label>
        <input id="note-title" className="form-input" autoFocus value={title} onChange={(event) => { setTitle(event.target.value); setError(''); }} placeholder="Enter a note title..." maxLength={100} />
        <label className="field-label" htmlFor="note-content">Your note</label>
        <textarea id="note-content" className="form-input note-textarea" value={content} onChange={(event) => { setContent(event.target.value); setError(''); }} placeholder="Write a note..." rows={6} maxLength={5000} />
        {error && <span className="field-error">{error}</span>}
        <div className="form-two-col"><div><label className="field-label" htmlFor="note-category">Category</label><select id="note-category" className="form-input" value={category} onChange={(event) => setCategory(event.target.value)}><option>Personal</option><option>Study</option><option>Ideas</option><option>Work</option><option>Project</option></select></div>
          <div><span className="field-label">Card colour</span><div className="color-picker">{[['butter','Butter'],['mint','Mint'],['lilac','Lilac'],['rose','Rose']].map(([value, label]) => <button key={value} type="button" title={label} aria-label={`${label} note colour`} className={`color-swatch ${value} ${color === value ? 'chosen' : ''}`} onClick={() => setColor(value)} />)}</div></div></div>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{initialNote ? 'Save changes' : 'Save note'}</button></div>
      </form>
    </div>
  );
}
