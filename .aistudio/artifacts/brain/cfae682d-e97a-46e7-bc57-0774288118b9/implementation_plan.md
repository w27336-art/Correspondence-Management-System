# AI-Powered PCAA Correspondence Management System for Airblue

A specialized regulatory correspondence management system tailored for **Airblue** to register, digitize, store, retrieve, and track all official communications exchanged with the **Pakistan Civil Aviation Authority (PCAA)**. The platform features intelligent multimodal document OCR & metadata extraction, split-screen document verification, cross-referenced correspondence threads, deadline tracking, role-based access control, and complete audit logging.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following system decisions incorporate recommended defaults for high operational efficiency in airline regulatory compliance:

- **Confirmed Decision 1 (Storage Architecture)**: High-security internal document repository with SHA-256 integrity hashing and metadata indexing, paired with a dedicated Microsoft OneDrive / SharePoint synchronization manager and setup panel.
- **Confirmed Decision 2 (AI Extraction Pipeline)**: Multimodal Gemini Vision (`gemini-3.8-flash`) server-side pipeline for direct extraction of scanned letters, reference numbers, direction, dates, subject, regulatory directives, and confidence scoring.
- **Confirmed Decision 3 (Aviation Domain Data)**: Pre-loaded with realistic regulatory records representing authentic Airblue–PCAA correspondence across Flight Operations (FOPs), Airworthiness (Airworthiness Directives / Form 26), Aerodrome Ramp Safety, Cabin Safety, Tariffs & Licensing, with active threads and audit trails.

---

## 1. Overview & Core Concept

- **What It Does**: Digitizes and streamlines the end-to-end lifecycle of regulatory correspondence between Airblue and PCAA. Staff can drag-and-drop scanned letters or PDFs, review AI-extracted metadata side-by-side with the high-resolution original document, correct or confirm fields, link related letters into chronological threads, track reply deadlines, and conduct instant full-text and parametric searches.
- **Target Audience & Roles**:
  - **Administrator**: System settings, user role provisioning, numbering formats, retention schedules, audit log inspection.
  - **Correspondence Registrar**: Document uploading, OCR verification, incoming/outgoing letter registration, thread cross-referencing.
  - **Reviewer / Department User**: Reading permitted correspondence, assigning action owners, adding internal remarks, marking reply status.
  - **Read-Only Auditor**: Search, inspection of original documents, and compliance audit trail verification.
- **Key Value**: Eliminates manual paper register logs, prevents missed regulatory deadlines, guarantees rapid document retrieval during audits, and maintains an unalterable chain of custody for all regulatory mandates.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Document Ingestion & AI Extraction**:
   - Registrar drops a scanned PDF or letter image into the upload dropzone.
   - Server runs OCR and multimodal analysis, extracting dates, reference numbers (PCAA ref & Airblue ref), sender/recipient orgs, subject, summary, required actions, and confidence flags.
2. **Side-by-Side Verification Screen**:
   - **Left Panel (50%)**: Interactive document previewer with multi-page navigation, zoom in/out, fit-width, rotate, and full-resolution download.
   - **Right Panel (50%)**: Editable registration form populated with extracted data. Fields with low extraction confidence or missing data are visibly highlighted with verification warning flags. Users can click "Save Draft" or "Verify & Register".
3. **Registry & Chronological Threads**:
   - Filterable correspondence table with incoming/outgoing badges, priority indicators, PCAA/Airblue reference pairs, department tags, and deadline countdowns.
   - Interactive Thread View mapping root letters, inquiries, replies, and regulatory approvals chronologically.
4. **Deadline & Action Tracker**:
   - Real-time monitor of pending replies, warning colors for upcoming deadlines (<72 hours), and critical alerts for overdue regulatory submissions.
5. **Full-Text & Parametric Search**:
   - Instant search across reference numbers, OCR content, subjects, sender/recipient, tags, and date ranges with direct one-click document viewing.

