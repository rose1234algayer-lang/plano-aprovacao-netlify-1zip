---
name: Preview runtime
description: Environment-specific constraint affecting the imported project's generated web preview workflow.
---

The current Replit runtime does not provide a `python3` executable, so a workflow generated with `python3 -m http.server` cannot start.

**Why:** The imported project includes a Node/Express server and the generated Python workflow fails before opening its configured web port.

**How to apply:** If preview setup is requested, use the project's existing Node server and configure it to serve on the workflow's required web port rather than relying on the generated Python command.