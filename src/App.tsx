import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { UploadAndExtractView } from './components/UploadAndExtractView';
import { SearchAndListView } from './components/SearchAndListView';
import { PendingRepliesView } from './components/PendingRepliesView';
import { ThreadTimelineView } from './components/ThreadTimelineView';
import { ReportsView } from './components/ReportsView';
import { AuditTrailView } from './components/AuditTrailView';
import { CloudSettingsView } from './components/CloudSettingsView';
import { RecordDetailModal } from './components/RecordDetailModal';
import { 
  CorrespondenceRecord, 
  AuditLogEntry, 
  CloudStorageConfig, 
  UserRole,
  CorrespondenceDirection 
} from './types/correspondence';
import { initialCorrespondenceRecords, initialAuditLogs, initialCloudConfig } from './data/mockRecords';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('Correspondence Registrar');
  const [records, setRecords] = useState<CorrespondenceRecord[]>(initialCorrespondenceRecords);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [cloudConfig, setCloudConfig] = useState<CloudStorageConfig>(initialCloudConfig);
  const [selectedRecord, setSelectedRecord] = useState<CorrespondenceRecord | null>(null);
  const [replyParentRecord, setReplyParentRecord] = useState<CorrespondenceRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load records from API
  const loadData = async () => {
    try {
      const [resRec, resLogs, resCloud] = await Promise.all([
        fetch('/api/correspondence').then(r => r.json()).catch(() => ({ data: initialCorrespondenceRecords })),
        fetch('/api/audit-logs').then(r => r.json()).catch(() => ({ data: initialAuditLogs })),
        fetch('/api/cloud-storage').then(r => r.json()).catch(() => ({ data: initialCloudConfig })),
      ]);

      if (resRec.data) setRecords(resRec.data);
      if (resLogs.data) setAuditLogs(resLogs.data);
      if (resCloud.data) setCloudConfig(resCloud.data);
    } catch (err) {
      console.warn('Backend fetch error, using local state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save new record (via upload or manual registration)
  const handleSaveRecord = async (newRecordData: Partial<CorrespondenceRecord>, isVerified: boolean) => {
    try {
      const res = await fetch('/api/correspondence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecordData,
          actorName: currentRole === 'Correspondence Registrar' ? 'Syed Hammad' : 'Administrator',
          actorRole: currentRole,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setRecords(prev => [json.data, ...prev]);
        setSelectedRecord(json.data);
      } else {
        // Fallback local creation
        const localId = `rec-${Date.now()}`;
        const internalRef = `AB-PCAA-2026-${String(records.length + 43).padStart(4, '0')}`;
        const completeRecord: CorrespondenceRecord = {
          ...(newRecordData as any),
          id: localId,
          internalRef,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          threadId: newRecordData.threadId || `thread-${Date.now()}`,
        };
        setRecords(prev => [completeRecord, ...prev]);
        setSelectedRecord(completeRecord);
      }
      loadData();
    } catch (err) {
      console.error('Error saving record:', err);
    }
  };

  // Update existing record
  const handleUpdateRecord = async (updatedFields: Partial<CorrespondenceRecord>) => {
    if (!selectedRecord) return;
    try {
      const res = await fetch(`/api/correspondence/${selectedRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedFields,
          actorName: 'Current User',
          actorRole: currentRole,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setRecords(prev => prev.map(r => r.id === selectedRecord.id ? json.data : r));
        setSelectedRecord(json.data);
      } else {
        const merged = { ...selectedRecord, ...updatedFields, updatedAt: new Date().toISOString() };
        setRecords(prev => prev.map(r => r.id === selectedRecord.id ? merged : r));
        setSelectedRecord(merged);
      }
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Sync file to cloud
  const handleSyncCloud = async (recordId: string) => {
    try {
      await fetch('/api/cloud-storage/sync-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, actorName: 'Syed Hammad' }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Update cloud config
  const handleUpdateCloudConfig = async (newConfig: Partial<CloudStorageConfig>) => {
    try {
      const res = await fetch('/api/cloud-storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCloudConfig(json.data);
      }
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    window.location.href = '/api/export/csv';
  };

  // Draft reply to an existing incoming letter
  const handleDraftReply = (parentRecord: CorrespondenceRecord) => {
    setReplyParentRecord(parentRecord);
    setCurrentView('register-outgoing');
  };

  const pendingCount = records.filter(
    r => r.replyRequired && r.status !== 'Replied' && r.status !== 'Closed'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={(view) => {
          setReplyParentRecord(null);
          setCurrentView(view);
        }}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        pendingCount={pendingCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && (
          <DashboardView
            records={records}
            onSelectRecord={setSelectedRecord}
            onNavigate={setCurrentView}
            currentRole={currentRole}
          />
        )}

        {(currentView === 'upload' || currentView === 'register-incoming' || currentView === 'register-outgoing') && (
          <UploadAndExtractView
            key={currentView}
            initialDirection={currentView === 'register-outgoing' ? 'outgoing' : 'incoming'}
            currentRole={currentRole}
            onSaveRecord={handleSaveRecord}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'search' && (
          <SearchAndListView
            records={records}
            onSelectRecord={setSelectedRecord}
            onExportCsv={handleExportCsv}
          />
        )}

        {currentView === 'pending' && (
          <PendingRepliesView
            records={records}
            onSelectRecord={setSelectedRecord}
            onDraftReply={handleDraftReply}
          />
        )}

        {currentView === 'threads' && (
          <ThreadTimelineView
            records={records}
            onSelectRecord={setSelectedRecord}
          />
        )}

        {currentView === 'reports' && (
          <ReportsView
            records={records}
            onExportCsv={handleExportCsv}
          />
        )}

        {currentView === 'audit' && (
          <AuditTrailView
            logs={auditLogs}
          />
        )}

        {currentView === 'cloud' && (
          <CloudSettingsView
            config={cloudConfig}
            onUpdateConfig={handleUpdateCloudConfig}
          />
        )}
      </main>

      {/* Record Inspection / Edit Modal */}
      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdateRecord={handleUpdateRecord}
          onSyncCloud={handleSyncCloud}
          onDraftReply={handleDraftReply}
          currentRole={currentRole}
        />
      )}

      {/* Quiet Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Airblue Regulatory Affairs</span>
            <span>·</span>
            <span>Pakistan Civil Aviation Authority Electronic Correspondence Register</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            ICAO Annex 6 · CARs 1994 Part XII · SHA-256 Vault Verified
          </div>
        </div>
      </footer>
    </div>
  );
}