### Visual Identity & Theme
- **Aesthetic Direction**: Aviation regulatory enterprise suite — authoritative, utilitarian, calm, and dense with high-scannability data grids.
- **Color Palette**:
  - Primary Canvas: Clean neutral light (`#F8FAFC` slate-50) with crisp white cards (`#FFFFFF`).
  - Brand Tone: Airblue navy deep slate (`#0B2545`) with aero sapphire accents (`#134074` / `#0077B6`).
  - Semantic Status:
    - Forest Green (`#16A34A`): Verified / Dispatched / Closed
    - Aviation Amber (`#D97706`): Pending Verification / Approaching Deadline
    - Urgent Red (`#DC2626`): Overdue Reply / Critical Directive
- **Typography & Scale**:
  - Display & Headings: `Plus Jakarta Sans` (font-semibold, tight tracking).
  - Body & UI: `DM Sans` / `Public Sans` for clear readability at 13px–15px.
  - Identifiers & Dates: Tabular monospace figures (`font-mono tabular-nums`) for reference numbers, timestamps, and confidence percentages.
- **Anti-Slop Discipline**:
  - No generic purple floating pills or candy badges.
  - Metadata rendered with clean unboxed typographic separators (`·`, `/`).
  - High-density data tables ($38\text{px}$–$44\text{px}$ row height) with clean column alignment.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Vite + Express Architecture**
  - *Chosen Approach*: Unified Node/Express backend serving client-side React SPA with Vite, hosting dedicated `/api/*` endpoints for Gemini AI extraction, document storage, and search indexing.
  - *Why*: Enables real server-side execution of `@google/genai` using secure `process.env.GEMINI_API_KEY` while providing fast client-side UI responsiveness.
- **Decision 2: Multimodal Gemini 3.8 Flash for OCR & Structured Extraction**
  - *Chosen Approach*: Use Gemini 3.8 Flash with structured schema extraction (`responseMimeType: "application/json"`), processing the document image/PDF inline to obtain both verbatim text and normalized metadata fields in a single high-accuracy pass.
  - *Why*: Outperforms traditional decoupled OCR + regex for complex bureaucratic Pakistani government/aviation letter layouts (which contain seal emblems, multi-line reference strings, and bilingual Urdu/English headers).
- **Decision 3: Dual Storage Model with Cloud Provider Setup Screen**
  - *Chosen Approach*: Reliable local vault with SHA-256 integrity verification, combined with an interactive Microsoft OneDrive / SharePoint cloud connector module. If cloud storage is unconfigured or in setup mode, the UI provides explicit configuration guidance rather than silent failure.
- **Decision 4: Immutable Audit Trail Engine**
  - *Chosen Approach*: Every action (creation, metadata alteration, field correction, status update, link creation) is permanently recorded with timestamp, user ID, actor role, before/after values, and IP/session context.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AIRBLUE PCAA CORRESPONDENCE SYSTEM                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
┌────────────────────────────────┐            ┌────────────────────────────────┐
│      REACT 19 FRONTEND         │            │      EXPRESS 4 BACKEND         │
│  - Navigation & Top Bar        │            │  - Document Ingestion Service  │
│  - Dashboard & Analytics       │   HTTP     │  - Gemini Multimodal Pipeline  │
│  - Dual-Panel Verification     │ ─────────> │  - Correspondence Data Store   │
│  - Registry & Thread Tree      │   JSON     │  - Audit Trail Logger          │
│  - Full-Text Search Engine     │ <───────── │  - Export Engine (CSV/Excel)   │
│  - Cloud Storage Config Panel  │            │  - Role-Based Access Auth      │
│  - Admin & Role Management     │            │  - OneDrive/SharePoint Sync    │
└────────────────────────────────┘            └────────────────────────────────┘
                                                              │
                                       ┌──────────────────────┴───────┐
                                       ▼                              ▼
                       ┌──────────────────────────────┐ ┌──────────────────────┐
                       │   @google/genai (Server)     │ │ Storage & Vault     │
                       │   - gemini-3.8-flash         │ │ - Original Docs     │
                       │   - Structured JSON Schema   │ │ - Full-Text Index   │
                       │   - Verbatim Text + Summary  │ │ - Cloud References  │
                       └──────────────────────────────┘ └──────────────────────┘
