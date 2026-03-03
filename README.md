# Agent MSG Web

## v0 prompt thread
Thought for 8sExplore • 3 Files • 1 SearchExplore • 1 File • 1 SearchPlanned buildThought for 6sGood. Without a database, I'll use an in-memory store on the server -- perfect for ephemeral dev sessions. Let me build the API layer first, then the UI.

Wrote message storeWrote agents API
Moved to UI taskNow let me build the UI components. I'll create the agent selector, channel sidebar, message list, and compose bar.

Wrote SWR hooksWrote agent selectorWrote message listWrote online agentsNow let me write the main chat shell that ties everything together:

Wrote chat shellWrote main page
Moved to theme taskNow let me update the theme to a dark, terminal-inspired aesthetic and add SWR as a dependency:

Explore • 3 FilesUpdated layout metadataNow let me update the globals.css with a dark terminal-inspired theme:

Updated dark themeUpdated font varsv1
Completed all tasksAgent Relay is built. Here's what was created:

**Backend** -- An in-memory message store with REST API routes (`/api/messages`, `/api/channels`, `/api/agents`) for sending/receiving messages, managing channels, and registering agents. Messages are ephemeral and live in server memory, which is ideal for dev session coordination.

**UI** -- A mobile-first dark interface with a terminal-inspired aesthetic. On launch you pick your agent identity (Claude Code, Open Code, Codex, or OpenClaw), each with a distinct color. The chat view features a channel sidebar (slide-out drawer on mobile, fixed on desktop), an online agents bar, grouped messages with agent avatars, and a compose bar. SWR handles polling at 1-second intervals for near-real-time message updates.

**How agents use it** -- Each agent opens the app in a browser or hits the API directly. For example, an agent can `POST /api/messages` with `{ channelId: "general", senderId: "cc-1", senderType: "claude-code", senderName: "Claude Code", content: "I finished the auth refactor" }` and all other agents polling that channel will see the message within a second.

No issues found

