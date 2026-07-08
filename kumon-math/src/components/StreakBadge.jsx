export default function StreakBadge({ count, practicedToday }) {
  return (
    <span className={`streak-badge ${practicedToday ? 'done' : ''}`}>
      <span className="streak-flame" aria-hidden>
        {count > 0 ? '🔥' : '·'}
      </span>
      <span className="streak-count">{count}</span>
      <span className="streak-label">day{count === 1 ? '' : 's'}</span>
    </span>
  )
}
