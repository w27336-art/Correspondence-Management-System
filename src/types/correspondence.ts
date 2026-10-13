export type CorrespondenceDirection = 'incoming' | 'outgoing';

export type CorrespondenceStatus =
  | 'Draft'
  | 'Processing'
  | 'Awaiting Verification'
  | 'Received'
  | 'Under Review'
  | 'Reply Required'
  | 'Replied'
  | 'Dispatched'
  | 'Closed';

export type CorrespondencePriority = 'Normal' | 'Urgent' | 'Critical';

export type CorrespondenceCategory =
  | 'Flight Operations'
  | 'Airworthiness & Engineering'
  | 'Aerodrome & Ramp Safety'
  | 'Cabin Safety & Crew'
  | 'Tariffs, Routes & Licensing'
  | 'Aviation Security & Facilitation'
  | 'Legal & Regulatory Compliance';

export interface DocumentAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl?: string; // base64 or object URL for preview
  cloudFileId?: string;
  cloudStoragePath?: string;
  cloudSynced: boolean;
  sha256Hash: string;
  uploadedAt: string;
}

export interface ExtractionConfidence {
  letterDate: number;
  pcaaRefNumber: number;
  airblueRefNumber: number;
  sender: number;
  recipient: number;
  subject: number;
  category: number;
  direction: number;
  replyDeadline: number;
  overall: number;
}

export interface CorrespondenceRecord {
  id: string;
  internalRef: string; // e.g. AB-PCAA-2026-0042
  direction: CorrespondenceDirection;
  letterDate: string; // YYYY-MM-DD
  receivedOrDispatchedDate: string; // YYYY-MM-DD
  sender: string;
  senderOrg: string;
  senderDept?: string;
  recipient: string;
  recipientOrg: string;
  recipientDept?: string;
  subject: string;
  pcaaRefNumber: string;
  airblueRefNumber?: string;
  category: CorrespondenceCategory;
  departmentConcerned: string;
  responsibleOfficer: string;
  
  // Cross referencing
  threadId: string;
  parentCorrespondenceId?: string;
  relatedRefNumber?: string;
  previousLetterRef?: string;
  
  // Tracking
  replyRequired: boolean;
  replyDeadline?: string;
  status: CorrespondenceStatus;
  priority: CorrespondencePriority;
  
  // Tags & Content
  keywords: string[];
  remarks: string;
  extractedText: string;
  aiSummary: string;
  regulatoryDirectives?: string[];
  mentionedOfficers?: string[];
  
  // Confidence & Verification
  confidence: ExtractionConfidence;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  
  // Attachments & Cloud Storage
  attachment: DocumentAttachment;
  additionalAttachments?: DocumentAttachment[];
  cloudStorageLocation?: string;
  
  // Audit & Timestamps
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'Administrator' | 'Correspondence Registrar' | 'Reviewer / Department' | 'Read-Only Auditor';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  correspondenceId?: string;
  internalRef?: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'CREATE' | 'AI_EXTRACT' | 'VERIFY' | 'UPDATE' | 'LINK_THREAD' | 'STATUS_CHANGE' | 'EXPORT' | 'CLOUD_SYNC' | 'CONFIG_CHANGE';
  description: string;
  details?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
  };
  ipAddress?: string;
}

export interface CloudStorageConfig {
  provider: 'onedrive' | 'sharepoint';
  isConnected: boolean;
  accountEmail: string;
  tenantId: string;
  clientId: string;
  baseFolder: string;
  namingPattern: string; // e.g. '{year}/{direction}/{ref}'
  autoSync: boolean;
  retentionYears: number;
  lastSyncTimestamp?: string;
}
