/* Life OS — vanilla JS single page app. No build step, no framework.
 * Everything user-supplied goes in through textContent, never innerHTML. */

'use strict';

/* ------------------------------------------------------------------ api --- */

const api = {
  async get(path) {
    const res = await fetch(path, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`);
    return res.json();
  },
  async send(method, path, body) {
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`${method} ${path} failed (${res.status})`);
    return res.json();
  },
  state:   ()            => api.get('/api/state'),
  create:  (kind, body)  => api.send('POST',   `/api/${kind}`, body),
  update:  (kind, id, b) => api.send('PATCH',  `/api/${kind}/${id}`, b),
  remove:  (kind, id)    => api.send('DELETE', `/api/${kind}/${id}`),
  cycleTask: (id)        => api.send('POST', `/api/tasks/${id}/toggle`),
  checkHabit: (id, date) => api.send('POST', `/api/habits/${id}/check`, { date })
};

/* --------------------------------------------------------------- helpers --- */

let STATE = null;
let ROUTE = 'today';

const KINDS = {
  work:     { label: 'Work',        glyph: '▰', blurb: 'The job that pays the bills' },
  hustle:   { label: 'Side Hustles', glyph: '◈', blurb: 'The things you are building' },
  personal: { label: 'Personal',    glyph: '❤', blurb: 'Health, home, everything else' }
};

const STATUSES = ['todo', 'doing', 'done'];
const STATUS_LABEL = { todo: 'To do', doing: 'In progress', done: 'Done' };

/** Tiny hyperscript. Props starting with "on" become listeners. */
function h(tag, props, ...kids) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;          // only ever literals we author
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else node.setAttribute(key, value);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

const today = () => new Date().toISOString().slice(0, 10);

function parseDay(value) {
  if (!value) return null;
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return isNaN(d) ? null : d;
}

function daysFromToday(value) {
  const d = parseDay(value);
  if (!d) return null;
  const now = parseDay(today());
  return Math.round((d - now) / 86400000);
}

/** "Today", "Tomorrow", "3d late", "Fri 12 Sep" — whichever is most useful. */
function dueLabel(value) {
  const delta = daysFromToday(value);
  if (delta === null) return null;
  if (delta === 0) return 'Today';
  if (delta === 1) return 'Tomorrow';
  if (delta === -1) return '1 day late';
  if (delta < 0) return `${Math.abs(delta)} days late`;
  if (delta < 7) return `In ${delta} days`;
  return parseDay(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function fmtDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function money(amount) {
  const symbol = (STATE?.settings?.currency) || '$';
  const value = Number(amount || 0);
  return `${value < 0 ? '-' : ''}${symbol}${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const areas = () => STATE.areas;
const areasOf = (kind) => STATE.areas.filter((a) => a.kind === kind);
const areaById = (id) => STATE.areas.find((a) => a.id === id) || null;
const areaName = (id) => areaById(id)?.name || 'Unassigned';
const areaColor = (id) => areaById(id)?.color || 'var(--text-dim)';
const tasksIn = (kind) => STATE.tasks.filter((t) => areaById(t.area_id)?.kind === kind);

function sortTasks(list) {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...list].sort((a, b) => {
    const da = daysFromToday(a.due);
    const db = daysFromToday(b.due);
    if (da !== db) return (da === null ? 9999 : da) - (db === null ? 9999 : db);
    return (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1);
  });
}

function toast(message) {
  document.querySelector('.toast')?.remove();
  const node = h('div', { class: 'toast', text: message });
  document.body.append(node);
  setTimeout(() => node.remove(), 2200);
}

/** Every mutation goes through here: call the API, refetch, repaint. */
async function commit(work, message) {
  try {
    await work();
    STATE = await api.state();
    render();
    if (message) toast(message);
  } catch (err) {
    console.error(err);
    toast(err.message || 'Something went wrong');
  }
}

/* ----------------------------------------------------------------- modal --- */

/**
 * fields: [{ name, label, type, options?, value?, placeholder?, span? }]
 * Resolves with an object of values, or null if dismissed.
 */
function openForm({ title, fields, submitLabel = 'Save', onDelete }) {
  return new Promise((resolve) => {
    const root = document.getElementById('modal-root');
    const inputs = {};

    const close = (value) => { root.replaceChildren(); document.removeEventListener('keydown', onKey); resolve(value); };
    const onKey = (e) => { if (e.key === 'Escape') close(null); };
    document.addEventListener('keydown', onKey);

    const body = h('div', { class: 'modal-body' });
    let row = null;
    for (const field of fields) {
      let control;
      if (field.type === 'select') {
        control = h('select', { name: field.name },
          ...field.options.map((opt) => h('option', {
            value: opt.value,
            selected: String(opt.value) === String(field.value ?? '')
          }, opt.label))
        );
      } else if (field.type === 'textarea') {
        control = h('textarea', { name: field.name, placeholder: field.placeholder || '' });
        control.value = field.value ?? '';
      } else if (field.type === 'checkbox') {
        control = h('input', { type: 'checkbox', style: { width: 'auto' } });
        control.checked = Boolean(field.value);
      } else {
        control = h('input', { type: field.type || 'text', placeholder: field.placeholder || '', step: field.step });
        control.value = field.value ?? '';
      }
      inputs[field.name] = control;

      const wrapper = h('div', { class: 'field' }, h('label', { text: field.label }), control);
      if (field.span === 'half') {
        if (!row) { row = h('div', { class: 'form-row' }); body.append(row); }
        row.append(wrapper);
        if (row.children.length === 2) row = null;
      } else {
        row = null;
        body.append(wrapper);
      }
    }

    const submit = () => {
      const values = {};
      for (const [name, control] of Object.entries(inputs)) {
        values[name] = control.type === 'checkbox' ? control.checked : control.value;
      }
      close(values);
    };

    const modal = h('div', { class: 'modal' },
      h('div', { class: 'modal-head' },
        h('h3', { text: title }),
        h('button', { class: 'btn btn-sm btn-ghost', onClick: () => close(null), text: '✕' })
      ),
      body,
      h('div', { class: 'modal-foot' },
        onDelete && h('button', {
          class: 'btn btn-sm btn-danger', text: 'Delete',
          onClick: () => { close(null); onDelete(); }
        }),
        h('span', { class: 'spacer' }),
        h('button', { class: 'btn', text: 'Cancel', onClick: () => close(null) }),
        h('button', { class: 'btn btn-primary', text: submitLabel, onClick: submit })
      )
    );

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); submit(); }
    });

    const backdrop = h('div', { class: 'modal-backdrop', onClick: (e) => { if (e.target === backdrop) close(null); } }, modal);
    root.append(backdrop);
    body.querySelector('input, select, textarea')?.focus();
  });
}

