# Life OS

A personal dashboard for the three things that actually take up your week: **work**,
**side hustles**, and **the rest of your life**. It runs on your own machine, at
`http://localhost:4567`, and stores everything in a single readable JSON file that
never leaves your computer.

No gems. No `bundle install`. No database. No build step. Just Ruby.

```sh
ruby life_os/server.rb
```

That's it — it opens your browser for you.

## What's in it

| Screen | What it's for |
| --- | --- |
| **Today** | The one screen to open in the morning: what's due, what's in progress, habits to check off, what's on the calendar, and where every area stands. |
| **Work** | A to-do / in-progress / done board for the job, plus upcoming meetings and work goals. |
| **Hustles** | The same board for the things you're building, with what each one has actually earned. |
| **Personal** | Health, home, family — everything that isn't a job. |
| **Money** | Income and expenses per hustle, monthly and all-time net, and progress against money goals. |
| **Habits** | Daily check-offs with streaks and a seven-day trail. |
| **Notes** | Plans, pipelines, thinking space. Pin the ones that matter. |
| **Settings** | Your areas, your name, your currency, your backup. |

## Concepts

There are only two ideas to learn.

**Areas** are the buckets your life divides into — "Day Job", "Consulting", "Online
Store", "Health". Each area belongs to one of three parts of life: `work`, `hustle`,
or `personal`. That's what drives the three main screens, so adding a new side hustle
is just adding an area.

**Everything else hangs off an area**: tasks, money entries, habits, events, goals and
notes. Delete an area and its contents survive as unassigned — your data is never
thrown away as a side effect.

## Day-to-day

- Type into the capture box on **Today** and press Enter to add a task in one move.
- Press <kbd>n</kbd> anywhere to open the new-task form.
- Click a task's circle to cycle it: to do → in progress → done → to do.
- Click a habit's box to check it off. Click again to undo.
- Click a goal card to update where you are.

## Options

```sh
ruby life_os/server.rb --port 8080   # run somewhere else
ruby life_os/server.rb --no-open     # don't launch a browser
LIFE_OS_PORT=9000 ruby life_os/server.rb
```

## Your data

Everything lives in `life_os/data/life_os.json` — plain JSON you can read, grep, edit
in a text editor, or keep in a private repo. It's gitignored here so your life doesn't
end up in a pull request.

- **Back up:** the ↓ Backup link in the sidebar, or just copy the file.
- **Restore:** stop the server, put the file back, start it again.
- **Start fresh:** delete the file. The next boot writes a new sample dataset so nothing
  is ever a blank page.

The server binds to `127.0.0.1` only, so it isn't reachable from anywhere else on your
network. There are no accounts and no telemetry, because there's nobody else to talk to.

## Tests

```sh
ruby life_os/test/test_life_os.rb
```

Uses minitest from the standard library. Covers the store, the streak and money maths,
and every API route — including that path traversal stays blocked and unknown fields
get dropped.

## How it fits together

```
life_os/
├── server.rb          entry point: options, wiring, the startup banner
├── lib/
│   ├── http.rb        a small HTTP/1.1 server on TCPSocket (Ruby 3.3 dropped webrick)
│   ├── app.rb         routing: static files + the JSON API, with a field allowlist
│   ├── store.rb       the JSON file store — atomic writes, one mutex
│   ├── insights.rb    streaks, money roll-ups, task pressure (pure functions)
│   └── seed.rb        the sample dataset written on first boot
├── public/            index.html + app.js + style.css, no framework
└── test/              minitest
```

The API is a plain REST surface over the collections — `GET /api/state` returns
everything plus computed summaries, and `POST/PATCH/DELETE /api/<collection>[/<id>]`
does the rest. Two endpoints exist because they're toggles rather than edits:
`POST /api/tasks/:id/toggle` and `POST /api/habits/:id/check`.
