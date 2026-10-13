import { CorrespondenceRecord, AuditLogEntry, CloudStorageConfig } from '../types/correspondence';

export const initialCloudConfig: CloudStorageConfig = {
  provider: 'onedrive',
  isConnected: true,
  accountEmail: 'compliance.records@airblue.com',
  tenantId: 'ab-tenant-49102-pakistan',
  clientId: '0a93c4-airblue-pcaa-gateway',
  baseFolder: '/Airblue_Corporate/Regulatory_Affairs/PCAA_Correspondence',
  namingPattern: '{year}/{category}/{direction}/{internalRef}',
  autoSync: true,
  retentionYears: 10,
  lastSyncTimestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
};

// Generates an SVG data URL mimicking an official letterhead document
export function generateLetterSvgDataUrl(title: string, ref: string, date: string, from: string, to: string, content: string[]): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
    <rect width="800" height="1100" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <!-- Top Header Border -->
    <rect x="50" y="40" width="700" height="4" fill="#0B2545"/>
    <rect x="50" y="47" width="700" height="1" fill="#0077B6"/>
    
    <!-- Emblem / Watermark -->
    <circle cx="400" cy="90" r="28" fill="#f8fafc" stroke="#0B2545" stroke-width="1.5"/>
    <text x="400" y="94" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="10" font-weight="bold" fill="#0B2545" text-anchor="middle">CAA / PAK</text>
    <text x="400" y="130" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#0B2545" text-anchor="middle" letter-spacing="1">PAKISTAN CIVIL AVIATION AUTHORITY</text>
    <text x="400" y="146" font-family="Arial, sans-serif" font-size="10" fill="#64748b" text-anchor="middle">HEADQUARTERS CIVIL AVIATION AUTHORITY, TERMINAL 1, JIAP, KARACHI</text>
    
    <line x1="50" y1="165" x2="750" y2="165" stroke="#cbd5e1" stroke-width="1"/>
    
    <!-- Reference and Date -->
    <text x="50" y="195" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#1e293b">Ref: ${ref}</text>
    <text x="750" y="195" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="end">Date: ${date}</text>
    
    <!-- Addressing -->
    <text x="50" y="235" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">To:</text>
    <text x="75" y="235" font-family="Arial, sans-serif" font-size="11" fill="#334155">${to}</text>
    <text x="75" y="252" font-family="Arial, sans-serif" font-size="11" fill="#334155">Airblue Limited, Corporate Headquarters</text>
    <text x="75" y="269" font-family="Arial, sans-serif" font-size="11" fill="#334155">Islamabad, Pakistan</text>
    
    <text x="50" y="305" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">From:</text>
    <text x="95" y="305" font-family="Arial, sans-serif" font-size="11" fill="#334155">${from}</text>
    
    <!-- Subject -->
    <rect x="50" y="330" width="700" height="28" fill="#f1f5f9" rx="4"/>
    <text x="60" y="348" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">SUBJECT: ${title.toUpperCase()}</text>
    
    <!-- Body Paragraphs -->
    ${content.map((p, idx) => `<text x="50" y="${390 + idx * 42}" font-family="Arial, sans-serif" font-size="11" fill="#334155" width="700">${p}</text>`).join('\n')}
    
    <!-- Signature Area -->
    <text x="500" y="860" font-family="Brush Script MT, cursive" font-size="22" fill="#0f172a">M. Tariq Mehmood</text>
    <line x1="500" y1="875" x2="720" y2="875" stroke="#94a3b8" stroke-width="1"/>
    <text x="500" y="895" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">Senior Additional Director</text>
    <text x="500" y="910" font-family="Arial, sans-serif" font-size="10" fill="#64748b">For Director General, Civil Aviation Authority</text>
    
    <!-- Stamp / Verification Seal -->
    <rect x="50" y="930" width="180" height="55" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,2" rx="4"/>
    <text x="140" y="952" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="middle">RECEIVED &amp; LOGGED</text>
    <text x="140" y="968" font-family="Courier, monospace" font-size="9" fill="#dc2626" text-anchor="middle">AIRBLUE REGULATORY DESK</text>
    
    <!-- Footer -->
    <text x="400" y="1060" font-family="Arial, sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">CONFIDENTIAL &amp; PROPRIETARY — AIRBLUE COMPLIANCE RECORD REGISTER</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const initialCorrespondenceRecords: CorrespondenceRecord[] = [
  {
    id: 'rec-001',
    internalRef: 'AB-PCAA-2026-0018',
    direction: 'incoming',
    letterDate: '2026-09-28',
    receivedOrDispatchedDate: '2026-09-30',
    sender: 'Engr. Muhammad Tariq (Addl. Director AWD)',
    senderOrg: 'Pakistan Civil Aviation Authority (PCAA)',
    senderDept: 'Airworthiness Directorate (AWD)',
    recipient: 'VP Flight Operations & Technical',
    recipientOrg: 'Airblue Limited',
    recipientDept: 'Engineering & Maintenance',
    subject: 'Mandatory Compliance with Airworthiness Directive AD-2026-A320-04 (CFM56-5B High-Pressure Turbine Inspection)',
    pcaaRefNumber: 'HQCAA/1085/543/AWD/TECH',
    airblueRefNumber: 'AB/ENG/AWD/2026/891',
    category: 'Airworthiness & Engineering',
    departmentConcerned: 'Engineering & Maintenance',
    responsibleOfficer: 'Engr. Asif Javed (Chief Engineer)',
    threadId: 'thread-airworthiness-cfm56',
    replyRequired: true,
    replyDeadline: '2026-10-18',
    status: 'Under Review',
    priority: 'Critical',
    keywords: ['CFM56-5B', 'Airbus A320', 'Turbine Blades', 'Ultrasonic Inspection', 'EASA AD', 'AWD Form 26'],
    remarks: 'PCAA AWD requires immediate fleet inspection logs for 6x Airbus A320 airframes within 21 calendar days. Non-compliance grounding risk.',
    extractedText: `PAKISTAN CIVIL AVIATION AUTHORITY
HEADQUARTERS CAA, TERMINAL-1, JIAP, KARACHI
Ref: HQCAA/1085/543/AWD/TECH
Dated: 28 September 2026

To: The Vice President Flight Operations & Technical, Airblue Limited, Corporate HQ, Islamabad.
SUBJECT: MANDATORY COMPLIANCE WITH AIRWORTHINESS DIRECTIVE AD-2026-A320-04 (CFM56-5B HPT ROTOR BLADES)

1. Reference is made to EASA Emergency Airworthiness Directive 2026-0182-E and subsequent PCAA AWD Notice No. 12/2026.
2. All Pakistani registered Airbus A320 aircraft powered by CFM56-5B powerplants must undergo non-destructive ultrasonic testing of stage 1 & 2 HPT rotor disks and blades prior to accumulating 2,200 flight cycles.
3. Airblue Limited is hereby directed to submit a comprehensive compliance status report and engineering maintenance work orders to PCAA AWD no later than 18 October 2026.
4. Failure to furnish the verified compliance record will result in the suspension of Certificate of Airworthiness (C of A) for affected airframes (AP-BKG, AP-BKR, AP-BNL).

(Engr. Muhammad Tariq)
Additional Director Airworthiness
For Director General Civil Aviation Authority`,
    aiSummary: 'PCAA Airworthiness Directorate mandates compliance with emergency AD-2026-A320-04 for CFM56-5B engines on Airblue A320 fleet. Detailed inspection logs and work orders must be submitted by 18 October 2026 to avoid C of A suspension.',
    regulatoryDirectives: [
      'Perform ultrasonic NDT inspection on CFM56-5B HPT rotor disks before 2,200 flight cycles',
      'Submit Airblue fleet compliance status report to PCAA AWD by 18-Oct-2026',
      'Endorse engineering task cards with AWD Form 26'
    ],
    mentionedOfficers: ['Engr. Muhammad Tariq', 'Director General CAA'],
    confidence: {
      letterDate: 99,
      pcaaRefNumber: 97,
      airblueRefNumber: 90,
      sender: 98,
      recipient: 95,
      subject: 99,
      category: 98,
      direction: 99,
      replyDeadline: 96,
      overall: 97,
    },
    isVerified: true,
    verifiedBy: 'Syed Hammad (Registrar)',
    verifiedAt: '2026-10-01T09:15:00Z',
    attachment: {
      id: 'att-001',
      fileName: 'PCAA_AWD_Directive_AD-2026-A320-04.pdf',
      fileType: 'application/pdf',
      fileSize: 482910,
      dataUrl: generateLetterSvgDataUrl(
        'Compliance with Airworthiness Directive AD-2026-A320-04',
        'HQCAA/1085/543/AWD/TECH',
        '28-SEP-2026',
        'Engr. Muhammad Tariq (Addl. Director AWD)',
        'The VP Flight Operations & Technical',
        [
          '1. Reference EASA Emergency Airworthiness Directive 2026-0182-E and PCAA AWD Notice No. 12/2026.',
          '2. All Pakistani registered Airbus A320 fleet powered by CFM56-5B must undergo NDT ultrasonic tests.',
          '3. Submit compliance status report and task cards to PCAA AWD no later than 18 October 2026.',
          '4. Failure to comply will lead to suspension of Certificate of Airworthiness (C of A) for affected airframes.'
        ]
      ),
      cloudFileId: 'od-file-883921-cfm56',
      cloudStoragePath: '/2026/Airworthiness/incoming/AB-PCAA-2026-0018/PCAA_AWD_Directive_AD-2026-A320-04.pdf',
      cloudSynced: true,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      uploadedAt: '2026-09-30T10:05:00Z',
    },
    cloudStorageLocation: 'OneDrive/Airblue_Corporate/Regulatory_Affairs/2026/Airworthiness/incoming/AB-PCAA-2026-0018',
    createdBy: 'Syed Hammad (Registrar)',
    createdAt: '2026-09-30T10:05:00Z',
    updatedAt: '2026-10-01T09:15:00Z',
  },
  {
    id: 'rec-002',
    internalRef: 'AB-PCAA-2026-0022',
    direction: 'outgoing',
    letterDate: '2026-10-06',
    receivedOrDispatchedDate: '2026-10-06',
    sender: 'Chief Executive Officer / Managing Director',
    senderOrg: 'Airblue Limited',
    senderDept: 'Executive Office & Commercial',
    recipient: 'Director Air Transport & Economic Regulations (AT&ER)',
    recipientOrg: 'Pakistan Civil Aviation Authority (PCAA)',
    recipientDept: 'Air Transport Directorate',
    subject: 'Request for Winter 2026-27 Schedule Approval and Additional Slot Allocations for Islamabad (ISB) and Jeddah (JED)',
    pcaaRefNumber: 'HQCAA/2415/782/AT/W26',
    airblueRefNumber: 'AB/COMM/SCHED/W26/104',
    category: 'Tariffs, Routes & Licensing',
    departmentConcerned: 'Commercial Planning & Scheduling',
    responsibleOfficer: 'Bilal Farooq (Head of Network Planning)',
    threadId: 'thread-winter-slots-2026',
    replyRequired: true,
    replyDeadline: '2026-10-24',
    status: 'Dispatched',
    priority: 'Normal',
    keywords: ['Winter Schedule 2026', 'Slot Allocation', 'Islamabad JIAP', 'Jeddah International', 'PA-270', 'PA-271'],
    remarks: 'Formal Airblue submission for Winter 2026 schedule with 14 weekly frequencies on ISB-JED sector and 7 weekly on LHE-DXB.',
    extractedText: `AIRBLUE LIMITED
EXECUTIVE OFFICES, ISE TOWERS, JINNAH AVENUE, ISLAMABAD
Ref: AB/COMM/SCHED/W26/104
Date: 06 October 2026

To: The Director Air Transport & Economic Regulations, Headquarters CAA, JIAP, Karachi.
SUBJECT: APPLICATION FOR WINTER 2026/27 FLIGHT SCHEDULE APPROVAL & SLOTS

Dear Sir,
1. In accordance with Civil Aviation Rules 1994 (CARs 94) Part XII and Air Transport Policy Directive 2025, Airblue Limited submits herewith proposed flight schedule for Winter Season 2026/2027 effective 25 October 2026.
2. In particular, Airblue requests confirmation of prime operating slots for additional daily frequencies on Islamabad (ISB) - Jeddah (JED) - Islamabad (PA-270 / PA-271) utilizing Airbus A321neo aircraft.
3. Relevant bilateral air services capacity entitlements and insurance certificates have been verified.
4. Your early concurrence is respectfully solicited to enable ticketing system deployment.

Yours faithfully,
(Tariq Chaudhary)
Managing Director, Airblue Limited`,
    aiSummary: 'Airblue submits Winter 2026/27 flight schedule application to PCAA AT&ER requesting approval for 14 weekly flights on ISB-JED sector with A321neo aircraft.',
    regulatoryDirectives: [
      'Approval of Winter 2026/27 schedule under CARs 1994 Part XII',
      'Slot coordination with Airport Slot Management Committee ISB'
    ],
    mentionedOfficers: ['Tariq Chaudhary (MD)', 'Director AT&ER PCAA'],
    confidence: {
      letterDate: 100,
      pcaaRefNumber: 94,
      airblueRefNumber: 100,
      sender: 99,
      recipient: 97,
      subject: 99,
      category: 98,
      direction: 100,
      replyDeadline: 92,
      overall: 97,
    },
    isVerified: true,
    verifiedBy: 'Syed Hammad (Registrar)',
    verifiedAt: '2026-10-06T14:20:00Z',
    attachment: {
      id: 'att-002',
      fileName: 'AB_Submission_Winter2026_Schedule_Slots.pdf',
      fileType: 'application/pdf',
      fileSize: 394200,
      dataUrl: generateLetterSvgDataUrl(
        'Winter 2026/27 Flight Schedule Approval & Slots',
        'AB/COMM/SCHED/W26/104',
        '06-OCT-2026',
        'Airblue Managing Director',
        'Director Air Transport & Economic Regulations (PCAA)',
        [
          '1. In accordance with CARs 1994 Part XII, Airblue submits Winter 2026/27 flight schedule.',
          '2. Requesting confirmation of prime slots on Islamabad (ISB) - Jeddah (JED) with A321neo.',
          '3. Bilateral air service quotas and third-party insurance compliance certificates attached.',
          '4. Favorable review requested prior to schedule commencement date.'
        ]
      ),
      cloudFileId: 'od-file-993812-slots',
      cloudStoragePath: '/2026/Tariffs_Routes_Licensing/outgoing/AB-PCAA-2026-0022/AB_Submission_Winter2026_Schedule_Slots.pdf',
      cloudSynced: true,
      sha256Hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      uploadedAt: '2026-10-06T14:00:00Z',
    },
    cloudStorageLocation: 'OneDrive/Airblue_Corporate/Regulatory_Affairs/2026/Tariffs/outgoing/AB-PCAA-2026-0022',
    createdBy: 'Syed Hammad (Registrar)',
    createdAt: '2026-10-06T14:00:00Z',
    updatedAt: '2026-10-06T14:20:00Z',
  },
  {
    id: 'rec-003',
    internalRef: 'AB-PCAA-2026-0029',
    direction: 'incoming',
    letterDate: '2026-10-09',
    receivedOrDispatchedDate: '2026-10-10',
    sender: 'Capt. Zafar Iqbal (Director Flight Standards)',
    senderOrg: 'Pakistan Civil Aviation Authority (PCAA)',
    senderDept: 'Flight Standards Directorate (FSD)',
    recipient: 'Director Flight Operations (DFO)',
    recipientOrg: 'Airblue Limited',
    recipientDept: 'Flight Operations Directorate',
    subject: 'Safety Audit Observation — Cockpit Voice Recorder (CVR) and Flight Data Recorder (FDR) Readout Interval Verification',
    pcaaRefNumber: 'HQCAA/6211/98/FSD/OPS',
    airblueRefNumber: 'AB/FSD/AUD/2026/302',
    category: 'Flight Operations',
    departmentConcerned: 'Flight Safety & Quality Assurance',
    responsibleOfficer: 'Capt. Kamran Siddiqui (Safety Manager)',
    threadId: 'thread-fsd-audit-cvr',
    replyRequired: true,
    replyDeadline: '2026-10-15',
    status: 'Reply Required',
    priority: 'Critical',
    keywords: ['CVR Readout', 'FDR Calibration', 'CARs 94 Part X', 'Flight Safety Audit', 'Corrective Action Plan'],
    remarks: 'URGENT: PCAA FSD identified discrepancies in routine calibration interval records for FDR parameter checks on aircraft AP-BNL during ramp inspection at IIAP Islamabad. Response due in 5 days.',
    extractedText: `PAKISTAN CIVIL AVIATION AUTHORITY
FLIGHT STANDARDS DIRECTORATE, HQ CAA KARACHI
Ref: HQCAA/6211/98/FSD/OPS
Date: 09 October 2026

To: Director Flight Operations, Airblue Limited, Corporate HQ, Islamabad.
SUBJECT: SAFETY AUDIT LEVEL-2 FINDING: RECERTIFICATION OF FDR/CVR PERIODIC READOUTS

1. During joint ramp safety surveillance conducted at Islamabad International Airport (IIAP) on 04 October 2026 on Airblue Airbus A320 aircraft registration AP-BNL, it was observed that the annual 88-parameter FDR calibration readout documentation was past the 12-month regulatory window by 14 days.
2. Under Civil Aviation Regulations ANO-001-FSXX, all scheduled air operators must demonstrate annual functional verification of flight recorders.
3. Airblue Limited is required to furnish:
   a) Certified FDR readout laboratory report from an approved Part-145 facility.
   b) Root Cause Analysis (RCA) and Corrective Action Plan (CAP) to prevent recurrence.
4. Response must reach this office within seven (07) business days, no later than 15 October 2026.

(Capt. Zafar Iqbal)
Director Flight Standards, PCAA`,
    aiSummary: 'Level-2 safety audit finding issued by PCAA FSD regarding overdue FDR annual readout verification on aircraft AP-BNL. Corrective Action Plan and certified lab readout required by 15 October 2026.',
    regulatoryDirectives: [
      'Provide Part-145 certified FDR readout analysis for AP-BNL',
      'Submit formal RCA (Root Cause Analysis) and CAP (Corrective Action Plan)',
      'Deadline: 15-Oct-2026'
    ],
    mentionedOfficers: ['Capt. Zafar Iqbal', 'Air Safety Inspector IIAP'],
    confidence: {
      letterDate: 98,
      pcaaRefNumber: 99,
      airblueRefNumber: 88,
      sender: 98,
      recipient: 96,
      subject: 99,
      category: 99,
      direction: 99,
      replyDeadline: 98,
      overall: 97,
    },
    isVerified: true,
    verifiedBy: 'Syed Hammad (Registrar)',
    verifiedAt: '2026-10-10T11:45:00Z',
    attachment: {
      id: 'att-003',
      fileName: 'PCAA_FSD_Level2_Audit_Finding_FDR_CVR.pdf',
      fileType: 'application/pdf',
      fileSize: 521400,
      dataUrl: generateLetterSvgDataUrl(
        'Safety Audit Level-2 Finding: FDR/CVR Verification',
        'HQCAA/6211/98/FSD/OPS',
        '09-OCT-2026',
        'Capt. Zafar Iqbal (Director Flight Standards)',
        'The Director Flight Operations, Airblue',
        [
          '1. Ramp safety surveillance at Islamabad on 04 October 2026 on A320 AP-BNL.',
          '2. Annual 88-parameter FDR calibration readout was past regulatory window by 14 days.',
          '3. Provide certified FDR readout lab report and Root Cause Analysis / CAP.',
          '4. Strict compliance required within 7 days (Deadline: 15 October 2026).'
        ]
      ),
      cloudFileId: 'od-file-100234-fdr',
      cloudStoragePath: '/2026/Flight_Operations/incoming/AB-PCAA-2026-0029/PCAA_FSD_Level2_Audit_Finding_FDR_CVR.pdf',
      cloudSynced: true,
      sha256Hash: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
      uploadedAt: '2026-10-10T11:00:00Z',
    },
    cloudStorageLocation: 'OneDrive/Airblue_Corporate/Regulatory_Affairs/2026/FlightOps/incoming/AB-PCAA-2026-0029',
    createdBy: 'Syed Hammad (Registrar)',
    createdAt: '2026-10-10T11:00:00Z',
    updatedAt: '2026-10-10T11:45:00Z',
  },
  {
    id: 'rec-004',
    internalRef: 'AB-PCAA-2026-0034',
    direction: 'incoming',
    letterDate: '2026-10-11',
    receivedOrDispatchedDate: '2026-10-12',
    sender: 'Sultan Ahmed (Senior Aerodrome Inspector)',
    senderOrg: 'Pakistan Civil Aviation Authority (PCAA)',
    senderDept: 'Aerodrome & Airspace Regulations (A&AR)',
    recipient: 'Station Manager, Allama Iqbal International Airport (AIIAP)',
    recipientOrg: 'Airblue Limited',
    recipientDept: 'Ground Operations & Station Management',
    subject: 'Ramp Safety Inspection Notice: Ground Support Equipment (GSE) Tow-Bar Shear-Pin Maintenance and Pushback Procedures',
    pcaaRefNumber: 'CAA/AIIAP/204/RAMP/26',
    airblueRefNumber: 'AB/GRD/LHE/2026/112',
    category: 'Aerodrome & Ramp Safety',
    departmentConcerned: 'Ground Operations & Station Management',
    responsibleOfficer: 'Muhammad Rizwan (Lahore Station Manager)',
    threadId: 'thread-ramp-safety-gse',
    replyRequired: true,
    replyDeadline: '2026-10-25',
    status: 'Received',
    priority: 'Normal',
    keywords: ['GSE Inspection', 'Tow-bar shear pins', 'Ramp Safety', 'AIIAP Lahore', 'Airbus A320 pushback', 'FOD Prevention'],
    remarks: 'Routine inspection observed worn shear pins on Airblue designated tow-bar for Bay 6 pushback. Replacement and checklist update required.',
    extractedText: `PAKISTAN CIVIL AVIATION AUTHORITY
AIRPORT MANAGER OFFICE, ALLAMA IQBAL INTERNATIONAL AIRPORT, LAHORE
Ref: CAA/AIIAP/204/RAMP/26
Date: 11 October 2026

To: Station Manager, Airblue Limited, AIIAP Lahore.
SUBJECT: RAMP SAFETY INSPECTION OBSERVATION — GSE AND PUSHBACK OPERATIONS

1. An unannounced ramp safety audit was conducted by PCAA Safety Inspectors on 08 October 2026 on Apron Bay 6 and 7 during turnaround of flight PA-412.
2. Observations noted:
   a. Tow-bar designated for Airbus A320 series exhibited excessive wear on head shear-pin assembly.
   b. Marshalling cones placement was non-standard during fueling operation.
3. Airblue Ground Handling personnel must inspect all active GSE equipment, replace compromised components, and brief ramp handlers.
4. Compliance verification report must be submitted to Airport Manager AIIAP by 25 October 2026.

(Sultan Ahmed)
Senior Aerodrome Inspector, AIIAP Lahore`,
    aiSummary: 'PCAA Aerodrome Inspector issues observation regarding worn GSE tow-bar shear pins and marshalling cone placement at AIIAP Lahore Apron Bay 6. Corrective report due 25 October 2026.',
    regulatoryDirectives: [
      'Inspect and replace worn tow-bar shear-pin assemblies for A320 pushback',
      'Conduct ramp safety refresher briefing for Airblue ground handlers',
      'Submit compliance verification by 25-Oct-2026'
    ],
    mentionedOfficers: ['Sultan Ahmed', 'Airport Manager AIIAP'],
    confidence: {
      letterDate: 97,
      pcaaRefNumber: 96,
      airblueRefNumber: 85,
      sender: 98,
      recipient: 94,
      subject: 98,
      category: 97,
      direction: 98,
      replyDeadline: 95,
      overall: 95,
    },
    isVerified: true,
    verifiedBy: 'Syed Hammad (Registrar)',
    verifiedAt: '2026-10-12T08:30:00Z',
    attachment: {
      id: 'att-004',
      fileName: 'PCAA_AIIAP_Ramp_GSE_Inspection_Notice.pdf',
      fileType: 'application/pdf',
      fileSize: 312000,
      dataUrl: generateLetterSvgDataUrl(
        'Ramp Safety Inspection Notice: GSE & Pushback',
        'CAA/AIIAP/204/RAMP/26',
        '11-OCT-2026',
        'Sultan Ahmed (Senior Aerodrome Inspector)',
        'Station Manager, Airblue Limited, Lahore',
        [
          '1. Unannounced ramp safety audit conducted on 08 October 2026 on Apron Bay 6 & 7.',
          '2. Tow-bar for A320 pushback showed excessive shear-pin wear; non-standard cone placement.',
          '3. Inspect all active GSE equipment, replace shear pins, brief ground personnel.',
          '4. Compliance report must reach Airport Manager office by 25 October 2026.'
        ]
      ),
      cloudFileId: 'od-file-772911-gse',
      cloudStoragePath: '/2026/Aerodrome_Ramp_Safety/incoming/AB-PCAA-2026-0034/PCAA_AIIAP_Ramp_GSE_Inspection_Notice.pdf',
      cloudSynced: true,
      sha256Hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      uploadedAt: '2026-10-12T08:15:00Z',
    },
    cloudStorageLocation: 'OneDrive/Airblue_Corporate/Regulatory_Affairs/2026/RampSafety/incoming/AB-PCAA-2026-0034',
    createdBy: 'Syed Hammad (Registrar)',
    createdAt: '2026-10-12T08:15:00Z',
    updatedAt: '2026-10-12T08:30:00Z',
  },
  {
    id: 'rec-005',
    internalRef: 'AB-PCAA-2026-0039',
    direction: 'outgoing',
    letterDate: '2026-10-12',
    receivedOrDispatchedDate: '2026-10-12',
    sender: 'Capt. Kamran Siddiqui (Safety Manager)',
    senderOrg: 'Airblue Limited',
    senderDept: 'Flight Safety & Quality Assurance',
    recipient: 'Capt. Zafar Iqbal (Director Flight Standards)',
    recipientOrg: 'Pakistan Civil Aviation Authority (PCAA)',
    recipientDept: 'Flight Standards Directorate (FSD)',
    subject: 'Interim Reply & Corrective Action Plan (CAP) Regarding CVR/FDR Recertification (Aircraft AP-BNL)',
    pcaaRefNumber: 'HQCAA/6211/98/FSD/OPS',
    airblueRefNumber: 'AB/FSD/AUD/2026/310',
    category: 'Flight Operations',
    departmentConcerned: 'Flight Safety & Quality Assurance',
    responsibleOfficer: 'Capt. Kamran Siddiqui (Safety Manager)',
    threadId: 'thread-fsd-audit-cvr',
    parentCorrespondenceId: 'rec-003',
    previousLetterRef: 'HQCAA/6211/98/FSD/OPS',
    replyRequired: false,
    status: 'Dispatched',
    priority: 'Urgent',
    keywords: ['CAP Submission', 'AP-BNL CVR/FDR', 'Part-145 Certified Lab', 'Flight Safety Airblue'],
    remarks: 'Official Airblue response linking to PCAA audit finding HQCAA/6211/98/FSD/OPS. Attached certified readout from Airbus approved facility and updated CAMO tracking roster.',
    extractedText: `AIRBLUE LIMITED
DIRECTORATE OF FLIGHT SAFETY & QUALITY ASSURANCE
Ref: AB/FSD/AUD/2026/310
Date: 12 October 2026

To: The Director Flight Standards, Headquarters CAA, Terminal-1 JIAP, Karachi.
SUBJECT: CORRECTIVE ACTION PLAN AND RECERTIFICATION OF FDR FOR AIRCRAFT AP-BNL

Ref: Your office letter no. HQCAA/6211/98/FSD/OPS dated 09 October 2026.

Dear Sir,
1. With reference to the subject letter, Airblue Quality Assurance has completed comprehensive review and Root Cause Analysis regarding flight recorder readout intervals.
2. Aircraft AP-BNL underwent full FDR readouts on 10 October 2026 via our EASA Part-145 approved technical partner. All 88 mandatory flight parameters have been verified compliant with zero anomalies.
3. Attached herewith please find:
   Annexure-A: Certified Laboratory Readout Certificate No. FDR-2026-8921.
   Annexure-B: Root Cause Analysis and revised CAMO automated alerting interval.
4. We request formal closure of Level-2 Finding FSD-2026-04.

Yours sincerely,
(Capt. Kamran Siddiqui)
Manager Flight Safety & QA, Airblue Limited`,
    aiSummary: 'Airblue submits formal Corrective Action Plan and certified Part-145 FDR readout report for aircraft AP-BNL in response to PCAA letter HQCAA/6211/98/FSD/OPS, requesting finding closure.',
    regulatoryDirectives: [
      'Closure of PCAA Finding FSD-2026-04 requested',
      'CAMO digital recurrence alert system instituted'
    ],
    mentionedOfficers: ['Capt. Kamran Siddiqui', 'Capt. Zafar Iqbal'],
    confidence: {
      letterDate: 100,
      pcaaRefNumber: 100,
      airblueRefNumber: 100,
      sender: 100,
      recipient: 99,
      subject: 100,
      category: 100,
      direction: 100,
      replyDeadline: 100,
      overall: 100,
    },
    isVerified: true,
    verifiedBy: 'Syed Hammad (Registrar)',
    verifiedAt: '2026-10-12T16:10:00Z',
    attachment: {
      id: 'att-005',
      fileName: 'Airblue_CAP_FDR_Closure_AP-BNL.pdf',
      fileType: 'application/pdf',
      fileSize: 451800,
      dataUrl: generateLetterSvgDataUrl(
        'Corrective Action Plan: FDR Recertification AP-BNL',
        'AB/FSD/AUD/2026/310',
        '12-OCT-2026',
        'Capt. Kamran Siddiqui (Airblue Safety Mgr)',
        'Capt. Zafar Iqbal (Director Flight Standards)',
        [
          '1. Ref: PCAA HQCAA/6211/98/FSD/OPS dated 09 October 2026.',
          '2. Aircraft AP-BNL completed 88-parameter FDR readout via Part-145 lab with zero anomalies.',
          '3. Attached: Certified Readout FDR-2026-8921 and updated CAMO automated alerting system.',
          '4. Formal closure of Level-2 finding respectfully requested.'
        ]
      ),
      cloudFileId: 'od-file-881920-cap',
      cloudStoragePath: '/2026/Flight_Operations/outgoing/AB-PCAA-2026-0039/Airblue_CAP_FDR_Closure_AP-BNL.pdf',
      cloudSynced: true,
      sha256Hash: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      uploadedAt: '2026-10-12T16:00:00Z',
    },
    cloudStorageLocation: 'OneDrive/Airblue_Corporate/Regulatory_Affairs/2026/FlightOps/outgoing/AB-PCAA-2026-0039',
    createdBy: 'Syed Hammad (Registrar)',
    createdAt: '2026-10-12T16:00:00Z',
    updatedAt: '2026-10-12T16:10:00Z',
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-30T10:05:00Z',
    correspondenceId: 'rec-001',
    internalRef: 'AB-PCAA-2026-0018',
    actorId: 'usr-002',
    actorName: 'Syed Hammad',
    actorRole: 'Correspondence Registrar',
    action: 'CREATE',
    description: 'Ingested original document PCAA_AWD_Directive_AD-2026-A320-04.pdf (482 KB)',
    details: {
      field: 'status',
      oldValue: null,
      newValue: 'Awaiting Verification'
    },
    ipAddress: '192.168.10.45'
  },
  {
    id: 'log-002',
    timestamp: '2026-09-30T10:06:12Z',
    correspondenceId: 'rec-001',
    internalRef: 'AB-PCAA-2026-0018',
    actorId: 'system-ai',
    actorName: 'Gemini Multimodal OCR Engine',
    actorRole: 'Administrator',
    action: 'AI_EXTRACT',
    description: 'Extracted metadata with 97% confidence score. PCAA ref HQCAA/1085/543/AWD/TECH identified.',
    ipAddress: '127.0.0.1'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-01T09:15:00Z',
    correspondenceId: 'rec-001',
    internalRef: 'AB-PCAA-2026-0018',
    actorId: 'usr-002',
    actorName: 'Syed Hammad',
    actorRole: 'Correspondence Registrar',
    action: 'VERIFY',
    description: 'Verified extracted fields against original document scan and assigned internal reference AB-PCAA-2026-0018.',
    details: {
      field: 'status',
      oldValue: 'Awaiting Verification',
      newValue: 'Under Review'
    },
    ipAddress: '192.168.10.45'
  },
  {
    id: 'log-004',
    timestamp: '2026-10-01T09:16:00Z',
    correspondenceId: 'rec-001',
    internalRef: 'AB-PCAA-2026-0018',
    actorId: 'usr-002',
    actorName: 'Syed Hammad',
    actorRole: 'Correspondence Registrar',
    action: 'CLOUD_SYNC',
    description: 'Uploaded original document to Microsoft OneDrive (od-file-883921-cfm56). SHA-256 confirmed.',
    ipAddress: '192.168.10.45'
  },
  {
    id: 'log-005',
    timestamp: '2026-10-06T14:20:00Z',
    correspondenceId: 'rec-002',
    internalRef: 'AB-PCAA-2026-0022',
    actorId: 'usr-002',
    actorName: 'Syed Hammad',
    actorRole: 'Correspondence Registrar',
    action: 'CREATE',
    description: 'Registered outgoing letter AB/COMM/SCHED/W26/104 to PCAA AT&ER for Winter Schedule Slots.',
    details: {
      field: 'status',
      oldValue: null,
      newValue: 'Dispatched'
    },
    ipAddress: '192.168.10.45'
  },
  {
    id: 'log-006',
    timestamp: '2026-10-10T11:45:00Z',
    correspondenceId: 'rec-003',
    internalRef: 'AB-PCAA-2026-0029',
    actorId: 'usr-002',
    actorName: 'Syed Hammad',
    actorRole: 'Correspondence Registrar',
    action: 'VERIFY',
    description: 'Logged critical Level-2 safety audit observation from PCAA FSD. Deadline set for 15-Oct-2026.',
    details: {
      field: 'replyDeadline',
      oldValue: null,
      newValue: '2026-10-15'
    },
    ipAddress: '192.168.10.45'
  },
  {
    id: 'log-007',
    timestamp: '2026-10-12T16:10:00Z',
    correspondenceId: 'rec-005',
    internalRef: 'AB-PCAA-2026-0039',
    actorId: 'usr-003',
    actorName: 'Capt. Kamran Siddiqui',
    actorRole: 'Reviewer / Department',
    action: 'LINK_THREAD',
    description: 'Cross-referenced outgoing reply AB-PCAA-2026-0039 to incoming parent letter AB-PCAA-2026-0029 in thread "thread-fsd-audit-cvr".',
    details: {
      field: 'parentCorrespondenceId',
      oldValue: null,
      newValue: 'rec-003'
    },
    ipAddress: '192.168.10.82'
  }
];