const areaOptions = (kind) => {
  const list = kind ? areasOf(kind) : areas();
  return [...list.map((a) => ({ value: a.id, label: `${a.name} · ${KINDS[a.kind].label}` })), { value: '', label: 'Unassigned' }];
};

/* --------------------------------------------------------------- actions --- */

async function newTask(defaults = {}) {
  const values = await openForm({
    title: 'New task',
    fields: [
      { name: 'title', label: 'What needs doing', placeholder: 'e.g. Send the invoice', value: defaults.title || '' },
      { name: 'area_id', label: 'Area', type: 'select', options: areaOptions(), value: defaults.area_id || areas()[0]?.id, span: 'half' },
      { name: 'due', label: 'Due', type: 'date', value: defaults.due || '', span: 'half' },
      { name: 'priority', label: 'Priority', type: 'select', span: 'half', value: 'medium',
        options: [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] },
      { name: 'status', label: 'Status', type: 'select', span: 'half', value: defaults.status || 'todo',
        options: STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })) },
      { name: 'notes', label: 'Notes', type: 'textarea', value: '' }
    ],
    submitLabel: 'Add task'
  });
  if (!values || !values.title.trim()) return;
  await commit(() => api.create('tasks', values), 'Task added');
}

async function editTask(task) {
  const values = await openForm({
    title: 'Edit task',
    fields: [
      { name: 'title', label: 'Title', value: task.title },
      { name: 'area_id', label: 'Area', type: 'select', options: areaOptions(), value: task.area_id || '', span: 'half' },
      { name: 'due', label: 'Due', type: 'date', value: task.due || '', span: 'half' },
      { name: 'priority', label: 'Priority', type: 'select', span: 'half', value: task.priority,
        options: [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] },
      { name: 'status', label: 'Status', type: 'select', span: 'half', value: task.status,
        options: STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })) },
      { name: 'notes', label: 'Notes', type: 'textarea', value: task.notes || '' }
    ],
    onDelete: () => commit(() => api.remove('tasks', task.id), 'Task deleted')
  });
  if (!values) return;
  await commit(() => api.update('tasks', task.id, values), 'Task updated');
}

async function newMoney(defaults = {}) {
  const values = await openForm({
    title: 'Log money',
    fields: [
      { name: 'label', label: 'What was it', placeholder: 'e.g. Retainer — September' },
      { name: 'kind', label: 'Type', type: 'select', span: 'half', value: defaults.kind || 'income',
        options: [{ value: 'income', label: 'Money in' }, { value: 'expense', label: 'Money out' }] },
      { name: 'amount', label: 'Amount', type: 'number', step: '0.01', span: 'half', value: '' },
      { name: 'area_id', label: 'Area', type: 'select', span: 'half', options: areaOptions(), value: defaults.area_id || areasOf('hustle')[0]?.id },
      { name: 'date', label: 'Date', type: 'date', span: 'half', value: today() }
    ],
    submitLabel: 'Log it'
  });
  if (!values || !values.label.trim()) return;
  values.amount = Number(values.amount) || 0;
  await commit(() => api.create('money', values), 'Logged');
}

async function newHabit() {
  const values = await openForm({
    title: 'New habit',
    fields: [
      { name: 'name', label: 'Habit', placeholder: 'e.g. Walk after lunch' },
      { name: 'area_id', label: 'Area', type: 'select', options: areaOptions(), value: areasOf('personal')[0]?.id, span: 'half' },
      { name: 'target', label: 'Days per week', type: 'number', value: 7, span: 'half' }
    ],
    submitLabel: 'Add habit'
  });
  if (!values || !values.name.trim()) return;
  values.target = Number(values.target) || 7;
  await commit(() => api.create('habits', values), 'Habit added');
}

