---
trigger: always_on
---

Project rules — EDIT-FIRST (NO SHELL WRITES)

1. NEVER write/modify files via terminal commands.
   - Forbidden: cat, tee, echo >, >>, heredoc (<<EOF), sed -i, powershell Set-Content/Add-Content.
2. When code/tests need changes, respond ONLY with a git-style unified diff patch (diff --git ...).
   - Include full new files in the patch.
3. Only use terminal commands to RUN the project (bench start) after code changes are applied.
4. Assume the terminal is PowerShell unless told otherwise; therefore NEVER output bash-only syntax.

Run steps (commands) — only when asked to run

- Never as root, never sudo
- su sab (interactive only; no -c)
- cd
- source env14/bin/activate
- cd f16/
- bench start
