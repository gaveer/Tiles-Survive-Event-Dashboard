# Task System Architecture

## Data Flow

rawData (tasks.json)
→ buildTaskMap()
→ classifyTasks()
→ getTaskState()   ← CORE ENGINE
→ render (lists)
→ timers (hunter)
→ intervals (refresh)

## Key Rules

* `d` (day) is static from JSON
* `utc` is source of time truth
* ALL scheduling depends on getTaskState()

## State Engine

getTaskState(task):

* Converts (day + time) → Date
* Determines ACTIVE / UPCOMING
* Drives ordering

## Secondary Systems

* updateTodayPanel → independent logic (today-only)
* Prep system → reads getTaskState()
* Timers → read getTaskState()

## Known Critical Point

⚠ Week alignment logic in getTaskState()
→ previously caused Thu/Fri glitch

## Rendering Order

status → priority → time