async function newGoal(defaults = {}) {
  const values = await openForm({
    title: 'New goal',
    fields: [
      { name: 'title', label: 'Goal', placeholder: 'e.g. Side income this month' },
      { name: 'area_id', label: 'Area', type: 'select', options: areaOptions(), value: defaults.area_id || areas()[0]?.id },
      { name: 'current', label: 'Where you are', type: 'number', step: '0.01', value: 0, span: 'half' },
      { name: 'target', label: 'Target', type: 'number', step: '0.01', value: '', span: 'half' },
      { name: 'unit', label: 'Unit (blank for a count)', placeholder: '$', value: defaults.unit ?? '' }
    ],
    submitLabel: 'Add goal'
  });
  if (!values || !values.title.trim()) return;
  values.current = Number(values.current) || 0;
  values.target = Number(values.target) || 0;
  await commit(() => api.create('goals', values), 'Goal added');
}

async function editGoal(goal) {
  const values = await openForm({
    title: 'Update goal',
    fields: [
      { name: 'title', label: 'Goal', value: goal.title },
      { name: 'current', label: 'Where you are', type: 'number', step: '0.01', value: goal.current, span: 'half' },
      { name: 'target', label: 'Target', type: 'number', step: '0.01', value: goal.target, span: 'half' }
    ],
    onDelete: () => commit(() => api.remove('goals', goal.id), 'Goal removed')
  });
  if (!values) return;
  values.current = Number(values.current) || 0;
  values.target = Number(values.target) || 0;
  await commit(() => api.update('goals', goal.id, values), 'Goal updated');
}

async function newEvent(defaults = {}) {
  const values = await openForm({
    title: 'New event',
    fields: [
      { name: 'title', label: 'What', placeholder: 'e.g. Client call' },
      { name: 'starts_at', label: 'When', type: 'datetime-local', value: `${today()}T09:00` },
      { name: 'area_id', label: 'Area', type: 'select', options: areaOptions(), value: defaults.area_id || areas()[0]?.id }
    ],
    submitLabel: 'Add event'
  });
  if (!values || !values.title.trim()) return;
  await commit(() => api.create('events', values), 'Event added');
}

async function newNote() {
  const values = await openForm({
    title: 'New note',
    fields: [
      { name: 'title', label: 'Title', placeholder: 'e.g. Ideas for the shop' },
      { name: 'area_id', label: 'Area', type: 'select', options: areaOptions(), value: '' },
      { name: 'body', label: 'Note', type: 'textarea' },
      { name: 'pinned', label: 'Pin to the top', type: 'checkbox', value: false }
    ],
    submitLabel: 'Save note'
  });
  if (!values || !values.title.trim()) return;
  await commit(() => api.create('notes', values), 'Note saved');
}

async function editNote(note) {
  const values = await openForm({
    title: 'Edit note',
    fields: [
      { name: 'title', label: 'Title', value: note.title },
      { name: 'area_id', label: 'Area', type: 'select', options: areaOptions(), value: note.area_id || '' },
      { name: 'body', label: 'Note', type: 'textarea', value: note.body || '' },
      { name: 'pinned', label: 'Pin to the top', type: 'checkbox', value: note.pinned }
    ],
    onDelete: () => commit(() => api.remove('notes', note.id), 'Note deleted')
  });
  if (!values) return;
  await commit(() => api.update('notes', note.id, values), 'Note updated');
}

async function newArea() {
  const values = await openForm({
    title: 'New area',
    fields: [
      { name: 'name', label: 'Name', placeholder: 'e.g. Freelance design' },
      { name: 'kind', label: 'Part of life', type: 'select', span: 'half', value: 'hustle',
        options: Object.entries(KINDS).map(([value, k]) => ({ value, label: k.label })) },
      { name: 'color', label: 'Colour', type: 'color', span: 'half', value: '#5b8def' }
    ],
    submitLabel: 'Add area'
  });
  if (!values || !values.name.trim()) return;
  await commit(() => api.create('areas', values), 'Area added');
}

async function editArea(area) {
  const values = await openForm({
    title: 'Edit area',
    fields: [
      { name: 'name', label: 'Name', value: area.name },
      { name: 'kind', label: 'Part of life', type: 'select', span: 'half', value: area.kind,
        options: Object.entries(KINDS).map(([value, k]) => ({ value, label: k.label })) },
      { name: 'color', label: 'Colour', type: 'color', span: 'half', value: area.color }
    ],
    onDelete: () => {
      if (!confirm(`Delete "${area.name}"? Its tasks and entries are kept but become unassigned.`)) return;
      commit(() => api.remove('areas', area.id), 'Area deleted');
    }
  });
  if (!values) return;
  await commit(() => api.update('areas', area.id, values), 'Area updated');
}

/* ------------------------------------------------------------ components --- */

function stat(label, value, foot, tone) {
  return h('div', { class: 'stat' },
    h('div', { class: 'stat-label', text: label }),
    h('div', { class: `stat-value ${tone || ''}`, text: value }),
    foot ? h('div', { class: 'stat-foot', text: foot }) : null
  );
}

