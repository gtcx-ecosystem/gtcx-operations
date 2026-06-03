#!/usr/bin/env node
/**
 * Protocol 22 — deterministic next-work selection for gtcx-operations.
 * Reads docs/strategy/execution-roadmap.md; emits JSON to stdout.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const ROADMAP_PATH = join(REPO_ROOT, 'docs/strategy/execution-roadmap.md');

/** Tier 2 handoffs — cross-repo / pilot blockers. */
const HANDOFF_STORY_ORDER = [
  { handoffId: 'H-CLICKUP', storyId: 'OPS-02' },
  { handoffId: 'H-GW', storyId: 'OPS-03' },
  { handoffId: 'H-CI', storyId: 'OPS-06' },
  { handoffId: 'H-INF86', storyId: 'OPS-01' },
  { handoffId: 'H-P22', storyId: 'OPS-04' },
];

const EVIDENCE_RE = /\b(UAT-|VIS-|VoiceOver|manual sign-off|evidence capture only)\b/i;
const OPS_DOCS_RE = /\b(Author `docs\/|runbook|manifest|pointer doc)\b/i;
const EXTERNAL_RE = /\b(SOC 2 CPA|pen-test vendor|CPA review|Legal sign-off)\b/i;

function parsePriority(p) {
  const n = Number.parseInt(String(p).replace(/\D/g, ''), 10);
  return Number.isFinite(n) ? n : 9;
}

function storyOrdinal(storyId) {
  const m = /^OPS-(\d+)/.exec(storyId);
  return m ? Number.parseInt(m[1], 10) : 999;
}

function classifyStory(title) {
  if (EXTERNAL_RE.test(title)) return 'external';
  if (EVIDENCE_RE.test(title)) return 'evidence-capture';
  if (OPS_DOCS_RE.test(title)) return 'ops-docs';
  return 'code';
}

function parseActivePhase(md) {
  const m = md.match(/## Active phase:\s*\*\*P(\d+)/i);
  return m ? Number.parseInt(m[1], 10) : 1;
}

function phaseOpsRange(phase) {
  if (phase === 1) return { min: 1, max: 7 };
  if (phase === 2) return { min: 8, max: 12 };
  if (phase === 3) return { min: 13, max: 99 };
  return { min: 1, max: 99 };
}

function upsertStory(stories, row) {
  stories.set(row.id, row);
}

function parseStories(md) {
  const stories = new Map();

  const rowFull =
    /^\| (OPS-\d+) \| ([^|]+) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| (P\d) \| (pending|in_progress|blocked|done|deferred|partial) \|/gim;
  let match;
  while ((match = rowFull.exec(md)) !== null) {
    const [, id, title, feature, , , priority, status] = match;
    const key = id.trim();
    upsertStory(stories, {
      id: key,
      title: title.trim(),
      feature: feature.trim(),
      priority: priority.trim(),
      status: status.trim() === 'partial' ? 'pending' : status.trim(),
      implementationClass: classifyStory(title.trim()),
      ordinal: storyOrdinal(key),
    });
  }

  return stories;
}

function isAutomatable(story, frame) {
  if (story.status === 'blocked' || story.status === 'done' || story.status === 'deferred') {
    return false;
  }
  if (frame === 'development') {
    return story.implementationClass === 'code' || story.implementationClass === 'ops-docs';
  }
  return true;
}

function compareStories(a, b) {
  const pa = parsePriority(a.priority);
  const pb = parsePriority(b.priority);
  if (pa !== pb) return pa - pb;
  return a.ordinal - b.ordinal;
}

function selectNext(stories, options) {
  const { activePhase, frame } = options;
  const range = phaseOpsRange(activePhase);

  const inProgress = [...stories.values()]
    .filter((s) => s.status === 'in_progress')
    .sort(compareStories);
  if (inProgress.length > 0) {
    return { story: inProgress[0], tier: 'resume-in_progress', reason: 'Story already in_progress' };
  }

  for (const entry of HANDOFF_STORY_ORDER) {
    const story = stories.get(entry.storyId);
    if (!story || !isAutomatable(story, frame)) continue;
    if (story.status === 'pending' || story.status === 'in_progress') {
      return {
        story,
        tier: 'handoff',
        handoffId: entry.handoffId,
        reason: `Pilot handoff ${entry.handoffId} → ${entry.storyId}`,
      };
    }
  }

  const phaseCandidates = [...stories.values()]
    .filter(
      (s) =>
        s.status === 'pending' &&
        s.ordinal >= range.min &&
        s.ordinal <= range.max &&
        isAutomatable(s, frame),
    )
    .sort(compareStories);
  if (phaseCandidates.length > 0) {
    return {
      story: phaseCandidates[0],
      tier: 'active-phase',
      reason: `Active phase P${activePhase} automatable backlog (OPS-${String(range.min).padStart(2, '0')}–${String(range.max).padStart(2, '0')})`,
    };
  }

  const p0Outside = [...stories.values()]
    .filter(
      (s) =>
        s.status === 'pending' &&
        s.priority === 'P0' &&
        isAutomatable(s, frame) &&
        (s.ordinal < range.min || s.ordinal > range.max),
    )
    .sort(compareStories);
  if (p0Outside.length > 0) {
    return {
      story: p0Outside[0],
      tier: 'p0-outside-phase',
      reason: 'P0 story outside active phase',
    };
  }

  const remainder = [...stories.values()]
    .filter((s) => s.status === 'pending' && isAutomatable(s, frame))
    .sort(compareStories);
  if (remainder.length > 0) {
    return { story: remainder[0], tier: 'backlog', reason: 'Remaining automatable backlog' };
  }

  return null;
}

function main() {
  const frame = process.env.AGENT_FRAME === 'regulatory-audit' ? 'regulatory-audit' : 'development';
  const md = readFileSync(ROADMAP_PATH, 'utf8');
  const stories = parseStories(md);
  const activePhase = parseActivePhase(md);
  const selection = selectNext(stories, { activePhase, frame });

  if (!selection) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          backlogClear: true,
          activePhase,
          frame,
          message: 'No automatable pending or in_progress stories for current frame.',
          protocol: '22-agent-work-selection',
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  const { story, tier, reason, handoffId } = selection;
  console.log(
    JSON.stringify(
      {
        ok: true,
        backlogClear: false,
        protocol: '22-agent-work-selection',
        activePhase: `P${activePhase}`,
        frame,
        next: {
          storyId: story.id,
          title: story.title,
          priority: story.priority,
          status: story.status,
          implementationClass: story.implementationClass,
          feature: story.feature,
        },
        selection: { tier, handoffId: handoffId ?? null, reason },
        agentInstructions: [
          `Mark ${story.id} in_progress in docs/strategy/execution-roadmap.md before coding.`,
          'Update docs/audit/auto-dev-state.md after completion.',
          'Do not ask the user which story to pick.',
        ],
      },
      null,
      2,
    ),
  );
}

main();
