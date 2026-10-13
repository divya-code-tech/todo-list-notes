import { Clock3, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

function relativeDate(dateString) {
  if (!dateString) return 'Just created';
  const date = new Date(dateString);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return `Today, ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className={`note-card note-${note.color || 'mint'}`}>
      <div className="note-card-top"><span className={`note-category note-tag-${(note.category || 'other').toLowerCase()}`}>{note.category || 'General'}</span><div className="note-actions"><button className="note-icon-button" onClick={() => onEdit(note)} aria-label={`Edit ${note.title}`} title="Edit note"><Pencil size={14} /></button><button className="note-icon-button" onClick={() => onDelete(note.id)} aria-label={`Delete ${note.title}`} title="Delete note"><Trash2 size={14} /></button></div></div>
      <button className="note-card-content" onClick={() => onEdit(note)} aria-label={`Open note ${note.title}`}><h3>{note.title}</h3><p>{note.content || 'No content yet.'}</p></button>
      <div className="note-card-footer"><Clock3 size={12} /><span>{relativeDate(note.updatedAt || note.createdAt)}</span></div>
    </article>
  );
}