function areaPill(id) {
  if (!id || !areaById(id)) return h('span', { class: 'pill', text: 'Unassigned' });
  return h('span', { class: 'pill' },
    h('span', { class: 'dot', style: { background: areaColor(id) } }),
    areaName(id)
  );
}

function taskRow(task, { showArea = true } = {}) {
  const delta = daysFromToday(task.due);
  const overdue = task.status !== 'done' && delta !== null && delta < 0;
  const dueToday = task.status !== 'done' && delta === 0;

  const check = h('button', {
    class: `task-check ${task.status}`,
    title: `Mark as ${STATUS_LABEL[STATUSES[(STATUSES.indexOf(task.status) + 1) % 3]]}`,
    text: task.status === 'done' ? '✓' : task.status === 'doing' ? '●' : '',
    onClick: () => commit(() => api.cycleTask(task.id))
  });

  return h('div', { class: `task ${task.status === 'done' ? 'is-done' : ''}` },
    check,
    h('div', { class: 'task-body' },
      h('div', { class: 'task-title', text: task.title }),
      h('div', { class: 'task-meta' },
        showArea ? areaPill(task.area_id) : null,
        task.priority === 'high' && task.status !== 'done' ? h('span', { class: 'pill pill-high', text: 'High' }) : null,
        task.due ? h('span', {
          class: `pill ${overdue ? 'pill-overdue' : dueToday ? 'pill-today' : ''}`,
          text: dueLabel(task.due)
        }) : null,
        task.notes ? h('span', { class: 'pill', text: '✎ note' }) : null
      )
    ),
    h('div', { class: 'task-actions' },
      h('button', { class: 'btn btn-sm btn-ghost', text: 'Edit', onClick: () => editTask(task) })
    )
  );
}

function taskList(list, options) {
  if (!list.length) return h('div', { class: 'empty', text: options?.empty || 'Nothing here.' });
  return h('div', {}, ...list.map((t) => taskRow(t, options)));
}

function habitRow(habit) {
  const summary = STATE.summary.habits.find((s) => s.id === habit.id);
  if (!summary) return null;
  return h('div', { class: 'habit' },
    h('button', {
      class: `habit-toggle ${summary.done_today ? 'on' : ''}`,
      text: '✓',
      title: summary.done_today ? 'Undo today' : 'Mark done for today',
      onClick: () => commit(() => api.checkHabit(habit.id, today()))
    }),
    h('div', { style: { flex: '1', minWidth: '0' } },
      h('div', { text: habit.name, style: { fontWeight: '520' } }),
      h('div', { class: 'task-meta' },
        areaPill(habit.area_id),
        h('span', { class: 'pill', text: `${summary.this_week}/${habit.target} this week` })
      )
    ),
    h('div', { class: 'habit-week' },
      ...summary.last_7.map((done, i) => h('span', {
        class: `habit-day ${done ? 'on' : ''}`,
        title: i === 6 ? 'Today' : `${6 - i} days ago`
      }))
    ),
    h('div', { class: 'streak', text: summary.streak > 0 ? `🔥 ${summary.streak} day${summary.streak === 1 ? '' : 's'}` : '—' })
  );
}

function goalCard(goal) {
  const summary = STATE.summary.goals.find((g) => g.id === goal.id) || goal;
  // Show cents only when there are cents, so "$3,000" doesn't become "$3,000.00".
  const number = (value) => Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });
  const unit = (value) => (goal.unit ? `${goal.unit}${number(value)}` : number(value));
  return h('div', { class: 'card', onClick: () => editGoal(goal), style: { cursor: 'pointer' } },
    h('div', { class: 'row-between' },
      h('div', { class: 'card-title', text: goal.title }),
      h('span', { class: `pill ${summary.complete ? 'pill-good' : ''}`, text: `${summary.percent}%` })
    ),
    h('div', { class: 'row', style: { marginTop: '6px', gap: '6px' } },
      h('span', { class: 'mono', style: { fontSize: '19px', fontWeight: '650' }, text: unit(goal.current) }),
      h('span', { class: 'dim', text: `of ${unit(goal.target)}` })
    ),
    h('div', { class: 'progress' }, h('span', {
      style: { width: `${Math.min(summary.percent, 100)}%`, background: areaColor(goal.area_id) }
    })),
    h('div', { class: 'task-meta', style: { marginTop: '10px' } }, areaPill(goal.area_id))
  );
}

function eventRow(event) {
  return h('div', { class: 'task' },
    h('div', { class: 'task-body' },
      h('div', { class: 'task-title', text: event.title }),
      h('div', { class: 'task-meta' },
        areaPill(event.area_id),
        h('span', { class: 'pill', text: fmtDateTime(event.starts_at) })
      )
    ),
    h('div', { class: 'task-actions' },
      h('button', {
        class: 'btn btn-sm btn-ghost', text: 'Remove',
        onClick: () => commit(() => api.remove('events', event.id), 'Event removed')
      })
    )
  );
}

