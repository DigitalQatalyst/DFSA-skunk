# DFSA Data Model Foundation

This document defines the core entities and relationships required to support DFSA regulatory workflows. It is intended as a reference for the application back end and for AI agents that rely on structured data.

## 1. Core Entities

### Firm
Represents an authorised or prospective entity. Includes:
- Legal name
- Licence category
- Status
- Country of incorporation
- Parent organisation
- Risk rating
- Reporting obligations

### Individual
Represents a person associated with a firm or applying for a controlled function. Includes:
- Personal identification data
- Controlled functions sought
- Fitness and propriety information

### Licence
Represents the regulatory permission granted to a firm. Includes:
- Activity type
- Category
- Effective date
- Expiry or renewal details

### Submission
Represents any filing, application, or response. Includes:
- Submission type
- Required documents
- Status
- Assigned reviewer

### Supervisory Action
Represents DFSA requests, assessments, or follow ups. Includes:
- Action type
- Response deadline
- Documents requested
- Resolution status

### Public Register Entry
Represents data about firms or individuals that are publicly visible. Includes:
- Status
- Sanctions
- Permissions

## 2. Relationships
- Firm has many Individuals.
- Firm has many Submissions.
- Submission may relate to a Licence.
- Firm may have multiple Licences.
- Supervisory Action is linked to a Firm or Submission.
- Public Register Entry maps to a Firm or Individual.

## 3. Data Design Principles
- All records must be audit ready.
- All fields must align with DFSA terminology.
- Do not infer suitability or assessment outcome through data states.
- Use explicit statuses that reflect regulatory processes.
