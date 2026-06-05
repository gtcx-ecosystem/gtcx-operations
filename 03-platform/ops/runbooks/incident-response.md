---
id: RUNBOOK-001
title: "Incident Response"
version: "1.0"
effective_date: "2026-05-17"
owner: "ops@gtcx.trade"
trigger: "Production outage, security breach, or data loss"
severity_levels:
  - p1-critical: "Complete service outage, data breach"
  - p2-high: "Major feature degraded, partial outage"
  - p3-medium: "Minor issue with workaround"
  - p4-low: "Cosmetic or non-urgent"
---

# Incident Response Runbook

## 1. Detect

- Alert fires or user reports issue
- Confirm impact scope (affected users, services, regions)
- Classify severity (P1-P4)

## 2. Respond

| Severity | Response Time | Channel |
|----------|--------------|---------|
| P1 | 15 min | #incidents-critical |
| P2 | 30 min | #incidents-high |
| P3 | 2 hours | #incidents |
| P4 | 24 hours | #incidents |

## 3. Mitigate

- Apply immediate fix or rollback
- Document actions taken in incident log
- Notify stakeholders if user-facing

## 4. Resolve

- Verify service recovery
- Update status page
- Schedule post-mortem within 48 hours for P1/P2

## 5. Learn

- Write post-mortem: timeline, root cause, remediation
- Update runbooks if process gaps found
- Close incident when post-mortem approved

## Escalation

- P1: Auto-page on-call + notify leadership
- P2: Notify team lead + post in #incidents
- P3/P4: Create ticket, assign to owner

## Contacts

- On-call: oncall@gtcx.trade
- Security: security@gtcx.trade
- Leadership: founders@gtcx.trade