function board(tasks, defaults = {}) {
  return h('div', { class: 'board' },
    ...STATUSES.map((status) => {
      const inColumn = sortTasks(tasks.filter((t) => t.status === status));
      return h('div', { class: 'board-col' },
        h('div', { class: 'board-col-head' },
          STATUS_LABEL[status],
          h('span', { class: 'count', text: String(inColumn.length) }),
          h('span', { class: 'spacer' }),
          status === 'todo'
            ? h('button', { class: 'btn btn-sm btn-ghost', text: '+', onClick: () => newTask(defaults) })
            : null
        ),
        inColumn.length
          ? h('div', {}, ...inColumn.map((t) => taskRow(t)))
          : h('div', { class: 'empty', text: status === 'done' ? 'Nothing finished yet' : 'Clear' })
      );
    })
  );
}

function pageHead(title, sub, ...actions) {
  return h('div', { class: 'page-head' },
    h('div', {}, h('h1', { class: 'page-title', text: title }), sub ? h('div', { class: 'page-sub', text: sub }) : null),
    h('div', { class: 'row wrap' }, ...actions)
  );
}

function card(title, hint, body, action) {
  return h('div', { class: 'card' },
    h('div', { class: 'card-head' },
      h('div', {},
        h('div', { class: 'card-title', text: title }),
        hint ? h('div', { class: 'card-hint', text: hint }) : null
      ),
      action || null
    ),
    body
  );
}

/* ----------------------------------------------------------------- views --- */

function greeting() {
  const hour = new Date().getHours();
  const name = STATE.settings?.owner && STATE.settings.owner !== 'You' ? `, ${STATE.settings.owner}` : '';
  if (hour < 5) return `Still up${name}?`;
  if (hour < 12) return `Good morning${name}`;
  if (hour < 18) return `Good afternoon${name}`;
  return `Good evening${name}`;
}

function viewToday() {
  const s = STATE.summary;
  const view = document.getElementById('view');

  const focus = sortTasks(STATE.tasks.filter((t) => {
    if (t.status === 'done') return false;
    if (t.status === 'doing') return true;
    const delta = daysFromToday(t.due);
    return delta !== null && delta <= 0;
  }));

  const upcoming = STATE.events
    .filter((e) => new Date(e.starts_at) >= new Date(Date.now() - 3600000))
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
    .slice(0, 6);

  const hustleNet = s.money.this_month.net;
  const longDate = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  view.replaceChildren(
    pageHead(greeting(), longDate,
      h('button', { class: 'btn', text: '+ Event', onClick: () => newEvent() }),
      h('button', { class: 'btn btn-primary', text: '+ Task', onClick: () => newTask() })
    ),

    quickCapture(),

    h('div', { class: 'grid grid-stats', style: { marginTop: '18px' } },
      stat('Open tasks', String(s.tasks.open), `${s.tasks.doing} in progress`),
      stat('Due today', String(s.tasks.due_today), s.tasks.overdue ? `${s.tasks.overdue} overdue` : 'nothing overdue', s.tasks.overdue ? 'neg' : ''),
      stat('Done this week', String(s.tasks.completed_this_week), 'keep it moving'),
      stat('Net this month', money(hustleNet), 'across every area', hustleNet >= 0 ? 'pos' : 'neg')
    ),

    h('div', { class: 'grid grid-2', style: { marginTop: '16px' } },
      card('Focus today', 'In progress, due today, or overdue',
        taskList(focus, { empty: 'Nothing urgent. Nice.' })),
      card('Habits', 'Tap to check off today',
        STATE.habits.length
          ? h('div', {}, ...STATE.habits.map(habitRow))
          : h('div', { class: 'empty', text: 'No habits yet.' }),
        h('button', { class: 'btn btn-sm', text: '+ Habit', onClick: newHabit })
      )
    ),

    h('div', { class: 'grid grid-2', style: { marginTop: '16px' } },
      card('Coming up', 'Next few things on the calendar',
        upcoming.length ? h('div', {}, ...upcoming.map(eventRow)) : h('div', { class: 'empty', text: 'Calendar is clear.' })),
      card('Where things stand', 'Every area at a glance', areaOverview())
    ),

    STATE.goals.length
      ? h('div', { style: { marginTop: '16px' } },
          h('div', { class: 'card-title', style: { marginBottom: '12px' }, text: 'Goals' }),
          h('div', { class: 'grid grid-3' }, ...STATE.goals.map(goalCard)))
      : null
  );
}

function areaOverview() {
  if (!STATE.summary.areas.length) return h('div', { class: 'empty', text: 'No areas yet — add one in Settings.' });
  return h('div', {}, ...STATE.summary.areas.map((area) => h('div', { class: 'task' },
    h('span', { class: 'dot', style: { width: '9px', height: '9px', borderRadius: '50%', background: area.color, marginTop: '7px' } }),
    h('div', { class: 'task-body' },
      h('div', { class: 'task-title', text: area.name }),
      h('div', { class: 'task-meta' },
        h('span', { class: 'pill', text: KINDS[area.kind]?.label || area.kind }),
        h('span', { class: `pill ${area.overdue_tasks ? 'pill-overdue' : ''}`, text: `${area.open_tasks} open` }),
        area.net ? h('span', { class: `pill ${area.net >= 0 ? 'pill-good' : 'pill-overdue'}`, text: money(area.net) }) : null
      )
    )
  )));
}

