# DFSA Financial Services Application - Developer Specifications

> **Version:** 1.0.0
> **Last Updated:** December 2024
> **Route:** `/financial-services`

## Overview

This folder contains the complete technical specifications for implementing the DFSA Financial Services Application form. The form is a multi-stage wizard that collects information from applicants seeking authorization from the Dubai Financial Services Authority (DFSA).

## Documents Index

| Document | Description |
|----------|-------------|
| [01-FORM-STRUCTURE.md](./01-FORM-STRUCTURE.md) | Complete form structure, stages, steps, and fields |
| [02-VISIBILITY-RULES.md](./02-VISIBILITY-RULES.md) | Show/hide logic for steps and fields |
| [03-NAVIGATION-RULES.md](./03-NAVIGATION-RULES.md) | Step navigation and validation rules |
| [04-API-SPECIFICATIONS.md](./04-API-SPECIFICATIONS.md) | Backend API endpoints and data contracts |
| [05-SAVE-FUNCTIONALITY.md](./05-SAVE-FUNCTIONALITY.md) | Draft save, auto-save, and submission flows |
| [06-PDF-EXPORT.md](./06-PDF-EXPORT.md) | PDF generation specifications |

### Platform Standards (DFSA-Contextualized)

| Document | Description |
|----------|-------------|
| [DFSA_Forms_GeneralStandards_v1.md](./DFSA_Forms_GeneralStandards_v1.md) | Global form standards for DFSA Connect |
| [DFSA_DataValidationStandards_v1.md](./DFSA_DataValidationStandards_v1.md) | Field-level validation rules and regex patterns |
| [DFSA_ApplicationsModule_v1.md](./DFSA_ApplicationsModule_v1.md) | Complete applications module specification |

## Data Files (CSV)

Import-ready data files for system integration:

| File | Format | Description |
|------|--------|-------------|
| [form-fields.csv](./data/form-fields.csv) | CSV | Complete field inventory (80+ fields) |
| [form-steps.csv](./data/form-steps.csv) | CSV | All 26 form steps with visibility conditions |
| [visibility-rules.csv](./data/visibility-rules.csv) | CSV | Step and field visibility rules (45+ rules) |
| [activity-codes.csv](./data/activity-codes.csv) | CSV | Sector, activity, and investment type codes |
| [api-endpoints.csv](./data/api-endpoints.csv) | CSV | API endpoint reference (22 endpoints) |
| [status-workflow.csv](./data/status-workflow.csv) | CSV | Application status workflow transitions |

## Quick Start

### Form Architecture

```
DFSA Financial Services Form
├── Stage 1: General Requirements (5 steps - always visible)
│   ├── Step 1-1: Introduction & Disclosure
│   ├── Step 1-2: Standing Data
│   ├── Step 1-3: Ownership Information
│   ├── Step 1-4: Controllers & Group Structure
│   └── Step 1-5: Permissions & Financial Services
│
├── Stage 2: Activity-Specific Forms (13 steps - conditional)
│   ├── Step 2-1: Fund Management
│   ├── Step 2-2: Representative Office
│   ├── Step 2-3: Islamic Endorsement
│   └── ... (more conditional steps)
│
├── Stage 3: Core Profile Forms (4 steps - conditional)
│   ├── Step 3-1: Business Plan
│   ├── Step 3-2: Clients
│   ├── Step 3-4: Risk Management & Compliance
│   └── Step 3-5: Governance
│
└── Stage 4: Final Submission (4 steps - always visible)
    ├── Step 4-1: Waivers & Modifications
    ├── Step 4-2: Application Fees
    ├── Step 4-3: Fit & Proper Declarations
    └── Step 4-4: Review & Submit
```

### Key Technical Concepts

1. **Conditional Step Visibility**: Steps appear/hide based on user selections in Step 1-5
2. **Rules Engine**: Database-driven visibility rules (can also use legacy hardcoded logic)
3. **Auto-Save**: Form data saved every 30 seconds
4. **Progress Tracking**: Visual progress indicators per stage and overall
5. **PDF Export**: Generate PDF summaries at any point

### API Base URL

```
Production: https://api.dfsa.ae/api/fs-applications
Development: http://localhost:3000/api/fs-applications
```

### Key Data Structures

```typescript
// Form Data Object
interface FormData {
  // Submitter Info
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;

  // Activity Selections (Q98)
  activitySelections: {
    A1?: boolean;  // Banking/Investment
    A2?: boolean;  // General Insurance
    A3?: boolean;  // Life Insurance
    // ... more
  };

  // Financial Services Matrix (Q99)
  financialServicesMatrix: {
    A1?: string[];   // ['C1', 'C2'] = selected investment types
    A2?: string[];
    // ... more
  };

  // Endorsements
  endorsementSelections: {
    E1_A1?: boolean;  // Islamic
    E2_A1?: boolean;  // Retail
    // ... more
  };
}

// Application Status
type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'approved'
  | 'rejected'
  | 'withdrawn';
```

## Implementation Notes

### Frontend Technology
- React 18+ with TypeScript
- Component-based step architecture
- CSS-in-JS with inline styles
- lucide-react for icons

### Backend Technology
- Node.js with Express
- SQLite (development) / PostgreSQL (production)
- pdfkit for PDF generation
- nodemailer for email notifications

### Feature Flags
```
REACT_APP_USE_RULES_ENGINE=true  # Use database rules
REACT_APP_USE_RULES_ENGINE=false # Use legacy hardcoded rules
```

## Contact

For questions about these specifications, contact the DFSA Digital Services team.