```

### Data Entities & Schema
1. **Correspondence Record**:
   - `id`: Unique UUID
   - `internalRef`: Auto-generated string (e.g. `AB-PCAA-2026-0042`)
   - `direction`: `'incoming' | 'outgoing'`
   - `letterDate`: ISO date string
   - `receivedOrDispatchedDate`: ISO date string
   - `senderOrg`, `senderDept`, `senderName`
   - `recipientOrg`, `recipientDept`, `recipientName`
   - `subject`: String
   - `pcaaRefNumber`: String
   - `airblueRefNumber`: String
   - `category`: `'Flight Operations' | 'Airworthiness' | 'Aerodrome & Ramp' | 'Cabin Safety' | 'Tariffs & Licensing' | 'Security & Facilitation' | 'Legal & General'`
   - `status`: `'Draft' | 'Processing' | 'Awaiting Verification' | 'Received' | 'Under Review' | 'Reply Required' | 'Replied' | 'Dispatched' | 'Closed'`
   - `priority`: `'Normal' | 'Urgent' | 'Critical'`
   - `replyRequired`: Boolean
   - `replyDeadline`: Optional ISO date string
   - `responsibleOfficer`: String
   - `concernedDept`: String
   - `threadId`: UUID
   - `parentCorrespondenceId`: Optional UUID
   - `keywords`: Array of strings
   - `remarks`: String
   - `extractedText`: Verbatim text
   - `aiSummary`: Formal executive summary
   - `confidenceScores`: Record of field -> confidence percentage
   - `documentAttachment`: `{ fileId, fileName, fileType, fileSize, storageUrl, sha256, cloudStatus }`
   - `createdBy`, `createdAt`, `updatedAt`, `verifiedBy`, `verifiedAt`

2. **Audit Log Entry**:
   - `id`, `timestamp`, `correspondenceId`, `actorId`, `actorName`, `actorRole`, `actionType` (`'CREATE' | 'OCR_EXTRACT' | 'VERIFY' | 'METADATA_UPDATE' | 'LINK_THREAD' | 'STATUS_CHANGE' | 'EXPORT'`), `changes` (`{ field, oldValue, newValue }`), `ipAddress`

3. **Cloud Storage Configuration**:
   - Provider (`'onedrive' | 'sharepoint'`), Tenant ID, Client ID, Site/Drive path, folder format structure (`/{year}/{direction}/{ref}`), sync status, retention years.

---

## 5. Implementation Sequence

1. **Step 1: Backend Foundation & API Routes**: Setup Express server with TypeScript in `server.ts` alongside Vite middleware, configuring Gemini AI extraction with `@google/genai`, storage routes, correspondence CRUD, search index, and audit logging.
2. **Step 2: Seed Data & Regulatory Archives**: Create comprehensive seed data representing genuine Airblue–PCAA exchanges (Airworthiness directives, slot allocations, ramp inspection observations, pilot licensing reviews).
3. **Step 3: Ingestion & Verification UI**: Implement the split-screen document viewer with interactive controls and dynamic confidence-highlighted metadata form.
4. **Step 4: Registry, Threads, Search & Reporting**: Build high-density table views, thread relationship visualizer, full-text search with highlighting, deadline alert system, and CSV/Excel export.
5. **Step 5: Cloud Storage & Admin Controls**: Create OneDrive/SharePoint configuration view, role-switching toggle (Admin, Registrar, Reviewer, Auditor), and unalterable audit log viewer.
6. **Step 6: Build Verification & Testing**: Verify compilation (`compile_applet`), test all API endpoints, verify file uploads and AI OCR pipelines.