/** One-line task entry so capturing something takes no clicks. */
function quickCapture() {
  const input = h('input', { type: 'text', placeholder: 'Capture a task and press Enter…' });
  const select = h('select', {}, ...areaOptions().map((o) => h('option', { value: o.value }, o.label)));

  const submit = () => {
    const title = input.value.trim();
    if (!title) return;
    input.value = '';
    commit(() => api.create('tasks', { title, area_id: select.value, status: 'todo', priority: 'medium' }), 'Captured');
  };

  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  return h('div', { class: 'card' },
    h('div', { class: 'capture' }, input, select, h('button', { class: 'btn btn-primary', text: 'Add', onClick: submit }))
  );
}

function viewLane(kind) {
  const view = document.getElementById('view');
  const meta = KINDS[kind];
  const laneAreas = areasOf(kind);
  const tasks = tasksIn(kind);
  const open = tasks.filter((t) => t.status !== 'done');
  const overdue = open.filter((t) => { const d = daysFromToday(t.due); return d !== null && d < 0; });
  const laneGoals = STATE.goals.filter((g) => areaById(g.area_id)?.kind === kind);
  const laneEvents = STATE.events
    .filter((e) => areaById(e.area_id)?.kind === kind && new Date(e.starts_at) >= new Date(Date.now() - 3600000))
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
    .slice(0, 5);

  const laneMoney = STATE.money.filter((m) => areaById(m.area_id)?.kind === kind);
  const income = laneMoney.filter((m) => m.kind === 'income').reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const expense = laneMoney.filter((m) => m.kind === 'expense').reduce((sum, m) => sum + Number(m.amount || 0), 0);

  const defaults = { area_id: laneAreas[0]?.id };

  view.replaceChildren(
    pageHead(meta.label, meta.blurb,
      h('button', { class: 'btn', text: '+ Area', onClick: newArea }),
      kind === 'hustle' ? h('button', { class: 'btn', text: '+ Money', onClick: () => newMoney(defaults) }) : null,
      h('button', { class: 'btn btn-primary', text: '+ Task', onClick: () => newTask(defaults) })
    ),

    h('div', { class: 'grid grid-stats' },
      stat('Open', String(open.length), `${tasks.length} total`),
      stat('Overdue', String(overdue.length), overdue.length ? 'needs a look' : 'all clear', overdue.length ? 'neg' : ''),
      stat('Areas', String(laneAreas.length), laneAreas.map((a) => a.name).join(', ') || 'none yet'),
      kind === 'hustle'
        ? stat('Net earned', money(income - expense), `${money(income)} in · ${money(expense)} out`, income - expense >= 0 ? 'pos' : 'neg')
        : stat('Done', String(tasks.filter((t) => t.status === 'done').length), 'all time')
    ),

    laneAreas.length === 0
      ? h('div', { class: 'card', style: { marginTop: '16px' } },
          h('div', { class: 'empty' }, `No ${meta.label.toLowerCase()} areas yet. Add one to start tracking.`))
      : h('div', { style: { marginTop: '16px' } }, board(tasks, defaults)),

    h('div', { class: 'grid grid-2', style: { marginTop: '16px' } },
      card('Coming up', null,
        laneEvents.length ? h('div', {}, ...laneEvents.map(eventRow)) : h('div', { class: 'empty', text: 'Nothing scheduled.' }),
        h('button', { class: 'btn btn-sm', text: '+ Event', onClick: () => newEvent(defaults) })),
      card('Goals', null,
        laneGoals.length
          ? h('div', { class: 'grid', style: { gap: '12px' } }, ...laneGoals.map(goalCard))
          : h('div', { class: 'empty', text: 'No goals for this part of life yet.' }),
        h('button', { class: 'btn btn-sm', text: '+ Goal', onClick: () => newGoal(defaults) }))
    ),

    kind === 'hustle' && laneMoney.length
      ? h('div', { style: { marginTop: '16px' } }, card('Recent money', 'Newest first', ledgerTable(laneMoney.slice(0, 8))))
      : null
  );
}

function ledgerTable(entries) {
  const sorted = [...entries].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!sorted.length) return h('div', { class: 'empty', text: 'No entries yet.' });

  return h('table', { class: 'ledger' },
    h('thead', {}, h('tr', {},
      h('th', { text: 'Date' }), h('th', { text: 'What' }), h('th', { text: 'Area' }),
      h('th', { class: 'amount', text: 'Amount' }), h('th', {})
    )),
    h('tbody', {}, ...sorted.map((entry) => h('tr', {},
      h('td', { class: 'dim mono', text: entry.date }),
      h('td', { text: entry.label }),
      h('td', {}, areaPill(entry.area_id)),
      h('td', { class: `amount ${entry.kind === 'income' ? 'pos' : 'neg'}`, text: `${entry.kind === 'income' ? '+' : '−'}${money(entry.amount)}` }),
      h('td', { style: { textAlign: 'right' } }, h('button', {
        class: 'btn btn-sm btn-ghost', text: '✕', title: 'Delete entry',
        onClick: () => commit(() => api.remove('money', entry.id), 'Entry removed')
      }))
    )))
  );
}

