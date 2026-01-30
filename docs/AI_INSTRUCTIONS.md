# 🤖 Instructions for Working with AI Assistants

This document provides instructions for developers (you!) on how to effectively work with AI assistants like GitHub Copilot Chat when the conversation context has been cleared.

---

## 📋 Starting a Fresh Conversation

When you start a new conversation with an AI assistant after context has been cleared, use this **exact prompt**:

```
Hi! I'm working on the Lupad project, a ride-hailing app for Calbayog City, Philippines.

Please read and understand these files in order:
1. README.md - Project overview and setup
2. PROGRESS.md - Current development status
3. ROADMAP.md - Project timeline and phases
4. ARCHITECTURE.md - Technical architecture
5. DECISIONS.md - Key decisions made

After reviewing, please:
- Summarize what phase we're currently in
- Identify what was last worked on
- Confirm you understand the tech stack
- Note: Follow the "Feature-First Development Approach" documented below

Then help me with: [describe your specific task]
```

**Why this works:**

- Gives AI complete context of project state
- Helps AI understand what's been done vs. what's planned
- Gets AI oriented before starting work
- Ensures consistent understanding across sessions

---

## 🔄 Before Ending a Session

Before you finish a work session, ask the AI to help you update documentation:

```
Before we end this session, please help me:

1. Update PROGRESS.md:
   - Mark completed items
   - Update "Currently Working On"
   - Add any blockers encountered
   - Update "Last Updated" date

2. Update DECISIONS.md if we made any new technical decisions

3. Update README.md if we added new setup steps or dependencies

4. Create a brief session summary I can reference later
```

---

## 📝 Session Summary Template

Ask the AI to generate a session summary using this format:

```markdown
## Session Summary - [Date]

### Accomplished

- [What was completed]
- [What was completed]

### Current State

- [Brief description of project state]
- [What's working, what's not]

### Files Modified

- [List of files changed]

### Next Session Should

1. [Immediate next task]
2. [Following task]
3. [Task after that]

### Issues/Blockers

- [Any issues encountered]

### Notes

- [Any important notes to remember]
```

**Save this summary** in a `SESSIONS.md` file or in your notes.

---

## 🎯 Tips for Effective AI Collaboration

### 1. Be Specific About Context

Instead of:

> "Fix the login bug"

Say:

> "In apps/customer/src/screens/LoginScreen.tsx, the JWT token is not being saved to SecureStore after successful login. Check the handleLogin function."

### 2. Reference Documentation

> "According to ARCHITECTURE.md, we're using JWT authentication. Can you implement the token refresh logic?"

### 3. Ask for Multi-Step Plans

> "I need to implement ride booking. Can you create a task breakdown based on what's in ROADMAP.md for Week 5-6?"

### 4. Request Documentation Updates

> "After implementing this feature, please update ARCHITECTURE.md with how the ride matching algorithm works."

### 5. Validate Against Roadmap

> "Does this implementation align with what's planned in ROADMAP.md Phase 1?"

---

## 🔍 Common Questions to Ask AI

### Understanding Project State

- "What phase of development are we in according to PROGRESS.md?"
- "What are the immediate next steps from PROGRESS.md?"
- "Are there any blockers listed in PROGRESS.md?"

### Architecture Questions

- "According to ARCHITECTURE.md, how should I implement [feature]?"
- "What's our authentication strategy from ARCHITECTURE.md?"
- "Show me the database schema from ARCHITECTURE.md"

### Decision Context

- "Why did we choose [technology] according to DECISIONS.md?"
- "What alternatives were considered for [component]?"

### Next Steps

- "Based on ROADMAP.md, what should I work on after completing [current task]?"
- "What's the timeline for [feature] in ROADMAP.md?"

---

## 📚 Documentation Maintenance

### Update Frequency

**PROGRESS.md:**

- Update: Daily or after each work session
- Mark completed items immediately
- Update current status

**DECISIONS.md:**

- Update: When making any architectural or technical decision
- Add rationale and alternatives considered

**ARCHITECTURE.md:**

- Update: When implementing new system components
- When changing technical approach

**README.md:**

- Update: When adding new dependencies
- When setup process changes
- When adding new npm scripts

**ROADMAP.md:**

- Update: When timeline changes
- When adding/removing features
- When completing major milestones

---

## 🚀 Example Workflow

Here's a typical workflow with AI assistance:

### 1. Start of Day

```
Hi! Please check PROGRESS.md and tell me what I should work on today.
Also check if there are any blockers listed.
```

### 2. Starting a New Feature

```
I'm going to implement [feature]. According to ROADMAP.md, this is part of Week [X].

Please:
1. Check ARCHITECTURE.md for relevant design decisions
2. Create a task breakdown
3. Identify what files I'll need to create/modify
```

### 3. During Implementation

```
I'm implementing [specific component]. Can you:
1. Review this code for issues
2. Ensure it follows patterns from ARCHITECTURE.md
3. Check if we need to make any decisions for DECISIONS.md
```

