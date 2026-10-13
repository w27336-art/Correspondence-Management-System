import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Clock, 
  Send, 
  ShieldCheck, 
  Cloud, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Building, 
  Calendar, 
  Tag, 
  GitFork, 
  Download,
  ExternalLink,
  Edit2,
  Save,
  RefreshCw
} from 'lucide-react';
import { CorrespondenceRecord, UserRole } from '../types/correspondence';
import { DocumentViewer } from './DocumentViewer';

interface RecordDetailModalProps {
  record: CorrespondenceRecord;
  onClose: () => void;
  onUpdateRecord: (updated: Partial<CorrespondenceRecord>) => Promise<void>;
  onSyncCloud: (recordId: string) => Promise<void>;
  onDraftReply: (parentRecord: CorrespondenceRecord) => void;
  currentRole: UserRole;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  onClose,
  onUpdateRecord,
  onSyncCloud,
  onDraftReply,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<'metadata' | 'summary' | 'ocr' | 'audit'>('metadata');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  // Editable local state
  const [formData, setFormData] = useState({
    status: record.status,
    priority: record.priority,
    responsibleOfficer: record.responsibleOfficer,
    departmentConcerned: record.departmentConcerned,
    remarks: record.remarks,
    replyRequired: record.replyRequired,
    replyDeadline: record.replyDeadline || '',
  });

  const canEdit = currentRole === 'Administrator' || currentRole === 'Correspondence Registrar' || currentRole === 'Reviewer / Department';

  const handleSaveEdit = async () => {
    try {
      await onUpdateRecord(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      await onSyncCloud(record.id);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
              record.direction === 'incoming' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {record.direction.toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white">
                  {record.internalRef}
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-xs text-blue-300">
                  {record.pcaaRefNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-xl">
                {record.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {record.replyRequired && record.status !== 'Replied' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDraftReply(record);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Draft Outgoing Reply</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split 2-Panel View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-[580px]">
          {/* Left Panel: Document Viewer (5 cols) */}
          <div className="lg:col-span-5 border-r border-slate-200 bg-slate-950 flex flex-col p-4">
            <DocumentViewer attachment={record.attachment} />
          </div>

          {/* Right Panel: Record Metadata, Summary, OCR & Management (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-50/50 overflow-hidden">
            {/* Tab navigation */}
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('metadata')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                    activeTab === 'metadata' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Record Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                    activeTab === 'summary' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI Summary &amp; Directives
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ocr')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                    activeTab === 'ocr' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  OCR Text
                </button>
              </div>

              {canEdit && (
                <div>
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3 text-slate-500" />
                      <span>Edit Fields</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable Details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  {/* Status & Priority Card */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Workflow Status:</span>
                        {isEditing ? (
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="Received">Received</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Reply Required">Reply Required</option>
                            <option value="Replied">Replied</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Closed">Closed</option>
                          </select>
                        ) : (
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {record.status}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Priority:</span>
                        {isEditing ? (
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="Normal">Normal</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Critical">Critical</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            record.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                            record.priority === 'Urgent' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {record.priority}
                          </span>
                        )}
                      </div>
                    </div>

                    {record.replyRequired && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>PCAA Response Due Date:</span>
                          {isEditing ? (
                            <input
                              type="date"
                              value={formData.replyDeadline}
                              onChange={(e) => setFormData({ ...formData, replyDeadline: e.target.value })}
                              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded"
                            />
                          ) : (
                            <strong className="font-mono text-red-600">{record.replyDeadline || 'N/A'}</strong>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Fields Grid */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Letter Date</span>
                        <span className="font-mono text-slate-800 font-semibold">{record.letterDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Date Logged</span>
                        <span className="font-mono text-slate-800">{record.receivedOrDispatchedDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">PCAA Reference</span>
                        <span className="font-mono text-slate-900 font-bold">{record.pcaaRefNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Airblue Reference</span>
                        <span className="font-mono text-slate-700">{record.airblueRefNumber || '—'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Sender / From</span>
                        <span className="font-medium text-slate-800">{record.sender}</span>
                        <span className="text-[11px] text-slate-500 block">{record.senderOrg}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Recipient / To</span>
                        <span className="font-medium text-slate-800">{record.recipient}</span>
                        <span className="text-[11px] text-slate-500 block">{record.recipientOrg}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Regulatory Category</span>
                        <span className="font-medium text-blue-700">{record.category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Concerned Airblue Department</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.departmentConcerned}
                            onChange={(e) => setFormData({ ...formData, departmentConcerned: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded"
                          />
                        ) : (
                          <span className="font-medium text-slate-800">{record.departmentConcerned}</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Responsible Action Owner</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.responsibleOfficer}
                          onChange={(e) => setFormData({ ...formData, responsibleOfficer: e.target.value })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded"
                        />
                      ) : (
                        <span className="font-semibold text-slate-900">{record.responsibleOfficer || 'Unassigned'}</span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Keywords &amp; Regulatory Tags</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {record.keywords.map((k, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cloud Storage Location & Integrity Check */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900">Cloud Storage Sync</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloudSync}
                        disabled={isSyncing}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        <span>Sync Now</span>
                      </button>
                    </div>

                    {syncSuccess && (
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        Document successfully synchronized with OneDrive!
                      </p>
                    )}

                    <div className="font-mono text-[11px] text-slate-600 break-all bg-slate-50 p-2 rounded border border-slate-200">
                      {record.attachment.cloudStoragePath || record.cloudStorageLocation || 'Vault synchronization in progress'}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        Executive Regulatory Summary
                      </h4>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {record.aiSummary}
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Regulatory Directives Mandated
                    </h4>
                    {record.regulatoryDirectives && record.regulatoryDirectives.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {record.regulatoryDirectives.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic">No specific directives recorded.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'ocr' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Full Extracted Text (Search Indexed):</span>
                    <span className="font-mono">{record.extractedText.length} chars</span>
                  </div>
                  <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[460px]">
                    {record.extractedText}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] text-slate-500">
              <div>
                Logged by: <strong>{record.createdBy}</strong> on {new Date(record.createdAt).toLocaleDateString()}
              </div>

              <div>
                Verification Status: {record.isVerified ? (
                  <span className="text-emerald-600 font-semibold">Verified ({record.verifiedBy || 'Registrar'})</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Draft Awaiting Verification</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