function viewMoney() {
  const view = document.getElementById('view');
  const s = STATE.summary.money;

  const byArea = areas()
    .map((area) => ({ area, totals: s.by_area[area.id] || { income: 0, expense: 0, net: 0 } }))
    .filter((row) => row.totals.income || row.totals.expense)
    .sort((a, b) => b.totals.net - a.totals.net);

  view.replaceChildren(
    pageHead('Money', 'What the side hustles are actually doing',
      h('button', { class: 'btn', text: '+ Goal', onClick: () => newGoal({ unit: STATE.settings?.currency || '$' }) }),
      h('button', { class: 'btn btn-primary', text: '+ Entry', onClick: () => newMoney() })
    ),

    h('div', { class: 'grid grid-stats' },
      stat('This month in', money(s.this_month.income), 'money in'),
      stat('This month out', money(s.this_month.expense), 'money out'),
      stat('This month net', money(s.this_month.net), 'in minus out', s.this_month.net >= 0 ? 'pos' : 'neg'),
      stat('All time net', money(s.all_time.net), `${money(s.all_time.income)} earned`, s.all_time.net >= 0 ? 'pos' : 'neg')
    ),

    byArea.length
      ? h('div', { class: 'grid grid-3', style: { marginTop: '16px' } },
          ...byArea.map(({ area, totals }) => h('div', { class: 'card' },
            h('div', { class: 'row' },
              h('span', { style: { width: '9px', height: '9px', borderRadius: '50%', background: area.color } }),
              h('div', { class: 'card-title', text: area.name })
            ),
            h('div', { class: `stat-value ${totals.net >= 0 ? 'pos' : 'neg'}`, text: money(totals.net) }),
            h('div', { class: 'stat-foot', text: `${money(totals.income)} in · ${money(totals.expense)} out` })
          )))
      : null,

    h('div', { style: { marginTop: '16px' } }, card('Ledger', 'Everything you have logged', ledgerTable(STATE.money))),

    STATE.goals.length
      ? h('div', { style: { marginTop: '16px' } },
          h('div', { class: 'card-title', style: { marginBottom: '12px' }, text: 'Goals' }),
          h('div', { class: 'grid grid-3' }, ...STATE.goals.map(goalCard)))
      : null
  );
}

function viewHabits() {
  const view = document.getElementById('view');
  const summaries = STATE.summary.habits;
  const doneToday = summaries.filter((s) => s.done_today).length;
  const bestStreak = summaries.reduce((best, s) => Math.max(best, s.best_streak), 0);

  view.replaceChildren(
    pageHead('Habits', 'The small things that compound',
      h('button', { class: 'btn btn-primary', text: '+ Habit', onClick: newHabit })),

    h('div', { class: 'grid grid-stats' },
      stat('Checked off today', `${doneToday}/${STATE.habits.length}`, doneToday === STATE.habits.length && STATE.habits.length ? 'perfect day' : 'still time'),
      stat('Longest streak', `${bestStreak}`, 'days in a row'),
      stat('Tracking', String(STATE.habits.length), 'habits')
    ),

    h('div', { style: { marginTop: '16px' } },
      card('All habits', 'The seven squares are the last seven days',
        STATE.habits.length
          ? h('div', {}, ...STATE.habits.map((habit) => h('div', { class: 'row' },
              h('div', { style: { flex: '1' } }, habitRow(habit)),
              h('button', {
                class: 'btn btn-sm btn-ghost', text: '✕', title: 'Delete habit',
                onClick: () => commit(() => api.remove('habits', habit.id), 'Habit removed')
              })
            )))
          : h('div', { class: 'empty', text: 'No habits yet. Add one and check it off daily.' })
      ))
  );
}

function viewNotes() {
  const view = document.getElementById('view');
  const sorted = [...STATE.notes].sort((a, b) => (Number(b.pinned) - Number(a.pinned)) ||
    String(b.updated_at || b.created_at).localeCompare(String(a.updated_at || a.created_at)));

  view.replaceChildren(
    pageHead('Notes', 'Thinking space, plans, anything worth keeping',
      h('button', { class: 'btn btn-primary', text: '+ Note', onClick: newNote })),

    sorted.length
      ? h('div', { class: 'grid grid-2' }, ...sorted.map((note) => h('div', { class: 'note' },
          h('div', { class: 'row-between' },
            h('div', { class: 'card-title', text: `${note.pinned ? '📌 ' : ''}${note.title}` }),
            h('button', { class: 'btn btn-sm btn-ghost', text: 'Edit', onClick: () => editNote(note) })
          ),
          h('div', { class: 'task-meta', style: { marginTop: '6px' } },
            areaPill(note.area_id),
            h('span', { class: 'pill', text: String(note.updated_at || note.created_at || '').slice(0, 10) })
          ),
          h('div', { class: 'note-body', text: note.body || '' })
        )))
      : h('div', { class: 'card' }, h('div', { class: 'empty', text: 'No notes yet.' }))
  );
}

