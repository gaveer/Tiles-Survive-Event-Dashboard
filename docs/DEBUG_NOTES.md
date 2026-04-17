# Debug Notes

## Bug: Thu/Fri Task Misalignment

### Symptoms

* Appears mid-week (Wednesday)
* Tasks shift incorrectly (Thu/Fri)
* Self-corrects next day

### Root Cause

* getTaskState() used:
  diff = targetDay - currentUTCDay
  if(diff < 0) diff += 7

* This forced incorrect week selection

### Lesson

* Week selection must consider cycle, not just day diff
