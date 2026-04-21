---
author: Gökhan Namal
pubDatetime: 2026-04-02T09:00:00-08:00
title: How to build a shared AI context for your engineering team
featured: false
draft: false
tags:
  - engineering
  - ai
  - tooling
description: "Stop rebuilding context from scratch every session. Build a shared AI library your team installs once, improves together, and reuses across every repo."
---

An iOS engineer opens a new repo. Before writing a single line of code, they open Claude and start typing.

"We use SwiftUI. We follow MVVM with the Observation framework. Our PR process requires a changelog entry, a screenshot for UI changes, and a reviewer from the team. Our CI runs on Buildkite and takes about 12 minutes..."

They've typed this before. Yesterday, in a different repo. Somewhere across the org, a backend engineer is doing the same thing with a different stack. Each one rebuilding context from scratch, every session, for every repo.

---

## The problem: every session starts from zero

Consider the same task done twice. Two engineers at the same company both ask Claude to review a pull request. The first gets generic feedback: the code looks correct, consider adding tests, the naming is reasonable. The second gets something different: Claude checks their SwiftUI conventions, flags a missing `accessibilityLabel` their design system requires, notes the PR is missing a changelog entry their release process mandates, and catches a memory management pattern their team learned the hard way six months ago.

Same model. Same company. Same task. The only difference is that one engineer has shared context loaded.

The second engineer has a `/pr-review` skill installed: a markdown file that encodes exactly what a good PR looks like at their company. Not generic code review knowledge. Their code review knowledge.

The fix is not more prompting discipline. It is shared infrastructure: context your team builds once, installs anywhere, and improves over time. Engineers publish skills publicly too. [Dimillian's skill library](https://github.com/dimillian/skills) is one example: high-quality SwiftUI and iOS skills any team can install and adapt.

---

## What you can actually share

**Skills** are reusable procedures invoked as slash commands: `/pr-review`, `/deploy-staging`, `/incident-response`. A skill loads and the AI has what it needs to act on your conventions instead of generic ones. Any repeated task is a candidate: ADRs, post-mortems, security checklists, feature scaffolding. Skills can embed existing runbooks, so your incident runbook becomes the incident skill rather than something engineers have to find separately.

**Hooks** are automated behaviors triggered by events. Run a linter after every file edit. Validate commit message format before every commit. Enforce patterns without asking anyone to remember.

---

## Three ways to share context

The simplest option is a shared `CLAUDE.md` or `AGENTS.md` file: one document with your conventions, committed to a shared repo. It works across any AI coding tool and requires nothing beyond a text file.

It breaks down fast. [OpenAI's engineering team tried this](https://openai.com/index/harness-engineering/) and documented the failure modes: context is a scarce resource, and a giant instruction file crowds out the task, the code, and the relevant docs. Too much guidance becomes non-guidance. When everything is "important," nothing is. The file rots instantly, humans stop maintaining it, and agents can't tell what's still true.

The second option is a script-based approach like [skills.sh](https://skills.sh): a tool that installs skills into your local Claude setup without a Git-backed marketplace. It works well for individuals or small teams who want to share a set of skills without committing to a repository structure. The tradeoff is that updates are manual and there is no per-domain organization.

The third option is a marketplace with plugins: a Git repository that organizes skills by domain, installs globally, and updates automatically. The iOS team gets iOS skills, the backend team gets backend skills, everyone gets the shared ones. The rest of this article covers how to set this up.

---

## How to build a company marketplace

One Git repository becomes the company's shared AI library.

```
acme-corp/claude-marketplace
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    ├── shared/                # Company-wide skills
    │   ├── .claude-plugin/plugin.json
    │   └── skills/
    │       ├── pr-review/SKILL.md
    │       └── incident/SKILL.md
    ├── ios/
    ├── android/
    ├── backend/
    └── design-system/
```

The `marketplace.json` at the root is the catalog:

```json
{
  "name": "acme-tools",
  "owner": { "name": "Acme DevTools Team", "email": "devtools@acme.com" },
  "metadata": { "pluginRoot": "./plugins" },
  "plugins": [
    {
      "name": "shared",
      "source": "./shared",
      "description": "Company-wide skills"
    },
    {
      "name": "ios",
      "source": "./ios",
      "description": "iOS engineering skills"
    },
    {
      "name": "android",
      "source": "./android",
      "description": "Android engineering skills"
    },
    {
      "name": "backend",
      "source": "./backend",
      "description": "Backend engineering skills"
    }
  ]
}
```

Each plugin is independently installable. An iOS engineer installs `shared` and `ios`. A new joiner installs both relevant plugins and immediately has an AI that knows how their org does engineering.

### Auto-setup for new joiners

Add this to `.claude/settings.json` in any shared org repo:

```json
{
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": { "source": "github", "repo": "acme-corp/claude-marketplace" }
    }
  },
  "enabledPlugins": {
    "shared@acme-tools": true
  }
}
```

New joiners clone the repo, get prompted to install the marketplace, pick their domain plugins, and have skills available across every repo they work in.

### Pushing plugins to everyone (enterprise)

For enterprise teams, there is a way to skip the self-install step entirely. In the Claude.ai admin console, navigate to **Admin Settings > Claude Code > Managed settings**. Adding plugins here pushes them to every user automatically. When engineers authenticate with org credentials, the plugins are already there and cannot be overridden or uninstalled by individual users.

```json
{
  "enabledPlugins": {
    "shared@acme-tools": true,
    "ios@acme-tools": true
  }
}
```

Use this for anything the org considers non-negotiable: security checklists, incident response, compliance requirements.

### Keeping skills up to date automatically

A hook handles updates: pull the latest from the marketplace repo before each session, so every engineer picks up changes without a manual step.

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git -C ~/acme-claude-marketplace pull --quiet 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

Add this to `~/.claude/settings.json`. When someone improves the `/incident-response` skill or tightens the iOS checklist, every engineer gets it on their next prompt. The `|| true` keeps it silent if the network is unavailable.

---

## Maintaining the library

A simple rule: if you explain something to Claude twice, it belongs in a skill.

An engineer debugging a flaky test explains the team's specific retry helper and why the standard approach breaks on their CI. Two weeks later, a different engineer hits the same issue and types the same explanation from scratch. That is when someone opens a PR to the marketplace repo. Now no one on the team types it again.

The capture moment happens mid-session: the engineer corrects the AI ("no, do it like this instead") or confirms something worked ("yes, exactly that"). The habit is to notice those moments and open a PR before the session ends. Treat it like a doc that got out of date: someone notices, someone fixes it, everyone benefits.

---

## Where to start

Pick the task your team explains to AI tools most often. PR review is a common first choice: everyone does it and the conventions are specific to your team. Write the skill, get two or three engineers to use it for a week, and see what is missing.

A working example marketplace is available at [github.com/gokhanamal/claude-marketplace-template](https://github.com/gokhanamal/claude-marketplace-template) with the structure above, a shared plugin, and a starter iOS plugin. Fork it, rename the plugins for your org, and add your first skill. The next time an engineer opens a new repo, they will not have to type any of it again.