function viewSettings() {
  const view = document.getElementById('view');
  const nameInput = h('input', { type: 'text', value: STATE.settings?.owner || '' });
  const currencyInput = h('input', { type: 'text', value: STATE.settings?.currency || '$', maxlength: '3' });

  view.replaceChildren(
    pageHead('Settings', 'Your areas, your data, your machine'),

    card('You', null, h('div', { class: 'grid grid-2' },
      h('div', { class: 'field' }, h('label', { text: 'Name' }), nameInput),
      h('div', { class: 'field' }, h('label', { text: 'Currency symbol' }), currencyInput)
    ), h('button', {
      class: 'btn btn-sm btn-primary', text: 'Save',
      onClick: () => commit(
        () => api.send('PATCH', '/api/settings', { owner: nameInput.value, currency: currencyInput.value || '$' }),
        'Saved'
      )
    })),

    h('div', { style: { marginTop: '16px' } },
      card('Areas', 'Buckets that tasks, money and habits belong to',
        areas().length
          ? h('div', {}, ...areas().map((area) => h('div', { class: 'task' },
              h('span', { style: { width: '11px', height: '11px', borderRadius: '50%', background: area.color, marginTop: '6px' } }),
              h('div', { class: 'task-body' },
                h('div', { class: 'task-title', text: area.name }),
                h('div', { class: 'task-meta' }, h('span', { class: 'pill', text: KINDS[area.kind]?.label || area.kind }))
              ),
              h('button', { class: 'btn btn-sm btn-ghost', text: 'Edit', onClick: () => editArea(area) })
            )))
          : h('div', { class: 'empty', text: 'No areas yet.' }),
        h('button', { class: 'btn btn-sm', text: '+ Area', onClick: newArea })
      )),

    h('div', { style: { marginTop: '16px' } },
      card('Your data', 'Nothing leaves this computer',
        h('div', { class: 'muted', style: { fontSize: '13.5px', lineHeight: '1.7' } },
          h('p', { text: 'Everything you enter is stored in life_os/data/life_os.json as plain, readable JSON. Back it up by downloading a copy, or just commit the file somewhere private.' }),
          h('p', { text: 'To restore a backup, stop the server, drop the file back at that path, and start it again. Delete the file entirely to start from a fresh sample dataset.' })
        ),
        h('a', { class: 'btn btn-sm', href: '/api/export', text: '↓ Download backup' })
      ))
  );
}

/* --------------------------------------------------------------- shell ---- */

const ROUTES = {
  today:    { label: 'Today',    glyph: '◉', render: viewToday },
  work:     { label: 'Work',     glyph: '▰', render: () => viewLane('work') },
  hustle:   { label: 'Hustles',  glyph: '◈', render: () => viewLane('hustle') },
  personal: { label: 'Personal', glyph: '❤', render: () => viewLane('personal') },
  money:    { label: 'Money',    glyph: '＄', render: viewMoney },
  habits:   { label: 'Habits',   glyph: '✓', render: viewHabits },
  notes:    { label: 'Notes',    glyph: '✎', render: viewNotes },
  settings: { label: 'Settings', glyph: '⚙', render: viewSettings }
};

function navButton(key, meta, count) {
  return h('button', {
    class: `nav-item ${ROUTE === key ? 'active' : ''}`,
    onClick: () => { location.hash = key; }
  },
    h('span', { class: 'glyph', text: meta.glyph }),
    h('span', { text: meta.label }),
    count ? h('span', { class: 'count', text: String(count) }) : null
  );
}

function renderNav() {
  const nav = document.getElementById('nav');
  const openIn = (kind) => tasksIn(kind).filter((t) => t.status !== 'done').length;

  nav.replaceChildren(
    navButton('today', ROUTES.today, STATE.summary.tasks.due_today + STATE.summary.tasks.overdue),
    h('div', { class: 'nav-label', text: 'Life' }),
    navButton('work', ROUTES.work, openIn('work')),
    navButton('hustle', ROUTES.hustle, openIn('hustle')),
    navButton('personal', ROUTES.personal, openIn('personal')),
    h('div', { class: 'nav-label', text: 'Systems' }),
    navButton('money', ROUTES.money),
    navButton('habits', ROUTES.habits),
    navButton('notes', ROUTES.notes),
    navButton('settings', ROUTES.settings)
  );

  const owner = STATE.settings?.owner;
  document.getElementById('brand-sub').textContent = owner && owner !== 'You' ? owner : 'localhost';
}

function render() {
  if (!STATE) return;
  renderNav();
  (ROUTES[ROUTE] || ROUTES.today).render();
  window.scrollTo({ top: 0 });
}

function applyRoute() {
  const key = location.hash.replace('#', '');
  ROUTE = ROUTES[key] ? key : 'today';
  render();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('life-os-theme', theme); } catch (_) { /* private mode */ }
}

async function boot() {
  try { applyTheme(localStorage.getItem('life-os-theme') || 'dark'); } catch (_) { /* ignore */ }

  document.getElementById('theme-toggle').addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  window.addEventListener('hashchange', applyRoute);

  // "n" for a new task, as long as you are not typing into something.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'n' || e.metaKey || e.ctrlKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) return;
    if (document.querySelector('.modal')) return;
    e.preventDefault();
    newTask();
  });

  try {
    STATE = await api.state();
  } catch (err) {
    document.getElementById('view').replaceChildren(
      h('div', { class: 'card' }, h('div', { class: 'empty', text: `Could not reach the server: ${err.message}` }))
    );
    return;
  }
  applyRoute();
}

boot();
