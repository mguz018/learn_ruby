import { useState } from 'react'

const AVATARS = [
  '🦒', '🐧', '🦉', '🐧🦉', '🦊', '🐨', '🐼', '🦁', '🐯', '🐸', '🐵', '🦄',
  '🐙', '🦕', '🦖', '🐢', '🐬', '🦋', '🐝', '🦔', '🐰', '🐱', '🐶', '🦩',
  '🚀', '🤖', '👾', '⭐', '🌈', '🦈', '🐲', '🦚',
]
const COLORS = [
  '#2563eb', '#e0662b', '#16a34a', '#7c3aed', '#db2777', '#0d9488',
  '#ea580c', '#4f46e5', '#dc2626', '#0891b2', '#65a30d', '#c026d3',
]

export default function ProfileEditor({ initial, onSave, onCancel, onDelete }) {
  const [name, setName] = useState(initial?.name || '')
  const [avatar, setAvatar] = useState(initial?.avatar || '🦊')
  const [color, setColor] = useState(initial?.color || COLORS[0])
  const isEdit = !!initial

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal editor" style={{ '--accent': color }} onClick={(e) => e.stopPropagation()}>
        <div className="editor-preview">
          <span className="editor-avatar">{avatar}</span>
          <span className="editor-preview-name">{name || 'New Kid'}</span>
        </div>

        <label className="editor-label">Name</label>
        <input
          className="text-input"
          value={name}
          maxLength={16}
          placeholder="Enter a name"
          onChange={(e) => setName(e.target.value)}
        />

        <label className="editor-label">Pick an avatar</label>
        <div className="avatar-picker">
          {AVATARS.map((a) => (
            <button
              key={a}
              className={`avatar-option ${avatar === a ? 'selected' : ''}`}
              onClick={() => setAvatar(a)}
            >
              {a}
            </button>
          ))}
        </div>

        <label className="editor-label">Pick a color</label>
        <div className="color-picker">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`color-option ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`color ${c}`}
            />
          ))}
        </div>

        <div className="editor-actions">
          <button
            className="primary-btn"
            disabled={!name.trim()}
            onClick={() => onSave({ name, avatar, color })}
          >
            {isEdit ? 'Save' : 'Add Kid'}
          </button>
          <button className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
        {isEdit && onDelete && (
          <button className="editor-delete" onClick={onDelete}>
            Remove this kid
          </button>
        )}
      </div>
    </div>
  )
}