### 4. After Completing Feature

```
I've completed [feature]. Please help me:
1. Update PROGRESS.md to mark it complete
2. Update ARCHITECTURE.md with implementation details
3. Identify what to work on next from ROADMAP.md
```

### 5. End of Day

```
Let's wrap up. Please:
1. Update PROGRESS.md with today's work
2. Create a session summary
3. Identify top 3 priorities for tomorrow
```

---

## 🐛 Debugging with AI

When asking for help with bugs:

```
I'm encountering [error] in [file].

Context:
- What I'm trying to do: [description]
- What's happening: [actual behavior]
- What should happen: [expected behavior]
- Relevant architecture: [reference ARCHITECTURE.md section]

Can you help identify the issue?
```

---

## 📦 When Adding Dependencies

Always ask AI to document new dependencies:

```
I want to add [package name] for [purpose].

Please:
1. Check if this aligns with our tech stack in ARCHITECTURE.md
2. Verify it doesn't conflict with existing decisions in DECISIONS.md
3. Update README.md with installation instructions
4. Add a decision entry to DECISIONS.md if it's a significant choice
```

---

## 🎓 Learning from Documentation

The documentation files serve as:

- **README.md** - Your quick reference guide
- **PROGRESS.md** - Your daily todo list and progress tracker
- **ROADMAP.md** - Your big-picture timeline
- **ARCHITECTURE.md** - Your technical encyclopedia
- **DECISIONS.md** - Your "why we did it this way" history book

Always read these before asking AI questions!

---

## ⚠️ Important Reminders

1. **Update PROGRESS.md frequently** - It's your source of truth
2. **Document decisions immediately** - Don't rely on memory
3. **Keep README.md updated** - Future you will thank present you
4. **Reference docs in conversations** - Helps AI give better answers
5. **Create session summaries** - Makes resuming work easier

---

## 🔗 Quick Reference

**Starting fresh conversation:**
→ Use the prompt at the top of this file

**Need to understand current state:**
→ Read PROGRESS.md first, then ask AI

**Making a technical decision:**
→ Document in DECISIONS.md with rationale

**Completed a feature:**
→ Update PROGRESS.md immediately

**Added new dependency:**
→ Update README.md and possibly ARCHITECTURE.md

**Changed architecture:**
→ Update ARCHITECTURE.md

**End of session:**
→ Update docs and create session summary

---

## 🏗️ Feature-First Development Approach

**IMPORTANT:** When planning and implementing features, follow a feature-centered approach rather than setting up all infrastructure upfront.

### Principles

1. **Build feature by feature, end-to-end**
   - Complete one feature before moving to the next
   - Each feature should be testable on its own
   - Avoid setting up infrastructure "just in case"

2. **Install dependencies only when needed**
   - Don't install packages until the feature requires them
   - This keeps the project lean and avoids unused dependencies
   - Makes it easier to track what each dependency is used for

3. **Backend + Frontend together**
   - Build the backend API endpoints and frontend screens for a feature in the same work session
   - This ensures the API design matches what the UI actually needs
   - Easier to iterate when both sides are developed together

4. **Design for extensibility**
   - Even though we build incrementally, keep code modular and extensible
   - Follow established patterns so new features fit naturally
   - Don't over-engineer, but don't paint yourself into a corner either

### Example: Building the Auth Feature

**Instead of:**
1. Install all 15 dependencies for the entire app
2. Set up all navigation screens (empty)
3. Create all API endpoints (unused)
4. Then build features one by one

**Do this:**
1. Identify what the Auth feature needs (expo-router, zustand, axios, expo-secure-store)
2. Install only those dependencies
3. Build splash screen → onboarding → registration → OTP → nickname (complete flow)
4. Connect to backend auth APIs
5. Test the complete auth flow
6. Move to next feature

### Benefits

- **Easier to follow**: Work in logical chunks, not scattered setup tasks
- **Faster feedback**: See working features sooner
- **Less waste**: Don't build things you might not need
- **Better context**: Backend and frontend developers (or AI) understand the full feature
- **Simpler debugging**: When something breaks, you know which feature caused it

### When Planning with AI

When asking AI to plan implementation:

```
I want to build the [feature name] feature.

Please:
1. Identify ONLY the dependencies needed for this feature
2. Plan the backend endpoints required
3. Plan the frontend screens required
4. Create a task list that builds the feature end-to-end
5. Keep the implementation extensible for future features
```

### Feature Checklist

For each feature, ensure:
- [ ] Only required dependencies are installed
- [ ] Backend endpoints are created and tested
- [ ] Frontend screens are created and connected
- [ ] Feature works end-to-end
- [ ] Code follows established patterns
- [ ] Documentation is updated (PROGRESS.md)

---

**Last Updated:** January 30, 2026

**Tip:** Bookmark this file in your browser/editor for quick access! 🔖
