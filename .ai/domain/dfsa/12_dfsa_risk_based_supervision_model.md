# DFSA Risk Based Supervision Model

This document outlines the principles of DFSA’s supervisory approach and provides guidance for building supervision features and agent logic.

## 1. Supervisory Principles
DFSA applies supervision proportionately based on the risk profile of each entity. Higher risk firms receive more frequent or detailed oversight. Lower risk firms receive lighter touch supervision.

## 2. Risk Categories
Supervision commonly considers:
- Business model risk
- Prudential risk
- Conduct risk
- Operational risk
- Governance quality
- AML and CTF risk
- Market impact

## 3. Risk Assessment Process
1. Firm submits periodic filings.
2. DFSA reviews risk indicators.
3. DFSA assigns or updates a risk rating.
4. Supervisory actions are determined based on the rating.
5. Follow ups are issued where required.

## 4. Supervisory Tools
- Periodic reporting
- Thematic reviews
- Onsite inspections
- Desk based reviews
- Information requests
- Meetings with senior management

## 5. Application Guidelines
The application must:
- Avoid interpreting or predicting risk ratings.
- Only display risk related information that DFSA has formally assigned.
- Support structured submission ingestion.
- Facilitate timely responses to supervisory actions.
- Log all communication and upload events.

## 6. Agent Behaviour
- Agents may explain supervisory concepts.
- Agents may describe required filings.
- Agents must not estimate risk scores or outcomes.
- Agents must direct users to submit accurate information for proper assessment.
